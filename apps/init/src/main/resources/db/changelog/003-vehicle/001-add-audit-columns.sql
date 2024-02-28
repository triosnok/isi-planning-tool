ALTER TABLE vehicle
ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN fk_created_by_user_id UUID,
ADD COLUMN updated_at TIMESTAMP,
ADD COLUMN fk_updated_by_user_id UUID;