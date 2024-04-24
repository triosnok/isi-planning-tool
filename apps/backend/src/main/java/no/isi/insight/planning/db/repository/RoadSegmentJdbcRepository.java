package no.isi.insight.planning.db.repository;

import java.sql.Types;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.railing.view.RoadCategory;
import no.isi.insight.planning.client.railing.view.RoadSegment;

@Repository
@RequiredArgsConstructor
public class RoadSegmentJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String ROAD_SEGMENT_QUERY = """
      SELECT
        rs.fk_road_railing_id,
        rs.road_segment_id,
        rs.road_reference,
        rs.road_system_reference,
        rs.road_category,
        ST_AsText(rs.geometry) AS wkt,
        ST_SRID(rs.geometry) AS srid,
        rs.length
      FROM road_segment rs
      WHERE 1=1
        AND rs.fk_road_railing_id = :railingId
        AND :segmentId IS NULL OR rs.road_segment_id = :segmentId
    """;

  private static final RowMapper<RoadSegment> ROAD_SEGMENT_ROW_MAPPER = (rs, i) -> {
    return RoadSegment.builder()
      .id(rs.getString("road_segment_id"))
      .railingId(rs.getLong("fk_road_railing_id"))
      .roadReference(rs.getString("road_reference"))
      .roadSystemReference(rs.getString("road_system_reference"))
      .category(RoadCategory.fromShortCode(rs.getString("road_category")))
      .geometry(
        new Geometry(
          rs.getString("wkt"),
          rs.getInt("srid")
        )
      )
      .length(rs.getDouble("length"))
      .build();
  };

  private List<RoadSegment> findById(
      Long railingId,
      Optional<String> segmentId
  ) {
    var params = new MapSqlParameterSource().addValue("railingId", railingId, Types.BIGINT)
      .addValue("segmentId", segmentId.orElse(null), Types.VARCHAR);

    return this.jdbcTemplate.query(ROAD_SEGMENT_QUERY, params, ROAD_SEGMENT_ROW_MAPPER);
  }

  public List<RoadSegment> findByRailingId(
      Long railingId
  ) {
    return this.findById(railingId, Optional.empty());
  }

  public Optional<RoadSegment> findByRailingIdAndSegmentId(
      Long railingId,
      String segmentId
  ) {
    var segments = this.findById(railingId, Optional.of(segmentId));

    if (segments.size() > 1) {
      throw new IllegalStateException(
        "Multiple segments for params: [railingId=%s,segmentId]".formatted(railingId, segmentId)
      );
    }

    return segments.stream().findFirst();
  }

}
