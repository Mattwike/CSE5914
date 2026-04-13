INSERT INTO group_events (group_id, event_id)
VALUES (:group_id, :event_id)
ON CONFLICT (group_id, event_id) DO NOTHING
RETURNING group_id, event_id, added_at;
