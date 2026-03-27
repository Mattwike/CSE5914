import os
from sqlalchemy import text

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class SQLHelper:
    def __init__(self):
        pass

    def load_query(self, file_path: str) -> str:
        full_path = os.path.join(BACKEND_DIR, file_path)
        with open(full_path, 'r') as file:
            query = file.read()
        return text(query)