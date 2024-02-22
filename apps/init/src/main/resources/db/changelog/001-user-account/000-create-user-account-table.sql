CREATE TYPE user_account_role AS ENUM ('PLANNER', 'DRIVER');

CREATE TABLE user_account  (
  user_account_id UUID DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_account_role NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP,

  PRIMARY KEY (user_account_id)
);
