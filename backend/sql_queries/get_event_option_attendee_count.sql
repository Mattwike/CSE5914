SELECT COUNT(*)::int AS current_capacity
FROM event_option_attendees
WHERE event_option_id = :event_id;
