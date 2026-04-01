SELECT
  id,
  email,
  verified,
  display_name,
  birth_date,
  graduation_year,
  major,
  has_car,
  bio
FROM profiles
WHERE id = :id;
