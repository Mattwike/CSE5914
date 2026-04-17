SELECT
  g.id,
  g.name,
  g.description,
  g.image_url,
  g.join_policy,
  g.created_by,
  g.created_at,
  (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) AS member_count
FROM groups g
ORDER BY RANDOM()
LIMIT :lim;
