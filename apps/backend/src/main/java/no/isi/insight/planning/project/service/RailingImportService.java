package no.isi.insight.planning.project.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.locationtech.jts.geom.LineString;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.project.view.RailingImportDetails;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.integration.nvdb.NvdbImportService;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Direction;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Placement;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.RoadSegment;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.RoadStretch;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject.Side;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObjectType;
import no.isi.insight.planning.db.model.RoadDirection;
import no.isi.insight.planning.db.model.RoadSide;
import no.isi.insight.planning.db.model.UserAccount;
import no.isi.insight.planning.utility.GeometryUtils;
import no.isi.insight.planning.utility.RequestUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailingImportService {
  private final NvdbImportService importService;
  private final NamedParameterJdbcTemplate jdbcTemplate;
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
  private static final String UPSERT_ROAD_SEGMENT_QUERY = """
      INSERT INTO road_segment (fk_road_railing_id, road_segment_id, geometry, length, side_of_road, direction_of_road, road_system_reference, road_reference, road_category)
      VALUES (:railingId, :externalId, ST_GeomFromText(:geometry, 5973), :length, :side::road_side, :direction::road_direction, :roadSystemReference, :roadReference, :roadCategory)
      ON CONFLICT (fk_road_railing_id, road_segment_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        length = EXCLUDED.length,
        side_of_road = EXCLUDED.side_of_road,
        direction_of_road = EXCLUDED.direction_of_road,
        road_system_reference = EXCLUDED.road_system_reference,
        road_reference = EXCLUDED.road_reference,
        road_category = EXCLUDED.road_category,
        last_imported_at = NOW()
    """;

  // language=sql
  private static final String INSERT_PROJECT_PLAN_RAILING_QUERY = """
      INSERT INTO project_plan_road_railing (fk_project_plan_id, fk_road_railing_id, fk_created_by_user_id)
      VALUES (:planId, :railingId, :userId)
    """;

  /**
   * Imports a new set of railings without clearing the existing ones.
   * 
   * @param url    the URL to import railings from
   * @param planId the ID of the plan to import railings to
   * 
   * @return details of the import
   */
  public RailingImportDetails importRailings(
      String url,
      UUID planId
  ) {
    return this.importRailings(url, planId, false);
  }

  /**
   * Imports a new set of railings.
   * 
   * @param url    the URL to import railings from
   * @param planId the ID of the plan to import railings to
   * @param clear  whether to clear the existing railings before importing
   * 
   * @return details of the import
   */
  @Transactional(readOnly = false)
  public RailingImportDetails importRailings(
      String url,
      UUID planId,
      boolean clear
  ) {
    if (clear) {
      var cleared = this.jdbcTemplate.update(
        // language=sql
        "DELETE FROM project_plan_road_railing pprr WHERE pprr.fk_project_plan_id = :planId",
        Map.of("planId", planId)
      );

      log.info("Cleared {} existing railings from plan with id: {}", cleared, planId);
    }

    log.info("Importing railings from NVDB...");
    var railings = this.importService.importRoadObjects(url, NvdbRoadObjectType.RAILING, Map.of("inkluder", "alle"));

    var importedByUserId = RequestUtils.getRequestingUserAccount().map(UserAccount::getUserAccountId);

    var railingParams = new ArrayList<MapSqlParameterSource>(railings.size());
    var planJoinParams = new ArrayList<MapSqlParameterSource>(railings.size());
    var roadSystemParams = new ArrayList<MapSqlParameterSource>();
    var roadSegmentsParams = new ArrayList<MapSqlParameterSource>();
    var railingIds = new ArrayList<Long>();

    var flipped = 0;

    for (var railing : railings) {
      var segments = railing.roadSegments().stream().map(segment -> {
        var placement = railing.location().placements().stream().filter(p -> segment.isWithin(p)).findFirst();
        var reference = railing.location()
          .roadSystemReferences()
          .stream()
          .filter(r -> r.system().id().equals(segment.roadSystemReference().system().id()))
          .findFirst();

        var stretch = this.geometryService.parseLineString(segment.geometry().wkt());

        if (placement.isEmpty() || stretch.isEmpty()) {
          return null;
        }

        return RoadSegmentReverser.<RoadSegment>builder()
          .placementDirection(
            placement.map(Placement::direction).map(Direction::toRoadDirection).orElse(RoadDirection.WITH)
          )
          .roadSystemDirection(reference.map(r -> r.stretch().direction()).map(Direction::toRoadDirection).orElse(null))
          .stretchDirection(
            Optional.ofNullable(segment.roadSystemReference().stretch())
              .map(RoadStretch::direction)
              .map(Direction::toRoadDirection)
              .orElse(null)
          )
          .placementSide(placement.map(Placement::side).map(Side::toRoadSide).orElse(null))
          .stretch(stretch.get())
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

      try {
        railingIds.add(railing.id());
        railingParams.add(this.mapRailingParams(railing, geometryChecker.getGeometry()));
        roadSystemParams.addAll(this.mapRoadSystemParams(railing));
        roadSegmentsParams.addAll(this.mapRoadSegmentParams(railing.id(), segments));
        planJoinParams.add(
          new MapSqlParameterSource(
            Map.of("planId", planId, "railingId", railing.id(), "userId", importedByUserId.orElse(null))
          )
        );
      } catch (Exception e) {
        log.warn("Failed to map params for railing[id={}]: {}", railing.id(), e.getMessage());
      }
    }

    log.info("{} of the imported railings were flipped", flipped);

    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_RAILING_QUERY, railingParams.toArray(MapSqlParameterSource[]::new));
    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_SEGMENT_QUERY, roadSegmentsParams.toArray(MapSqlParameterSource[]::new));
    var importedRailings = this.jdbcTemplate
      .batchUpdate(INSERT_PROJECT_PLAN_RAILING_QUERY, planJoinParams.toArray(MapSqlParameterSource[]::new));

    var importCount = 0L;

    for (var count : importedRailings) {
      if (count > 0) {
        importCount++;
      }
    }

    return new RailingImportDetails(
      importCount,
      url,
      LocalDateTime.now()
    );
  }

  private MapSqlParameterSource mapRailingParams(
      NvdbRoadObject roadObject,
      LineString geometry
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("externalId", roadObject.id());
    params.addValue("geometry", GeometryUtils.toWkt(geometry));
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
      var roadCategory = data.roadSystemReference().system().category();

      var roadReference = switch (roadCategory) {
        case "E" -> "E" + data.roadSystemReference().system().number();
        default -> data.roadSystemReference().system().number().toString();
      };

      var params = new MapSqlParameterSource();
      params.addValue("railingId", railingId);
      params.addValue("externalId", data.getShortform());
      params.addValue("geometry", GeometryUtils.toWkt(segment.getGeometry()));
      params.addValue("length", data.length());
      params.addValue("direction", segment.getDirection().name());
      params.addValue("roadSystemReference", data.roadSystemReference().shortform());
      params.addValue("roadReference", roadReference);
      params.addValue("roadCategory", roadCategory);
      params.addValue("side", Optional.ofNullable(segment.getSide()).map(RoadSide::name).orElse(null));
      return params;
    }).filter(Objects::nonNull).toList();

    return sqlParams;
  }

}
