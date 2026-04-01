from fastapi import APIRouter, BackgroundTasks, Depends
from utils.auth_dependency import get_current_user
import os

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/categories")
async def get_categories():
    sql_helper = SQLHelper()

    try:
        query = sql_helper.load_query("sql_queries/get_categories.sql")
        with engine.connect() as connection:
            result = connection.execute(query)
            categories = [row["name"] for row in result.mappings().all()]
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"message": "Database Error"}
        )

    return {"categories": categories}

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

@router.get("/{user_id}/eventOptions")
async def get_event_options(user_id: str):
    pass