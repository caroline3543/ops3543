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
import Backpack from './components/Backpack';
import Library from './components/Library';
import './App.css';

const TABS = [
  { id: 'ichooseto', icon: '🌿', label: 'I choose to' },
  { id: 'events',    icon: '📅', label: 'Events' },
  { id: 'backpack',  icon: '🎒', label: 'Backpack' },
  { id: 'library',   icon: '📚', label: 'Library' },
  { id: 'camp',      icon: '🏕️', label: 'My camp' },
];

export default function App() {
  const [tab, setTab] = useState('ichooseto');
  const [commanderName] = useLocalStorage('commanderName', 'Commander');
  const [showSettings, setShowSettings] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [dayStr, setDayStr] = useState('');
  const { coins, earn } = useCoins();
  const [camp] = useLocalStorage('camp', null);
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
    earn(base + bonus, task.text);
  };
  const handleAllDone = () => earn(COIN_REWARDS.allDoneBonus, 'All done for the day!');

  return (
    <div className="app" data-loc={locationId || undefined}>
      <div className="app-bg" />
      <div className="app-inner">

        {/* Header — only shown on I Choose To tab */}
        {tab === 'ichooseto' && (
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
        )}

        {/* Minimal header for other tabs */}
        {tab !== 'ichooseto' && (
          <header className="app-header app-header-minimal">
            <div className="header-tab-title">
              {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
            </div>
            <div className="header-right">
              <div className="coin-display">🪙 {coins}</div>
              <button className="settings-btn" onClick={() => setShowSettings(true)}>⚙</button>
            </div>
          </header>
        )}

        {/* ── TAB: I CHOOSE TO ── */}
        {tab === 'ichooseto' && (
          <>
            <div className="greeting-section">
              <div className="greeting-day">{dayStr}</div>
              <div className="greeting-text">
                {greeting}, <span className="greeting-name">{commanderName}.</span>
              </div>
            </div>

            {/* Server info strip */}
            <div className="info-strip">
              <ServerAge compact />
              <UtcCountdown compact />
            </div>

            <MinisterTimer />

            <div className="choose-to-heading">
              <div className="choose-to-title">I choose to…</div>
              <div className="choose-to-sub">What do I want to accomplish today?</div>
            </div>

            <TaskBoard
              externalTasks={pendingTasks}
              onTaskComplete={handleTaskComplete}
              onAllDone={handleAllDone}
            />

            {/* Today's events summary */}
            <div className="events-summary-heading">
              <div className="section-label">TODAY'S ADVENTURES</div>
            </div>
            <EventsPanel onTasksAdded={handleTasksAdded} compact />
          </>
        )}

        {/* ── TAB: EVENTS ── */}
        {tab === 'events' && (
          <EventsPanel onTasksAdded={handleTasksAdded} fullPage />
        )}

        {/* ── TAB: BACKPACK ── */}
        {tab === 'backpack' && <Backpack />}

        {/* ── TAB: LIBRARY ── */}
        {tab === 'library' && <Library />}

        {/* ── TAB: MY CAMP ── */}
        {tab === 'camp' && <BaseCamp />}

      </div>

      {/* Scrollable bottom nav */}
      <nav className="bottom-nav">
        <div className="nav-scroll">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}
