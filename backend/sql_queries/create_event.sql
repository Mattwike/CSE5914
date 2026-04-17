WITH new_event AS (
    INSERT INTO events (title, description, location_name, location_address, start_time, end_time, image_url, source, created_by, capacity, close_date, fee, current_capacity, category)
    VALUES (:title, :description, :location_name, :location_address, :start_time, :end_time, :image_url, 'user_created', :created_by, :capacity, :close_date, :fee, 1, :category)
    RETURNING id, created_by
)
INSERT INTO event_attendees (event_id, user_id, joined_at)
SELECT id, created_by, NOW()
FROM new_event
RETURNING event_id AS id;