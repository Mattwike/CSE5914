INSERT INTO user_preferences (user_id, event_size, event_distance)
VALUES (:user_id, :event_size, :event_distance)
ON CONFLICT (user_id)
DO UPDATE SET
  event_size = EXCLUDED.event_size,
  event_distance = EXCLUDED.event_distance;
