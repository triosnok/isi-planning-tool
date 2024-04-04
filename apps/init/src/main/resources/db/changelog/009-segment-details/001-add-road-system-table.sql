CREATE TABLE road_system (
  road_system_id BIGINT NOT NULL,
  road_category TEXT NOT NULL,
  road_phase TEXT NOT NULL,
  road_number INTEGER NOT NULL,
  last_imported_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (road_system_id)
);
