CREATE TABLE road_railing_road_segment (
  fk_road_railing_id BIGINT NOT NULL,
  fk_road_segment_id TEXT NOT NULL,
  direction_of_road road_direction,
  side_of_road road_side,

  FOREIGN KEY (fk_road_railing_id) REFERENCES road_railing (road_railing_id),
  FOREIGN KEY (fk_road_segment_id) REFERENCES road_segment (road_segment_id)
);
