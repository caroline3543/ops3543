// src/components/EventsPanel.jsx
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EVENT_TEMPLATES } from '../data/gameData';

export default function EventsPanel({ onTasksAdded }) {
  const [events, setEvents] = useLocalStorage('events', [
    { id: 1, name: 'Bear Trap', startUtc: '18:00', endUtc: '19:00', priority: 'high', color: '#ef4444', tasksAdded: false },
    { id: 2, name: 'Foundry Battle Prep', startUtc: '21:30', endUtc: '22:15', priority: 'prep', color: '#8b5cf6', tasksAdded: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: 'Bear Trap',
    customName: '',
    startUtc: '',
    endUtc: '',
    priority: 'high',
  });
  const [expandedId, setExpandedId] = useState(null);

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
      tasksAdded: false,
    };
    setEvents(prev => [...prev, newEvent]);
    if (template.tasks.length > 0) {
      onTasksAdded(template.tasks.map(t => ({
        ...t,
        id: Date.now() + Math.random(),
        eventName,
        type: 'event',
        done: false,
        starred: false,
      })));
    }
    setShowAdd(false);
    setForm({ name: 'Bear Trap', customName: '', startUtc: '', endUtc: '', priority: 'high' });
  };

  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const priorityColor = (p) => {
    if (p === 'high') return '#ef4444';
    if (p === 'prep') return '#8b5cf6';
    if (p === 'medium') return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="events-panel">
      <div className="panel-header">
        <div>
          <div className="section-label">Today's adventures</div>
          <div className="panel-title">What's on</div>
        </div>
        <button className="btn-icon" onClick={() => setShowAdd(!showAdd)}>+</button>
      </div>

      {showAdd && (
        <div className="add-form">
          <div className="form-group">
            <label className="input-label">Event Type</label>
            <select
              className="select-input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            >
              {templateNames.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          {isCustom && (
            <div className="form-group">
              <label className="input-label">Event Name</label>
              <input
                className="text-input"
                value={form.customName}
                onChange={e => setForm(f => ({ ...f, customName: e.target.value }))}
                placeholder="Enter event name"
              />
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
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="prep">Prep</option>
              <option value="low">Low</option>
            </select>
          </div>
          {EVENT_TEMPLATES[form.name]?.tasks.length > 0 && (
            <div className="task-preview">
              <div className="input-label">These tasks will be added for you:</div>
              {EVENT_TEMPLATES[form.name].tasks.map((t, i) => (
                <div key={i} className="task-preview-item">✓ {t.text}</div>
              ))}
            </div>
          )}
          <div className="form-row">
            <button className="btn-primary" onClick={addEvent}>Add Event</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="events-list">
        {events.length === 0 && (
          <div className="empty-state">Nothing planned yet — tap + to add something.</div>
        )}
        {events.map(ev => (
          <div key={ev.id} className="event-item" style={{ borderLeftColor: ev.color }}>
            <div className="event-row" onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}>
              <div className="event-main">
                <div className="event-time">{ev.startUtc}{ev.endUtc ? ` — ${ev.endUtc}` : ''} UTC</div>
                <div className="event-name">{ev.name}</div>
              </div>
              <div className="event-right">
                <span className="priority-tag" style={{ background: priorityColor(ev.priority) }}>
                  {ev.priority.charAt(0).toUpperCase() + ev.priority.slice(1)}
                </span>
                <span className="expand-arrow">{expandedId === ev.id ? '▲' : '▼'}</span>
              </div>
            </div>
            {expandedId === ev.id && (
              <div className="event-actions">
                <button className="btn-ghost btn-small danger" onClick={() => deleteEvent(ev.id)}>
                  Remove this event
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
