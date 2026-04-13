from fastapi import APIRouter
from .user import router as userRouter
from .follow import router as followRouter

api_router = APIRouter()

api_router.include_router(userRouter)
api_router.include_router(followRouter)