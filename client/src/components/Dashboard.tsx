import type { AppData } from '../hooks/useData';
import {
  calculateOKRProgress,
  getInitials,
  formatDateTime,
  getStatusColor,
} from '../utils/helpers';

interface DashboardProps {
  data: AppData;
}

export default function Dashboard({ data }: DashboardProps) {
  const { teamMembers, okrs, sprints, meetings } = data;

  const latestSprint = sprints[sprints.length - 1];
  const avgOkrProgress = Math.round(
    okrs.reduce((sum, okr) => sum + calculateOKRProgress(okr), 0) / okrs.length
  );
  const openActionItems = meetings.reduce(
    (count, m) => count + m.action_items.filter((ai) => !ai.completed).length,
    0
  );
  const prevVelocity = sprints.length >= 2 ? sprints[sprints.length - 2].velocity : latestSprint.velocity;
  const velocityChange = latestSprint
    ? Math.round(((latestSprint.velocity - prevVelocity) / prevVelocity) * 100)
    : 0;

  const maxVelocity = Math.max(...sprints.map((s) => s.velocity));

  // Simulated task counts for workload visualization
  const workloadData = [
    { memberId: 'tm-1', tasks: 5 },
    { memberId: 'tm-2', tasks: 7 },
    { memberId: 'tm-3', tasks: 8 },
    { memberId: 'tm-4', tasks: 4 },
    { memberId: 'tm-5', tasks: 6 },
    { memberId: 'tm-6', tasks: 5 },
  ];
  const maxTasks = Math.max(...workloadData.map((w) => w.tasks));

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your team's performance and progress</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <span className="stat-trend up">↑ Active</span>
          </div>
          <div className="stat-value">{teamMembers.length}</div>
          <div className="stat-label">Team Members</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🏃</span>
            <span className={`stat-trend ${velocityChange >= 0 ? 'up' : 'down'}`}>
              {velocityChange >= 0 ? '↑' : '↓'} {Math.abs(velocityChange)}%
            </span>
          </div>
          <div className="stat-value">{latestSprint?.velocity ?? '—'}</div>
          <div className="stat-label">Sprint Velocity</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🎯</span>
            <span className={`stat-trend ${avgOkrProgress >= 60 ? 'up' : 'down'}`}>
              {avgOkrProgress >= 60 ? '↑' : '↓'} {avgOkrProgress}%
            </span>
          </div>
          <div className="stat-value">{avgOkrProgress}%</div>
          <div className="stat-label">OKR Progress</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📌</span>
            <span className={`stat-trend ${openActionItems <= 3 ? 'up' : 'down'}`}>
              {openActionItems <= 3 ? '✓ Low' : '⚠ Pending'}
            </span>
          </div>
          <div className="stat-value">{openActionItems}</div>
          <div className="stat-label">Open Action Items</div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Velocity Chart */}
        <div className="card">
          <div className="card-title">🏃 Sprint Velocity Trend</div>
          <div className="velocity-bars">
            {sprints.map((sprint) => {
              const heightPct = (sprint.velocity / maxVelocity) * 100;
              return (
                <div key={sprint.id} className="velocity-bar-wrapper">
                  <div className="velocity-bar-value">{sprint.velocity}</div>
                  <div className="velocity-bar-group" style={{ height: '100%' }}>
                    <div
                      className="velocity-bar"
                      style={{
                        height: `${heightPct}%`,
                        background: `linear-gradient(180deg, var(--primary), var(--secondary))`,
                      }}
                    />
                  </div>
                  <div className="velocity-bar-label">{sprint.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OKR Progress */}
        <div className="card">
          <div className="card-title">🎯 OKR Progress</div>
          <div className="okr-progress-list">
            {okrs.map((okr) => {
              const progress = calculateOKRProgress(okr);
              return (
                <div key={okr.id} className="okr-progress-item">
                  <div className="okr-label">
                    <span className="okr-label-title">{okr.title}</span>
                    <span className="okr-label-pct" style={{ color: getStatusColor(okr.status) }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progress}%`,
                        background: getStatusColor(okr.status),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="card">
          <div className="card-title">📋 Recent Meetings</div>
          <div className="recent-list">
            {meetings.slice(0, 3).map((meeting) => (
              <div key={meeting.id} className="recent-item">
                <span className="recent-item-icon">
                  {meeting.type === 'one_on_one' ? '👤' : '🗓️'}
                </span>
                <div className="recent-item-info">
                  <div className="recent-item-title">{meeting.title}</div>
                  <div className="recent-item-subtitle">
                    {formatDateTime(meeting.date)} · {meeting.attendee_ids.length} attendees
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Workload */}
        <div className="card">
          <div className="card-title">⚙️ Team Workload</div>
          <div className="workload-list">
            {workloadData.map((w) => {
              const member = teamMembers.find((m) => m.id === w.memberId);
              if (!member) return null;
              const widthPct = (w.tasks / maxTasks) * 100;
              return (
                <div key={w.memberId} className="workload-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
                    <div
                      className="avatar avatar-sm"
                      style={{ background: member.avatar_color }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <span className="workload-name">{member.name.split(' ')[0]}</span>
                  </div>
                  <div className="workload-bar-bg">
                    <div
                      className="workload-bar-fill"
                      style={{
                        width: `${widthPct}%`,
                        background: member.avatar_color,
                      }}
                    />
                  </div>
                  <span className="workload-count">{w.tasks}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
