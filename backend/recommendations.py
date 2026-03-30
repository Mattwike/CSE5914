from fastapi import APIRouter, BackgroundTasks
from openai import OpenAi
import os, json

router = APIRouter(prefix="/recommendations", tags=["recommendations"])
client = OpenAi(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/get_recommendations")
async def getRecommendations(userID: str):
    
    rows = execute_sql("get_recommendation_data.sql", {"userID": userID})

    if not rows:
        return[]
    
    user = {
        "name": rows[0]["name"],
        "preferences": rows[0].get("preferences",[])
    }

    events = []
    for r in rows:
        events.append({
            "id": r["event_id"],
            "title": r["title"],
            "description": r["description"]
        })

    prompt = f"""
    You are recommending events to a college student.

    User:
    {user}

    Events:
    {events}

    Return ONLY a JSON object with a single key "ids" containing an array of the top 3 event IDs.
    Example: {{"ids": [1, 5, 8]}}
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
        )

        content = response.choices[0].message.content
        parsed = json.loads(content)
        ids = parsed.get("ids", [])

    except Exception as e:
        print(f"Recommendation Error: {e}") 
        ids = []

    if not ids:
        return events[:3]

    recommended = [e for e in events if str(e["id"]) in [str(i) for i in ids]]

    return recommended[:3]

    



@router.post("/review_recommendation")
async def reviewRecommendation(userID: str, eventID: str, rating: int):
    pass

