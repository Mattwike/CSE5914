SELECT
    id,
    external_id,
    title,
    description,
    category,
    location_name,
    location_address,
    latitude,
    longitude,
    start_time,
    end_time,
    image_url,
    source,
    source_url,
    website_url
FROM event_options
WHERE start_time IS NULL OR start_time >= :now_query
ORDER BY start_time NULLS LAST
LIMIT 200;
