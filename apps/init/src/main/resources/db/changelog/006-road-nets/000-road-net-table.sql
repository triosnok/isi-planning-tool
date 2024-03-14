CREATE TABLE road_net (
  road_net_id UUID NOT NULL DEFAULT gen_random_uuid(),
  external_id BIGINT NOT NULL,
  geometry GEOMETRY NOT NULL,
  last_imported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_imported_by UUID,

  PRIMARY KEY (road_net_id),
  UNIQUE (external_id)
);
