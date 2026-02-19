from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import account

app = FastAPI(title="CSE5914 Capstone Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(account.router)

@app.get("/")
async def root():
    return {"message": "Hello test Applications!"}