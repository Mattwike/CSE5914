WITH new_group AS (
  INSERT INTO groups (name, description, image_url, join_policy, created_by)
  VALUES (:name, :description, :image_url, :join_policy, :created_by)
  RETURNING id, name, description, image_url, join_policy, created_by, created_at
)
INSERT INTO group_members (group_id, user_id, role)
SELECT id, :created_by, 'owner'
FROM new_group
RETURNING (SELECT id FROM new_group) AS id,
          (SELECT name FROM new_group) AS name,
          (SELECT description FROM new_group) AS description,
          (SELECT image_url FROM new_group) AS image_url,
          (SELECT join_policy FROM new_group) AS join_policy,
          (SELECT created_by FROM new_group) AS created_by,
          (SELECT created_at FROM new_group) AS created_at;
