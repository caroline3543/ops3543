// src/components/MinisterTimer.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MINISTER_POSITIONS } from '../data/gameData';

const DURATION = 30 * 60; // 30 minutes in seconds

export default function MinisterTimer() {
  const [session, setSession] = useLocalStorage('ministerSession', null);
  const [selectedPosition, setSelectedPosition] = useState(MINISTER_POSITIONS[0].id);
  const [inputTime, setInputTime] = useState('');
  const [now, setNow] = useState(Date.now());
  const [showBook, setShowBook] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const book = () => {
    if (!inputTime) return;
    const [h, m] = inputTime.split(':').map(Number);
    const today = new Date();
    const startUtc = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      h, m, 0
    );
    setSession({
      positionId: selectedPosition,
      startUtc,
      endUtc: startUtc + DURATION * 1000,
    });
    setShowBook(false);
    setInputTime('');
  };

  const clear = () => setSession(null);

  const position = session
    ? MINISTER_POSITIONS.find(p => p.id === session.positionId)
    : null;

  const isActive = session && now >= session.startUtc && now < session.endUtc;
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

  return (
    <div className="minister-card">
      <div className="section-label">MINISTER POSITION</div>

      {!session && !showBook && (
        <button className="btn-primary" onClick={() => setShowBook(true)}>
          + Book Position
        </button>
      )}

      {showBook && (
        <div className="book-form">
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
          <div className="form-row">
            <label className="input-label">Start time (UTC)</label>
            <input
              type="time"
              className="time-input"
              value={inputTime}
              onChange={e => setInputTime(e.target.value)}
            />
          </div>
          <div className="form-row">
            <button className="btn-primary" onClick={book}>Confirm Booking</button>
            <button className="btn-ghost" onClick={() => setShowBook(false)}>Cancel</button>
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
                  {secondsLeft > 0 ? `${fmt(secondsLeft)} remaining` : 'Position expired'}
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
