CREATE INDEX road_railing_geometry_idx ON road_railing USING GIST (geometry);
CREATE INDEX road_segment_geometry_idx ON road_segment USING GIST (geometry);
