SELECT display_name
FROM profiles
WHERE id IN (
  SELECT follower_id
  FROM follows
  WHERE following_id = :user_id
);
