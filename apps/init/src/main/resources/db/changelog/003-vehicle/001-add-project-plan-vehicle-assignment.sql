ALTER TABLE project_plan ADD COLUMN fk_vehicle_id UUID;
ALTER TABLE project_plan ADD CONSTRAINT fk_vehicle_id FOREIGN KEY (fk_vehicle_id) REFERENCES vehicle (vehicle_id);
