ALTER TABLE project_plan RENAME COLUMN railing_import_urls TO railing_imports;

/*
the following transforms JSON column values from ['url1', 'url2'] 
to: [{ count: 0, url: 'url1', importedAt: '2021-01-01T00:00:00Z' }, { count: 0, url: 'url2', importedAt: '2021-01-01T00:00:00Z' }]
*/ 
UPDATE project_plan SET railing_imports = transform.railing_imports
FROM (
  WITH unnested AS (
    SELECT
      project_plan_id,
      JSON_ARRAY_ELEMENTS(railing_imports) AS railing_imports
    FROM project_plan
  )
  SELECT
    u.project_plan_id,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'count', 0,
        'url', u.railing_imports,
        'importedAt', NOW() AT TIME ZONE 'UTC'
      )
    ) AS railing_imports
  FROM unnested u
  GROUP BY u.project_plan_id
) transform
WHERE project_plan.project_plan_id = transform.project_plan_id;
