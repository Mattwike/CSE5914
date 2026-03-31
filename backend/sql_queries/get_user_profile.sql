SELECT
  id,
  email,
  verified,
  display_name,
  graduation_year,
  major,
  has_car,
  bio
FROM profiles
WHERE id = :id;
