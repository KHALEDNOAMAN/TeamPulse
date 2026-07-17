from fastapi import APIRouter
from app.models.schemas import Meeting, ActionItem
from datetime import datetime, date

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

meetings_db: list[Meeting] = [
    Meeting(
        id="mtg-1",
        title="Sprint 11 Planning",
        date=datetime(2025, 6, 30, 10, 0),
        type="sprint",
        attendee_ids=["tm-1", "tm-2", "tm-3", "tm-4", "tm-5", "tm-6"],
        agenda_items=[
            "Review Sprint 10 outcomes and carryover items",
            "Estimate and commit to Sprint 11 backlog",
            "Assign ownership for high-priority stories",
            "Discuss cross-team dependency on Auth service migration",
        ],
        action_items=[
            ActionItem(id="ai-1", text="Break down Auth migration epic into sub-tasks", assignee_id="tm-3", due_date=date(2025, 7, 2), completed=True),
            ActionItem(id="ai-2", text="Update capacity plan with Noor's PTO", assignee_id="tm-1", due_date=date(2025, 7, 1), completed=True),
            ActionItem(id="ai-3", text="Draft technical spec for real-time notifications", assignee_id="tm-2", due_date=date(2025, 7, 4), completed=False),
        ],
        notes="Team agreed to limit WIP to 3 items per developer. Auth migration is critical path — Omar to coordinate with Platform team. Velocity target: 46 points.",
    ),
    Meeting(
        id="mtg-2",
        title="1-on-1: Khaled & Sara",
        date=datetime(2025, 7, 7, 14, 0),
        type="one_on_one",
        attendee_ids=["tm-1", "tm-2"],
        agenda_items=[
            "Career growth discussion — path to Staff Engineer",
            "Review frontend architecture RFC feedback",
            "Discuss conference talk proposal for ReactConf",
        ],
        action_items=[
            ActionItem(id="ai-4", text="Submit Staff Engineer promotion packet draft", assignee_id="tm-2", due_date=date(2025, 7, 14), completed=False),
            ActionItem(id="ai-5", text="Connect Sara with Staff engineers in Platform for mentorship", assignee_id="tm-1", due_date=date(2025, 7, 11), completed=False),
        ],
        notes="Sara is ready for increased scope. Discussed leading the Design System migration as a Staff-level project. ReactConf abstract deadline is July 20.",
    ),
    Meeting(
        id="mtg-3",
        title="Sprint 10 Review & Demo",
        date=datetime(2025, 6, 29, 15, 0),
        type="sprint",
        attendee_ids=["tm-1", "tm-2", "tm-3", "tm-5", "tm-6"],
        agenda_items=[
            "Demo: Real-time dashboard data streaming (Sara)",
            "Demo: Automated canary deployment pipeline (Ahmed)",
            "Review sprint metrics — 42/44 points completed",
            "Stakeholder feedback collection",
        ],
        action_items=[
            ActionItem(id="ai-6", text="File bug for dashboard WebSocket reconnection edge case", assignee_id="tm-6", due_date=date(2025, 7, 1), completed=True),
            ActionItem(id="ai-7", text="Schedule canary pipeline walkthrough for Platform team", assignee_id="tm-5", due_date=date(2025, 7, 3), completed=True),
        ],
        notes="Stakeholders impressed with dashboard streaming performance. Canary deployment pipeline approved for production rollout. Two minor bugs identified during demo — both non-blocking.",
    ),
]


@router.get("/", response_model=list[Meeting])
async def get_meetings(meeting_type: str | None = None):
    if meeting_type:
        return [m for m in meetings_db if m.type == meeting_type]
    return meetings_db


@router.post("/", response_model=Meeting)
async def create_meeting(meeting: Meeting):
    meetings_db.append(meeting)
    return meeting
