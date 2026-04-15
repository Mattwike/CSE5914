SELECT eoa.user_id, eoa.joined_at, p.display_name
FROM event_option_attendees eoa
LEFT JOIN profiles p ON p.id = eoa.user_id
WHERE eoa.event_option_id = :event_id
ORDER BY eoa.joined_at;
