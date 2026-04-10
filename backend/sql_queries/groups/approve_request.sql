UPDATE group_join_requests
SET status = 'approved'
WHERE id = :request_id AND group_id = :group_id AND status = 'pending'
RETURNING id, group_id, user_id;
