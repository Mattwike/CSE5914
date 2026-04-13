DELETE FROM group_events
WHERE group_id = :group_id AND event_id = :event_id
RETURNING group_id, event_id;
