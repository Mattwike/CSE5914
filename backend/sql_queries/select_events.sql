SELECT
    id,
    NULL::text AS external_id,
    title,
    description,
    NULL::text AS category,
    location_name,
    location_address,
    NULL::double precision AS latitude,
    NULL::double precision AS longitude,
    start_time,
    end_time,
    image_url,
    source,
    NULL::text AS source_url,
    NULL::text AS website_url
FROM events
WHERE start_time IS NULL OR start_time >= NOW()
ORDER BY start_time NULLS LAST
LIMIT 100;
