import { useState } from 'react';
import type { AppData } from '../hooks/useData';
import type { RetroCategory } from '../types';
import { getMemberName, getMemberById, getInitials } from '../utils/helpers';

interface RetroBoardProps {
  data: AppData;
}

export default function RetroBoard({ data }: RetroBoardProps) {
  const { retrospectives, setRetrospectives, sprints } = data;
  const [selectedRetroId, setSelectedRetroId] = useState(retrospectives[0]?.id ?? '');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<RetroCategory | null>(null);

  const retro = retrospectives.find((r) => r.id === selectedRetroId);

  const wentWell = retro?.items.filter((i) => i.category === 'went_well') ?? [];
  const toImprove = retro?.items.filter((i) => i.category === 'to_improve') ?? [];
  const actions = retro?.items.filter((i) => i.category === 'action') ?? [];

  const totalItems = retro?.items.length ?? 0;
  const mostVoted = retro?.items.reduce(
    (max, item) => (item.votes > max.votes ? item : max),
    retro.items[0]
  );
  const pendingActions = actions.length;

  const handleVote = (itemId: string) => {
    setRetrospectives((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRetroId) return r;
        return {
          ...r,
          items: r.items.map((item) =>
            item.id === itemId ? { ...item, votes: item.votes + 1 } : item
          ),
        };
      })
    );
  };

  const handleAddItem = () => {
    if (!newItemText.trim() || !newItemCategory || !retro) return;
    const newItem = {
      id: `ri-${Date.now()}`,
      category: newItemCategory,
      text: newItemText,
      votes: 0,
      author_id: 'tm-1',
    };
    setRetrospectives((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRetroId) return r;
        return { ...r, items: [...r.items, newItem] };
      })
    );
    setNewItemText('');
    setNewItemCategory(null);
  };

  const sprint = sprints.find((s) => s.id === retro?.sprint_id);

  const columns: { key: RetroCategory; label: string; icon: string; className: string; items: typeof wentWell }[] = [
    { key: 'went_well', label: 'What Went Well', icon: '🟢', className: 'went-well', items: wentWell },
    { key: 'to_improve', label: 'What To Improve', icon: '🟡', className: 'to-improve', items: toImprove },
    { key: 'action', label: 'Action Items', icon: '🔵', className: 'action', items: actions },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Retrospective Board</h2>
        <p>Reflect, learn, and improve as a team</p>
      </div>

      {/* Sprint Selector */}
      <div className="filter-bar">
        <select
          className="sprint-selector"
          value={selectedRetroId}
          onChange={(e) => setSelectedRetroId(e.target.value)}
        >
          {retrospectives.map((r) => {
            const sp = sprints.find((s) => s.id === r.sprint_id);
            return (
              <option key={r.id} value={r.id}>
                {sp ? sp.name : r.sprint_id} — {r.date}
              </option>
            );
          })}
        </select>

        {sprint && (
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {sprint.name} Retrospective
          </span>
        )}
      </div>

      {/* Summary Stats */}
      {retro && (
        <div className="retro-summary">
          <div className="retro-summary-item">
            <span className="retro-stat-val">{totalItems}</span> Total Items
          </div>
          <div className="retro-summary-item">
            <span className="retro-stat-val">👍 {mostVoted?.votes ?? 0}</span> Most Voted
          </div>
          <div className="retro-summary-item">
            <span className="retro-stat-val">{pendingActions}</span> Action Items
          </div>
        </div>
      )}

      {/* Retro Board */}
      {retro ? (
        <div className="retro-board">
          {columns.map((col) => (
            <div key={col.key} className="retro-column">
              <div className={`retro-column-header ${col.className}`}>
                <span>{col.icon}</span>
                <span>{col.label}</span>
                <span className="column-count">{col.items.length}</span>
              </div>

              {col.items.map((item) => {
                const author = getMemberById(item.author_id);
                return (
                  <div key={item.id} className="retro-item-card">
                    <div className="retro-item-text">{item.text}</div>
                    <div className="retro-item-footer">
                      <div className="retro-item-author" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {author && (
                          <div
                            className="avatar"
                            style={{
                              background: author.avatar_color,
                              width: '20px',
                              height: '20px',
                              fontSize: '0.55rem',
                            }}
                          >
                            {getInitials(author.name)}
                          </div>
                        )}
                        {getMemberName(item.author_id).split(' ')[0]}
                      </div>
                      <button
                        className="retro-vote-btn"
                        onClick={() => handleVote(item.id)}
                      >
                        👍 {item.votes}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add New Item */}
              {newItemCategory === col.key ? (
                <div className="retro-item-card" style={{ border: '1px dashed var(--primary)' }}>
                  <textarea
                    className="form-textarea"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder={`Add a ${col.label.toLowerCase()} item...`}
                    autoFocus
                    rows={3}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="btn btn-primary" onClick={handleAddItem} style={{ flex: 1, padding: '8px' }}>
                      Add
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => { setNewItemCategory(null); setNewItemText(''); }}
                      style={{ padding: '8px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', opacity: 0.7 }}
                  onClick={() => setNewItemCategory(col.key)}
                >
                  ＋ Add Item
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <p>No retrospectives available</p>
        </div>
      )}
    </div>
  );
}
