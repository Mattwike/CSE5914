UPDATE events
SET 
    title = COALESCE(:title, title),
    description = COALESCE(:description, description),
    location_name = COALESCE(:location_name, location_name),
    location_address = COALESCE(:location_address, location_address),
    start_time = COALESCE(:start_time, start_time),
    end_time = COALESCE(:end_time, end_time),
    image_url = COALESCE(:image_url, image_url),
    capacity = COALESCE(:capacity, capacity),
    close_date = COALESCE(:close_date, close_date),
    fee = COALESCE(:fee, fee),
    category = COALESCE(:category, category)
WHERE id = :event_id AND created_by = :user_id
RETURNING id, title, description, location_name, location_address, start_time, end_time, image_url, capacity, close_date, fee, category;