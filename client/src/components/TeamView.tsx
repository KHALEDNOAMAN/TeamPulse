import type { AppData } from '../hooks/useData';
import { getInitials, getMemberStatusColor } from '../utils/helpers';

interface TeamViewProps {
  data: AppData;
}

export default function TeamView({ data }: TeamViewProps) {
  const { teamMembers } = data;

  const availableCount = teamMembers.filter((m) => m.status === 'available').length;
  const busyCount = teamMembers.filter((m) => m.status === 'busy').length;
  const awayCount = teamMembers.filter((m) => m.status === 'away').length;

  // Simulated task loads
  const taskLoads: Record<string, number> = {
    'tm-1': 5,
    'tm-2': 7,
    'tm-3': 8,
    'tm-4': 4,
    'tm-5': 6,
    'tm-6': 5,
  };
  const maxLoad = Math.max(...Object.values(taskLoads));

  return (
    <div>
      <div className="page-header">
        <h2>Team</h2>
        <p>Your team members and their current status</p>
      </div>

      {/* Summary */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{teamMembers.length}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🟢</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{availableCount}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🟡</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{busyCount}</div>
          <div className="stat-label">Busy</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">⚪</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{awayCount}</div>
          <div className="stat-label">Away</div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="team-grid">
        {teamMembers.map((member) => {
          const load = taskLoads[member.id] ?? 0;
          const loadPct = (load / maxLoad) * 100;

          return (
            <div key={member.id} className="team-card">
              <div className="team-avatar" style={{ background: member.avatar_color }}>
                {getInitials(member.name)}
                <div
                  className="avatar-status"
                  style={{ background: getMemberStatusColor(member.status) }}
                />
              </div>
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
              <div className="team-email">{member.email}</div>

              <div className="member-status-indicator">
                <span
                  className="status-dot"
                  style={{ background: getMemberStatusColor(member.status) }}
                />
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </div>

              {/* Task Load Bar */}
              <div style={{ margin: '8px 0 12px', padding: '0 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>Task Load</span>
                  <span>{load} tasks</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${loadPct}%`,
                      background: loadPct > 80 ? 'var(--danger)' : loadPct > 60 ? 'var(--warning)' : 'var(--success)',
                    }}
                  />
                </div>
              </div>

              <div className="skill-tags">
                {member.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
