INSERT INTO follows (follower_id, following_id)
VALUES (
    :follower_id,
    (SELECT id FROM profiles WHERE display_name = :followed_username)
)
ON CONFLICT DO NOTHING;