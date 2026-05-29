// src/components/EventsTab.jsx
// Full events tab — today/week/month views, countdowns, local time
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EVENT_TEMPLATES } from '../data/gameData';

const VIEWS = ['Today', 'This Week', 'This Month'];

function getLocalTime(utcTimeStr) {
  if (!utcTimeStr) return '';
  const [h, m] = utcTimeStr.split(':').map(Number);
  const now = new Date();
  const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m));
  return utc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCountdown(utcTimeStr) {
  if (!utcTimeStr) return null;
  const [h, m] = utcTimeStr.split(':').map(Number);
  const now = new Date();
  const eventMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m);
  const diff = eventMs - Date.now();
  if (diff < 0) return null;
  const totalMins = Math.floor(diff / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs > 0) return `in ${hrs}h ${mins}m`;
  if (mins > 0) return `in ${mins}m`;
  return 'now';
}

function priorityStyle(p) {
  if (p === 'high')   return { bg: '#fee2e2', color: '#c0392b', label: '🔥 Hot' };
  if (p === 'prep')   return { bg: '#ede9fe', color: '#7c3aed', label: '📋 Prep' };
  if (p === 'medium') return { bg: '#fef3c7', color: '#b45309', label: '⚡ Steady' };
  return { bg: '#f3f4f6', color: '#6b7280', label: 'Low' };
}

function EventCard({ ev, onDelete, expanded, onToggle }) {
  const [now, setNow] = useState(Date.now());
  const ps = priorityStyle(ev.priority);
  const countdown = getCountdown(ev.startUtc);
  const localTime = getLocalTime(ev.startUtc);
  const template = EVENT_TEMPLATES[ev.name];

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ev-card" style={{ borderLeftColor: ev.color || '#c0392b' }}>
      <div className="ev-card-main" onClick={onToggle}>
        <div className="ev-card-left">
          <div className="ev-time-row">
            <span className="ev-utc">{ev.startUtc}{ev.endUtc ? ` — ${ev.endUtc}` : ''} UTC</span>
            {localTime && <span className="ev-local">· {localTime} local</span>}
          </div>
          <div className="ev-name">{ev.name}</div>
          {countdown && <div className="ev-countdown">{countdown}</div>}
        </div>
        <div className="ev-card-right">
          <span className="ev-tag" style={{ background: ps.bg, color: ps.color }}>{ps.label}</span>
          <span className="ev-chevron">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="ev-expanded">
          {template?.tasks?.length > 0 && (
            <div className="ev-tasks-preview">
              <div className="ev-section-label">Associated tasks</div>
              {template.tasks.map((t, i) => (
                <div key={i} className="ev-task-row">
                  <span className="ev-task-dot" />
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          )}
          <button className="ev-delete-btn" onClick={() => onDelete(ev.id)}>
            Remove event
          </button>
        </div>
      )}
    </div>
  );
}

export default function EventsTab({ onTasksAdded }) {
  const [events, setEvents] = useLocalStorage('events', [
    { id: 1, name: 'Bear Trap',          startUtc: '18:00', endUtc: '19:00', priority: 'high', color: '#ef4444' },
    { id: 2, name: 'Foundry Battle Prep',startUtc: '21:30', endUtc: '22:15', priority: 'prep', color: '#8b5cf6' },
  ]);
  const [view, setView] = useState('Today');
  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: 'Bear Trap', customName: '', startUtc: '', endUtc: '', priority: 'high' });

  const templateNames = Object.keys(EVENT_TEMPLATES);
  const isCustom = form.name === 'Custom';
  const eventName = isCustom ? form.customName : form.name;

  const addEvent = () => {
    if (!eventName || !form.startUtc) return;
    const template = EVENT_TEMPLATES[form.name] || EVENT_TEMPLATES['Custom'];
    const newEvent = {
      id: Date.now(),
      name: eventName,
      startUtc: form.startUtc,
      endUtc: form.endUtc,
      priority: form.priority,
      color: template.color,
    };
    setEvents(prev => [...prev, newEvent]);
    if (template.tasks?.length > 0 && onTasksAdded) {
      onTasksAdded(template.tasks.map(t => ({
        ...t, id: Date.now() + Math.random(),
        eventName, type: 'event', done: false, starred: false,
      })));
    }
    setShowAdd(false);
    setForm({ name: 'Bear Trap', customName: '', startUtc: '', endUtc: '', priority: 'high' });
  };

  return (
    <div className="events-tab">
      {/* Header */}
      <div className="tab-page-header">
        <div>
          <div className="tab-page-eyebrow">Whiteout Survival</div>
          <div className="tab-page-title">Events</div>
        </div>
        <button className="btn-icon" onClick={() => setShowAdd(!showAdd)}>+</button>
      </div>

      {/* View toggle */}
      <div className="view-pill-row">
        {VIEWS.map(v => (
          <button key={v} className={`view-pill ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
            {v}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="add-event-card">
          <div className="form-group">
            <label className="input-label">Event type</label>
            <select className="select-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}>
              {templateNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {isCustom && (
            <div className="form-group">
              <label className="input-label">Event name</label>
              <input className="text-input" value={form.customName} onChange={e => setForm(f => ({ ...f, customName: e.target.value }))} placeholder="Name your event" />
            </div>
          )}
          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label">Start (UTC)</label>
              <input type="time" className="time-input" value={form.startUtc} onChange={e => setForm(f => ({ ...f, startUtc: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="input-label">End (UTC)</label>
              <input type="time" className="time-input" value={form.endUtc} onChange={e => setForm(f => ({ ...f, endUtc: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="input-label">Priority</label>
            <select className="select-input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="high">🔥 Hot</option>
              <option value="medium">⚡ Steady</option>
              <option value="prep">📋 Prep</option>
              <option value="low">Low</option>
            </select>
          </div>
          {EVENT_TEMPLATES[form.name]?.tasks?.length > 0 && (
            <div className="task-preview">
              <div className="input-label" style={{ marginBottom: '6px' }}>Tasks that will be added:</div>
              {EVENT_TEMPLATES[form.name].tasks.map((t, i) => (
                <div key={i} className="task-preview-item">✓ {t.text}</div>
              ))}
            </div>
          )}
          <div className="form-row" style={{ marginTop: '4px' }}>
            <button className="btn-primary" onClick={addEvent}>Add event</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="ev-list">
        {events.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-text">Nothing planned yet.</div>
            <div className="empty-sub">Tap + to add an event.</div>
          </div>
        )}
        {events.map(ev => (
          <EventCard
            key={ev.id}
            ev={ev}
            onDelete={id => setEvents(prev => prev.filter(e => e.id !== id))}
            expanded={expandedId === ev.id}
            onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
          />
        ))}
      </div>
    </div>
  );
}
