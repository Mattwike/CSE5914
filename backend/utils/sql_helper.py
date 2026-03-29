import os
from sqlalchemy import create_engine, text

class SQLHelper:
    def __init__(self):
        self._base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def load_query(self, file_path: str) -> str:
        full_path = os.path.join(self._base_dir, file_path)
        with open(full_path, 'r') as file:
            query = file.read()
        return text(query)
    