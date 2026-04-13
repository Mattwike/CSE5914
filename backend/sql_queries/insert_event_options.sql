INSERT INTO event_options (
        id, source, external_id, title, description, category,
        location_name, location_address, latitude, longitude, distance_from_campus,
        is_recurring, start_time, end_time, opening_hours,
        price_level, min_price, max_price, is_free, google_rating, google_review_count, popularity_score,
        image_url, source_url, website_url, walkable,
        created_at, updated_at
    ) VALUES (
        gen_random_uuid(), %(source)s, %(external_id)s, %(title)s, %(description)s, %(category)s,
        %(location_name)s, %(location_address)s, %(latitude)s, %(longitude)s, %(distance_from_campus)s,
        %(is_recurring)s, %(start_time)s, %(end_time)s, %(opening_hours)s,
        %(price_level)s,  %(min_price)s, %(max_price)s, %(is_free)s, %(google_rating)s, %(google_review_count)s, %(popularity_score)s,
        %(image_url)s, %(source_url)s, %(website_url)s, %(walkable)s,
        NOW(), NOW()
    )
    ON CONFLICT (external_id) DO UPDATE SET
        title                = EXCLUDED.title,
        description          = EXCLUDED.description,
        category             = EXCLUDED.category,
        location_name        = EXCLUDED.location_name,
        location_address     = EXCLUDED.location_address,
        latitude             = EXCLUDED.latitude,
        longitude            = EXCLUDED.longitude,
        distance_from_campus = EXCLUDED.distance_from_campus,
        is_recurring         = EXCLUDED.is_recurring,
        start_time           = EXCLUDED.start_time,
        end_time             = EXCLUDED.end_time,
        opening_hours        = EXCLUDED.opening_hours,
        price_level          = EXCLUDED.price_level,
        min_price  = EXCLUDED.min_price,
        max_price  = EXCLUDED.max_price,
        is_free              = EXCLUDED.is_free,
        google_rating        = EXCLUDED.google_rating,
        google_review_count  = EXCLUDED.google_review_count,
        popularity_score     = EXCLUDED.popularity_score,
        image_url            = EXCLUDED.image_url,
        source_url           = EXCLUDED.source_url,
        website_url          = EXCLUDED.website_url,
        updated_at           = NOW()