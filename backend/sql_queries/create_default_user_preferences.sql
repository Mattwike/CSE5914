INSERT INTO user_preferences (user_id, event_size, event_distance)
VALUES (:user_id, 'mega', 2)
ON CONFLICT (user_id) DO NOTHING
RETURNING event_size, event_distance;
