// src/components/MinisterTimer.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MINISTER_POSITIONS } from '../data/gameData';
import { AnimatedRing, PulsingDot } from './CampAnimations';

const DURATION = 30 * 60 * 1000;

const ACCOUNTS = [
  { id: 'main', label: 'Main' },
  { id: 'alt',  label: 'Alt'  },
];

function generateSlots() {
  const slots = [];
  const now = new Date();
  const startMs = Math.ceil(now.getTime() / (30*60*1000)) * (30*60*1000);
  const endMs = now.getTime() + 36*60*60*1000;
  for (let t = startMs; t < endMs; t += 30*60*1000) {
    const d = new Date(t);
    const hh = String(d.getUTCHours()).padStart(2,'0');
    const mm = String(d.getUTCMinutes()).padStart(2,'0');
    const lh = String(d.getHours()).padStart(2,'0');
    const lm = String(d.getMinutes()).padStart(2,'0');
    const diffDays = Math.floor((t - new Date().setUTCHours(0,0,0,0)) / (24*60*60*1000));
    const dayLabel = diffDays===0?'Today':diffDays===1?'Tomorrow':'+2 days';
    slots.push({ ts:t, utcLabel:`${hh}:${mm} UTC`, localLabel:`${lh}:${lm}`, dayLabel });
  }
  return slots;
}

function fmt(ms) {
  const s = Math.max(0, Math.floor(ms/1000));
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  if (h>0) return `${h}h ${String(m).padStart(2,'0')}m`;
  if (m>0) return `${m}m ${String(sec).padStart(2,'0')}s`;
  return `${sec}s`;
}

function fmtUtc(ts) {
  const d = new Date(ts);
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')} UTC`;
}

