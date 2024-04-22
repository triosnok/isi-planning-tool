ALTER TABLE trip_railing_capture ADD COLUMN railing_top_coverage NUMRANGE NOT NULL DEFAULT '[0,0]'::NUMRANGE;
ALTER TABLE trip_railing_capture ADD COLUMN railing_side_coverage NUMRANGE NOT NULL DEFAULT '[0,0]'::NUMRANGE;
ALTER TABLE trip_railing_capture ADD COLUMN segment_coverage NUMRANGE NOT NULL DEFAULT '[0,0]'::NUMRANGE;
ALTER TABLE trip_railing_capture ADD COLUMN segment_index NUMERIC NOT NULL DEFAULT 0;
