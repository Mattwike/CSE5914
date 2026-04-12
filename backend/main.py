from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from accounts import api_router
import recommendations
import events
import groups
import chat

app = FastAPI(title="CSE5914 Capstone Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(events.router,prefix="/api")
app.include_router(groups.router, prefix="/api")
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])