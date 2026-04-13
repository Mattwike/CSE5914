SELECT event_time
FROM user_preferences_time
WHERE user_id = :user_id
ORDER BY event_time;
