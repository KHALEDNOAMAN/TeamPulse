import { useState } from 'react';
import type { AppData } from '../hooks/useData';
import {
  formatDateTime,
  formatDate,
  getInitials,
  getMemberById,
} from '../utils/helpers';

interface MeetingNotesProps {
  data: AppData;
}

type FilterType = 'all' | 'sprint' | 'one_on_one' | 'team';

export default function MeetingNotes({ data }: MeetingNotesProps) {
  const { meetings, setMeetings } = data;
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['mtg-1']));
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'sprint' | 'one_on_one' | 'team'>('team');

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: '1-on-1', value: 'one_on_one' },
    { label: 'Team', value: 'team' },
    { label: 'Sprint Review', value: 'sprint' },
  ];

  const filteredMeetings =
    filter === 'all' ? meetings : meetings.filter((m) => m.type === filter);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleActionItem = (meetingId: string, actionItemId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          action_items: m.action_items.map((ai) =>
            ai.id === actionItemId ? { ...ai, completed: !ai.completed } : ai
          ),
        };
      })
    );
  };

  const handleAddMeeting = () => {
    if (!newTitle.trim()) return;
    const newMeeting = {
      id: `mtg-${Date.now()}`,
      title: newTitle,
      date: new Date().toISOString(),
      type: newType,
      attendee_ids: ['tm-1'],
      agenda_items: [],
      action_items: [],
      notes: '',
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setNewTitle('');
    setShowNewForm(false);
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'one_on_one': return '1-on-1';
      case 'sprint': return 'Sprint';
      case 'team': return 'Team';
      default: return type;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Meetings</h2>
        <p>Meeting notes, agendas, and action items</p>
      </div>

      {/* Filter & New Button */}
      <div className="filter-bar">
        <div className="tab-nav">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`tab-btn ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewForm(true)}>
          ＋ New Meeting
        </button>
      </div>

      {/* New Meeting Form Modal */}
      {showNewForm && (
        <div className="modal-overlay" onClick={() => setShowNewForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Meeting</h3>
              <button className="modal-close" onClick={() => setShowNewForm(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Meeting Title</label>
              <input
                className="form-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Sprint 12 Planning"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="sprint-selector"
                style={{ width: '100%' }}
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'sprint' | 'one_on_one' | 'team')}
              >
                <option value="sprint">Sprint Review</option>
                <option value="one_on_one">1-on-1</option>
                <option value="team">Team</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleAddMeeting} style={{ width: '100%' }}>
              Create Meeting
            </button>
          </div>
        </div>
      )}

      {/* Meeting List */}
      <div className="meeting-list">
        {filteredMeetings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No meetings found for this filter</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const isExpanded = expandedIds.has(meeting.id);

            return (
              <div key={meeting.id} className="meeting-card">
                <div
                  className="meeting-card-header"
                  onClick={() => toggleExpand(meeting.id)}
                >
                  <div className="meeting-info">
                    <div className="meeting-title">{meeting.title}</div>
                    <div className="meeting-date">{formatDateTime(meeting.date)}</div>
                  </div>
                  <div className="meeting-meta">
                    {/* Attendee Avatars */}
                    <div className="avatar-group">
                      {meeting.attendee_ids.slice(0, 4).map((aid) => {
                        const member = getMemberById(aid);
                        if (!member) return null;
                        return (
                          <div
                            key={aid}
                            className="avatar avatar-sm"
                            style={{ background: member.avatar_color }}
                            title={member.name}
                          >
                            {getInitials(member.name)}
                          </div>
                        );
                      })}
                      {meeting.attendee_ids.length > 4 && (
                        <div
                          className="avatar avatar-sm"
                          style={{ background: 'var(--text-dim)' }}
                        >
                          +{meeting.attendee_ids.length - 4}
                        </div>
                      )}
                    </div>
                    <span className={`meeting-type-badge ${meeting.type}`}>
                      {typeLabel(meeting.type)}
                    </span>
                    <span className={`meeting-expand-icon ${isExpanded ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="meeting-card-body">
                    {/* Agenda */}
                    {meeting.agenda_items.length > 0 && (
                      <div>
                        <div className="meeting-section-title">Agenda</div>
                        <ol className="agenda-list">
                          {meeting.agenda_items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Notes */}
                    {meeting.notes && (
                      <div>
                        <div className="meeting-section-title">Notes</div>
                        <div className="meeting-notes">{meeting.notes}</div>
                      </div>
                    )}

                    {/* Action Items */}
                    {meeting.action_items.length > 0 && (
                      <div>
                        <div className="meeting-section-title">
                          Action Items ({meeting.action_items.filter((ai) => ai.completed).length}/{meeting.action_items.length} done)
                        </div>
                        <div className="action-items-list">
                          {meeting.action_items.map((ai) => {
                            const assignee = getMemberById(ai.assignee_id);
                            return (
                              <div key={ai.id} className="action-item">
                                <button
                                  className={`action-item-checkbox ${ai.completed ? 'checked' : ''}`}
                                  onClick={() => toggleActionItem(meeting.id, ai.id)}
                                >
                                  {ai.completed ? '✓' : ''}
                                </button>
                                <span className={`action-item-text ${ai.completed ? 'completed' : ''}`}>
                                  {ai.text}
                                </span>
                                <div className="action-item-meta">
                                  {assignee && (
                                    <div
                                      className="avatar avatar-sm"
                                      style={{ background: assignee.avatar_color, width: '24px', height: '24px', fontSize: '0.6rem' }}
                                      title={assignee.name}
                                    >
                                      {getInitials(assignee.name)}
                                    </div>
                                  )}
                                  <span>{formatDate(ai.due_date)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
