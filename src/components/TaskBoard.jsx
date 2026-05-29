// src/components/TaskBoard.jsx
import { useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QUADRANTS = [
  { id: 'do-now',  label: 'Do Now',  sub: 'Urgent & Important',     color: '#ef4444' },
  { id: 'do-soon', label: 'Do Soon', sub: 'Important, Not Urgent',   color: '#f59e0b' },
  { id: 'do-later',label: 'Do Later',sub: 'Urgent, Not Important',   color: '#3b82f6' },
  { id: 'maybe',   label: 'Maybe',   sub: 'Neither',                 color: '#6b7280' },
];

export default function TaskBoard({ externalTasks }) {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [view, setView] = useState('list'); // 'list' | 'matrix'
  const [filter, setFilter] = useState('all'); // 'all' | 'personal' | 'event'
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [dragId, setDragId] = useState(null);
  const [dragOverQ, setDragOverQ] = useState(null);
  const allTasks = [...tasks, ...(externalTasks || [])];

  // Merge external tasks into local storage once
  useState(() => {
    if (externalTasks?.length) {
      setTasks(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newOnes = externalTasks.filter(t => !existingIds.has(t.id));
        return newOnes.length ? [...prev, ...newOnes] : prev;
      });
    }
  });

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks(prev => [{
      id: Date.now(),
      text: newText.trim(),
      quadrant: 'do-now',
      type: 'personal',
      done: false,
      starred: false,
    }, ...prev]);
    setNewText('');
  };

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const star = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  const remove = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const startEdit = (t) => { setEditingId(t.id); setEditText(t.text); };
  const saveEdit = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditingId(null);
  };
  const moveQuadrant = (id, q) => setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant: q } : t));

  const filtered = tasks
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  const forQ = (qid) => filtered.filter(t => t.quadrant === qid);

  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, qid) => { e.preventDefault(); setDragOverQ(qid); };
  const onDrop = (qid) => {
    if (dragId) moveQuadrant(dragId, qid);
    setDragId(null);
    setDragOverQ(null);
  };

  const TaskItem = ({ t, showQuadrantMove = false }) => (
    <div className={`task-item ${t.done ? 'task-done' : ''} ${t.starred ? 'task-starred' : ''}`}>
      <button className="task-check" onClick={() => toggle(t.id)}>
        {t.done ? '✓' : '○'}
      </button>
      <div className="task-body">
        {editingId === t.id ? (
          <input
            autoFocus
            className="task-edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={() => saveEdit(t.id)}
            onKeyDown={e => e.key === 'Enter' && saveEdit(t.id)}
          />
        ) : (
          <span className="task-text" onDoubleClick={() => startEdit(t)}>{t.text}</span>
        )}
        {t.eventName && <span className="task-event-tag">{t.eventName}</span>}
      </div>
      <div className="task-actions">
        {showQuadrantMove && (
          <select
            className="q-select"
            value={t.quadrant}
            onChange={e => moveQuadrant(t.id, e.target.value)}
          >
            {QUADRANTS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
          </select>
        )}
        <button className={`task-btn ${t.starred ? 'starred' : ''}`} onClick={() => star(t.id)}>★</button>
        <button className="task-btn edit-btn" onClick={() => startEdit(t)}>✎</button>
        <button className="task-btn delete-btn" onClick={() => remove(t.id)}>✕</button>
      </div>
    </div>
  );

  return (
    <div className="task-board">
      <div className="panel-header">
        <div>
          <div className="section-label">EXECUTION</div>
          <div className="panel-title">Tasks</div>
        </div>
        <div className="view-toggle">
          <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
          <button className={`toggle-btn ${view === 'matrix' ? 'active' : ''}`} onClick={() => setView('matrix')}>Matrix</button>
        </div>
      </div>

      <div className="filter-row">
        {['all', 'personal', 'event'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="add-task-row">
        <input
          className="task-input"
          placeholder="Add a task for today..."
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
              <div className="empty-icon">✓</div>
              <div>Your slate is clear</div>
              <div className="empty-sub">Add tasks above and they'll stay synced across all views.</div>
            </div>
          )}
          {filtered.map(t => <TaskItem key={t.id} t={t} showQuadrantMove={true} />)}
        </div>
      )}

      {view === 'matrix' && (
        <div className="matrix-grid">
          {QUADRANTS.map(q => (
            <div
              key={q.id}
              className={`matrix-quadrant ${dragOverQ === q.id ? 'drag-over' : ''}`}
              style={{ borderTopColor: q.color }}
              onDragOver={e => onDragOver(e, q.id)}
              onDrop={() => onDrop(q.id)}
            >
              <div className="q-header">
                <div className="q-label" style={{ color: q.color }}>{q.label}</div>
                <div className="q-sub">{q.sub}</div>
              </div>
              <div className="q-tasks">
                {forQ(q.id).map(t => (
                  <div
                    key={t.id}
                    className={`q-task-item ${t.done ? 'task-done' : ''}`}
                    draggable
                    onDragStart={() => onDragStart(t.id)}
                  >
                    <button className="task-check small" onClick={() => toggle(t.id)}>
                      {t.done ? '✓' : '○'}
                    </button>
                    <span className="task-text">{t.text}</span>
                    <div className="q-task-actions">
                      <button className={`task-btn ${t.starred ? 'starred' : ''}`} onClick={() => star(t.id)}>★</button>
                      <button className="task-btn delete-btn" onClick={() => remove(t.id)}>✕</button>
                    </div>
                  </div>
                ))}
                {forQ(q.id).length === 0 && (
                  <div className="q-empty">Drop tasks here</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="task-stats">
        <span>{filtered.filter(t => t.done).length} done</span>
        <span>{filtered.filter(t => !t.done).length} open</span>
        <span>{filtered.filter(t => t.starred).length} starred</span>
      </div>
    </div>
  );
}
