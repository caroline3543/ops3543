// src/components/ServerAge.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STATE_FOUNDING_DATE, SERVER_MILESTONES } from '../data/gameData';

export default function ServerAge() {
  const [open, setOpen] = useState(false);
  const [showCount, setShowCount] = useLocalStorage('milestoneShowCount', 3);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const msPerDay = 24 * 3600 * 1000;
  const dayAge = Math.floor((now - STATE_FOUNDING_DATE.getTime()) / msPerDay);

  const upcoming = SERVER_MILESTONES.filter(m => m.day > dayAge);
  const past = SERVER_MILESTONES.filter(m => m.day <= dayAge);
  const next = upcoming[0];

  const daysToNext = next ? next.day - dayAge : null;
  const nextProgress = next
    ? (() => {
        const prev = [...past].reverse()[0];
        const fromDay = prev ? prev.day : 0;
        const span = next.day - fromDay;
        const elapsed = dayAge - fromDay;
        return Math.min(100, (elapsed / span) * 100);
      })()
    : 100;

  // How many to show on the card (capped at available)
  const cardMilestones = upcoming.slice(0, showCount);
  const visibleUpcoming = upcoming.slice(0, Math.max(showCount, 5));

  return (
    <>
      <div className="server-age-card" onClick={() => setOpen(true)}>
        <div className="server-age-top">
          <div className="server-age-header">
            <div>
              <div className="section-label">STATE 3543</div>
              <div className="server-day">Day {dayAge}</div>
            </div>
            <div className="milestone-ring">
              <svg viewBox="0 0 40 40" className="ring-svg">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle
                  cx="20" cy="20" r="16" fill="none"
                  stroke="#3b82f6" strokeWidth="3"
                  strokeDasharray={`${nextProgress} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 20 20)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <span className="ring-pct">{Math.round(nextProgress)}%</span>
            </div>
          </div>

          {/* Milestone list on card */}
          <div className="card-milestones">
            {cardMilestones.map((m, i) => (
              <div key={m.day} className={`card-milestone ${i === 0 ? 'card-milestone-next' : ''}`}>
                <div className="card-milestone-day">Day {m.day}</div>
                <div className="card-milestone-label">{m.label}</div>
                <div className="card-milestone-eta">in {m.day - dayAge}d</div>
              </div>
            ))}
          </div>

          <div className="server-tap-hint">Tap to see what's coming ›</div>
        </div>
      </div>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title">Your server's story</div>
                <div className="drawer-sub">Server #3543 · Day {dayAge}</div>
              </div>
              <button className="btn-ghost" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="drawer-section-label">Coming up</div>
            <div className="milestone-list">
              {visibleUpcoming.map((m, i) => (
                <div key={m.day} className={`milestone-item ${i === 0 ? 'milestone-next' : ''}`}>
                  <div className="milestone-day">Day {m.day}</div>
                  <div className="milestone-info">
                    <div className="milestone-label">{m.label}</div>
                    <div className="milestone-detail">{m.detail}</div>
                    <div className="milestone-eta">in {m.day - dayAge} days</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-show-more">
              <label className="input-label">Milestones to show</label>
              <div className="show-more-btns">
                {[1, 2, 3, 5].map(n => (
                  <button
                    key={n}
                    className={`show-btn ${showCount === n ? 'active' : ''}`}
                    onClick={() => setShowCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="drawer-section-label" style={{ marginTop: '1.5rem' }}>Already unlocked</div>
            <div className="milestone-list past-list">
              {[...past].reverse().map(m => (
                <div key={m.day} className="milestone-item milestone-past">
                  <div className="milestone-day past">Day {m.day}</div>
                  <div className="milestone-info">
                    <div className="milestone-label past-label">{m.label}</div>
                    <div className="milestone-eta past-eta">unlocked {dayAge - m.day}d ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
