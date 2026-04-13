UPDATE profiles
SET verified = true
WHERE email = :email
RETURNING id, email;