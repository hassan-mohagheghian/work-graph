from fastapi import FastAPI

from src.bootstrap.routers import register_routers
from src.exception_handler import register_exception_handlers

app = FastAPI(title="WorkGraph API", version="0.1.0", debug=True)

register_exception_handlers(app=app)

register_routers(app=app)


@app.get("/")
async def health_check():
    return {"status": "healthy"}
