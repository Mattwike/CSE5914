from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from accounts import api_router

app = FastAPI(title="CSE5914 Capstone Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Hello test Applications!"}