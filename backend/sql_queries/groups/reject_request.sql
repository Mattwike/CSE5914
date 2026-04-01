UPDATE group_join_requests
SET status = 'rejected'
WHERE id = :request_id AND group_id = :group_id AND status = 'pending'
RETURNING id;
