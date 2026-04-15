SELECT CASE
    WHEN EXISTS (SELECT 1 FROM events WHERE id = :event_id) THEN 'events'
    WHEN EXISTS (SELECT 1 FROM event_options WHERE id = :event_id) THEN 'event_options'
    ELSE NULL
END AS event_type;
