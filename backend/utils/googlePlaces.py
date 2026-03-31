import json
import os
import requests
from datetime import timezone, datetime
from dotenv import load_dotenv
from sql_helper import SQLHelper
from colleges import get_college
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
import math
try:
    import tzdata
except ImportError:
    pass

load_dotenv()

BASE_URL = "https://places.googleapis.com/v1/places:searchNearby"

PLACE_TYPES = [
    "museum", "art_gallery", "park", "bar", "restaurant",
    "bowling_alley", "movie_theater", "night_club",
    "amusement_park", "zoo", "aquarium", "stadium",
]

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

def fetch_places_by_type(lat, lng, place_type, radius_meters=8000):
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.websiteUri,places.priceLevel,places.rating,places.userRatingCount,places.regularOpeningHours",
    }
    body = {
        "includedTypes": [place_type],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": radius_meters,
            }
        }
    }
    resp = requests.post(BASE_URL, headers=headers, json=body)
    resp.raise_for_status()
    data = resp.json()
    places = data.get("places", [])
    return places

def haversine_miles(lat1, lon1, lat2, lon2):
    """Calculate distance in miles between two lat/lng points."""
    R = 3958.8
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def get_todays_hours(raw: dict):
    """Extract today's open/close times from Google Places opening hours."""
    hours = raw.get("regularOpeningHours", {})
    periods = hours.get("periods", [])
    
    today = datetime.now(ZoneInfo("America/New_York")).weekday()
    google_today = (today + 1) % 7

    for period in periods:
        open_info = period.get("open", {})
        close_info = period.get("close", {})
        if open_info.get("day") == google_today:
            now = datetime.now(ZoneInfo("America/New_York"))
            
            open_hour = open_info.get("hour", 0)
            open_min  = open_info.get("minute", 0)
            close_hour = close_info.get("hour", 23)
            close_min  = close_info.get("minute", 59)

            start = now.replace(hour=open_hour, minute=open_min, second=0, microsecond=0)
            end   = now.replace(hour=close_hour, minute=close_min, second=0, microsecond=0)
            return start.isoformat(), end.isoformat()
    
    return None, None

def map_to_schema(raw: dict, college: dict, place_type: str) -> dict:
    place_id  = raw.get("id")
    location  = raw.get("location", {})
    photos    = raw.get("photos", [])
    photo_name = photos[0].get("name") if photos else None
    image_url = (
        f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={API_KEY}"
        if photo_name else None
    )

    # Distance from campus
    lat = location.get("latitude")
    lng = location.get("longitude")
    distance = (
        haversine_miles(college["lat"], college["lng"], lat, lng)
        if lat and lng else None
    )

    CATEGORY_MAP = {
        "museum":        "museum",
        "art_gallery":   "art_gallery",
        "park":          "park",
        "bar":           "bar",
        "restaurant":    "restaurant",
        "bowling_alley": "bowling_alley",
        "movie_theater": "movie_theater",
        "night_club":    "night_club",
        "amusement_park":"amusement_park",
        "zoo":           "zoo",
        "aquarium":      "aquarium",
        "stadium":       "stadium",
    }
    category = CATEGORY_MAP.get(place_type, "other")

    # Price level — Google returns strings like "PRICE_LEVEL_MODERATE"
    price_raw = raw.get("priceLevel", "")
    PRICE_MAP = {
        "PRICE_LEVEL_FREE":          0,
        "PRICE_LEVEL_INEXPENSIVE":   1,
        "PRICE_LEVEL_MODERATE":      2,
        "PRICE_LEVEL_EXPENSIVE":     3,
        "PRICE_LEVEL_VERY_EXPENSIVE":4,
    }
    price_level = PRICE_MAP.get(price_raw, None)

    # Popularity score: rating * log10(review_count + 1)
    rating       = raw.get("rating")
    review_count = raw.get("userRatingCount", 0)
    popularity   = round(rating * math.log10(review_count + 1), 4) if rating else None

    # Opening hours — store full weekly schedule as JSONB
    opening_hours_raw = raw.get("regularOpeningHours", {})
    opening_hours = opening_hours_raw.get("weekdayDescriptions") or None

    start_time, end_time = get_todays_hours(raw)

    return {
        "source":               "google",
        "external_id":          place_id,
        "title":                raw.get("displayName", {}).get("text"),
        "description":          f"{place_type.replace('_', ' ').title()} near {college['name']}. "
                                f"Rating: {raw.get('rating', 'N/A')} ⭐ ({review_count} reviews)",
        "category":             category,
        "location_name":        raw.get("displayName", {}).get("text"),
        "location_address":     raw.get("formattedAddress"),
        "latitude":             lat,
        "longitude":            lng,
        "distance_from_campus": distance,
        "is_recurring":         True,
        "start_time":           start_time,
        "end_time":             end_time,
        "opening_hours":        json.dumps(opening_hours) if opening_hours else None,
        "price_level":          price_level,
        "min_price":            None,
        "max_price":            None,
        "is_free":              price_level == 0 or price_raw == "" or price_raw is None,
        "google_rating":        rating,
        "google_review_count":  review_count,
        "popularity_score":     popularity,
        "image_url":            image_url,
        "source_url":           raw.get("websiteUri") or f"https://www.google.com/maps/place/?q=place_id:{place_id}",
        "website_url":          raw.get("websiteUri"),
        "walkable":            distance is not None and distance <= 2.0,
    }


def fetch_all_places(college_key="ohio_state", radius_meters=8000):
    college = get_college(college_key)
    lat, lng = college["lat"], college["lng"]

    seen_ids = set()
    all_places = []
    for place_type in PLACE_TYPES:
        places = fetch_places_by_type(lat, lng, place_type, radius_meters)
        for p in places:
            uid = p.get("id")
            if uid not in seen_ids:
                seen_ids.add(uid)
                p["_place_type"] = place_type
                all_places.append(p)

    return all_places


def sync_google_places(engine, college_key="ohio_state", radius_meters=8000):
    college = get_college(college_key)

    sql_helper = SQLHelper()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    query_path = os.path.join(base_dir, "..", "sql_queries", "insert_event_options.sql")

    with open(query_path, 'r') as f:
        QUERY = f.read()

    places = fetch_all_places(college_key, radius_meters)

    success = 0
    raw_conn = engine.raw_connection()
    try:
        cursor = raw_conn.cursor()
        for raw in places:
            try:
                params = map_to_schema(raw, college, raw["_place_type"])
                cursor.execute(QUERY, params)
                success += 1
            except Exception as e:
                raw_conn.rollback()
                name = raw.get("displayName", {}).get("text", "unknown")
        raw_conn.commit()
    finally:
        raw_conn.close()
