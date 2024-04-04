ALTER TABLE road_segment ADD COLUMN road_system_reference TEXT;
ALTER TABLE road_segment ADD COLUMN fk_road_system_id BIGINT;
ALTER TABLE road_segment ADD CONSTRAINT fk_road_system_id FOREIGN KEY (fk_road_system_id) REFERENCES road_system (road_system_id);
