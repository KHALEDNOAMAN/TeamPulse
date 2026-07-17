import type { OKR, OKRStatus, MemberStatus, TeamMember } from '../types';
import { teamMembers } from './demoData';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

export function calculateOKRProgress(okr: OKR): number {
  if (okr.key_results.length === 0) return 0;
  const totalProgress = okr.key_results.reduce((sum, kr) => {
    const progress = Math.min((kr.current_value / kr.target_value) * 100, 100);
    return sum + progress;
  }, 0);
  return Math.round(totalProgress / okr.key_results.length);
}

export function calculateKRProgress(currentValue: number, targetValue: number): number {
  if (targetValue === 0) return 0;
  return Math.min(Math.round((currentValue / targetValue) * 100), 100);
}

export function getStatusColor(status: OKRStatus): string {
  switch (status) {
    case 'on_track':
      return '#10b981';
    case 'at_risk':
      return '#f59e0b';
    case 'behind':
      return '#ef4444';
    case 'completed':
      return '#06b6d4';
    default:
      return '#94a3b8';
  }
}

export function getStatusLabel(status: OKRStatus): string {
  switch (status) {
    case 'on_track':
      return 'On Track';
    case 'at_risk':
      return 'At Risk';
    case 'behind':
      return 'Behind';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
}

export function getMemberStatusColor(status: MemberStatus): string {
  switch (status) {
    case 'available':
      return '#10b981';
    case 'busy':
      return '#f59e0b';
    case 'away':
      return '#94a3b8';
    default:
      return '#94a3b8';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((m) => m.id === id);
}

export function getMemberName(id: string): string {
  const member = getMemberById(id);
  return member ? member.name : 'Unknown';
}

export function getCompletionRate(planned: number, completed: number): number {
  if (planned === 0) return 0;
  return Math.round((completed / planned) * 100);
}
