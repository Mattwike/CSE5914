from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/get_recommendations")
async def getRecommendations(userID: str):
    pass

@router.post("/review_recommendation")
async def reviewRecommendation(userID: str, eventID: str, rating: int):
    pass

