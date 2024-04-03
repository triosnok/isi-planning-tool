CREATE TABLE trip_railing_deviation (
  trip_railing_deviation_id UUID DEFAULT gen_random_uuid(),
  fk_trip_railing_capture_id UUID,
  deviation_type TEXT NOT NULL,
  details JSON NOT NULL DEFAULT '{}'::json,

  FOREIGN KEY (fk_trip_railing_capture_id) REFERENCES trip_railing_capture (trip_railing_capture_id),
  PRIMARY KEY (trip_railing_deviation_id)
);
