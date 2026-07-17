from fastapi import APIRouter, HTTPException
from app.models.schemas import Retrospective, RetroItem, RetroCategory
from datetime import date

router = APIRouter(prefix="/api/retros", tags=["retros"])

retros_db: list[Retrospective] = [
    Retrospective(
        id="retro-1",
        sprint_id="sp-11",
        date=date(2025, 7, 13),
        items=[
            RetroItem(id="ri-1", category=RetroCategory.went_well, text="CI/CD pipeline improvements reduced average deploy time by 40%", votes=5, author_id="tm-5"),
            RetroItem(id="ri-2", category=RetroCategory.went_well, text="Pair programming sessions significantly improved knowledge sharing across backend and frontend", votes=4, author_id="tm-2"),
            RetroItem(id="ri-3", category=RetroCategory.went_well, text="New automated canary deployments caught a critical regression before it hit production", votes=6, author_id="tm-5"),
            RetroItem(id="ri-4", category=RetroCategory.went_well, text="Sprint velocity improved for the 4th consecutive sprint — team is hitting its stride", votes=3, author_id="tm-1"),
            RetroItem(id="ri-5", category=RetroCategory.to_improve, text="Need more consistent code review coverage — some PRs waited 2+ days for review", votes=4, author_id="tm-3"),
            RetroItem(id="ri-6", category=RetroCategory.to_improve, text="Flaky integration tests in the payments module are eroding confidence in the test suite", votes=5, author_id="tm-6"),
            RetroItem(id="ri-7", category=RetroCategory.to_improve, text="Cross-team dependency on Auth service migration caused 3 days of blocked work", votes=3, author_id="tm-3"),
            RetroItem(id="ri-8", category=RetroCategory.action, text="Implement a PR review rotation schedule to guarantee <24h first review", votes=4, author_id="tm-1"),
            RetroItem(id="ri-9", category=RetroCategory.action, text="Dedicate 2 story points per sprint to fixing flaky tests", votes=3, author_id="tm-6"),
            RetroItem(id="ri-10", category=RetroCategory.action, text="Set up weekly sync with Platform team to unblock cross-team dependencies early", votes=2, author_id="tm-1"),
        ],
    ),
]


@router.get("/", response_model=list[Retrospective])
async def get_retros():
    return retros_db


@router.post("/", response_model=Retrospective)
async def create_retro(retro: Retrospective):
    retros_db.append(retro)
    return retro


@router.put("/{retro_id}/vote")
async def vote_on_item(retro_id: str, item_id: str):
    for retro in retros_db:
        if retro.id == retro_id:
            for item in retro.items:
                if item.id == item_id:
                    item.votes += 1
                    return {"item_id": item.id, "votes": item.votes}
            raise HTTPException(status_code=404, detail="Retro item not found")
    raise HTTPException(status_code=404, detail="Retrospective not found")
