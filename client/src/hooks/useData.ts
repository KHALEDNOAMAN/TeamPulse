import { useState } from 'react';
import type {
  TeamMember,
  OKR,
  Sprint,
  Meeting,
  Retrospective,
} from '../types';
import {
  teamMembers as initialMembers,
  okrs as initialOkrs,
  sprints as initialSprints,
  meetings as initialMeetings,
  retrospectives as initialRetros,
} from '../utils/demoData';

export interface AppData {
  teamMembers: TeamMember[];
  okrs: OKR[];
  sprints: Sprint[];
  meetings: Meeting[];
  retrospectives: Retrospective[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setOkrs: React.Dispatch<React.SetStateAction<OKR[]>>;
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  setRetrospectives: React.Dispatch<React.SetStateAction<Retrospective[]>>;
}

export function useData(): AppData {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialMembers);
  const [okrs, setOkrs] = useState<OKR[]>(initialOkrs);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>(initialRetros);

  return {
    teamMembers,
    okrs,
    sprints,
    meetings,
    retrospectives,
    setTeamMembers,
    setOkrs,
    setSprints,
    setMeetings,
    setRetrospectives,
  };
}
