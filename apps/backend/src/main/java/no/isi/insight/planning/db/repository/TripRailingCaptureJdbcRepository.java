package no.isi.insight.planning.db.repository;

import java.sql.Types;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.capture.view.CapturedMetersByDay;
import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.railing.view.RailingCapture;
import no.isi.insight.planning.client.railing.view.Range;
import no.isi.insight.planning.client.trip.view.CameraPosition;
import no.isi.insight.planning.utility.JdbcUtils;

@Slf4j
@Repository
@RequiredArgsConstructor
public class TripRailingCaptureJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

  // language=sql
  private static final String RAILING_CAPTURE_QUERY = """
      SELECT
        trc.trip_railing_capture_id,
        trc.fk_road_segment_id,
        trc.fk_road_railing_id,
        t.trip_id,
        pp.project_plan_id,
        pp.fk_project_id,
        LOWER(trc.segment_coverage) AS segment_coverage_start,
        UPPER(trc.segment_coverage) AS segment_coverage_end,
        ST_AsText(trc.position) AS wkt,
        ST_SRID(trc.position) AS srid,
        trc.image_urls,
        trc.captured_at
      FROM trip_railing_capture trc
      INNER JOIN trip t
        ON trc.fk_trip_id = t.trip_id
      INNER JOIN project_plan pp
        ON t.fk_project_plan_id = pp.project_plan_id
      INNER JOIN project p
        ON pp.fk_project_id = p.project_id
      WHERE 1=1
        AND (trc.fk_road_railing_id = :railingId)
        AND (trc.fk_road_segment_id = :segmentId)
        AND (:segmentIndex <@ trc.segment_coverage)
        AND (:projectId IS NULL OR pp.fk_project_id = :projectId::uuid)
        AND (:planId IS NULL OR t.fk_project_plan_id = :planId::uuid)
        AND (:tripId IS NULL OR t.trip_id = :tripId::uuid)
      ORDER BY trc.captured_at DESC
    """;

  private static final TypeReference<Map<CameraPosition, String>> IMAGE_URLS_TYPE = new TypeReference<>(){};

  private RowMapper<RailingCapture> captureMapper() {
    return (rs, i) -> {
      var id = rs.getString("trip_railing_capture_id");

      if (rs.wasNull()) {
        return null;
      }

      Map<CameraPosition, String> imageUrls = Map.of();

      try {
        imageUrls = this.objectMapper.readValue(rs.getBytes("image_urls"), IMAGE_URLS_TYPE);
      } catch (Exception e) {
        log.error("Failed to ");
      }

      return RailingCapture.builder()
        .id(UUID.fromString(id))
        .segmentId(rs.getString("fk_road_segment_id"))
        .railingId(rs.getLong("fk_road_railing_id"))
        .tripId(rs.getObject("trip_id", UUID.class))
        .planId(rs.getObject("project_plan_id", UUID.class))
        .projectId(rs.getObject("fk_project_id", UUID.class))
        .geometry(
          new Geometry(
            rs.getString("wkt"),
            rs.getInt("srid")
          )
        )
        .segmentCoverage(
          new Range(
            rs.getDouble("segment_coverage_start"),
            rs.getDouble("segment_coverage_end")
          )
        )
        .imageUrls(imageUrls)
        .capturedAt(JdbcUtils.getNullableDateTime(rs, "captured_at"))
        .build();

    };
  }

  public List<RailingCapture> findAll(
      Long railingId,
      String segmentId,
      double segmentIndex,
      Optional<UUID> projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId
  ) {
    var params = new MapSqlParameterSource().addValue("railingId", railingId)
      .addValue("segmentId", segmentId)
      .addValue("segmentIndex", segmentIndex, Types.NUMERIC)
      .addValue("projectId", projectId.orElse(null), Types.VARCHAR)
      .addValue("planId", planId.orElse(null), Types.VARCHAR)
      .addValue("tripId", tripId.orElse(null), Types.VARCHAR);

    return this.jdbcTemplate.query(RAILING_CAPTURE_QUERY, params, this.captureMapper());
  }

  public List<RailingCapture> findAll(
      Long railingId,
      String segmentId,
      double segmentIndex
  ) {
    return this.findAll(railingId, segmentId, segmentIndex, Optional.empty(), Optional.empty(), Optional.empty());
  }

  // language=sql
  private static final String CAPTURE_AGGREGATE_QUERY = """
      WITH capture_aggregate AS (
        SELECT
          trc.fk_road_railing_id,
          trc.fk_road_segment_id,
          trc.captured_at::date AS captured_at,
          RANGE_AGG(trc.segment_coverage) AS captured
        FROM trip_railing_capture trc
        GROUP BY 1,2,3
      ),
      capture_length AS (
        SELECT
          ca.fk_road_railing_id,
          ca.captured_at,
          SUM(UPPER(ca.captured) - LOWER(ca.captured)) AS captured_length
        FROM capture_aggregate ca
        GROUP BY 1,2
      )
      SELECT
        capture_date::date,
        SUM(cl.captured_length) AS captured_length
      FROM GENERATE_SERIES(DATE_TRUNC('WEEK', NOW()), DATE_TRUNC('WEEK', NOW()) + INTERVAL '1 WEEK', INTERVAL '1 DAY') capture_date
      LEFT JOIN capture_length cl
        ON capture_date::date = cl.captured_at
      GROUP BY 1
    """;

  public List<CapturedMetersByDay> findAggregates() {
    var params = new MapSqlParameterSource().addValue("date", LocalDate.now());

    return this.jdbcTemplate.query(
      CAPTURE_AGGREGATE_QUERY,
      params,
      (rs, i) -> new CapturedMetersByDay(
        rs.getObject("capture_date", LocalDate.class),
        rs.getDouble("captured_length")
      )
    );
  }

}
