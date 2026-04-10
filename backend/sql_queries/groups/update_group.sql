UPDATE groups
SET name = :name,
    description = :description,
    join_policy = :join_policy,
    updated_at = now()
WHERE id = :group_id AND created_by = :user_id
RETURNING id, name, description, image_url, join_policy;
