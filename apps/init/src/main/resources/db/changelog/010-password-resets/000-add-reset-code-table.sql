CREATE TABLE password_reset_code (
  fk_user_account_id UUID NOT NULL,
  reset_code TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,

  PRIMARY KEY (reset_code)
);
