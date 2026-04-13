SELECT ea.user_id, ea.joined_at, p.display_name
FROM event_attendees ea
LEFT JOIN profiles p ON ea.user_id = p.id
WHERE ea.event_id = :event_id
ORDER BY ea.joined_at;
