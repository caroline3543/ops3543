// src/components/EventsPanel.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EVENT_TEMPLATES } from '../data/gameData';
import EventCalendar from './EventCalendar';

const RECURRENCE_OPTIONS = ['Once','Daily','Every 2 days','Weekly — Monday','Weekly — Tuesday','Weekly — Wednesday','Weekly — Thursday','Weekly — Friday','Weekly — Saturday','Weekly — Sunday','Bi-weekly','Monthly'];
const CATEGORIES = ['Bear Trap','Crazy Joe','Foundry','Alliance Championship','Sunfire Castle','Hall of Chiefs','King of Icefield','SVS','Custom'];
const PRIORITY_COLORS = { high: '#e8705a', medium: '#c09030', prep: '#8a5aaa', low: '#7a9e8a' };

function countdown(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  try {
    const eventMs = new Date(`${dateStr}T${timeStr}:00Z`).getTime();
    const diff = eventMs - Date.now();
    if (diff < 0) return 'Ongoing';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
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

const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const DEFAULT_EVENTS = [
  { id: 1, name: 'Bear Trap', date: todayYMD(), startUtc: '18:00', endUtc: '19:00', priority: 'high', color: '#e8705a', category: 'Bear Trap', recurrence: 'Weekly', tasksAdded: false, linkedMessage: null },
  { id: 2, name: 'Foundry Battle Prep', date: todayYMD(), startUtc: '21:30', endUtc: '22:15', priority: 'prep', color: '#8a5aaa', category: 'Foundry', recurrence: 'Weekly', tasksAdded: false, linkedMessage: null },
];

export default function EventsPanel({ onTasksAdded, fullPage = false }) {
  const [events, setEvents] = useLocalStorage('events', DEFAULT_EVENTS);
  const [libraryItems] = useLocalStorage('library_items', []);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const emptyForm = () => ({
    name: '', category: 'Bear Trap', date: todayYMD(),
    startUtc: '', endUtc: '', duration: '30',
    priority: 'medium', recurrence: 'Once',
    linkedMessage: '', notes: '',
  });
  const [form, setForm] = useState(emptyForm());

  const addEvent = () => {
    if (!form.name.trim() || !form.startUtc) return;
    const template = EVENT_TEMPLATES[form.category] || EVENT_TEMPLATES['Custom'];
    const newEvent = {
      id: Date.now(),
      name: form.name,
      date: form.date,
      startUtc: form.startUtc,
      endUtc: form.endUtc,
      priority: form.priority,
      color: template?.color || '#7a9e8a',
      category: form.category,
      recurrence: form.recurrence,
      tasksAdded: false,
      linkedMessage: form.linkedMessage || null,
      notes: form.notes,
    };
    setEvents(prev => [...prev, newEvent].sort((a,b) => a.startUtc.localeCompare(b.startUtc)));
    if (template?.tasks?.length && onTasksAdded) {
      onTasksAdded(template.tasks.map(t => ({
        ...t, id: Date.now() + Math.random(),
        eventName: form.name, type: 'event', done: false, starred: false,
      })));
    }
    setShowAdd(false);
    setForm(emptyForm());
  };

  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  // For compact mode (Tab 1), only show today + next 24h
  const now24 = now + 24 * 3600 * 1000;
  const visibleEvents = fullPage ? events : events.filter(e => {
    if (!e.date || !e.startUtc) return false;
    try {
      const ms = new Date(`${e.date}T${e.startUtc}:00Z`).getTime();
      return ms >= now - 3600000 && ms <= now24;
    } catch { return false; }
  });

  const linkedLib = form.linkedMessage ? libraryItems.find(i => String(i.id) === String(form.linkedMessage)) : null;

  const AddForm = () => (
    <div className="add-event-form card" style={{ margin: '10px 0 0' }}>
      <div className="section-label" style={{ marginBottom: '12px' }}>New Event</div>
      <div className="form-group">
        <label className="input-label">Event name</label>
        <input className="text-input" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Bear Trap" />
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label className="input-label">Category</label>
          <select className="select-input" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="input-label">Recurrence</label>
          <select className="select-input" value={form.recurrence}
            onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))}>
            {RECURRENCE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="input-label">Date</label>
        <input type="date" className="text-input" value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label className="input-label">Start (UTC)</label>
          <input type="time" className="text-input" value={form.startUtc}
            onChange={e => setForm(f => ({ ...f, startUtc: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="input-label">End (UTC)</label>
          <input type="time" className="text-input" value={form.endUtc}
            onChange={e => setForm(f => ({ ...f, endUtc: e.target.value }))} />
        </div>
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label className="input-label">Priority</label>
          <select className="select-input" value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
            {['high','medium','prep','low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="input-label">Duration (min)</label>
          <input type="number" className="text-input" value={form.duration}
            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            placeholder="30" />
        </div>
      </div>
      {/* Link library message */}
      <div className="form-group">
        <label className="input-label">Link a library message (optional)</label>
        <select className="select-input" value={form.linkedMessage}
          onChange={e => setForm(f => ({ ...f, linkedMessage: e.target.value }))}>
          <option value="">None</option>
          {libraryItems.map(item => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </div>
      {linkedLib && (
        <div className="linked-message-preview">
          <div className="linked-message-label">📎 {linkedLib.title}</div>
          <div className="linked-message-content">{linkedLib.content.slice(0, 80)}…</div>
        </div>
      )}
      <div className="form-group">
        <label className="input-label">Notes</label>
        <input className="text-input" value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="Anything else to note?" />
      </div>
      {/* Auto tasks preview */}
      {EVENT_TEMPLATES[form.category]?.tasks?.length > 0 && (
        <div className="task-preview">
          <div className="input-label" style={{ marginBottom: '5px' }}>Tasks that will be added:</div>
          {EVENT_TEMPLATES[form.category].tasks.map((t, i) => (
            <div key={i} className="task-preview-item">✓ {t.text}</div>
          ))}
        </div>
      )}
      <div className="form-row" style={{ marginTop: '4px' }}>
        <button className="btn-primary" onClick={addEvent}>Add event</button>
        <button className="btn-ghost" onClick={() => { setShowAdd(false); setForm(emptyForm()); }}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className={`events-panel ${fullPage ? 'events-full-page' : ''}`}>
      <div className="panel-header">
        <div>
          <div className="section-label">
            {fullPage ? "ALL EVENTS" : "TODAY'S ADVENTURES"}
          </div>
          <div className="panel-title">{fullPage ? "Events" : "What's on"}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {fullPage && (
            <div className="view-toggle">
              <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}>List</button>
              <button className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}>Calendar</button>
            </div>
          )}
          <button className="btn-icon" style={{ width: 32, height: 32, fontSize: 18 }}
            onClick={() => setShowAdd(!showAdd)}>+</button>
        </div>
      </div>

      {showAdd && <AddForm />}

      {/* Calendar view */}
      {fullPage && viewMode === 'calendar' && (
        <EventCalendar events={events} />
      )}

      {/* List view */}
      {(!fullPage || viewMode === 'list') && (
        <div className="events-list">
          {visibleEvents.length === 0 && (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              <div className="empty-icon">📅</div>
              <div className="empty-text">
                {fullPage ? 'No events yet.' : 'Nothing in the next 24 hours.'}
              </div>
              <div className="empty-sub">Tap + to add one.</div>
            </div>
          )}
          {visibleEvents.map(ev => {
            const isExpanded = expandedId === ev.id;
            const cd = ev.date && ev.startUtc ? countdown(ev.date, ev.startUtc) : '';
            const local = ev.date && ev.startUtc ? fmtLocal(ev.date, ev.startUtc) : '';
            const linkedMsg = ev.linkedMessage ? libraryItems.find(i => String(i.id) === String(ev.linkedMessage)) : null;
            return (
              <div key={ev.id} className="event-item"
                style={{ borderLeftColor: ev.color || PRIORITY_COLORS[ev.priority] || 'var(--accent)' }}>
                <div className="event-row" onClick={() => setExpandedId(isExpanded ? null : ev.id)}>
                  <div>
                    {ev.date && <div className="event-time">{ev.date} · {ev.startUtc}{ev.endUtc ? ` – ${ev.endUtc}` : ''} UTC</div>}
                    {local && <div className="event-local-time">{local}</div>}
                    <div className="event-name">{ev.name}</div>
                    {cd && <div className="event-countdown">{cd}</div>}
                  </div>
                  <div className="event-right">
                    <span className="priority-tag"
                      style={{ background: PRIORITY_COLORS[ev.priority] || '#7a9e8a', color: '#fff' }}>
                      {ev.priority?.charAt(0).toUpperCase() + ev.priority?.slice(1)}
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
                    {linkedMsg && (
                      <div className="linked-message-preview" style={{ margin: '8px 0' }}>
                        <div className="linked-message-label">📎 {linkedMsg.title}</div>
                        <button className="btn-ghost btn-small" style={{ marginTop: '6px' }}
                          onClick={() => { navigator.clipboard.writeText(linkedMsg.content).catch(()=>{}); }}>
                          Copy message
                        </button>
                      </div>
                    )}
                    {ev.notes && <div className="event-notes">{ev.notes}</div>}
                    <button className="btn-ghost btn-small danger" style={{ marginTop: '6px' }}
                      onClick={() => deleteEvent(ev.id)}>Remove event</button>
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
