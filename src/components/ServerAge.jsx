// src/components/ServerAge.jsx
import { useState, useEffect } from 'react';
import { STATE_FOUNDING_DATE, SERVER_MILESTONES } from '../data/gameData';

function getServerDay() {
  const ms = Date.now() - STATE_FOUNDING_DATE.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00Z').getTime();
  const diff = target - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function fmtDate(dateStr) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-NZ', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// Compact inline version for info strip
export function ServerAgeCompact() {
  const [day, setDay] = useState(getServerDay);
  useEffect(() => {
    const id = setInterval(() => setDay(getServerDay()), 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="strip-inner">
      <div className="strip-label">📅 Server day</div>
      <div className="strip-value">Day {day}</div>
    </div>
  );
}

// Full progression card for Tab 1
export default function ServerProgression() {
  const [day, setDay] = useState(getServerDay);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setDay(getServerDay()), 60000);
    return () => clearInterval(id);
  }, []);

  const upcoming = SERVER_MILESTONES.filter(m => m.day > day);
  const next = upcoming[0];
  const nextTwo = upcoming.slice(0, 2);
  const rest = upcoming.slice(2);

  if (!next) return null;

  const nextDays = daysUntil(next.date);
  const nextPct = Math.min(100, Math.round(((day - (SERVER_MILESTONES[SERVER_MILESTONES.findLastIndex(m => m.day <= day)]?.day || 0)) /
    (next.day - (SERVER_MILESTONES[SERVER_MILESTONES.findLastIndex(m => m.day <= day)]?.day || 0))) * 100));

  return (
    <div className="progression-card card">
      {/* Header row */}
      <div className="prog-header">
        <div className="prog-day-badge">
          <span className="prog-day-num">Day {day}</span>
          <span className="prog-day-label">State 3543</span>
        </div>
        <div className="prog-next-block">
          <div className="prog-next-label">Next unlock</div>
          <div className="prog-next-name">{next.icon} {next.label}</div>
          <div className="prog-next-meta">
            {nextDays === 0 ? 'Today!' : nextDays === 1 ? 'Tomorrow' : `${nextDays} days`}
            {' · '}{fmtDate(next.date)}
          </div>
        </div>
      </div>

      {/* Progress bar to next milestone */}
      <div className="prog-track-wrap">
        <div className="prog-track">
          <div className="prog-fill" style={{ width: `${nextPct}%` }} />
        </div>
        <div className="prog-track-labels">
          <span>Day {SERVER_MILESTONES[SERVER_MILESTONES.findLastIndex(m => m.day <= day)]?.day || 0}</span>
          <span className="prog-track-pct">{nextPct}%</span>
          <span>Day {next.day}</span>
        </div>
      </div>

      {/* Next two milestones */}
      <div className="prog-upcoming">
        {nextTwo.map((m, i) => {
          const d = daysUntil(m.date);
          const isNext = i === 0;
          return (
            <div key={m.day} className={`prog-milestone ${isNext ? 'prog-milestone-next' : ''}`}>
              <span className="prog-m-icon">{m.icon}</span>
              <div className="prog-m-body">
                <div className="prog-m-name">{m.label}</div>
                <div className="prog-m-meta">Day {m.day} · {fmtDate(m.date)}</div>
              </div>
              <div className="prog-m-days">
                <div className="prog-m-days-num">{d === 0 ? '🎉' : d}</div>
                <div className="prog-m-days-label">{d === 0 ? 'Now' : 'days'}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand toggle */}
      {rest.length > 0 && (
        <>
          <button
            className="prog-expand-btn"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? '↑ Hide future milestones' : `↓ ${rest.length} more milestones`}
          </button>
          {expanded && (
            <div className="prog-rest">
              {rest.map(m => {
                const d = daysUntil(m.date);
                return (
                  <div key={m.day} className="prog-rest-item">
                    <span className="prog-m-icon">{m.icon}</span>
                    <div className="prog-m-body">
                      <div className="prog-m-name">{m.label}</div>
                      <div className="prog-m-meta">Day {m.day} · {fmtDate(m.date)}</div>
                    </div>
                    <div className="prog-m-days">
                      <div className="prog-m-days-num" style={{ fontSize: '13px' }}>{d}d</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
