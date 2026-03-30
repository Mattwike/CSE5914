from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os

router = APIRouter()

client = OpenAI()

class ChatRequest(BaseModel):
    message: str

@router.post("/basic")
async def basic_chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful event assistant for Ohio State University students. Keep answers friendly and concise."},
                {"role": "user", "content": req.message}
            ]
        )
        
        ai_reply = response.choices[0].message.content
        return {"reply": ai_reply}
        
    except Exception as e:
        print(f"OpenAI Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to AI")