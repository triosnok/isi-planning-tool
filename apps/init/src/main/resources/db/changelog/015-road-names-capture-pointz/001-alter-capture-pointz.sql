ALTER TABLE trip_railing_capture
ALTER COLUMN position TYPE GEOMETRY(POINTZ)
USING ST_Force3D(position);
