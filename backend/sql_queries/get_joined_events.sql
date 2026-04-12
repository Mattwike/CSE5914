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

UNION ALL

SELECT
    eo.id,
    eo.title,
    eo.description,
    eo.location_name,
    eo.location_address,
    eo.start_time,
    eo.image_url
FROM event_option_attendees eoa
JOIN event_options eo ON eoa.event_option_id = eo.id
WHERE eoa.user_id = :user_id

ORDER BY start_time;
