SELECT
  jr.id,
  jr.group_id,
  jr.user_id,
  jr.status,
  jr.created_at,
  p.email,
  p.display_name
FROM group_join_requests jr
JOIN profiles p ON p.id = jr.user_id
WHERE jr.group_id = :group_id AND jr.status = 'pending'
ORDER BY jr.created_at;
