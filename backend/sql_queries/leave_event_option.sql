DELETE FROM event_option_attendees
WHERE event_option_id = :event_id AND user_id = :user_id
RETURNING event_option_id;
