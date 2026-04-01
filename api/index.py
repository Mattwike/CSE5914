import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
from main import app as fastapi_app


class StripApiPrefix:
    """Strip /api prefix so FastAPI routes match without modification."""
    def __init__(self, app, prefix="/api"):
        self.app = app
        self.prefix = prefix

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope["path"].startswith(self.prefix):
            scope = dict(scope, path=scope["path"][len(self.prefix):] or "/")
        await self.app(scope, receive, send)


app = StripApiPrefix(fastapi_app)
