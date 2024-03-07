CREATE TABLE trip_railing_capture (
  trip_railing_capture_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_trip_id UUID NOT NULL,
  fk_road_railing_id UUID NOT NULL,
  captured_at TIMESTAMP DEFAULT NOW(),
  position POINT,
  image_urls JSON,

  PRIMARY KEY (trip_railing_capture_id),
  
  FOREIGN KEY (fk_trip_id) REFERENCES trip (trip_id),
  FOREIGN KEY (fk_road_railing_id) REFERENCES road_railing (road_railing_id)
);
