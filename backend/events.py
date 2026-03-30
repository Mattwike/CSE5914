from fastapi import APIRouter, BackgroundTasks, Depends
from utils.auth_dependency import get_current_user

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/{user_id}/create")
async def create(user_id: str, current_user: dict = Depends(get_current_user)):
    pass

@router.get("/{event_id}")
async def get_event(event_id: str, current_user: dict = Depends(get_current_user)):
    pass

@router.delete("/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    pass

@router.get("/{user_id}/event")
async def get_user_events(user_id: str, current_user: dict = Depends(get_current_user)):
    pass

@router.post("/{event_id}/modify")
async def change_time(eventID: str, userID: str, new_start_time: str, new_end_time: str, new_location: str, current_user: dict = Depends(get_current_user)):
    pass
