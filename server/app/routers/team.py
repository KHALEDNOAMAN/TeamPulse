from fastapi import APIRouter, HTTPException
from app.models.schemas import TeamMember, MemberStatus

router = APIRouter(prefix="/api/team", tags=["team"])

members_db: list[TeamMember] = [
    TeamMember(
        id="tm-1",
        name="Khaled Baraya",
        role="Engineering Manager",
        email="khaled@teampulse.dev",
        avatar_color="#8b5cf6",
        skills=["System Design", "Python", "Leadership", "Agile"],
        status=MemberStatus.available,
    ),
    TeamMember(
        id="tm-2",
        name="Sara Mansour",
        role="Senior Frontend Engineer",
        email="sara@teampulse.dev",
        avatar_color="#06b6d4",
        skills=["React", "TypeScript", "CSS", "Figma"],
        status=MemberStatus.available,
    ),
    TeamMember(
        id="tm-3",
        name="Omar Farouk",
        role="Backend Lead",
        email="omar@teampulse.dev",
        avatar_color="#10b981",
        skills=["Python", "FastAPI", "PostgreSQL", "Redis"],
        status=MemberStatus.busy,
    ),
    TeamMember(
        id="tm-4",
        name="Lina Haddad",
        role="UI/UX Designer",
        email="lina@teampulse.dev",
        avatar_color="#f59e0b",
        skills=["Figma", "User Research", "Prototyping", "Design Systems"],
        status=MemberStatus.available,
    ),
    TeamMember(
        id="tm-5",
        name="Ahmed Nasser",
        role="DevOps Engineer",
        email="ahmed@teampulse.dev",
        avatar_color="#ef4444",
        skills=["Docker", "Kubernetes", "Terraform", "CI/CD"],
        status=MemberStatus.busy,
    ),
    TeamMember(
        id="tm-6",
        name="Noor Al-Rashid",
        role="QA Engineer",
        email="noor@teampulse.dev",
        avatar_color="#ec4899",
        skills=["Cypress", "Playwright", "Test Strategy", "API Testing"],
        status=MemberStatus.away,
    ),
]


@router.get("/", response_model=list[TeamMember])
async def get_team_members():
    return members_db


@router.get("/{member_id}", response_model=TeamMember)
async def get_team_member(member_id: str):
    for member in members_db:
        if member.id == member_id:
            return member
    raise HTTPException(status_code=404, detail="Team member not found")
