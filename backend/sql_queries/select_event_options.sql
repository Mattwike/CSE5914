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
-- Include events with no start_time, future start_time, or recurring events
WHERE start_time IS NULL OR start_time >= NOW() OR is_recurring = true
ORDER BY start_time NULLS LAST
LIMIT 100;
