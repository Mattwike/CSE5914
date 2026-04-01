SELECT 
    t.*,
    p.display_name
FROM (
    SELECT
        id,
        external_id,
        title,
        description,
        category::text AS category, -- Change this line: Cast to text
        location_name,
        location_address,
        latitude,
        longitude,
        start_time,
        end_time,
        image_url,
        source::text AS source,
        source_url::text AS source_url,
        website_url::text AS website_url,
        NULL::uuid AS created_by
    FROM event_options
    UNION ALL
    SELECT
        id,
        NULL::text AS external_id,
        title,
        description,
        NULL::text AS category, -- This now matches the text cast above
        location_name,
        location_address,
        NULL::double precision AS latitude,
        NULL::double precision AS longitude,
        start_time,
        end_time,
        image_url,
        source::text AS source,
        NULL::text AS source_url,
        NULL::text AS website_url,
        created_by
    FROM events
) t
LEFT JOIN profiles p ON t.created_by = p.id
WHERE t.id = :id
LIMIT 1;
