CREATE TABLE road_segment (
  fk_road_railing_id BIGINT NOT NULL,
  road_segment_id TEXT NOT NULL,
  direction_of_road road_direction,
  side_of_road road_side,
  geometry GEOMETRY NOT NULL,
  length NUMERIC NOT NULL,
  last_imported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_imported_by UUID,

  PRIMARY KEY (fk_road_railing_id, road_segment_id),
  FOREIGN KEY (fk_road_railing_id) REFERENCES road_railing (road_railing_id)
);
