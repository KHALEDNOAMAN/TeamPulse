from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from enum import Enum


class MemberStatus(str, Enum):
    available = "available"
    busy = "busy"
    away = "away"


class OKRStatus(str, Enum):
    on_track = "on_track"
    at_risk = "at_risk"
    behind = "behind"
    completed = "completed"


class RetroCategory(str, Enum):
    went_well = "went_well"
    to_improve = "to_improve"
    action = "action"


class TeamMember(BaseModel):
    id: str
    name: str
    role: str
    email: str
    avatar_color: str
    skills: list[str]
    status: MemberStatus


class KeyResult(BaseModel):
    id: str
    title: str
    current_value: float
    target_value: float
    unit: str
    status: OKRStatus


class OKR(BaseModel):
    id: str
    title: str
    owner_id: str
    quarter: int
    year: int
    status: OKRStatus
    key_results: list[KeyResult]


class Sprint(BaseModel):
    id: str
    name: str
    start_date: date
    end_date: date
    velocity: float
    planned_points: int
    completed_points: int


class ActionItem(BaseModel):
    id: str
    text: str
    assignee_id: str
    due_date: date
    completed: bool


class Meeting(BaseModel):
    id: str
    title: str
    date: datetime
    type: str
    attendee_ids: list[str]
    agenda_items: list[str]
    action_items: list[ActionItem]
    notes: str


class RetroItem(BaseModel):
    id: str
    category: RetroCategory
    text: str
    votes: int
    author_id: str


class Retrospective(BaseModel):
    id: str
    sprint_id: str
    date: date
    items: list[RetroItem]
