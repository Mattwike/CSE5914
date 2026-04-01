SELECT * FROM (
    SELECT
        id,
        external_id,
        title,
        description,
            category::text AS category,
        location_name,
        location_address,
        latitude,
        longitude,
        start_time,
        end_time,
        image_url,
        source::text AS source,
        source_url::text AS source_url,
        website_url::text AS website_url
    FROM event_options
    UNION ALL
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
        source::text AS source,
        NULL::text AS source_url,
        NULL::text AS website_url
    FROM events
) t
WHERE id = :id
LIMIT 1;
