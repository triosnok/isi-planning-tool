/*
  This enables easier aggregation of progress in projects measured in coverage on segments. 
  If the trip_railing_capture table grows too large, this view could potentially be refactored as an insert that is done after each trip is ended.
*/
CREATE VIEW project_plan_segment_coverage_view AS (
  WITH capture_aggregate AS (
    SELECT
      t.fk_project_plan_id,
      trc.fk_road_railing_id,
      trc.fk_road_segment_id,
      RANGE_AGG(trc.segment_coverage) AS captured
    FROM trip_railing_capture trc
    INNER JOIN trip t
      ON trc.fk_trip_id = t.trip_id
    GROUP BY t.fk_project_plan_id, trc.fk_road_railing_id, trc.fk_road_segment_id
  )
  SELECT
    pprr.fk_project_plan_id as project_plan_id,
    rr.road_railing_id as fk_road_railing_id,
    rs.road_segment_id as fk_road_segment_id,
    MAX(rs.length) AS length,
    SUM(UPPER(ca.captured) - LOWER(ca.captured)) AS coverage
  FROM project_plan_road_railing pprr 
  INNER JOIN road_railing rr
    ON pprr.fk_road_railing_id = rr.road_railing_id
  INNER JOIN road_segment rs
    ON rr.road_railing_id = rs.fk_road_railing_id
  LEFT JOIN capture_aggregate ca
  	ON rs.road_segment_id = ca.fk_road_segment_id
  	AND rr.road_railing_id = ca.fk_road_railing_id
  	AND pprr.fk_project_plan_id = ca.fk_project_plan_id
  GROUP BY pprr.fk_project_plan_id, rr.road_railing_id, rs.road_segment_id
);
