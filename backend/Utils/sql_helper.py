import os
from sqlalchemy import create_engine, text

class SQLHelper:
    def __init__(self):
        pass

    def load_query(self, file_path: str) -> str:
        with open(file_path, 'r') as file:
            query = file.read()
        return text(query)