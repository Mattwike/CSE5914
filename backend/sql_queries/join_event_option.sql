INSERT INTO event_option_attendees (event_option_id, user_id, joined_at)
VALUES (:event_id, :user_id, NOW())
ON CONFLICT (event_option_id, user_id) DO NOTHING
RETURNING event_option_id;
