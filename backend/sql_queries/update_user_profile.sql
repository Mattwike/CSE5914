UPDATE profiles
SET
  display_name = :display_name,
  birth_date = :birth_date,
  graduation_year = :graduation_year,
  major = :major,
  has_car = :has_car,
  bio = :bio,
  updated_at = NOW()
WHERE id = :id
RETURNING
  id,
  email,
  verified,
  display_name,
  birth_date,
  graduation_year,
  major,
  has_car,
  bio;
