CREATE TABLE trip (
  trip_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_project_plan_id UUID NOT NULL,
  fk_driver_user_id UUID,
  fk_vehicle_id UUID,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  gnss_log TEXT,
  camera_logs JSON,
  fk_created_by_user_id UUID,
  updated_at TIMESTAMP,
  fk_updated_by_user_id UUID,
  
  PRIMARY KEY (trip_id),
  
  FOREIGN KEY (fk_project_plan_id) REFERENCES project_plan (project_plan_id),
  FOREIGN KEY (fk_driver_user_id) REFERENCES user_account (user_account_id),
  FOREIGN KEY (fk_vehicle_id) REFERENCES vehicle (vehicle_id)
);
