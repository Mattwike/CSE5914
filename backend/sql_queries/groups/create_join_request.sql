INSERT INTO group_join_requests (group_id, user_id, status)
VALUES (:group_id, :user_id, 'pending')
RETURNING id, group_id, user_id, status, created_at;
