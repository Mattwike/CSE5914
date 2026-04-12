SELECT COUNT(*) AS attendee_count
FROM event_option_attendees
WHERE event_option_id = :event_id;
