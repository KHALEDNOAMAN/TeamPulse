export type MemberStatus = 'available' | 'busy' | 'away';
export type OKRStatus = 'on_track' | 'at_risk' | 'behind' | 'completed';
export type RetroCategory = 'went_well' | 'to_improve' | 'action';
export type MeetingType = 'sprint' | 'one_on_one' | 'team';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar_color: string;
  skills: string[];
  status: MemberStatus;
}

export interface KeyResult {
  id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
  status: OKRStatus;
}

export interface OKR {
  id: string;
  title: string;
  owner_id: string;
  quarter: number;
  year: number;
  status: OKRStatus;
  key_results: KeyResult[];
}

export interface Sprint {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  velocity: number;
  planned_points: number;
  completed_points: number;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee_id: string;
  due_date: string;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  type: MeetingType;
  attendee_ids: string[];
  agenda_items: string[];
  action_items: ActionItem[];
  notes: string;
}

export interface RetroItem {
  id: string;
  category: RetroCategory;
  text: string;
  votes: number;
  author_id: string;
}

export interface Retrospective {
  id: string;
  sprint_id: string;
  date: string;
  items: RetroItem[];
}
