from fastapi import APIRouter, HTTPException
from app.models.schemas import Sprint
from datetime import date

router = APIRouter(prefix="/api/sprints", tags=["sprints"])

sprints_db: list[Sprint] = [
    Sprint(id="sp-8", name="Sprint 8", start_date=date(2025, 5, 19), end_date=date(2025, 6, 1), velocity=34, planned_points=38, completed_points=34),
    Sprint(id="sp-9", name="Sprint 9", start_date=date(2025, 6, 2), end_date=date(2025, 6, 15), velocity=37, planned_points=40, completed_points=37),
    Sprint(id="sp-10", name="Sprint 10", start_date=date(2025, 6, 16), end_date=date(2025, 6, 29), velocity=42, planned_points=44, completed_points=42),
    Sprint(id="sp-11", name="Sprint 11", start_date=date(2025, 6, 30), end_date=date(2025, 7, 13), velocity=45, planned_points=46, completed_points=45),
]


@router.get("/", response_model=list[Sprint])
async def get_sprints():
    return sprints_db


@router.get("/{sprint_id}", response_model=Sprint)
async def get_sprint(sprint_id: str):
    for sprint in sprints_db:
        if sprint.id == sprint_id:
            return sprint
    raise HTTPException(status_code=404, detail="Sprint not found")
