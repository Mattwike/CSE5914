COLLEGES = {
    "ohio_state": {
        "name": "Ohio State University",
        "lat": 40.0076,
        "lng": -83.0308,
        "city": "Columbus",
        "state_code": "OH",
    },
}

def get_college(key: str) -> dict:
    college = COLLEGES.get(key)
    if not college:
        raise ValueError(f"Unknown college key: '{key}'. Available: {list(COLLEGES.keys())}")
    return college