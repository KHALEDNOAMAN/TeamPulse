from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import team, okrs, sprints, meetings, retros

app = FastAPI(
    title="TeamPulse API",
    description="Team performance dashboard API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(team.router)
app.include_router(okrs.router)
app.include_router(sprints.router)
app.include_router(meetings.router)
app.include_router(retros.router)


@app.get("/")
async def root():
    return {
        "name": "TeamPulse API",
        "version": "1.0.0",
        "description": "Team performance dashboard backend",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "teampulse-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
