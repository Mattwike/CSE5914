from fastapi import APIRouter, BackgroundTasks, Depends
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/get_recommendations")
async def getRecommendations(userID: str, current_user: dict = Depends(get_current_user)):
    pass

@router.post("/review_recommendation")
async def reviewRecommendation(userID: str, eventID: str, rating: int, current_user: dict = Depends(get_current_user)):
    pass

