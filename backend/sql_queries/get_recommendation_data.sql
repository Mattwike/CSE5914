SELECT 
  p.id,
  p.name,
  up.preferences,
  e.id as event_id,
  e.title,
  e.description,
  e.date
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.user_id
JOIN events e ON e.date >= NOW()
WHERE p.id = :userID;