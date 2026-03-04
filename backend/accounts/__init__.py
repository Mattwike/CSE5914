from fastapi import APIRouter
from .user import router as userRouter

api_router = APIRouter()

api_router.include_router(userRouter)