package no.isi.insight.planning.project.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.integration.nvdb.NvdbImportService;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Side;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObjectType;
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

  // language=sql
  private static final String UPSERT_ROAD_RAILING_QUERY = """
      INSERT INTO road_railing (road_railing_id, geometry, length)
      VALUES (:externalId, ST_GeomFromText(:geometry, 5973), :length)
      ON CONFLICT (road_railing_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        length = EXCLUDED.length,
        last_imported_at = NOW()
    """;

  // language=sql
  private static final String UPSERT_ROAD_SEGMENT_QUERY = """
      INSERT INTO road_segment (road_segment_id, geometry)
      VALUES (:externalId, ST_GeomFromText(:geometry, 5973))
      ON CONFLICT (road_segment_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        last_imported_at = NOW()
    """;

  // language=sql
  private static final String UPSERT_JOIN_TABLE_QUERY = """
      INSERT INTO road_railing_road_segment (fk_road_railing_id, fk_road_segment_id, side_of_road, direction_of_road)
      VALUES (:railingId, :roadSegmentId, :side::road_side, :direction::road_direction)
    """;

  @Transactional(readOnly = false)
  public List<RoadRailing> importRailings(
      String url
  ) {
    log.info("Importing railings from NVDB...");
    var railings = this.importService.importRoadObjects(url, NvdbRoadObjectType.RAILING, Map.of("inkluder", "alle"));

    var railingParams = new ArrayList<MapSqlParameterSource>(railings.size());
    var roadSegmentsParams = new ArrayList<MapSqlParameterSource>();
    var joinTableParams = new ArrayList<MapSqlParameterSource>();
    var railingIds = new ArrayList<Long>();

    for (var railing : railings) {
      railingIds.add(railing.id());
      railingParams.add(this.mapRailingParams(railing));
      roadSegmentsParams.addAll(this.mapRoadSegmentParams(railing));
      joinTableParams.addAll(this.mapPlacementParams(railing));
    }

    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_RAILING_QUERY, railingParams.toArray(MapSqlParameterSource[]::new));
    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_SEGMENT_QUERY, roadSegmentsParams.toArray(MapSqlParameterSource[]::new));
    this.jdbcTemplate.batchUpdate(UPSERT_JOIN_TABLE_QUERY, joinTableParams.toArray(MapSqlParameterSource[]::new));

    return this.railingJpaRepository.findAllByIds(railingIds);
  }

  private MapSqlParameterSource mapRailingParams(
      NvdbRoadObject roadObject
  ) {
    var params = new MapSqlParameterSource();
    params.addValue("externalId", roadObject.id());
    params.addValue("geometry", roadObject.geometry().wkt());
    params.addValue("length", roadObject.location().length());

    return params;
  }

  private List<MapSqlParameterSource> mapRoadSegmentParams(
      NvdbRoadObject roadObject
  ) {
    return roadObject.roadSegments().stream().map(segment -> {
      var params = new MapSqlParameterSource();
      params.addValue("externalId", segment.getShortform());
      params.addValue("geometry", segment.geometry().wkt());
      return params;
    }).toList();
  }

  private List<MapSqlParameterSource> mapPlacementParams(
      NvdbRoadObject roadObject
  ) {
    return roadObject.roadSegments().stream().map(segment -> {
      var placement = roadObject.location().placements().stream().filter(p -> segment.isWithin(p)).findFirst();

      if (placement.isEmpty()) {
        return null;
      }

      var params = new MapSqlParameterSource();
      params.addValue("railingId", roadObject.id());
      params.addValue("roadSegmentId", segment.getShortform());
      params.addValue("direction", segment.roadSystemReference().stretch().direction().toRoadDirection().name());
      params.addValue("side", placement.map(p -> p.side()).map(Side::toRoadSide).map(RoadSide::name).orElse(null));
      return params;
    }).filter(Objects::nonNull).toList();
  }

}
