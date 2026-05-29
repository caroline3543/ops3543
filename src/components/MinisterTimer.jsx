// src/components/MinisterTimer.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MINISTER_POSITIONS } from '../data/gameData';

const DURATION = 30 * 60; // 30 minutes in seconds

// Generate 30-min slots for the next 36 hours from now (UTC)
function generateSlots() {
  const slots = [];
  const now = new Date();
  // Round up to the next 30-min boundary
  const startMs = Math.ceil(now.getTime() / (30 * 60 * 1000)) * (30 * 60 * 1000);
  const endMs = now.getTime() + 36 * 60 * 60 * 1000;

  for (let t = startMs; t < endMs; t += 30 * 60 * 1000) {
    const d = new Date(t);
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    // Day label — today / tomorrow / day after
    const diffDays = Math.floor((t - new Date().setUTCHours(0,0,0,0)) / (24*60*60*1000));
    const dayLabel = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : '+2 days';
    slots.push({ ts: t, label: `${hh}:${mm} UTC`, dayLabel });
  }
  return slots;
}

export default function MinisterTimer() {
  const [session, setSession] = useLocalStorage('ministerSession', null);
  const [selectedPosition, setSelectedPosition] = useState(MINISTER_POSITIONS[0].id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [showBook, setShowBook] = useState(false);
  const [slots, setSlots] = useState(generateSlots);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      setSlots(generateSlots());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const book = () => {
    if (!selectedSlot) return;
    setSession({
      positionId: selectedPosition,
      startUtc: selectedSlot,
      endUtc: selectedSlot + DURATION * 1000,
    });
    setShowBook(false);
    setSelectedSlot(null);
  };

  const clear = () => setSession(null);

  const position = session
    ? MINISTER_POSITIONS.find(p => p.id === session.positionId)
    : null;

  const isActive  = session && now >= session.startUtc && now < session.endUtc;
  const isPending = session && now < session.startUtc;
  const isExpired = session && now >= session.endUtc;

  const secondsLeft = session ? Math.max(0, Math.floor((session.endUtc - now) / 1000)) : 0;
  const progress = session ? ((DURATION - secondsLeft) / DURATION) * 100 : 0;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const fmtUtc = (ts) => {
    const d = new Date(ts);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
  };

  // Group slots by day label
  const groupedSlots = slots.reduce((acc, s) => {
    if (!acc[s.dayLabel]) acc[s.dayLabel] = [];
    acc[s.dayLabel].push(s);
    return acc;
  }, {});

  return (
    <div className="minister-card">
      <div className="section-label">MINISTER POSITION</div>

      {!session && !showBook && (
        <button className="btn-primary" onClick={() => setShowBook(true)}>
          Reserve a spot
        </button>
      )}

      {showBook && (
        <div className="book-form">
          {/* Position selector */}
          <div className="form-row">
            {MINISTER_POSITIONS.map(p => (
              <button
                key={p.id}
                className={`pos-btn ${selectedPosition === p.id ? 'active' : ''}`}
                onClick={() => setSelectedPosition(p.id)}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Time slot picker */}
          <div className="form-group">
            <label className="input-label">Select time slot (UTC)</label>
            <div className="slot-scroll">
              {Object.entries(groupedSlots).map(([dayLabel, daySlots]) => (
                <div key={dayLabel}>
                  <div className="slot-day-label">{dayLabel}</div>
                  <div className="slot-grid">
                    {daySlots.map(s => (
                      <button
                        key={s.ts}
                        className={`slot-btn ${selectedSlot === s.ts ? 'active' : ''}`}
                        onClick={() => setSelectedSlot(s.ts)}
                      >
                        {s.label.replace(' UTC', '')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <button
              className="btn-primary"
              onClick={book}
              disabled={!selectedSlot}
              style={{ opacity: selectedSlot ? 1 : 0.4 }}
            >
              All set!
            </button>
            <button className="btn-ghost" onClick={() => { setShowBook(false); setSelectedSlot(null); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {session && (
        <div className="minister-session">
          <div className="minister-header">
            <div className="minister-name">
              <span className="minister-icon">{position?.icon}</span>
              <span>{position?.label}</span>
            </div>
            <div className={`minister-status ${isActive ? 'status-active' : isPending ? 'status-pending' : 'status-expired'}`}>
              {isActive ? 'ACTIVE' : isPending ? 'PENDING' : 'EXPIRED'}
            </div>
          </div>

          {isPending && (
            <div className="minister-info">
              Starts at {fmtUtc(session.startUtc)}
            </div>
          )}

          {(isActive || isExpired) && (
            <>
              <div className="minister-countdown">
                {isExpired ? '00:00' : fmt(secondsLeft)}
              </div>
              <div className="minister-times">
                {fmtUtc(session.startUtc)} → {fmtUtc(session.endUtc)}
              </div>
              <div className="progress-track minister-progress">
                <div
                  className={`progress-fill ${isExpired ? 'progress-expired' : 'progress-minister'}`}
                  style={{ width: `${isExpired ? 100 : progress}%` }}
                />
              </div>
              {isActive && (
                <div className="minister-remaining">
                  {secondsLeft > 0 ? `${fmt(secondsLeft)} remaining` : 'Time's up — well done'}
                </div>
              )}
            </>
          )}

          <button className="btn-ghost btn-small clear-btn" onClick={clear}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
