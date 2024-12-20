---
title: Postgres
slug: postgres
date: '2024-11-04'
category: Database
headings:
- title: Views and Materialized Views
  slug: views-and-materialized-views
  depth: 2
- title: Working with Data Duplication
  slug: working-with-data-duplication
  depth: 2
---

## Views and Materialized Views {#views-and-materialized-views}

Cache an expensive query with a materialized view with historical data
(except for the latest two days), then union it with the live data. This
way, we get the best of both worlds: fast query times and up-to-date
data.

``` sql
-- create the materialized view
CREATE MATERIALIZED VIEW historical_data AS
SELECT id, avg(duration) as avg_duration
FROM logs
WHERE timestamp < NOW() - INTERVAL '2 days';

-- combine hisotical data with live data
SELECT id, avg(duration) as avg_duration
FROM logs
WHERE timestamp >= NOW() - INTERVAL '2 days'
UNION ALL
SELECT id, avg_duration
FROM historical_data;

-- refresh the materialized view every some time
REFRESH MATERIALIZED VIEW historical_data;
```

## Working with Data Duplication {#working-with-data-duplication}

Pick the latest record per group with `DISTINCT ON` and `ORDER BY`

``` sql
-- get the highest score for each student and the associated subject
SELECT DISTINCT ON (name) name, subject, score
FROM student_scores
ORDER BY name, score DESC;

-- get the latest request_duration for each URL
SELECT DISTINCT ON (url) url, request_duration
FROM logs
ORDER BY url, timestamp DESC
```

Add a `is_duplicate` flag with window functions

``` sql
CREATE VIEW table_with_duplicates AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY column1, column2, ...
      ORDER BY created_at DESC
    ) > 1 AS is_duplicate
  from table_name
)

-- then delete the duplicates
DELETE FROM table_with_duplicates
WHERE id in (
  SELECT id
  FROM table_with_duplicates
  WHERE is_duplicate
)
```
