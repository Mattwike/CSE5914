SELECT
    e.id,
    NULL::text AS external_id,
    e.title,
    e.description,
    NULL::text AS category,
    e.location_name,
    e.location_address,
    NULL::double precision AS latitude,
    NULL::double precision AS longitude,
    e.start_time,
    e.end_time,
    e.image_url,
    e.source,
    NULL::text AS source_url,
    NULL::text AS website_url
FROM events e
LEFT JOIN follows f
    ON f.following_id = e.created_by
    AND f.follower_id = :current_user_id
WHERE e.start_time IS NULL OR e.start_time >= NOW()
ORDER BY
    CASE WHEN f.follower_id IS NOT NULL THEN 0 ELSE 1 END,
    e.start_time NULLS LAST
LIMIT 100;
