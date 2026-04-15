WITH key AS (
  INSERT INTO profiles (email, password) 
  VALUES (:email, :password) 
  RETURNING id
), preference AS (
  INSERT INTO user_preferences (user_id, event_size, event_distance)
  SELECT id, 'mega', 2 FROM key
)
INSERT INTO profile_tokens (id, token)
SELECT id, :token FROM key;
