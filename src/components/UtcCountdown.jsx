// src/components/UtcCountdown.jsx
import { useState, useEffect } from 'react';

export default function UtcCountdown({ compact = false }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentUtc, setCurrentUtc] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcH = now.getUTCHours();
      const utcM = now.getUTCMinutes();
      const utcS = now.getUTCSeconds();
      const total = 86400;
      const passed = utcH * 3600 + utcM * 60 + utcS;
      const left = total - passed;
      const h = Math.floor(left / 3600);
      const m = Math.floor((left % 3600) / 60);
      const s = left % 60;
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
      setProgress((passed / total) * 100);
      setCurrentUtc(`${String(utcH).padStart(2,'0')}:${String(utcM).padStart(2,'0')}:${String(utcS).padStart(2,'0')} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (compact) {
    return (
      <div className="info-strip-item">
        <div className="strip-label">↺ Reset in</div>
        <div className="strip-value">{timeLeft}</div>
      </div>
    );
  }

  return (
    <div className="utc-card card">
      <div className="utc-title">Daily reset</div>
      <div className="utc-inner">
        <div className="utc-left">
          <div className="utc-icon">↺</div>
          <div>
            <div className="utc-label">Resets at midnight UTC</div>
            <div className="utc-sub">Board refreshes at 00:00</div>
          </div>
        </div>
        <div className="utc-time">{timeLeft}</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="utc-footer">{currentUtc}</div>
    </div>
  );
}
