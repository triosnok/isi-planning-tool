package no.isi.insight.planning.project.service;

import java.util.ArrayList;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.integration.nvdb.NvdbImportService;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObjectType;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadSide;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailingImportService {
  private final NvdbImportService importService;
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String UPSERT_ROAD_RAILING_QUERY = """
      INSERT INTO road_railing (external_id, geometry, road_system_reference_id, road_system_reference, length, direction_of_road, side_of_road)
      VALUES (:externalId, ST_GeomFromText(:geometry), :roadSystemReferenceId, :roadSystemReference, :length, :direction::road_direction, :side::road_side)
      ON CONFLICT (external_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        road_system_reference_id = EXCLUDED.road_system_reference_id,
        road_system_reference = EXCLUDED.road_system_reference,
        length = EXCLUDED.length,
        direction_of_road = EXCLUDED.direction_of_road,
        side_of_road = EXCLUDED.side_of_road,
        last_imported_at = NOW()
    """;

  // language=sql
  private static final String UPSERT_ROAD_NET_QUERY = """
      INSERT INTO road_net (external_id, geometry)
      VALUES (:externalId, ST_GeomFromText(:geometry))
      ON CONFLICT (external_id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        last_imported_at = NOW()
    """;

  @Transactional(readOnly = false)
  public void importRailings(
      String planId,
      String url
  ) {
    log.info("Importing railings & road nets from NVDB...");
    var railings = this.importService.importRoadObjects(url, NvdbRoadObjectType.RAILING);
    var roadNets = this.importService.importRoadObjects(url, NvdbRoadObjectType.ROAD_NET);

    var railingParams = new ArrayList<MapSqlParameterSource>(railings.size());
    var roadNetParams = new ArrayList<MapSqlParameterSource>(roadNets.size());

    for (var railing : railings) {
      railingParams.add(this.mapRailing(railing));
    }

    for (var roadNet : roadNets) {
      roadNetParams.add(this.mapRoadNet(roadNet));
    }

    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_RAILING_QUERY, railingParams.toArray(MapSqlParameterSource[]::new));
    this.jdbcTemplate.batchUpdate(UPSERT_ROAD_NET_QUERY, roadNetParams.toArray(MapSqlParameterSource[]::new));
  }

  private MapSqlParameterSource mapRailing(
      NvdbRoadObject roadObject
  ) {
    var roadSystemReference = roadObject.location().roadSystemReferences().get(0);
    var placement = roadObject.location().placements().stream().findFirst();

    var params = new MapSqlParameterSource();
    params.addValue("externalId", roadObject.id());
    params.addValue("geometry", roadObject.geometry().wkt());
    params.addValue("roadSystemReferenceId", roadSystemReference.system().id());
    params.addValue("roadSystemReference", roadSystemReference.shortform());
    params.addValue("length", roadObject.location().length());
    params.addValue("direction", placement.map(p -> p.getDirection()).map(RoadDirection::name).orElse(null));
    params.addValue("side", placement.map(p -> p.getSide()).map(RoadSide::name).orElse(null));

    return params;
  }

  private MapSqlParameterSource mapRoadNet(
      NvdbRoadObject roadObject
  ) {
    var params = new MapSqlParameterSource();
    params.addValue("externalId", roadObject.id());
    params.addValue("geometry", roadObject.geometry().wkt());

    return params;
  }

}
