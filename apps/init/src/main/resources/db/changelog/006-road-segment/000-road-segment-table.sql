CREATE TABLE road_segment (
  road_segment_id TEXT NOT NULL,
  geometry GEOMETRY NOT NULL,
  last_imported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_imported_by UUID,

  PRIMARY KEY (road_segment_id)
);
