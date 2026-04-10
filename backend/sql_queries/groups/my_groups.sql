SELECT
  g.id,
  g.name,
  g.description,
  g.image_url,
  g.join_policy,
  g.created_by,
  g.created_at,
  gm.role AS my_role,
  (SELECT COUNT(*) FROM group_members gm2 WHERE gm2.group_id = g.id) AS member_count
FROM groups g
JOIN group_members gm ON gm.group_id = g.id
WHERE gm.user_id = :user_id
ORDER BY g.created_at DESC;
