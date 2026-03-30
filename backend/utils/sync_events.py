from sqlalchemy import create_engine
from googlePlaces import sync_google_places
from ticketMaster import sync_ticketmaster_events
import os
from dotenv import load_dotenv

load_dotenv()
db_username = os.getenv("DB_USER")
db_password = os.getenv("PASSWORD")
db_host = os.getenv("HOST")
db_port = os.getenv("PORT")
db_name = os.getenv("DB_NAME")
database_url = f"postgresql+psycopg2://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}?sslmode=require"
engine = create_engine(database_url)

sync_google_places(engine, college_key="ohio_state")
sync_ticketmaster_events(engine, college_key="ohio_state")