function fmtLocal(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// Compact summary row — shown by default
function AccountSummaryRow({ accountId, accountLabel, onExpand, now }) {
  const [session] = useLocalStorage(`ministerSession_${accountId}`, null);
  const position = session ? MINISTER_POSITIONS.find(p=>p.id===session.positionId) : null;
  const isPending = session && now < session.startUtc;
  const isActive  = session && now >= session.startUtc && now < session.endUtc;
  const isExpired = session && now >= session.endUtc;
  const msLeft    = session ? Math.max(0, session.endUtc - now) : 0;
  const msToPend  = session ? Math.max(0, session.startUtc - now) : 0;
  const progress  = isActive ? ((DURATION-msLeft)/DURATION)*100 : 0;

  return (
    <button className="minister-summary-row" onClick={onExpand}>
      <div className="minister-summary-left">
        <span className="minister-summary-account">{accountLabel}</span>
        {session ? (
          <span className="minister-summary-pos">{position?.icon} {position?.label}</span>
        ) : (
          <span className="minister-summary-empty">No position booked</span>
        )}
      </div>

      <div className="minister-summary-right">
        {isActive && (
          <>
            <PulsingDot color="var(--sage)" size={7}/>
            <span className="minister-summary-countdown active">{fmt(msLeft)}</span>
          </>
        )}
        {isPending && (
          <span className="minister-summary-countdown pending">{fmt(msToPend)}</span>
        )}
        {isExpired && (
          <span className="minister-summary-expired">Done</span>
        )}
        {!session && (
          <span className="minister-summary-book">+ Book</span>
        )}
        <span className="minister-summary-chevron">›</span>
      </div>

      {/* Thin progress bar under active session */}
      {isActive && (
        <div className="minister-summary-bar">
          <div className="minister-summary-bar-fill" style={{width:`${progress}%`}}/>
        </div>
      )}
    </button>
  );
}

// Full expanded account — shown when tapped
function AccountExpanded({ accountId, accountLabel, onCollapse, play, haptic }) {
  const [session, setSession] = useLocalStorage(`ministerSession_${accountId}`, null);
  const [showBook, setShowBook] = useState(!session);
  const [selectedPosition, setSelectedPosition] = useState(MINISTER_POSITIONS[0].id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [slots, setSlots] = useState(generateSlots);

  useEffect(() => {
    const id = setInterval(()=>{ setNow(Date.now()); setSlots(generateSlots()); }, 1000);
    return () => clearInterval(id);
  }, []);

  const book = () => {
    if (!selectedSlot) return;
    setSession({ positionId:selectedPosition, startUtc:selectedSlot, endUtc:selectedSlot+DURATION });
    setShowBook(false);
    setSelectedSlot(null);
    if (haptic) haptic('success');
  };

  const clear = () => { setSession(null); setShowBook(true); };

  const position = session ? MINISTER_POSITIONS.find(p=>p.id===session.positionId) : null;
  const isPending = session && now < session.startUtc;
  const isActive  = session && now >= session.startUtc && now < session.endUtc;
  const isExpired = session && now >= session.endUtc;
  const msLeft    = session ? Math.max(0, session.endUtc - now) : 0;
  const msToPend  = session ? Math.max(0, session.startUtc - now) : 0;
  const progress  = isActive ? ((DURATION-msLeft)/DURATION)*100 : 0;

  const groupedSlots = slots.reduce((acc,s) => {
    if (!acc[s.dayLabel]) acc[s.dayLabel]=[];
    acc[s.dayLabel].push(s);
    return acc;
  }, {});

  return (
    <div className="minister-expanded-account">
      {/* Header */}
      <div className="minister-expanded-header">
        <span className="minister-summary-account">{accountLabel}</span>
        <button className="minister-collapse-btn" onClick={onCollapse}>↑ Collapse</button>
      </div>

      {/* Booking form */}
      {showBook && (
        <div className="book-form">
          <div className="form-row">
            {MINISTER_POSITIONS.map(p=>(
              <button key={p.id} className={`pos-btn ${selectedPosition===p.id?'active':''}`}
                onClick={()=>setSelectedPosition(p.id)}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
          <div className="form-group">
            <label className="input-label">Select time slot</label>
            <div className="slot-scroll">
              {Object.entries(groupedSlots).map(([day,daySlots])=>(
                <div key={day}>
                  <div className="slot-day-label">{day}</div>
                  <div className="slot-grid">
                    {daySlots.map(s=>(
                      <button key={s.ts}
                        className={`slot-btn ${selectedSlot===s.ts?'active':''}`}
                        onClick={()=>setSelectedSlot(s.ts)}>
                        <div>{s.utcLabel.replace(' UTC','')}</div>
                        <div style={{fontSize:'10px',opacity:0.6}}>{s.localLabel}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-row">
            <button className="btn-primary" onClick={book}
              disabled={!selectedSlot} style={{opacity:selectedSlot?1:0.4}}>
              Confirm
            </button>
            <button className="minister-text-cancel" onClick={onCollapse}>Cancel</button>
          </div>
        </div>
      )}

      {/* STATE 1: PENDING */}
      {isPending && (
        <div className="minister-state">
          <div className="minister-state-header">
            <span className="minister-pos-name">{position?.icon} {position?.label}</span>
            <span className="minister-status status-pending">Upcoming</span>
          </div>
          <div className="minister-countdown-large">{fmt(msToPend)}</div>
          <div className="minister-time-detail">{fmtUtc(session.startUtc)} · {fmtLocal(session.startUtc)} local</div>
          <button className="minister-text-cancel" onClick={clear}>Cancel booking</button>
        </div>
      )}

      {/* STATE 2: ACTIVE */}
      {isActive && (
        <div className="minister-state">
          <div className="minister-state-header">
            <span className="minister-pos-name">{position?.icon} {position?.label}</span>
            <span className="minister-status status-active">
              <PulsingDot color="var(--sage)" size={7}/> Active
            </span>
          </div>
          <div className="minister-active-body">
            <AnimatedRing progress={progress} size={68} color="var(--sage)" label={fmt(msLeft)}/>
            <div className="minister-active-info">
              <div className="minister-remaining-label">{fmt(msLeft)} remaining</div>
              <div className="minister-time-detail">{fmtUtc(session.startUtc)} → {fmtUtc(session.endUtc)}</div>
              <div className="minister-time-detail">{fmtLocal(session.startUtc)} → {fmtLocal(session.endUtc)} local</div>
            </div>
          </div>
          <div className="progress-track" style={{marginTop:'10px'}}>
            <div className="progress-fill progress-minister" style={{width:`${progress}%`}}/>
          </div>
        </div>
      )}

      {/* STATE 3: EXPIRED */}
      {isExpired && (
        <div className="minister-state expired-state">
          <div className="minister-expired-msg">Time to book your next position.</div>
          <button className="btn-primary minister-book-btn" onClick={clear}>Book next position</button>
        </div>
      )}
    </div>
  );
}

export default function MinisterTimer({ play, haptic }) {
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(()=>setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="minister-card card">
      <div className="section-label">MINISTER POSITION</div>

      {expandedAccount ? (
        // Show expanded account
        <AccountExpanded
          accountId={expandedAccount}
          accountLabel={ACCOUNTS.find(a=>a.id===expandedAccount)?.label}
          onCollapse={()=>setExpandedAccount(null)}
          play={play}
          haptic={haptic}
        />
      ) : (
        // Show compact summary rows
        <div className="minister-summary-list">
          {ACCOUNTS.map(acc=>(
            <AccountSummaryRow
              key={acc.id}
              accountId={acc.id}
              accountLabel={acc.label}
              now={now}
              onExpand={()=>setExpandedAccount(acc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
