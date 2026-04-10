SELECT
  g.id,
  g.name,
  g.description,
  g.image_url,
  g.join_policy,
  g.created_by,
  g.created_at,
  g.updated_at,
  p.email AS creator_email,
  p.display_name AS creator_display_name,
  (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) AS member_count
FROM groups g
JOIN profiles p ON p.id = g.created_by
WHERE g.id = :group_id;
