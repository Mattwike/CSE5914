from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import os

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]

@router.post("/basic")
async def basic_chat(req: ChatRequest):
    try:
        openai_messages = [
            {"role": "system", "content": "You are a helpful event assistant for Ohio State University students. Keep answers friendly and concise."},
        ]
        
        for m in req.history:
            openai_messages.append({"role": m.role, "content": m.content})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=openai_messages
        )
        
        ai_reply = response.choices[0].message.content
        return {"reply": ai_reply}
        
    except Exception as e:
        print(f"OpenAI Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Connection Error: {str(e)}")