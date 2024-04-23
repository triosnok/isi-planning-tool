ALTER TABLE road_segment ADD COLUMN road_reference TEXT; 
ALTER TABLE road_segment ADD COLUMN road_category TEXT;

UPDATE road_segment SET 
  road_reference = (CASE 
    WHEN sys.road_category = 'E' THEN 'E' || sys.road_number::TEXT
    ELSE sys.road_number::TEXT
  END), 
  road_category = sys.road_category
FROM road_system sys
INNER JOIN road_segment rs ON rs.fk_road_system_id = sys.road_system_id;

ALTER TABLE road_segment DROP COLUMN fk_road_system_id CASCADE;

DROP TABLE road_system;
