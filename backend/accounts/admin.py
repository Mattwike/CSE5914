from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/admin", tags=["admin"])

@router.delete("/delete_account")
async def deleteAccount(username: str):
    pass

@router.delete("/delete_event")
async def deleteEvent(eventID: str):
    pass