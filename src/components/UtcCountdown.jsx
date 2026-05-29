// src/components/UtcCountdown.jsx
import { useState, useEffect } from 'react';

export default function UtcCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentUtc, setCurrentUtc] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcH = now.getUTCHours();
      const utcM = now.getUTCMinutes();
      const utcS = now.getUTCSeconds();

      const totalSecondsInDay = 24 * 3600;
      const secondsPassed = utcH * 3600 + utcM * 60 + utcS;
      const secondsLeft = totalSecondsInDay - secondsPassed;

      const h = Math.floor(secondsLeft / 3600);
      const m = Math.floor((secondsLeft % 3600) / 60);
      const s = secondsLeft % 60;

      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
      setProgress(((totalSecondsInDay - secondsLeft) / totalSecondsInDay) * 100);
      setCurrentUtc(
        `${String(utcH).padStart(2, '0')}:${String(utcM).padStart(2, '0')}:${String(utcS).padStart(2, '0')} UTC`
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="utc-card">
      <div className="utc-header">
        <div className="utc-label">
          <span className="utc-icon">↺</span>
          <div>
            <div className="utc-title">Daily reset</div>
            <div className="utc-sub">Resets at midnight UTC</div>
          </div>
        </div>
        <div className="utc-time">{timeLeft}</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="utc-current">{currentUtc}</div>
    </div>
  );
}
