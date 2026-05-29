// src/App.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import UtcCountdown from './components/UtcCountdown';
import MinisterTimer from './components/MinisterTimer';
import ServerAge from './components/ServerAge';
import EventsPanel from './components/EventsPanel';
import TaskBoard from './components/TaskBoard';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

export default function App() {
  const [commanderName] = useLocalStorage('commanderName', 'Commander');
  const [showSettings, setShowSettings] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [dayStr, setDayStr] = useState('');

  useEffect(() => {
    const h = new Date().getUTCHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setDayStr(days[new Date().getDay()]);
  }, []);

  const handleTasksAdded = (tasks) => {
    setPendingTasks(prev => [...prev, ...tasks]);
  };

  return (
    <div className="app">
      <div className="app-inner">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <div className="header-badge">CC</div>
            <div>
              <div className="header-label">ALLIANCE OPS</div>
              <div className="header-title">Command Center</div>
            </div>
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙
          </button>
        </header>

        {/* Greeting */}
        <div className="greeting-section">
          <div className="greeting-day">{dayStr}</div>
          <div className="greeting-text">{greeting}, {commanderName}.</div>
        </div>

        {/* UTC Countdown */}
        <UtcCountdown />

        {/* Server Age */}
        <ServerAge />

        {/* Minister Timer */}
        <MinisterTimer />

        {/* Events */}
        <EventsPanel onTasksAdded={handleTasksAdded} />

        {/* Task Board */}
        <TaskBoard externalTasks={pendingTasks} />

        {/* Pulse */}
        <PulsePanel />

        {/* Bottom nav */}
        <nav className="bottom-nav">
          <button className="nav-btn active">
            <span className="nav-icon">◈</span>
            <span>Today</span>
          </button>
          <button className="nav-btn" onClick={() => setShowSettings(true)}>
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// Inline pulse panel — small enough to stay here
function PulsePanel() {
  const [tasks] = useLocalStorage('tasks', []);
  const open = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  const starred = tasks.filter(t => t.starred).length;

  return (
    <div className="pulse-card">
      <div className="section-label">PULSE</div>
      <div className="panel-title">Today at a glance</div>
      <div className="pulse-stats">
        <div className="pulse-stat">
          <div className="pulse-num">{open}</div>
          <div className="pulse-label">OPEN</div>
        </div>
        <div className="pulse-stat">
          <div className="pulse-num">{done}</div>
          <div className="pulse-label">DONE</div>
        </div>
        <div className="pulse-stat">
          <div className="pulse-num">{starred}</div>
          <div className="pulse-label">STARRED</div>
        </div>
      </div>
    </div>
  );
}
