SELECT id, title, description, location_name, start_time, end_time, image_url, fee, capacity, close_date, created_at
FROM events
WHERE created_by = :user_id
ORDER BY start_time DESC;