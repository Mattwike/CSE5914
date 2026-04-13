SELECT role
FROM group_members
WHERE group_id = :group_id AND user_id = :user_id;
