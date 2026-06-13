from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.bootstrap.routers import register_routers
from src.exception_handler import register_exception_handlers

app = FastAPI(title="WorkGraph API", version="0.1.0", debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app=app)

register_routers(app=app)


@app.get("/")
async def health_check():
    return {"status": "healthy"}
