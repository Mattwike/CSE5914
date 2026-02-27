from fastapi import APIRouter
from .user import router as userRouter
from .admin import router as adminRouter

api_router = APIRouter()

api_router.include_router(userRouter)
api_router.include_router(adminRouter)