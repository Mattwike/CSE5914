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


def _iso_str(val):
    if val is None:
        return None
    # if it's already a string, return as-is
    if isinstance(val, str):
        return val
    try:
        return val.isoformat()
    except Exception:
        return str(val)

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
    fee: Optional[int] = 0

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
                'fee': event.fee,
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
async def get_event(event_id: str):
    sql_helper = SQLHelper()
    try:
        query = sql_helper.load_query("sql_queries/select_event_by_id.sql")
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load query")

    try:
        with engine.connect() as connection:
            result = connection.execute(query, { 'id': event_id })
            row = result.mappings().fetchone()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")

    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    # Map DB row to frontend shape
    start_time = row.get('start_time')
    date_val = _iso_str(start_time)
    loc_name = row.get('location_name')
    loc_addr = row.get('location_address')
    if loc_name and loc_addr:
        location = f"{loc_name}, {loc_addr}"
    else:
        location = loc_name or loc_addr or None

    return {
        'id': str(row.get('id')),
        'title': row.get('title'),
        'date': date_val,
        'location': location,
        'description': row.get('description'),
        'thumbnail': row.get('image_url'),
    }

@router.delete("/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    pass

@router.get("/{user_id}/event")
async def get_user_events(user_id: str, current_user: dict = Depends(get_current_user)):
    sql_helper = SQLHelper()
    try:
        query = sql_helper.load_query("sql_queries/get_user_events.sql")
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load query")

    try:
        with engine.connect() as connection:
            result = connection.execute(query, {"user_id": current_user["user_id"]})
            rows = result.mappings().fetchall()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")

    items = []
    for r in rows:
        loc_name = r.get('location_name')
        loc_addr = r.get('location_address') if 'location_address' in r.keys() else None
        if loc_name and loc_addr:
            location = f"{loc_name}, {loc_addr}"
        else:
            location = loc_name or loc_addr or None

        items.append({
            'id': str(r.get('id')),
            'title': r.get('title'),
            'date': _iso_str(r.get('start_time')),
            'location': location,
            'description': r.get('description'),
            'thumbnail': r.get('image_url'),
        })

    return items


@router.get("")
@router.get("/")
async def list_events():
    """List combined events from external `event_options` and user `events`.
    Returns a list of mapped objects matching frontend `EventItem` shape.
    """
    sql_helper = SQLHelper()
    try:
        q1 = sql_helper.load_query("sql_queries/select_event_options.sql")
        q2 = sql_helper.load_query("sql_queries/select_events.sql")
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load queries")

    try:
        with engine.connect() as connection:
            r1 = connection.execute(q1).mappings().fetchall()
            r2 = connection.execute(q2).mappings().fetchall()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")

    items = []
    for r in list(r1) + list(r2):
        loc_name = r.get('location_name')
        loc_addr = r.get('location_address')
        if loc_name and loc_addr:
            location = f"{loc_name}, {loc_addr}"
        else:
            location = loc_name or loc_addr or None

        items.append({
            'id': str(r.get('id')),
            'title': r.get('title'),
            'date': _iso_str(r.get('start_time')),
            'location': location,
            'description': r.get('description'),
            'thumbnail': r.get('image_url'),
        })

    return items

@router.post("/{event_id}/modify")
async def change_time(eventID: str, userID: str, new_start_time: str, new_end_time: str, new_location: str, current_user: dict = Depends(get_current_user)):
    pass

@router.get("/{user_id}/eventOptions")
async def get_event_options(user_id: str):
    pass
