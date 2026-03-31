from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine
from utils.sql_helper import SQLHelper
from dotenv import load_dotenv
import os

load_dotenv('.env')

database_url = (
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('PASSWORD')}"
    f"@{os.getenv('HOST')}:{os.getenv('PORT')}/{os.getenv('DB_NAME')}?sslmode=require"
)
engine = create_engine(database_url, pool_pre_ping=True)

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
async def create(user_id: str):
    pass

@router.get("/{event_id}")
async def get_event(event_id: str):
    pass

@router.delete("/{event_id}")
async def delete_event(event_id: str):
    pass

@router.get("/{user_id}/event")
async def get_user_events(user_id: str):
    pass

@router.post("/{event_id}/modify")
async def change_time(eventID: str, userID: str, new_start_time: str, new_end_time: str, new_location: str):
    pass
