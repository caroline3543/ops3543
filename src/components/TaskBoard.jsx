// src/components/TaskBoard.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QUADRANTS = [
  { id: 'do-now',   label: 'Ready for this',        sub: 'Feels doable right now',     color: '#e8705a' },
  { id: 'do-soon',  label: 'When I have space',      sub: 'Important, not urgent',       color: '#c09030' },
  { id: 'do-later', label: 'When the time is right', sub: 'Can wait a little longer',    color: '#5a9e6a' },
  { id: 'maybe',    label: 'Holding space for this', sub: 'No pressure, just a thought', color: '#9a8a7a' },
];

function SubtaskSection({ taskId, subtasks = [], onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [newSub, setNewSub] = useState('');

  const toggleSub = (subId) => {
    onUpdate(subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s));
  };

  const addSub = () => {
    if (!newSub.trim()) return;
    onUpdate([...subtasks, { id: Date.now(), text: newSub.trim(), done: false }]);
    setNewSub('');
  };

  const removeSub = (subId) => {
    onUpdate(subtasks.filter(s => s.id !== subId));
  };

  const done = subtasks.filter(s => s.done).length;

  return (
    <div className="subtask-section">
      {subtasks.length > 0 && (
        <>
          <div className="subtask-progress">
            <div className="subtask-progress-label">{done} of {subtasks.length} steps done</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(done / subtasks.length) * 100}%` }} />
            </div>
          </div>
          <div className="subtask-list">
            {subtasks.map(s => (
              <div key={s.id} className={`subtask-item ${s.done ? 'subtask-done' : ''}`}>
                <button className="subtask-check" onClick={() => toggleSub(s.id)}>
                  {s.done ? '✓' : '○'}
                </button>
                <span className="subtask-text">{s.text}</span>
                <button className="subtask-delete" onClick={() => removeSub(s.id)}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}
      {adding ? (
        <div className="subtask-add-row">
          <input
            autoFocus
            className="subtask-input"
            value={newSub}
            onChange={e => setNewSub(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addSub(); if (e.key === 'Escape') setAdding(false); }}
            placeholder="What's one small step?"
          />
          <button className="subtask-add-btn" onClick={addSub}>Add</button>
        </div>
      ) : (
        <button className="breakdown-btn" onClick={() => setAdding(true)}>
          + one small step
        </button>
      )}
    </div>
  );
}

export default function TaskBoard({ externalTasks, onTaskComplete, onAllDone }) {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('all');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [dragId, setDragId] = useState(null);
  const [dragOverQ, setDragOverQ] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [justEarned, setJustEarned] = useState(null);

  useEffect(() => {
    if (externalTasks?.length) {
      setTasks(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newOnes = externalTasks.filter(t => !existingIds.has(t.id));
        return newOnes.length ? [...prev, ...newOnes] : prev;
      });
    }
  }, [externalTasks]);

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks(prev => [{
      id: Date.now(),
      text: newText.trim(),
      quadrant: 'do-now',
      type: 'personal',
      done: false,
      starred: false,
      subtasks: [],
    }, ...prev]);
    setNewText('');
  };

  const toggle = (id) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== id) return t;
        const nowDone = !t.done;
        if (nowDone && onTaskComplete) {
          onTaskComplete(t);
          const coins = t.type === 'event' ? 5 : 3;
          const bonus = t.starred ? 2 : 0;
          setJustEarned(`+${coins + bonus} 🪙`);
          setTimeout(() => setJustEarned(null), 1800);
        }
        return { ...t, done: nowDone };
      });
      const allDone = updated.length > 0 && updated.every(t => t.done);
      if (allDone && onAllDone) {
        setTimeout(() => {
          setJustEarned('+10 🪙 You did it all!');
          setTimeout(() => setJustEarned(null), 2500);
          onAllDone();
        }, 300);
      }
      return updated;
    });
  };

  const star = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  const remove = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const startEdit = (t) => { setEditingId(t.id); setEditText(t.text); };
  const saveEdit = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditingId(null);
  };
  const moveQuadrant = (id, q) => setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant: q } : t));
  const updateSubtasks = (id, subtasks) => setTasks(prev => prev.map(t => t.id === id ? { ...t, subtasks } : t));

  const filtered = tasks
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  const forQ = (qid) => filtered.filter(t => t.quadrant === qid);

  const open = filtered.filter(t => !t.done).length;
  const done = filtered.filter(t => t.done).length;
  const starred = filtered.filter(t => t.starred).length;

  const TaskItem = ({ t, showMove = false }) => {
    const isExpanded = expandedId === t.id;
    const subtasksDone = (t.subtasks || []).filter(s => s.done).length;
    const subtasksTotal = (t.subtasks || []).length;

    return (
      <div className={`task-item ${t.done ? 'task-done' : ''} ${t.starred ? 'task-starred' : ''}`}>
        <button className="task-check" onClick={() => toggle(t.id)}>
          {t.done ? '✓' : '○'}
        </button>
        <div className="task-body">
          {editingId === t.id ? (
            <input autoFocus className="task-edit-input"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={() => saveEdit(t.id)}
              onKeyDown={e => e.key === 'Enter' && saveEdit(t.id)}
            />
          ) : (
            <span className="task-text" onDoubleClick={() => startEdit(t)}>{t.text}</span>
          )}
          {t.eventName && <span className="task-event-tag">{t.eventName}</span>}
          {subtasksTotal > 0 && !isExpanded && (
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
              {subtasksDone}/{subtasksTotal} steps
            </div>
          )}
          {isExpanded && (
            <SubtaskSection
              taskId={t.id}
              subtasks={t.subtasks || []}
              onUpdate={(subs) => updateSubtasks(t.id, subs)}
            />
          )}
          {!isExpanded && (
            <button className="breakdown-btn" onClick={() => setExpandedId(t.id)}>
              {subtasksTotal > 0 ? `↓ ${subtasksTotal} step${subtasksTotal !== 1 ? 's' : ''}` : '↓ break this down'}
            </button>
          )}
          {isExpanded && (
            <button className="breakdown-btn" style={{ marginTop: '6px' }} onClick={() => setExpandedId(null)}>
              ↑ collapse
            </button>
          )}
        </div>
        <div className="task-actions">
          {showMove && (
            <select className="q-select" value={t.quadrant} onChange={e => moveQuadrant(t.id, e.target.value)}>
              {QUADRANTS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
            </select>
          )}
          <button className={`task-btn ${t.starred ? 'starred' : ''}`} onClick={() => star(t.id)}>★</button>
          <button className="task-btn" onClick={() => startEdit(t)}>✎</button>
          <button className="task-btn danger" onClick={() => remove(t.id)}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div className="card task-card">
      {justEarned && <div className="coin-toast">{justEarned}</div>}

      <div className="panel-header">
        <div>
          <div className="section-label">My choices</div>
          <div className="panel-title">What's on</div>
        </div>
        <div className="view-toggle">
          <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
          <button className={`toggle-btn ${view === 'matrix' ? 'active' : ''}`} onClick={() => setView('matrix')}>Matrix</button>
        </div>
      </div>

      <div className="filter-row">
        {['all', 'personal', 'event'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Everything' : f === 'personal' ? 'My choices' : 'Today\'s events'}
          </button>
        ))}
      </div>

      <div className="add-task-row">
        <input
          className="task-input"
          placeholder="What's one thing I'm choosing today?"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <button className="btn-icon" onClick={addTask}>+</button>
      </div>

      {view === 'list' && (
        <div className="task-list">
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <div className="empty-text">Nothing outstanding.</div>
              <div className="empty-sub">Go enjoy your camp. You've earned it.</div>
            </div>
          )}
          {filtered.map(t => <TaskItem key={t.id} t={t} showMove={true} />)}
        </div>
      )}

      {view === 'matrix' && (
        <div className="matrix-grid">
          {QUADRANTS.map(q => (
            <div
              key={q.id}
              className={`matrix-quadrant ${dragOverQ === q.id ? 'drag-over' : ''}`}
              style={{ borderTopColor: q.color }}
              onDragOver={e => { e.preventDefault(); setDragOverQ(q.id); }}
              onDrop={() => { if (dragId) moveQuadrant(dragId, q.id); setDragId(null); setDragOverQ(null); }}
            >
              <div className="q-header">
                <div className="q-label" style={{ color: q.color }}>{q.label}</div>
                <div className="q-sub">{q.sub}</div>
              </div>
              <div className="q-tasks">
                {forQ(q.id).map(t => (
                  <div key={t.id} className={`q-task-item ${t.done ? 'task-done' : ''}`}
                    draggable onDragStart={() => setDragId(t.id)}>
                    <button className="task-check small" onClick={() => toggle(t.id)}>
                      {t.done ? '✓' : '○'}
                    </button>
                    <span className="task-text" style={{ fontSize: '13px' }}>{t.text}</span>
                    <div className="q-task-actions">
                      <button className={`task-btn ${t.starred ? 'starred' : ''}`} onClick={() => star(t.id)}>★</button>
                      <button className="task-btn danger" onClick={() => remove(t.id)}>✕</button>
                    </div>
                  </div>
                ))}
                {forQ(q.id).length === 0 && (
                  <div className="q-empty">Nothing here yet —{'\n'}and that's okay</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="task-stats">
        {done > 0 && <span>✓ {done} done</span>}
        <span>{open} to do</span>
        {starred > 0 && <span>★ {starred} starred</span>}
      </div>
    </div>
  );
}
