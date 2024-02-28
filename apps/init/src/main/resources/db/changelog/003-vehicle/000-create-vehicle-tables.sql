CREATE TABLE vehicle (
  vehicle_id UUID DEFAULT gen_random_uuid(),
  image_url TEXT,
  registration_number TEXT NOT NULL,
  camera BOOLEAN,
  description TEXT,
  gnss_id TEXT,
  
  PRIMARY KEY (vehicle_id)
);
