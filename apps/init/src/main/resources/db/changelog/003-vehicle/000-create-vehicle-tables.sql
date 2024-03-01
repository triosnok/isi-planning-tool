CREATE TABLE vehicle (
  vehicle_id UUID DEFAULT gen_random_uuid(),
  image_url TEXT,
  registration_number TEXT NOT NULL,
  camera BOOLEAN,
  description TEXT,
  gnss_id TEXT,
  model TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  fk_created_by_user_id UUID,
  updated_at TIMESTAMP,
  fk_updated_by_user_id UUID,
  inactive_from TIMESTAMP,
  
  PRIMARY KEY (vehicle_id)
);
