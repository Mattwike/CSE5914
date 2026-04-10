SELECT
  gm.user_id,
  gm.role,
  gm.joined_at,
  p.email,
  p.display_name
FROM group_members gm
JOIN profiles p ON p.id = gm.user_id
WHERE gm.group_id = :group_id
ORDER BY
  CASE gm.role
    WHEN 'owner' THEN 0
    WHEN 'admin' THEN 1
    ELSE 2
  END,
  gm.joined_at;
