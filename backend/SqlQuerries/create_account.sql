WITH key AS (
  INSERT INTO profiles (email, password) 
  VALUES (:email, :password) 
  RETURNING id
)
INSERT INTO profile_tokens (id, token)
SELECT id, :token FROM key;