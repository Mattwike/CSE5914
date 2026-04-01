INSERT INTO events (title, description, location_name, location_address, start_time, end_time, image_url, source, created_by, capacity, close_date, fee)
VALUES (:title, :description, :location_name, :location_address, :start_time, :end_time, :image_url, 'user_created', :created_by, :capacity, :close_date, :fee)
RETURNING id;