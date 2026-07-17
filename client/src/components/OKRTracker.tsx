import { useState } from 'react';
import type { AppData } from '../hooks/useData';
import {
  calculateOKRProgress,
  calculateKRProgress,
  getStatusColor,
  getStatusLabel,
  getInitials,
  getMemberById,
} from '../utils/helpers';

interface OKRTrackerProps {
  data: AppData;
}

export default function OKRTracker({ data }: OKRTrackerProps) {
  const { okrs } = data;
  const [selectedQuarter, setSelectedQuarter] = useState(3);
  const [expandedOKRs, setExpandedOKRs] = useState<Set<string>>(new Set(['okr-1']));

  const quarters = [1, 2, 3, 4];
  const filteredOKRs = okrs.filter((o) => o.quarter === selectedQuarter);

  const onTrackCount = filteredOKRs.filter((o) => o.status === 'on_track' || o.status === 'completed').length;
  const atRiskCount = filteredOKRs.filter((o) => o.status === 'at_risk').length;
  const behindCount = filteredOKRs.filter((o) => o.status === 'behind').length;

  const toggleExpand = (id: string) => {
    setExpandedOKRs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="page-header">
        <h2>OKR Tracker</h2>
        <p>Track objectives and key results for the quarter</p>
      </div>

      {/* Quarter Tabs */}
      <div className="tab-nav">
        {quarters.map((q) => (
          <button
            key={q}
            className={`tab-btn ${selectedQuarter === q ? 'active' : ''}`}
            onClick={() => setSelectedQuarter(q)}
          >
            Q{q} 2025
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="okr-summary-stats">
        <div className="okr-summary-stat">
          <span className="count">{filteredOKRs.length}</span> Total OKRs
        </div>
        <div className="okr-summary-stat">
          <span className="count" style={{ color: 'var(--success)' }}>{onTrackCount}</span> On Track
        </div>
        <div className="okr-summary-stat">
          <span className="count" style={{ color: 'var(--warning)' }}>{atRiskCount}</span> At Risk
        </div>
        {behindCount > 0 && (
          <div className="okr-summary-stat">
            <span className="count" style={{ color: 'var(--danger)' }}>{behindCount}</span> Behind
          </div>
        )}
      </div>

      {/* OKR Cards */}
      {filteredOKRs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>No OKRs set for Q{selectedQuarter} 2025</p>
        </div>
      ) : (
        filteredOKRs.map((okr) => {
          const progress = calculateOKRProgress(okr);
          const owner = getMemberById(okr.owner_id);
          const isExpanded = expandedOKRs.has(okr.id);

          return (
            <div key={okr.id} className="okr-card">
              <div className="okr-card-header">
                <div className="okr-title-group">
                  {owner && (
                    <div
                      className="avatar avatar-sm"
                      style={{ background: owner.avatar_color }}
                    >
                      {getInitials(owner.name)}
                    </div>
                  )}
                  <div>
                    <div className="okr-title">{okr.title}</div>
                    <div className="okr-owner">
                      Owner: {owner?.name ?? 'Unknown'}
                    </div>
                  </div>
                </div>
                <span className={`status-badge ${okr.status}`}>
                  {getStatusLabel(okr.status)}
                </span>
              </div>

              <div className="okr-progress-row">
                <div className="progress-bar-container progress-bar-lg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${getStatusColor(okr.status)}, ${getStatusColor(okr.status)}dd)`,
                    }}
                  />
                </div>
                <span className="progress-pct" style={{ color: getStatusColor(okr.status) }}>
                  {progress}%
                </span>
              </div>

              <button className="kr-expand-btn" onClick={() => toggleExpand(okr.id)}>
                {isExpanded ? '▲ Hide' : '▼ Show'} Key Results ({okr.key_results.length})
              </button>

              {isExpanded && (
                <div className="kr-list">
                  {okr.key_results.map((kr) => {
                    const krProgress = calculateKRProgress(kr.current_value, kr.target_value);
                    return (
                      <div key={kr.id} className="kr-item">
                        <div className="kr-item-header">
                          <span className="kr-item-title">{kr.title}</span>
                          <span className="kr-item-value">
                            {kr.current_value} / {kr.target_value} {kr.unit}
                          </span>
                        </div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${krProgress}%`,
                              background: getStatusColor(kr.status),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
