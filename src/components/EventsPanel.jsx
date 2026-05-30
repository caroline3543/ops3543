// src/components/EventsPanel.jsx
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import EventCalendar from './EventCalendar';

const RECURRENCE_OPTIONS = [
  'Once','Daily','Every 2 days',
  'Weekly — Monday','Weekly — Tuesday','Weekly — Wednesday',
  'Weekly — Thursday','Weekly — Friday','Weekly — Saturday','Weekly — Sunday',
  'Bi-weekly','Monthly',
];

const CATEGORIES = [
  'Bear Trap','Crazy Joe','Foundry','Alliance Championship',
  'Alliance Showdown','Sunfire Castle','Hall of Chiefs','King of Icefield','SVS','Custom',
];

const PRIORITY_COLORS = {
  high: '#e8705a', medium: '#c09030', prep: '#8a5aaa', low: '#7a9e8a',
};

const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

function addDays(ymd, n) {
  const d = new Date(ymd + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function countdown(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  try {
    const diff = new Date(`${dateStr}T${timeStr}:00Z`).getTime() - Date.now();
    if (diff < 0) return 'Ongoing';
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    if (h > 48) return `${Math.floor(h/24)}d away`;
    if (h > 0) return `in ${h}h ${m}m`;
    return `in ${m}m`;
  } catch { return ''; }
}

function fmtLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  try {
    const d = new Date(`${dateStr}T${timeStr}:00Z`);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} local`;
  } catch { return ''; }
}

// Parse bulk text into task array (newline or comma separated)
function parseBulkTasks(text, eventName, type = 'event') {
  return text
    .split(/[\n,]/)
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .map(t => ({
      id: Date.now() + Math.random(),
      text: t,
      quadrant: 'do-now',
      type,
      done: false,
      starred: false,
      eventName,
      subtasks: [],
    }));
}

const DEFAULT_EVENTS = [
  {
    id: 1, name: 'Bear Trap', date: todayYMD(),
    startUtc: '18:00', endUtc: '19:00', priority: 'high',
    color: '#e8705a', category: 'Bear Trap', recurrence: 'Weekly — Friday',
    linkedMessage: null, notes: '', durationDays: 1,
    dailyTasks: { 0: '' },
  },
  {
    id: 2, name: 'Foundry Battle Prep', date: todayYMD(),
    startUtc: '21:30', endUtc: '22:15', priority: 'prep',
    color: '#8a5aaa', category: 'Foundry', recurrence: 'Weekly — Friday',
    linkedMessage: null, notes: '', durationDays: 1,
    dailyTasks: { 0: '' },
  },
];

// ── Add event form — defined OUTSIDE parent to prevent remount on keypress
function AddEventForm({ onAdd, onCancel, libraryItems }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Custom');
  const [date, setDate] = useState(todayYMD());
  const [startUtc, setStartUtc] = useState('');
  const [endUtc, setEndUtc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [recurrence, setRecurrence] = useState('Once');
  const [linkedMessage, setLinkedMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [dailyTasks, setDailyTasks] = useState({ 0: '' });
  const [activeDay, setActiveDay] = useState(0);

  // When durationDays changes, build day slots
  const handleDurationChange = (val) => {
    const n = Math.max(1, Math.min(30, Number(val)));
    setDurationDays(n);
    setDailyTasks(prev => {
      const next = {};
      for (let i = 0; i < n; i++) {
        next[i] = prev[i] || '';
      }
      return next;
    });
    setActiveDay(0);
  };

  const submit = () => {
    if (!name.trim() || !startUtc) return;
    onAdd({
      name, category, date, startUtc, endUtc,
      priority, recurrence, linkedMessage: linkedMessage || null,
      notes, durationDays, dailyTasks,
      color: PRIORITY_COLORS[priority] || '#7a9e8a',
    });
  };

  return (
    <div className="add-event-form card">
      <div className="section-label" style={{ marginBottom: '12px' }}>New Event</div>

      <div className="form-group">
        <label className="input-label">Event name</label>
        <input
          className="text-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Alliance Showdown"
          autoComplete="off"
        />
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="input-label">Category</label>
          <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="input-label">Recurrence</label>
          <select className="select-input" value={recurrence} onChange={e => setRecurrence(e.target.value)}>
            {RECURRENCE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="input-label">Start date</label>
          <input type="date" className="text-input" value={date} onChange={e => setDate(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="input-label">Duration (days)</label>
          <input
            type="number" className="text-input"
            value={durationDays} min="1" max="30"
            onChange={e => handleDurationChange(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="input-label">Start UTC</label>
          <input type="time" className="text-input" value={startUtc} onChange={e => setStartUtc(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="input-label">End UTC</label>
          <input type="time" className="text-input" value={endUtc} onChange={e => setEndUtc(e.target.value)}/>
        </div>
      </div>

      <div className="form-group">
        <label className="input-label">Priority</label>
        <select className="select-input" value={priority} onChange={e => setPriority(e.target.value)}>
          {['high','medium','prep','low'].map(p =>
            <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
        </select>
      </div>

      {/* Daily tasks — one tab per day */}
      <div className="form-group">
        <label className="input-label">
          Tasks{durationDays > 1 ? ' per day' : ''} — separate by new line or comma
        </label>
        {durationDays > 1 && (
          <div className="day-tabs">
            {Array.from({ length: durationDays }, (_, i) => (
              <button
                key={i}
                className={`day-tab ${activeDay === i ? 'active' : ''}`}
                onClick={() => setActiveDay(i)}
                type="button"
              >
                Day {i + 1}
                {dailyTasks[i]?.trim() && <span className="day-tab-dot"/>}
              </button>
            ))}
          </div>
        )}
        <textarea
          className="text-input bulk-task-input"
          value={dailyTasks[activeDay] || ''}
          onChange={e => setDailyTasks(prev => ({ ...prev, [activeDay]: e.target.value }))}
          placeholder={`Tasks for${durationDays > 1 ? ` day ${activeDay + 1}` : ' this event'}...\nOne per line, or separated by commas`}
          rows={4}
        />
        {dailyTasks[activeDay]?.trim() && (
          <div className="task-preview">
            {parseBulkTasks(dailyTasks[activeDay], name).map((t, i) => (
              <div key={i} className="task-preview-item">✓ {t.text}</div>
            ))}
          </div>
        )}
      </div>

      {/* Link library message */}
      {libraryItems.length > 0 && (
        <div className="form-group">
          <label className="input-label">Link a library message (optional)</label>
          <select className="select-input" value={linkedMessage} onChange={e => setLinkedMessage(e.target.value)}>
            <option value="">None</option>
            {libraryItems.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="input-label">Notes</label>
        <input className="text-input" value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Anything to note?" autoComplete="off"/>
      </div>

      <div className="form-row" style={{ marginTop: '4px' }}>
        <button className="btn-primary" onClick={submit}>Add event</button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Edit daily tasks form (inline, for existing events)
function EditDailyTasks({ event, onSave, onClose }) {
  const days = event.durationDays || 1;
  const [activeDay, setActiveDay] = useState(0);
  const [dailyTasks, setDailyTasks] = useState(
    event.dailyTasks || { 0: '' }
  );

  return (
    <div className="edit-daily-tasks">
      <div className="input-label" style={{ marginBottom: '8px' }}>
        Edit tasks — separate by new line or comma
      </div>
      {days > 1 && (
        <div className="day-tabs">
          {Array.from({ length: days }, (_, i) => (
            <button
              key={i}
              className={`day-tab ${activeDay === i ? 'active' : ''}`}
              onClick={() => setActiveDay(i)}
              type="button"
            >
              Day {i + 1}
              {dailyTasks[i]?.trim() && <span className="day-tab-dot"/>}
            </button>
          ))}
        </div>
      )}
      <textarea
        className="text-input bulk-task-input"
        value={dailyTasks[activeDay] || ''}
        onChange={e => setDailyTasks(prev => ({ ...prev, [activeDay]: e.target.value }))}
        placeholder="Tasks for this day...\nOne per line or comma separated"
        rows={4}
      />
      {dailyTasks[activeDay]?.trim() && (
        <div className="task-preview" style={{ marginTop: '6px' }}>
          {parseBulkTasks(dailyTasks[activeDay], event.name).map((t, i) => (
            <div key={i} className="task-preview-item">✓ {t.text}</div>
          ))}
        </div>
      )}
      <div className="form-row" style={{ marginTop: '10px' }}>
        <button className="btn-primary" onClick={() => { onSave(dailyTasks); onClose(); }}>Save tasks</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default function EventsPanel({ onTasksAdded, fullPage = false }) {
  const [events, setEvents] = useLocalStorage('events', DEFAULT_EVENTS);
  const [libraryItems] = useLocalStorage('library_items', []);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingTasksId, setEditingTasksId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // Auto-populate today's tasks for multi-day events
  useEffect(() => {
    if (!onTasksAdded) return;
    const todayStr = todayYMD();
    events.forEach(ev => {
      if (!ev.durationDays || ev.durationDays <= 1) return;
      const startDate = ev.date;
      if (!startDate) return;
      for (let i = 0; i < ev.durationDays; i++) {
        const dayDate = addDays(startDate, i);
        if (dayDate !== todayStr) continue;
        const taskText = ev.dailyTasks?.[i];
        if (!taskText?.trim()) continue;
        const storageKey = `ev_tasks_added_${ev.id}_day${i}`;
        if (localStorage.getItem(storageKey)) continue;
        const tasks = parseBulkTasks(taskText, `${ev.name} · Day ${i+1}`);
        if (tasks.length > 0) {
          onTasksAdded(tasks);
          localStorage.setItem(storageKey, '1');
        }
      }
    });
  }, [events]);

  const handleAdd = useCallback((formData) => {
    const { dailyTasks, durationDays, ...rest } = formData;
    const newEvent = {
      id: Date.now(),
      ...rest,
      durationDays: durationDays || 1,
      dailyTasks: dailyTasks || { 0: '' },
    };
    setEvents(prev => [...prev, newEvent].sort((a,b)=>
      (a.startUtc||'').localeCompare(b.startUtc||'')));

    // If single-day or day 0 is today, add tasks now
    const todayStr = todayYMD();
    if (formData.date === todayStr || durationDays === 1) {
      const taskText = dailyTasks?.[0];
      if (taskText?.trim() && onTasksAdded) {
        onTasksAdded(parseBulkTasks(taskText, formData.name));
      }
    }
    setShowAdd(false);
  }, [setEvents, onTasksAdded]);

  const handleCancel = useCallback(() => setShowAdd(false), []);

  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const updateEventTasks = (id, dailyTasks) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, dailyTasks } : e));
  };

  // For compact mode — show next 24h only
  const now24 = now + 24*3600*1000;
  const visibleEvents = fullPage ? events : events.filter(ev => {
    if (!ev.date || !ev.startUtc) return false;
    try {
      const ms = new Date(`${ev.date}T${ev.startUtc}:00Z`).getTime();
      return ms >= now - 3600000 && ms <= now24;
    } catch { return false; }
  });

  return (
    <div className={`events-panel ${fullPage ? 'events-full-page' : ''}`}>
      <div className="panel-header">
        <div>
          <div className="section-label">{fullPage ? 'ALL EVENTS' : "TODAY'S ADVENTURES"}</div>
          <div className="panel-title">{fullPage ? 'Events' : "What's on"}</div>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {fullPage && (
            <div className="view-toggle">
              <button className={`toggle-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}>List</button>
              <button className={`toggle-btn ${viewMode==='calendar'?'active':''}`} onClick={()=>setViewMode('calendar')}>Calendar</button>
            </div>
          )}
          <button className="btn-icon" style={{ width:32, height:32, fontSize:18 }}
            onClick={() => setShowAdd(s => !s)}>+</button>
        </div>
      </div>

      {/* Add form — stable component, no remount on keypress */}
      {showAdd && (
        <AddEventForm
          onAdd={handleAdd}
          onCancel={handleCancel}
          libraryItems={libraryItems}
        />
      )}

      {/* Calendar view */}
      {fullPage && viewMode === 'calendar' && <EventCalendar events={events}/>}

      {/* List view */}
      {(!fullPage || viewMode === 'list') && (
        <div className="events-list">
          {visibleEvents.length === 0 && (
            <div className="empty-state" style={{ padding:'20px 0' }}>
              <div className="empty-icon">📅</div>
              <div className="empty-text">{fullPage ? 'No events yet.' : 'Nothing in the next 24 hours.'}</div>
              <div className="empty-sub">Tap + to add one.</div>
            </div>
          )}

          {visibleEvents.map(ev => {
            const isExpanded = expandedId === ev.id;
            const cd = ev.date && ev.startUtc ? countdown(ev.date, ev.startUtc) : '';
            const local = ev.date && ev.startUtc ? fmtLocal(ev.date, ev.startUtc) : '';
            const linkedMsg = ev.linkedMessage
              ? libraryItems.find(i => String(i.id) === String(ev.linkedMessage))
              : null;
            const days = ev.durationDays || 1;

            return (
              <div key={ev.id} className="event-item"
                style={{ borderLeftColor: ev.color || PRIORITY_COLORS[ev.priority] || 'var(--accent)' }}>
                <div className="event-row"
                  onClick={() => setExpandedId(isExpanded ? null : ev.id)}>
                  <div>
                    {ev.date && (
                      <div className="event-time">
                        {ev.date}{days > 1 ? ` · ${days} days` : ''} · {ev.startUtc}{ev.endUtc ? ` – ${ev.endUtc}` : ''} UTC
                      </div>
                    )}
                    {local && <div className="event-local-time">{local}</div>}
                    <div className="event-name">{ev.name}</div>
                    {cd && <div className="event-countdown">{cd}</div>}
                  </div>
                  <div className="event-right">
                    <span className="priority-tag"
                      style={{ background: PRIORITY_COLORS[ev.priority] || '#7a9e8a', color:'#fff' }}>
                      {ev.priority?.charAt(0).toUpperCase()+ev.priority?.slice(1)}
                    </span>
                    <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="event-actions">
                    {ev.recurrence && ev.recurrence !== 'Once' && (
                      <div className="event-meta-tag">↻ {ev.recurrence}</div>
                    )}
                    {ev.category && <div className="event-meta-tag">{ev.category}</div>}
                    {days > 1 && <div className="event-meta-tag">📅 {days} days</div>}

                    {/* Daily tasks display */}
                    <div className="event-daily-tasks">
                      <div className="event-tasks-header">
                        <span className="input-label">Tasks</span>
                        <button className="event-edit-tasks-btn"
                          onClick={() => setEditingTasksId(editingTasksId===ev.id ? null : ev.id)}>
                          {editingTasksId===ev.id ? 'Done' : 'Edit tasks'}
                        </button>
                      </div>

                      {editingTasksId === ev.id ? (
                        <EditDailyTasks
                          event={ev}
                          onSave={(dt) => updateEventTasks(ev.id, dt)}
                          onClose={() => setEditingTasksId(null)}
                        />
                      ) : (
                        <div className="event-tasks-view">
                          {days > 1 ? (
                            Array.from({ length: days }, (_, i) => {
                              const taskText = ev.dailyTasks?.[i];
                              const tasks = taskText?.trim()
                                ? parseBulkTasks(taskText, ev.name)
                                : [];
                              return (
                                <div key={i} className="event-day-tasks">
                                  <div className="event-day-label">Day {i+1} · {addDays(ev.date||todayYMD(), i)}</div>
                                  {tasks.length > 0 ? (
                                    tasks.map((t,j) => (
                                      <div key={j} className="task-preview-item">· {t.text}</div>
                                    ))
                                  ) : (
                                    <div className="event-no-tasks">No tasks yet — tap Edit tasks</div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            (() => {
                              const taskText = ev.dailyTasks?.[0];
                              const tasks = taskText?.trim() ? parseBulkTasks(taskText, ev.name) : [];
                              return tasks.length > 0 ? (
                                tasks.map((t,j) => (
                                  <div key={j} className="task-preview-item">· {t.text}</div>
                                ))
                              ) : (
                                <div className="event-no-tasks">No tasks yet — tap Edit tasks</div>
                              );
                            })()
                          )}
                        </div>
                      )}
                    </div>

                    {linkedMsg && (
                      <div className="linked-message-preview" style={{ marginTop:'8px' }}>
                        <div className="linked-message-label">📎 {linkedMsg.title}</div>
                        <button className="btn-ghost btn-small" style={{ marginTop:'6px' }}
                          onClick={() => navigator.clipboard.writeText(linkedMsg.content).catch(()=>{})}>
                          Copy message
                        </button>
                      </div>
                    )}

                    {ev.notes && <div className="event-notes">{ev.notes}</div>}

                    <button className="btn-ghost btn-small danger" style={{ marginTop:'8px' }}
                      onClick={() => deleteEvent(ev.id)}>
                      Remove event
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
