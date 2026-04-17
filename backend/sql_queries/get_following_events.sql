SELECT
    e.id,
    e.title,
    e.description,
    e.category,
    e.location_name,
    e.location_address,
    e.start_time,
    e.end_time,
    e.image_url
FROM events e
INNER JOIN follows f
    ON f.following_id = e.created_by
WHERE f.follower_id = :user_id
  AND (e.start_time IS NULL OR e.start_time >= NOW())
ORDER BY e.start_time NULLS LAST;