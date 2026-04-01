SELECT display_name
FROM profiles
WHERE id IN (
  SELECT following_id
  FROM follows
  WHERE follower_id = :user_id
);
