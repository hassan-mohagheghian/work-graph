from fastapi import FastAPI

from src.bootstrap.routers import register_routers

app = FastAPI(
    title="WorkGraph API",
    version="0.1.0",
)

register_routers(app=app)


@app.get("/")
async def health_check():
    return {"status": "healthy"}
