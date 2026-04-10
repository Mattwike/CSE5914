SELECT 1 AS attending
FROM event_attendees
WHERE event_id = :event_id AND user_id = :user_id
LIMIT 1;
