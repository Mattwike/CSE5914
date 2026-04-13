WITH capacity_check AS (
    SELECT id, capacity, current_capacity, close_date
    FROM events
    WHERE id = :event_id
      AND (capacity IS NULL OR current_capacity < capacity)
      AND (close_date IS NULL OR close_date > NOW())
    FOR UPDATE
),
insert_attendee AS (
    INSERT INTO event_attendees (event_id, user_id, joined_at)
    SELECT :event_id, :user_id, NOW()
    FROM capacity_check
    ON CONFLICT (event_id, user_id) DO NOTHING
    RETURNING event_id
)
UPDATE events
SET current_capacity = current_capacity + 1
FROM insert_attendee
WHERE events.id = insert_attendee.event_id
RETURNING events.id, events.current_capacity;
