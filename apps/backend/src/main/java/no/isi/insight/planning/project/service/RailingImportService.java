package no.isi.insight.planning.project.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.locationtech.jts.geom.LineString;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.integration.nvdb.NvdbImportService;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Direction;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Placement;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.RoadSegment;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Side;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObjectType;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSide;
import no.isi.insight.planning.repository.RoadRailingJpaRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailingImportService {
  private final NvdbImportService importService;
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final RoadRailingJpaRepository railingJpaRepository;
  private final GeometryService geometryService;

  // language=sql
  private static final String UPSERT_ROAD_RAILING_QUERY = """
      INSERT INTO road_railing (road_railing_id, geometry, own_geometry, length)
      VALUES (:externalId, ST_GeomFromText(:geometry, 5973), :ownGeometry, :length)
      ON CONFLICT (road_railing_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        own_geometry = EXCLUDED.own_geometry,
        length = EXCLUDED.length,
        last_imported_at = NOW()
    """;

  // language=sql
  private static final String UPSERT_ROAD_SYSTEM_QUERY = """
      INSERT INTO road_system (road_system_id, road_category, road_phase, road_number)
      VALUES (:id, :category, :phase, :roadNumber)
      ON CONFLICT (road_system_id) DO UPDATE SET
        road_category = EXCLUDED.road_category,
        road_phase = EXCLUDED.road_phase,
        road_number = EXCLUDED.road_number,
        last_imported_at = NOW()
    """;

  // language=sql
  private static final String UPSERT_ROAD_SEGMENT_QUERY = """
      INSERT INTO road_segment (fk_road_railing_id, road_segment_id, geometry, length, side_of_road, direction_of_road, road_system_reference, fk_road_system_id)
      VALUES (:railingId, :externalId, ST_GeomFromText(:geometry, 5973), :length, :side::road_side, :direction::road_direction, :roadSystemReference, :roadSystemId)
      ON CONFLICT (fk_road_railing_id, road_segment_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        length = EXCLUDED.length,
        side_of_road = EXCLUDED.side_of_road,
        direction_of_road = EXCLUDED.direction_of_road,
        road_system_reference = EXCLUDED.road_system_reference,
        fk_road_system_id = EXCLUDED.fk_road_system_id,
        last_imported_at = NOW()
    """;

  @Transactional(readOnly = false)
  public List<RoadRailing> importRailings(
      String url
  ) {
    log.info("Importing railings from NVDB...");
    var railings = this.importService.importRoadObjects(url, NvdbRoadObjectType.RAILING, Map.of("inkluder", "alle"));

    var railingParams = new ArrayList<MapSqlParameterSource>(railings.size());
    var roadSystemParams = new ArrayList<MapSqlParameterSource>();
    var roadSegmentsParams = new ArrayList<MapSqlParameterSource>();
    var railingIds = new ArrayList<Long>();

    var flipped = 0;

    for (var railing : railings) {
      var segments = railing.roadSegments().stream().map(segment -> {
        var placement = railing.location().placements().stream().filter(p -> segment.isWithin(p)).findFirst();

        if (placement.isEmpty()) {
          return null;
        }

        return RoadSegmentReverser.<RoadSegment>builder()
          .placementDirection(
            placement.map(Placement::direction).map(Direction::toRoadDirection).orElse(RoadDirection.WITH)
          )
          .roadSystemDirection(segment.direction().toRoadDirection())
          .stretchDirection(segment.roadSystemReference().stretch().direction().toRoadDirection())
          .placementSide(placement.map(Placement::side).map(Side::toRoadSide).orElse(null))
          .stretch(this.geometryService.parseLineString(segment.geometry().wkt()).get())
          .data(segment)
          .build();
      }).filter(Objects::nonNull).toList();

      var geometryChecker = new RailingGeometryOrderChecker<>(
        this.geometryService.parseLineString(railing.geometry().wkt()).get(),
        segments
      );

      if (geometryChecker.isFlipped()) {
        flipped++;
      }

      railingIds.add(railing.id());
      railingParams.add(this.mapRailingParams(railing, geometryChecker.getGeometry()));
      roadSystemParams.addAll(this.mapRoadSystemParams(railing));
      roadSegmentsParams.addAll(this.mapRoadSegmentParams(railing.id(), segments));
    }

    log.info("{} of the imported railings were flipped", flipped);

    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_RAILING_QUERY, railingParams.toArray(MapSqlParameterSource[]::new));
    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_SYSTEM_QUERY, roadSystemParams.toArray(MapSqlParameterSource[]::new));
    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_SEGMENT_QUERY, roadSegmentsParams.toArray(MapSqlParameterSource[]::new));

    return this.railingJpaRepository.findAllByIds(railingIds);
  }

  private MapSqlParameterSource mapRailingParams(
      NvdbRoadObject roadObject,
      LineString geometry
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("externalId", roadObject.id());
    params.addValue("geometry", geometry.toText());
    params.addValue("ownGeometry", roadObject.geometry().isOwnGeomtry());
    params.addValue("length", roadObject.location().length());

    return params;
  }

  private List<MapSqlParameterSource> mapRoadSystemParams(
      NvdbRoadObject roadObject
  ) {
    var sqlParams = roadObject.roadSegments().stream().map(segment -> {
      var system = segment.roadSystemReference().system();

      var params = new MapSqlParameterSource();
      params.addValue("id", system.id());
      params.addValue("category", system.category());
      params.addValue("phase", system.phase());
      params.addValue("roadNumber", system.number());
      return params;
    }).toList();

    return sqlParams;
  }

  private List<MapSqlParameterSource> mapRoadSegmentParams(
      Long railingId,
      List<RoadSegmentReverser<RoadSegment>> segments
  ) {
    var sqlParams = segments.stream().map(segment -> {
      var data = segment.getData();

      var params = new MapSqlParameterSource();
      params.addValue("railingId", railingId);
      params.addValue("externalId", data.getShortform());
      params.addValue("geometry", segment.getGeometry().toText());
      params.addValue("length", data.length());
      params.addValue("direction", segment.getDirection().name());
      params.addValue("roadSystemReference", data.roadSystemReference().shortform());
      params.addValue("roadSystemId", data.roadSystemReference().system().id());
      params.addValue("side", Optional.ofNullable(segment.getSide()).map(RoadSide::name).orElse(null));
      return params;
    }).filter(Objects::nonNull).toList();

    return sqlParams;
  }

}
