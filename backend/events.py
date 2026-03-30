from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine
from utils.sql_helper import SQLHelper
from utils.auth_dependency import get_current_user
from dotenv import load_dotenv
from typing import Optional
from datetime import datetime
import os

load_dotenv('.env')

db_username = os.getenv("DB_USER")
db_password = os.getenv("PASSWORD")
db_host = os.getenv("HOST")
db_port = os.getenv("PORT")
db_name = os.getenv("DB_NAME")
database_url = f"postgresql+psycopg2://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}?sslmode=require"

engine = create_engine(database_url, pool_pre_ping=True)

router = APIRouter(prefix="/events", tags=["events"])

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    image_url: Optional[str] = None
    capacity: Optional[int] = None
    close_date: Optional[datetime] = None

@router.post("/create")
async def create(event: EventCreate, current_user: dict = Depends(get_current_user)):
    sql_helper = SQLHelper()
    try:
        query = sql_helper.load_query("sql_queries/create_event.sql")
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Failed to load query"}
        )

    try:
        with engine.connect() as connection:
            result = connection.execute(query, {
                'title': event.title,
                'description': event.description,
                'location_name': event.location_name,
                'location_address': event.location_address,
                'start_time': event.start_time,
                'end_time': event.end_time,
                'image_url': event.image_url,
                'created_by': current_user["user_id"],
                'capacity': event.capacity,
                'close_date': event.close_date,
            })
            row = result.mappings().fetchone()
            connection.commit()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": f"Database error: {str(e)}"}
        )

    return {"message": "Event created successfully", "event_id": str(row['id'])}

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
