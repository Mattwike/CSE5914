from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/{user_id}/create")
async def create(user_id: str):
    pass

@router.get("/{event_id}")
async def get_event(event_id: str):
    pass

@router.delete("/{event_id}")
async def delete_event(event_id: str):
    pass

@router.get("/{user_id}/event")

@router.post("/{event_id}/modify")
async def change_time(eventID: str, userID: str, new_start_time: str, new_end_time: str, new_location: str):
    pass
