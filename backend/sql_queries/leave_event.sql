WITH removed AS (
    DELETE FROM event_attendees
    WHERE event_id = :event_id AND user_id = :user_id
    RETURNING event_id
)
UPDATE events
SET current_capacity = GREATEST(current_capacity - 1, 0)
FROM removed
WHERE events.id = removed.event_id
RETURNING events.id, events.current_capacity;
