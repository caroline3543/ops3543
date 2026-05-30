// src/components/TaskBoard.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QUADRANTS = [
  { id: 'do-now',   label: 'Ready for this',        sub: 'Urgent & important',        color: '#e8705a' },
  { id: 'do-soon',  label: 'When I have space',      sub: 'Important, not urgent',     color: '#c09030' },
  { id: 'do-later', label: 'When the time is right', sub: 'Urgent, not important',     color: '#5a9a6a' },
  { id: 'maybe',    label: 'Holding space for this', sub: 'No pressure, just a thought',color: '#9a8a7a' },
];

// ── Swipeable task item
function SwipeableTask({ t, onToggle, onStar, onDelete, onEdit, onBreakdown, onMoveQuadrant, isExpanded, onToggleExpand, subtasks, onSubtaskUpdate }) {
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const threshold = 72;
  const isLocked = useRef(false);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isLocked.current = false;
    setSwiping(false);
  };

  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - startX.current;
    const dy = Math.abs(e.touches[0].clientY - startY.current);
    if (!isLocked.current) {
      if (dy > 10) { isLocked.current = true; return; }
      if (Math.abs(dx) > 8) { isLocked.current = false; setSwiping(true); }
    }
    if (swiping || Math.abs(dx) > 8) {
      e.preventDefault();
      setSwiping(true);
      setSwipeX(Math.max(-threshold * 1.2, Math.min(threshold * 1.2, dx)));
    }
  };

  const onTouchEnd = () => {
    if (!swiping) { setSwipeX(0); return; }
    if (swipeX < -threshold) { onDelete(t.id); }
    else if (swipeX > threshold) { onStar(t.id); }
    setSwipeX(0);
    setSwiping(false);
  };

  const revealed = Math.abs(swipeX);
  const deleteOpacity = swipeX < -20 ? Math.min(1, (-swipeX - 20) / 50) : 0;
  const starOpacity   = swipeX > 20  ? Math.min(1, (swipeX - 20) / 50) : 0;

  const subtasksDone  = (subtasks || []).filter(s => s.done).length;
  const subtasksTotal = (subtasks || []).length;

  const [addingSub, setAddingSub] = useState(false);
  const [newSub, setNewSub] = useState('');

  const addSub = () => {
    if (!newSub.trim()) return;
    onSubtaskUpdate(t.id, [...(subtasks||[]), { id: Date.now(), text: newSub.trim(), done: false }]);
    setNewSub('');
  };

  return (
    <div className="swipe-task-wrap">
      {/* Swipe hints */}
      <div className="swipe-hint swipe-hint-left" style={{ opacity: deleteOpacity }}>
        <span>🗑</span>
      </div>
      <div className="swipe-hint swipe-hint-right" style={{ opacity: starOpacity }}>
        <span>{t.starred ? '☆' : '★'}</span>
      </div>

      <div
        className={`task-item ${t.done ? 'task-done' : ''} ${t.starred ? 'task-starred' : ''}`}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button className="task-check" onClick={() => onToggle(t.id)}>
          {t.done ? '✓' : '○'}
        </button>

        <div className="task-body" onClick={() => onToggleExpand(t.id)}>
          <div className="task-text">{t.text}</div>
          {t.eventName && <span className="task-event-tag">{t.eventName}</span>}
          {subtasksTotal > 0 && !isExpanded && (
            <div className="subtask-mini-progress">
              <div className="subtask-mini-bar">
                <div className="subtask-mini-fill" style={{ width: `${(subtasksDone/subtasksTotal)*100}%` }} />
              </div>
              <span className="subtask-mini-label">{subtasksDone}/{subtasksTotal}</span>
            </div>
          )}
        </div>

        <div className="task-actions">
          <select className="q-select" value={t.quadrant}
            onChange={e => onMoveQuadrant(t.id, e.target.value)}
            onClick={e => e.stopPropagation()}>
            {QUADRANTS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
          </select>
          <button className={`task-btn ${t.starred ? 'starred' : ''}`} onClick={() => onStar(t.id)}>★</button>
          <button className="task-btn" onClick={() => onEdit(t)}>✎</button>
          <button className="task-btn danger" onClick={() => onDelete(t.id)}>✕</button>
        </div>
      </div>

      {/* Expanded subtasks */}
      {isExpanded && (
        <div className="subtask-section">
          {subtasksTotal > 0 && (
            <>
              <div className="subtask-progress">
                <div className="subtask-progress-label">{subtasksDone} of {subtasksTotal} steps</div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(subtasksDone/subtasksTotal)*100}%` }}/></div>
              </div>
              <div className="subtask-list">
                {(subtasks||[]).map(s => (
                  <div key={s.id} className={`subtask-item ${s.done ? 'subtask-done':''}`}>
                    <button className="subtask-check" onClick={() => {
                      onSubtaskUpdate(t.id, subtasks.map(x => x.id===s.id ? {...x,done:!x.done}:x));
                    }}>{s.done?'✓':'○'}</button>
                    <span className="subtask-text">{s.text}</span>
                    <button className="subtask-delete" onClick={() => {
                      onSubtaskUpdate(t.id, subtasks.filter(x=>x.id!==s.id));
                    }}>✕</button>
                  </div>
                ))}
              </div>
            </>
          )}
          {addingSub ? (
            <div className="subtask-add-row">
              <input autoFocus className="subtask-input" value={newSub}
                onChange={e=>setNewSub(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter')addSub();if(e.key==='Escape')setAddingSub(false);}}
                placeholder="What's one small step?" />
              <button className="subtask-add-btn" onClick={addSub}>Add</button>
            </div>
          ) : (
            <button className="breakdown-btn" onClick={()=>setAddingSub(true)}>+ one small step</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Swipeable Eisenhower matrix — one quadrant at a time
function MatrixView({ tasks, onToggle, onStar, onDelete, onMove }) {
  const [qIndex, setQIndex] = useState(0);
  const [dragId, setDragId] = useState(null);
  const startX = useRef(0);
  const [swipeDir, setSwipeDir] = useState(0);

  const q = QUADRANTS[qIndex];
  const qTasks = tasks.filter(t => t.quadrant === q.id);

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -50 && qIndex < 3) setQIndex(i => i + 1);
    if (dx > 50  && qIndex > 0) setQIndex(i => i - 1);
  };

  return (
    <div className="matrix-swipe">
      {/* Quadrant nav dots */}
      <div className="matrix-nav">
        {QUADRANTS.map((q, i) => (
          <button key={q.id} className={`matrix-nav-dot ${i === qIndex ? 'active' : ''}`}
            style={{ '--dot-color': q.color }}
            onClick={() => setQIndex(i)} />
        ))}
      </div>

      {/* Quadrant card */}
      <div
        className="matrix-quadrant-full"
        style={{ borderTopColor: q.color }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDragOver={e => e.preventDefault()}
        onDrop={() => { if (dragId) onMove(dragId, q.id); setDragId(null); }}
      >
        <div className="q-header">
          <div className="q-label" style={{ color: q.color }}>{q.label}</div>
          <div className="q-sub">{q.sub}</div>
        </div>

        <div className="q-tasks-full">
          {qTasks.length === 0 && (
            <div className="q-empty">Nothing here yet —<br/>and that's okay</div>
          )}
          {qTasks.map(t => (
            <div key={t.id}
              className={`q-task-item-full ${t.done ? 'task-done' : ''}`}
              draggable onDragStart={() => setDragId(t.id)}>
              <button className="task-check small" onClick={() => onToggle(t.id)}>
                {t.done ? '✓' : '○'}
              </button>
              <span className="task-text">{t.text}</span>
              <div className="q-task-actions">
                <button className={`task-btn ${t.starred?'starred':''}`} onClick={()=>onStar(t.id)}>★</button>
                <button className="task-btn danger" onClick={()=>onDelete(t.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="matrix-swipe-hint">
          {qIndex > 0 && <span>← {QUADRANTS[qIndex-1].label}</span>}
          {qIndex < 3 && <span style={{marginLeft:'auto'}}>{QUADRANTS[qIndex+1].label} →</span>}
        </div>
      </div>
    </div>
  );
}

export default function TaskBoard({ externalTasks, onTaskComplete, onAllDone, haptic }) {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('all');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [justEarned, setJustEarned] = useState(null);

  useEffect(() => {
    if (externalTasks?.length) {
      setTasks(prev => {
        const ids = new Set(prev.map(t => t.id));
        const newOnes = externalTasks.filter(t => !ids.has(t.id));
        return newOnes.length ? [...prev, ...newOnes] : prev;
      });
    }
  }, [externalTasks]);

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks(prev => [{
      id: Date.now(), text: newText.trim(),
      quadrant: 'do-now', type: 'personal',
      done: false, starred: false, subtasks: [],
    }, ...prev]);
    setNewText('');
    if (haptic) haptic('light');
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
          setJustEarned(`+${coins+bonus} 🪙`);
          setTimeout(() => setJustEarned(null), 1800);
        }
        return { ...t, done: nowDone };
      });
      const allDone = updated.length > 0 && updated.every(t => t.done);
      if (allDone && onAllDone) {
        setTimeout(() => { setJustEarned('+10 🪙 You did it all!'); setTimeout(()=>setJustEarned(null),2500); onAllDone(); }, 300);
      }
      return updated;
    });
    if (haptic) haptic('success');
  };

  const star = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t)
      .sort((a,b) => (b.starred?1:0)-(a.starred?1:0)));
    if (haptic) haptic('light');
  };

  const remove = (id) => { setTasks(prev => prev.filter(t => t.id !== id)); if (haptic) haptic('medium'); };
  const startEdit = (t) => { setEditingId(t.id); setEditText(t.text); };
  const saveEdit = (id) => { setTasks(prev => prev.map(t => t.id===id ? {...t,text:editText}:t)); setEditingId(null); };
  const moveQ = (id, q) => setTasks(prev => prev.map(t => t.id===id ? {...t,quadrant:q}:t));
  const updateSubs = (id, subs) => setTasks(prev => prev.map(t => t.id===id ? {...t,subtasks:subs}:t));
  const clearDone = () => setTasks(prev => prev.filter(t => !t.done));

  const filtered = tasks
    .filter(t => filter==='all' || t.type===filter)
    .sort((a,b)=>(b.starred?1:0)-(a.starred?1:0));

  const doneCount = filtered.filter(t=>t.done).length;
  const openCount = filtered.filter(t=>!t.done).length;

  return (
    <div className="card task-card">
      {justEarned && <div className="coin-toast">{justEarned}</div>}

      <div className="panel-header">
        <div>
          <div className="section-label">MY CHOICES</div>
          <div className="panel-title">What's on</div>
        </div>
        <div className="view-toggle">
          <button className={`toggle-btn ${view==='list'?'active':''}`} onClick={()=>setView('list')}>List</button>
          <button className={`toggle-btn ${view==='matrix'?'active':''}`} onClick={()=>setView('matrix')}>Matrix</button>
        </div>
      </div>

      <div className="filter-row">
        {['all','personal','event'].map(f=>(
          <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
            {f==='all'?'Everything':f==='personal'?'My choices':"Today's events"}
          </button>
        ))}
      </div>

      <div className="add-task-row">
        {editingId ? (
          <input autoFocus className="task-input" value={editText}
            onChange={e=>setEditText(e.target.value)}
            onBlur={()=>saveEdit(editingId)}
            onKeyDown={e=>e.key==='Enter'&&saveEdit(editingId)}
            placeholder="Edit task..." />
        ) : (
          <input className="task-input" placeholder="What's one thing I'm choosing today?"
            value={newText} onChange={e=>setNewText(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addTask()} />
        )}
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
          {filtered.map(t => (
            <SwipeableTask key={t.id} t={t}
              onToggle={toggle} onStar={star} onDelete={remove}
              onEdit={startEdit} onBreakdown={()=>{}}
              onMoveQuadrant={moveQ}
              isExpanded={expandedId===t.id}
              onToggleExpand={id=>setExpandedId(expandedId===id?null:id)}
              subtasks={t.subtasks||[]}
              onSubtaskUpdate={updateSubs}
            />
          ))}
        </div>
      )}

      {view === 'matrix' && (
        <MatrixView tasks={filtered} onToggle={toggle} onStar={star} onDelete={remove} onMove={moveQ} />
      )}

      <div className="task-stats-row">
        <div className="task-stats">
          {doneCount > 0 && <span>✓ {doneCount} done</span>}
          <span>{openCount} to do</span>
          {filtered.filter(t=>t.starred).length > 0 && <span>★ {filtered.filter(t=>t.starred).length}</span>}
        </div>
        {doneCount > 0 && (
          <button className="clear-done-btn" onClick={clearDone}>Clear done</button>
        )}
      </div>
    </div>
  );
}
