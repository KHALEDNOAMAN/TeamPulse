import type { AppData } from '../hooks/useData';
import { formatDate, getCompletionRate } from '../utils/helpers';

interface SprintAnalyticsProps {
  data: AppData;
}

export default function SprintAnalytics({ data }: SprintAnalyticsProps) {
  const { sprints } = data;

  const activeSprint = sprints[sprints.length - 1];
  const avgVelocity = Math.round(
    sprints.reduce((sum, s) => sum + s.velocity, 0) / sprints.length
  );
  const avgCompletionRate = Math.round(
    sprints.reduce((sum, s) => sum + getCompletionRate(s.planned_points, s.completed_points), 0) / sprints.length
  );
  const maxVelocity = Math.max(...sprints.map((s) => s.velocity));

  return (
    <div>
      <div className="page-header">
        <h2>Sprint Analytics</h2>
        <p>Metrics and trends across your sprint cycles</p>
      </div>

      {/* Active Sprint Card */}
      {activeSprint && (
        <div className="sprint-active-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="sprint-active-title">🏃 {activeSprint.name} — Active</div>
              <div className="sprint-dates">
                {formatDate(activeSprint.start_date)} → {formatDate(activeSprint.end_date)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activeSprint.completed_points}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activeSprint.planned_points}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Planned</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
                  {getCompletionRate(activeSprint.planned_points, activeSprint.completed_points)}%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completion</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div className="progress-bar-container progress-bar-lg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${getCompletionRate(activeSprint.planned_points, activeSprint.completed_points)}%`,
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="stat-cards" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
          </div>
          <div className="stat-value">{avgVelocity}</div>
          <div className="stat-label">Average Velocity</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-value">{avgCompletionRate}%</div>
          <div className="stat-label">Avg Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🔥</span>
          </div>
          <div className="stat-value">{maxVelocity}</div>
          <div className="stat-label">Peak Velocity</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🔄</span>
          </div>
          <div className="stat-value">{sprints.length}</div>
          <div className="stat-label">Sprints Tracked</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Velocity Trend */}
        <div className="card">
          <div className="card-title">📈 Velocity Trend</div>
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

        {/* Completion Rate Doughnut */}
        <div className="card">
          <div className="card-title">✅ Sprint Completion Rate</div>
          <div className="doughnut-stat" style={{ padding: '32px 0' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: `conic-gradient(var(--success) ${avgCompletionRate * 3.6}deg, var(--bg-input) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="doughnut-value">{avgCompletionRate}%</span>
              </div>
            </div>
            <span className="doughnut-label">Average across {sprints.length} sprints</span>
          </div>
        </div>

        {/* Sprint Comparison Table */}
        <div className="card full-width">
          <div className="card-title">📊 Sprint Comparison</div>
          <table className="sprint-table">
            <thead>
              <tr>
                <th>Sprint</th>
                <th>Dates</th>
                <th>Planned</th>
                <th>Completed</th>
                <th>Velocity</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {sprints.map((sprint) => {
                const rate = getCompletionRate(sprint.planned_points, sprint.completed_points);
                return (
                  <tr key={sprint.id}>
                    <td style={{ fontWeight: 600 }}>{sprint.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {formatDate(sprint.start_date)} – {formatDate(sprint.end_date)}
                    </td>
                    <td>{sprint.planned_points} pts</td>
                    <td>{sprint.completed_points} pts</td>
                    <td style={{ fontWeight: 700 }}>{sprint.velocity}</td>
                    <td>
                      <span
                        style={{
                          color: rate >= 90 ? 'var(--success)' : rate >= 80 ? 'var(--warning)' : 'var(--danger)',
                          fontWeight: 700,
                        }}
                      >
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
