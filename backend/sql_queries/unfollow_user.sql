DELETE FROM follows
                WHERE follower_id = :follower_id
                AND following_id = (SELECT id FROM profiles WHERE display_name = :followed_username)