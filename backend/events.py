from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/change_time")
async def change_time(eventID: str, userID: str, new_start_time: str, new_end_time: str):
    pass


@router.post("/change_location")
async def change_location(eventID: str, userID: str, new_location: str, new_lat: float, new_long: float):
    pass
