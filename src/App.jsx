// src/App.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCoins, COIN_REWARDS } from './hooks/useCoins';
import UtcCountdown from './components/UtcCountdown';
import MinisterTimer from './components/MinisterTimer';
import ServerAge from './components/ServerAge';
import EventsPanel from './components/EventsPanel';
import TaskBoard from './components/TaskBoard';
import SettingsPanel from './components/SettingsPanel';
import BaseCamp from './components/BaseCamp';
import './App.css';

export default function App() {
  const [tab, setTab] = useState('today');
  const [commanderName] = useLocalStorage('commanderName', 'Commander');
  const [showSettings, setShowSettings] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [dayStr, setDayStr] = useState('');
  const { coins, earn } = useCoins();
  const [camp] = useLocalStorage('camp', null);

  // Location-aware theme
  const locationId = camp?.locationId || null;

  useEffect(() => {
    const h = new Date().getUTCHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    setDayStr(days[new Date().getDay()]);
  }, []);

  const handleTasksAdded = (tasks) => setPendingTasks(prev => [...prev, ...tasks]);

  const handleTaskComplete = (task) => {
    const base = task.type === 'event' ? COIN_REWARDS.eventTask : COIN_REWARDS.personalTask;
    const bonus = task.starred ? COIN_REWARDS.starredBonus : 0;
    earn(base + bonus, `${task.text}`);
  };

  const handleAllDone = () => earn(COIN_REWARDS.allDoneBonus, 'All done for the day!');

  return (
    <div className="app" data-loc={locationId || undefined}>
      <div className="app-bg" />
      <div className="app-inner">

        <header className="app-header">
          <div className="header-left">
            <div className="header-badge">CC</div>
            <div>
              <div className="header-eyebrow">State 3543</div>
              <div className="header-title">Command Center</div>
            </div>
          </div>
          <div className="header-right">
            <div className="coin-display">🪙 {coins}</div>
            <button className="settings-btn" onClick={() => setShowSettings(true)}>⚙</button>
          </div>
        </header>

        {tab === 'today' && (
          <>
            <div className="greeting-section">
              <div className="greeting-day">{dayStr}</div>
              <div className="greeting-text">
                {greeting}, <span className="greeting-name">{commanderName}.</span>
              </div>
            </div>
            <UtcCountdown />
            <MinisterTimer />
            <EventsPanel onTasksAdded={handleTasksAdded} />
          </>
        )}

        {tab === 'ichooseto' && (
          <>
            <div className="tab-heading-section">
              <div className="tab-heading">I choose to.</div>
              <div className="tab-heading-sub">One thing at a time. That's enough.</div>
            </div>
            <ServerAge />
            <TaskBoard
              externalTasks={pendingTasks}
              onTaskComplete={handleTaskComplete}
              onAllDone={handleAllDone}
            />
          </>
        )}

        {tab === 'camp' && <BaseCamp />}

      </div>

      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>
          <span className="nav-icon">☀️</span>
          <span>Today</span>
        </button>
        <button className={`nav-btn ${tab === 'ichooseto' ? 'active' : ''}`} onClick={() => setTab('ichooseto')}>
          <span className="nav-icon">✦</span>
          <span>I choose to</span>
        </button>
        <button className={`nav-btn ${tab === 'camp' ? 'active' : ''}`} onClick={() => setTab('camp')}>
          <span className="nav-icon">🌿</span>
          <span>My camp</span>
        </button>
      </nav>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}
