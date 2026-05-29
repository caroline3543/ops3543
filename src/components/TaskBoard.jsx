// src/components/TaskBoard.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QUADRANTS = [
  { id: 'do-now',   label: 'Do Now',   sub: 'Urgent & Important',   color: '#e8705a' },
  { id: 'do-soon',  label: 'Do Soon',  sub: 'Important, Not Urgent', color: '#f0a742' },
  { id: 'do-later', label: 'Do Later', sub: 'Urgent, Not Important', color: '#5bc8d4' },
  { id: 'maybe',    label: 'Maybe',    sub: 'Neither',               color: '#6b7280' },
];

export default function TaskBoard({ externalTasks, onTaskComplete, onAllDone }) {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('all');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [dragId, setDragId] = useState(null);
  const [dragOverQ, setDragOverQ] = useState(null);
  const [justEarned, setJustEarned] = useState(null);

  // Merge external tasks once
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
      // Check if all done
      const allDone = updated.every(t => t.done);
      if (allDone && updated.length > 0 && onAllDone) {
        onAllDone();
        setJustEarned('+10 🪙 All done!');
        setTimeout(() => setJustEarned(null), 2000);
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

  const filtered = tasks
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  const forQ = (qid) => filtered.filter(t => t.quadrant === qid);

  const TaskItem = ({ t, showMove = false }) => (
    <div className={`task-item ${t.done ? 'task-done' : ''} ${t.starred ? 'task-starred' : ''}`}>
      <button className="task-check" onClick={() => toggle(t.id)}>
        {t.done ? '✓' : '○'}
      </button>
      <div className="task-body">
        {editingId === t.id ? (
          <input
            autoFocus className="task-edit-input"
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

  const open = filtered.filter(t => !t.done).length;
  const done = filtered.filter(t => t.done).length;
  const starred = filtered.filter(t => t.starred).length;

  return (
    <div className="card task-card">
      {justEarned && (
        <div className="coin-toast">{justEarned}</div>
      )}

      <div className="panel-header">
        <div>
          <div className="section-label">YOUR TASKS</div>
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
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="add-task-row">
        <input
          className="task-input"
          placeholder="What needs doing..."
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
              <div className="empty-text">You're all caught up.</div>
              <div className="empty-sub">Nothing outstanding. That's everything.</div>
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
              onDragOver={e => e.preventDefault()}
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
                    <span className="task-text">{t.text}</span>
                    <div className="q-task-actions">
                      <button className={`task-btn ${t.starred ? 'starred' : ''}`} onClick={() => star(t.id)}>★</button>
                      <button className="task-btn danger" onClick={() => remove(t.id)}>✕</button>
                    </div>
                  </div>
                ))}
                {forQ(q.id).length === 0 && <div className="q-empty">Nothing here</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="task-stats">
        <span>{open} open</span>
        <span>{done} done</span>
        <span>{starred} starred</span>
      </div>
    </div>
  );
}
