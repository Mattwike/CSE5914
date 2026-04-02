from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
from supabase import create_client, Client
from datetime import datetime, timezone
import os
import json

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_supabase() -> Client:
    return create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]
    user_id: Optional[str] = None

def fetch_event_context(user_id: Optional[str], supabase: Client) -> str:
    now = datetime.now(timezone.utc).isoformat()

    events_res = (
        supabase.table("events")
        .select("title, description, location_name, location_address, start_time, end_time, fee")
        .gte("start_time", now)
        .order("start_time")
        .limit(25)
        .execute()
    )

    options_res = (
        supabase.table("event_options")
        .select("title, description, category, tags, location_name, start_time, end_time, is_free, price_level")
        .gte("start_time", now)
        .order("start_time")
        .limit(10)
        .execute()
    )

    user_context = ""
    if user_id:
        pref_res = (
            supabase.table("user_preferences_categories")
            .select("categories(name)")
            .eq("user_id", user_id)
            .execute()
        )
        category_names = [r["categories"]["name"] for r in pref_res.data if r.get("categories")]
        if category_names:
            user_context = f"\nThis user's preferred categories: {', '.join(category_names)}."

    events = events_res.data or []
    options = options_res.data or []

    if not events and not options:
        return "No upcoming events found in the database."

    lines = [f"Today's date/time (UTC): {now}", user_context, "\n--- UPCOMING EVENTS ---"]
    for e in events:
        start = e.get("start_time", "TBD")
        location = e.get("location_name") or e.get("location_address") or "No location"
        fee = f"${e['fee']}" if e.get("fee") else "Free"
        lines.append(f"- {e['title']} | {start} | {location} | {fee}\n  {e.get('description') or ''}")

    if options:
        lines.append("\n--- OTHER ACTIVITIES / PLACES ---")
        for o in options:
            start = o.get("start_time", "Recurring")
            lines.append(f"- {o['title']} ({o.get('category', '')}) | {start} | {o.get('location_name', '')}")

    return "\n".join(lines)


@router.post("/basic")
async def basic_chat(req: ChatRequest):
    try:
        supabase = get_supabase()
        event_context = fetch_event_context(req.user_id, supabase)

        system_prompt = f"""You are a helpful event assistant for Ohio State University students.
Keep answers friendly and concise. Use the event data below to answer questions.
If asked about events today/this week, filter by date from the list.
Do not make up events not in the list.

{event_context}"""

        openai_messages = [{"role": "system", "content": system_prompt}]
        for m in req.history:
            openai_messages.append({"role": m.role, "content": m.content})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=openai_messages
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))