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
WHERE (:q IS NULL OR g.name ILIKE '%' || :q || '%' OR g.description ILIKE '%' || :q || '%')
ORDER BY g.created_at DESC
LIMIT :lim OFFSET :off;
