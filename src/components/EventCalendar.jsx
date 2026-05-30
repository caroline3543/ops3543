// src/components/EventCalendar.jsx
import { useState, useEffect } from 'react';

function fmtUtc(dateStr, timeStr) {
  return `${timeStr} UTC`;
}

function fmtLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  try {
    const [h, m] = timeStr.split(':');
    const d = new Date(`${dateStr}T${timeStr}:00Z`);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} local`;
  } catch { return ''; }
}

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

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - day + i);
    return d;
  });
}

function toYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function EventCalendar({ events }) {
  const [view, setView] = useState('week');
  const [selectedDay, setSelectedDay] = useState(null);
  const [now, setNow] = useState(Date.now());
  const today = new Date();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const weekDates = getWeekDates();

  // Month grid
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calCells = Array.from({ length: firstDay }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const eventsForDate = (ymd) => events.filter(e => e.date === ymd);

  const EventPill = ({ ev }) => (
    <div className="cal-event-pill" style={{ borderLeftColor: ev.color || 'var(--accent)' }}>
      <div className="cal-event-name">{ev.name}</div>
      <div className="cal-event-meta">
        {ev.startUtc && <span>{ev.startUtc} UTC</span>}
        {ev.date && ev.startUtc && <span> · {fmtLocal(ev.date, ev.startUtc)}</span>}
        {ev.date && ev.startUtc && <span className="cal-countdown"> · {countdown(ev.date, ev.startUtc)}</span>}
      </div>
    </div>
  );

  return (
    <div className="event-calendar">
      {/* View toggle */}
      <div className="cal-toggle">
        <button className={`cal-toggle-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>
          Week
        </button>
        <button className={`cal-toggle-btn ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>
          Month
        </button>
      </div>

      {/* Weekly view */}
      {view === 'week' && (
        <div className="week-view">
          <div className="week-header">
            {weekDates.map((d, i) => {
              const ymd = toYMD(d);
              const isToday = toYMD(d) === toYMD(today);
              const dayEvents = eventsForDate(ymd);
              return (
                <div key={i} className={`week-day ${isToday ? 'week-day-today' : ''}`}>
                  <div className="week-day-name">{DAYS[d.getDay()]}</div>
                  <div className="week-day-num">{d.getDate()}</div>
                  {dayEvents.length > 0 && (
                    <div className="week-day-dot" style={{ background: dayEvents[0].color || 'var(--accent)' }} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="week-events">
            {weekDates.map((d, i) => {
              const ymd = toYMD(d);
              const isToday = toYMD(d) === toYMD(today);
              const dayEvents = eventsForDate(ymd);
              if (dayEvents.length === 0) return null;
              return (
                <div key={i} className="week-day-events">
                  <div className="week-day-events-label">
                    {isToday ? 'Today' : `${DAYS[d.getDay()]} ${d.getDate()}`}
                  </div>
                  {dayEvents.map((ev, j) => <EventPill key={j} ev={ev} />)}
                </div>
              );
            })}
            {weekDates.every(d => eventsForDate(toYMD(d)).length === 0) && (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <div className="empty-text">No events this week.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly view */}
      {view === 'month' && (
        <div className="month-view">
          <div className="month-title">{MONTHS[month]} {year}</div>
          <div className="month-grid-header">
            {DAYS.map(d => <div key={d} className="month-grid-day-name">{d}</div>)}
          </div>
          <div className="month-grid">
            {calCells.map((day, i) => {
              if (!day) return <div key={i} className="month-cell empty-cell" />;
              const ymd = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const dayEvents = eventsForDate(ymd);
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = selectedDay === ymd;
              return (
                <div key={i}
                  className={`month-cell ${isToday ? 'month-cell-today' : ''} ${isSelected ? 'month-cell-selected' : ''}`}
                  onClick={() => setSelectedDay(isSelected ? null : ymd)}
                >
                  <div className="month-cell-num">{day}</div>
                  {dayEvents.length > 0 && (
                    <div className="month-event-dots">
                      {dayEvents.slice(0,3).map((ev, j) => (
                        <div key={j} className="month-event-dot"
                          style={{ background: ev.color || 'var(--accent)' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Selected day events */}
          {selectedDay && (
            <div className="month-day-events">
              <div className="week-day-events-label">
                {MONTHS[parseInt(selectedDay.split('-')[1])-1]} {parseInt(selectedDay.split('-')[2])}
              </div>
              {eventsForDate(selectedDay).length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text3)', padding: '8px 0' }}>No events</div>
              ) : (
                eventsForDate(selectedDay).map((ev, i) => <EventPill key={i} ev={ev} />)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
