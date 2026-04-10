DELETE FROM group_members
WHERE group_id = :group_id AND user_id = :target_user_id AND role != 'owner'
RETURNING group_id, user_id;
