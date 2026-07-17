from fastapi import APIRouter, HTTPException
from app.models.schemas import OKR, KeyResult, OKRStatus

router = APIRouter(prefix="/api/okrs", tags=["okrs"])

okrs_db: list[OKR] = [
    OKR(
        id="okr-1",
        title="Improve Platform Reliability",
        owner_id="tm-3",
        quarter=3,
        year=2025,
        status=OKRStatus.on_track,
        key_results=[
            KeyResult(id="kr-1a", title="Reduce P1 incident response time to under 5 minutes", current_value=5.2, target_value=5.0, unit="minutes", status=OKRStatus.on_track),
            KeyResult(id="kr-1b", title="Achieve 99.95% uptime across all production services", current_value=99.91, target_value=99.95, unit="%", status=OKRStatus.on_track),
            KeyResult(id="kr-1c", title="Reduce error rate in critical API endpoints by 60%", current_value=52, target_value=60, unit="%", status=OKRStatus.at_risk),
        ],
    ),
    OKR(
        id="okr-2",
        title="Accelerate Feature Delivery",
        owner_id="tm-1",
        quarter=3,
        year=2025,
        status=OKRStatus.on_track,
        key_results=[
            KeyResult(id="kr-2a", title="Increase sprint velocity from 34 to 48 story points", current_value=42, target_value=48, unit="points", status=OKRStatus.on_track),
            KeyResult(id="kr-2b", title="Reduce average PR review cycle time to under 4 hours", current_value=5.1, target_value=4.0, unit="hours", status=OKRStatus.at_risk),
            KeyResult(id="kr-2c", title="Ship 3 major features to production this quarter", current_value=2, target_value=3, unit="features", status=OKRStatus.on_track),
        ],
    ),
    OKR(
        id="okr-3",
        title="Enhance Developer Experience",
        owner_id="tm-5",
        quarter=3,
        year=2025,
        status=OKRStatus.at_risk,
        key_results=[
            KeyResult(id="kr-3a", title="Reduce CI/CD pipeline duration to under 8 minutes", current_value=10.5, target_value=8.0, unit="minutes", status=OKRStatus.at_risk),
            KeyResult(id="kr-3b", title="Achieve 80% developer satisfaction score in internal survey", current_value=68, target_value=80, unit="%", status=OKRStatus.behind),
            KeyResult(id="kr-3c", title="Onboard 100% of services to new observability platform", current_value=5, target_value=8, unit="services", status=OKRStatus.at_risk),
        ],
    ),
]


@router.get("/", response_model=list[OKR])
async def get_okrs(quarter: int | None = None, year: int | None = None):
    results = okrs_db
    if quarter is not None:
        results = [o for o in results if o.quarter == quarter]
    if year is not None:
        results = [o for o in results if o.year == year]
    return results


@router.post("/", response_model=OKR)
async def create_okr(okr: OKR):
    okrs_db.append(okr)
    return okr


@router.put("/{okr_id}", response_model=OKR)
async def update_okr(okr_id: str, updated: OKR):
    for i, okr in enumerate(okrs_db):
        if okr.id == okr_id:
            okrs_db[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="OKR not found")
