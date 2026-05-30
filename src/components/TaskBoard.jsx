// src/components/TaskBoard.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QUADRANTS = [
  { id: 'do-now',   label: 'Ready for this',    sub: 'Urgent & important',         color: 'var(--accent)' },
  { id: 'do-soon',  label: 'Worth planning',    sub: 'Important, not urgent',      color: 'var(--amber)'  },
  { id: 'do-later', label: 'Could ask for help',sub: 'Urgent, less important',     color: 'var(--blue)'   },
  { id: 'maybe',    label: 'Maybe let go',      sub: 'Neither urgent nor important',color: 'var(--text-3)' },
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

// ── True 2×2 Eisenhower Matrix
function MatrixView({ tasks, onToggle, onStar, onDelete, onMove }) {
  const [openQ, setOpenQ] = useState(null); // quadrant id for full sheet
  const [dragId, setDragId] = useState(null);

  const openSheet = QUADRANTS.find(q => q.id === openQ);
  const sheetTasks = openSheet ? tasks.filter(t => t.quadrant === openQ) : [];

  return (
    <>
      {/* 2×2 grid */}
      <div className="matrix-grid">
        {QUADRANTS.map(q => {
          const qTasks = tasks.filter(t => t.quadrant === q.id);
          const preview = qTasks.slice(0, 2);
          const more = qTasks.length - 2;
          return (
            <div
              key={q.id}
              className="matrix-cell"
              style={{ borderTopColor: q.color }}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragId) { onMove(dragId, q.id); setDragId(null); } }}
              onClick={() => setOpenQ(q.id)}
            >
              <div className="matrix-cell-header">
                <div className="matrix-cell-label" style={{ color: q.color }}>{q.label}</div>
                <div className="matrix-cell-count">{qTasks.length}</div>
              </div>
              <div className="matrix-cell-tasks">
                {qTasks.length === 0 && (
                  <div className="matrix-cell-empty">Empty ·<br/>tap to add</div>
                )}
                {preview.map(t => (
                  <div key={t.id}
                    className={`matrix-preview-task ${t.done ? 'task-done' : ''}`}
                    draggable
                    onDragStart={e => { e.stopPropagation(); setDragId(t.id); }}
                    onClick={e => { e.stopPropagation(); onToggle(t.id); }}
                  >
                    <span className="matrix-preview-check">{t.done ? '✓' : '○'}</span>
                    <span className="matrix-preview-text">{t.text}</span>
                  </div>
                ))}
                {more > 0 && (
                  <div className="matrix-more">+{more} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen quadrant sheet */}
      {openSheet && (
        <div className="sheet-overlay" onClick={() => setOpenQ(null)}>
          <div className="sheet-panel" onClick={e => e.stopPropagation()}
            style={{ display:'flex', flexDirection:'column', height:'88svh', maxHeight:'88svh', borderRadius:'20px 20px 0 0', background:'var(--bg-modal)', overflow:'hidden' }}>
            <div style={{ flexShrink:0, borderBottom:'1px solid var(--border)', padding:'12px 16px 10px' }}>
              <div className="sheet-handle" style={{ margin:'0 auto 10px' }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:800, color: openSheet.color }}>{openSheet.label}</div>
                  <div style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'2px' }}>{openSheet.sub}</div>
                </div>
                <button className="sheet-close" onClick={() => setOpenQ(null)}>✕</button>
              </div>
            </div>
            <div style={{ flex:'1 1 0%', minHeight:0, overflowY:'scroll', WebkitOverflowScrolling:'touch', padding:'12px 14px' }}>
              {sheetTasks.length === 0 && (
                <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-3)', fontSize:'14px', fontStyle:'italic' }}>
                  Nothing here yet — and that's okay.
                </div>
              )}
              {sheetTasks.map(t => (
                <div key={t.id}
                  className={`task-item ${t.done?'task-done':''} ${t.starred?'task-starred':''}`}
                  draggable onDragStart={() => setDragId(t.id)}
                  style={{ marginBottom:'6px' }}>
                  <button className="task-check" onClick={() => onToggle(t.id)}>{t.done?'✓':'○'}</button>
                  <div className="task-body">
                    <div className="task-text">{t.text}</div>
                  </div>
                  <div className="task-actions">
                    <button className={`task-btn ${t.starred?'starred':''}`} onClick={() => onStar(t.id)}>★</button>
                    <button className="task-btn danger" onClick={() => onDelete(t.id)}>✕</button>
                  </div>
                </div>
              ))}
              {/* Move to other quadrants */}
              <div style={{ marginTop:'16px', borderTop:'1px solid var(--border)', paddingTop:'12px' }}>
                <div style={{ fontSize:'11px', color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'8px' }}>Move tasks to</div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {QUADRANTS.filter(q => q.id !== openQ).map(q => (
                    <div key={q.id} style={{ fontSize:'12px', fontWeight:600, color:q.color, padding:'6px 10px', borderRadius:'99px', border:`1px solid ${q.color}`, opacity:0.8 }}>
                      {q.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
    // Support bulk add — newline or comma separated
    const lines = newText
      .split(/[\n,]/)
      .map(t => t.trim())
      .filter(t => t.length > 0);
    const newTasks = lines.map(text => ({
      id: Date.now() + Math.random(),
      text,
      quadrant: 'do-now',
      type: 'personal',
      done: false,
      starred: false,
      subtasks: [],
    }));
    setTasks(prev => [...newTasks, ...prev]);
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
          <textarea
            className="task-input task-input-multi"
            placeholder={"What's one thing I'm choosing today?\n\nAdd multiple — one per line or comma separated"}
            value={newText}
            onChange={e=>setNewText(e.target.value)}
            onKeyDown={e=>{
              // Cmd+Enter or Ctrl+Enter to add
              if (e.key==='Enter' && (e.metaKey||e.ctrlKey)) { e.preventDefault(); addTask(); }
            }}
            rows={newText.includes('\n') ? Math.min(6, newText.split('\n').length + 1) : 1}
          />
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
