ALTER TABLE password_reset_code ADD COLUMN confirmation_code TEXT NOT NULL;
ALTER TABLE password_reset_code ADD COLUMN confirmation_claimed_at TIMESTAMP;
ALTER TABLE password_reset_code ADD COLUMN password_reset_code_id UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE password_reset_code DROP CONSTRAINT password_reset_code_pkey;

ALTER TABLE password_reset_code ADD PRIMARY KEY (password_reset_code_id);
