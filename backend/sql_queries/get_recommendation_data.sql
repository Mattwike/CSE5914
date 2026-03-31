SELECT 
  p.id,
  p.first_name,
  up.preferences,
  e.id as event_id,
  e.title,
  e.description,
  e.date,
  e.location
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.user_id
CROSS JOIN (
  SELECT * FROM events 
  LIMIT 20
) e
WHERE p.id = :userID;