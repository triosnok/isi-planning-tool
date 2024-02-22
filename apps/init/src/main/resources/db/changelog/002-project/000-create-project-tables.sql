/**
 * NOTE: 
 *
 * Audit fields referencing user ids are not set up with foreign keys, to prevent having to cascade 
 * on deletion of user accounts.
 */

CREATE TABLE project (
  project_id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  reference_code TEXT,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  fk_created_by_user_id UUID,
  updated_at TIMESTAMP,
  fk_updated_by_user_id UUID,

  PRIMARY KEY (project_id)
);

CREATE TABLE project_plan (
  project_plan_id UUID NOT NULL DEFAULT gen_random_uuid(),
  fk_project_id UUID NOT NULL,
  railing_import_urls JSON,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  fk_created_by_USER_ID UUID,
  updated_at TIMESTAMP,
  fk_updated_by_user_id UUID,

  PRIMARY KEY (project_plan_id),
  FOREIGN KEY (fk_project_id) REFERENCES project (project_id)
);

CREATE TYPE road_direction AS ENUM ('WITH', 'AGAINST');
CREATE TYPE road_side AS ENUM ('LEFT', 'RIGHT', 'LEFT_AND_RIGHT', 'MIDDLE', 'CROSSING', 'MIDDLE_LEFT', 'MIDDLE_RIGHT', 'LEFT_ACCESS', 'RIGHT_ACCESS', 'ROUNDABOUT_CENTRE', 'LONGITUDINAL');

CREATE TABLE road_railing (
  road_railing_id UUID NOT NULL DEFAULT gen_random_uuid(),
  external_id BIGINT NOT NULL,
  geometry GEOMETRY NOT NULL,
  road_system_reference_id BIGINT,
  road_system_reference TEXT,
  length NUMERIC,
  direction_of_road road_direction,
  side_of_road road_side,
  last_imported_at TIMESTAMP DEFAULT NOW(),
  last_imported_by_user_id UUID,

  PRIMARY KEY (road_railing_id)
);

CREATE TABLE project_plan_road_railing (
  fk_project_plan_id UUID NOT NULL,
  fk_road_railing_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  fk_created_by_user_id UUID,

  PRIMARY KEY (fk_project_plan_id, fk_road_railing_id),
  FOREIGN KEY (fk_project_plan_id) REFERENCES project_plan (project_plan_id),
  FOREIGN KEY (fk_road_railing_id) REFERENCES road_railing (road_railing_id)
);
