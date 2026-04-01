from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine
from utils.sql_helper import SQLHelper
from dotenv import load_dotenv
from pydantic import BaseModel
import os

load_dotenv('.env')

database_url = (
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('PASSWORD')}"
    f"@{os.getenv('HOST')}:{os.getenv('PORT')}/{os.getenv('DB_NAME')}?sslmode=require"
)
engine = create_engine(database_url, pool_pre_ping=True)

router = APIRouter(prefix="/preferences", tags=["preferences"])

class CategoryPreferenceUpdate(BaseModel):
    user_id: str
    category_ids: list[str | int]

@router.get("/categories")
async def get_category_preferences(user_id: str):
    sql_helper = SQLHelper()

    try:
        query = sql_helper.load_query("sql_queries/get_user_preference_categories.sql")
        with engine.connect() as connection:
            result = connection.execute(query, {
                'user_id': user_id,
            })
            category_ids = [row["category_id"] for row in result.mappings().all()]
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"message": "Database Error"}
        )

    return {"category_ids": category_ids}

@router.put("/categories")
async def update_category_preferences(payload: CategoryPreferenceUpdate):
    sql_helper = SQLHelper()

    try:
        delete_query = sql_helper.load_query("sql_queries/delete_user_preference_categories.sql")
        insert_query = sql_helper.load_query("sql_queries/insert_user_preference_category.sql")

        with engine.connect() as connection:
            connection.execute(delete_query, {
                'user_id': payload.user_id,
            })

            for category_id in payload.category_ids:
                connection.execute(insert_query, {
                    'user_id': payload.user_id,
                    'category_id': category_id,
                })

            connection.commit()
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"message": "Database Error"}
        )

    return {"message": "Category preferences saved."}
