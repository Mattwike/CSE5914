INSERT INTO group_members (group_id, user_id, role)
VALUES (:group_id, :user_id, 'member')
ON CONFLICT (group_id, user_id) DO NOTHING
RETURNING group_id, user_id, role, joined_at;
