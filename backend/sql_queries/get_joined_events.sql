SELECT
    e.id,
    e.title,
    e.description,
    e.location_name,
    e.location_address,
    e.start_time,
    e.image_url
FROM event_attendees ea
JOIN events e ON ea.event_id = e.id
WHERE ea.user_id = :user_id
  AND e.created_by != :user_id
ORDER BY e.start_time;
