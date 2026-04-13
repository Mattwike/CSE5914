SELECT
  e.id,
  e.title,
  e.description,
  e.location_name,
  e.location_address,
  e.start_time,
  e.end_time,
  e.image_url,
  e.source,
  e.fee,
  e.capacity,
  ge.added_at
FROM group_events ge
JOIN events e ON e.id = ge.event_id
WHERE ge.group_id = :group_id
ORDER BY e.start_time;
