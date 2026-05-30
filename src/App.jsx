// src/App.jsx
import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCoins, COIN_REWARDS } from './hooks/useCoins';
import { useSounds } from './hooks/useSounds';
import { useHaptics } from './hooks/useHaptics';
import UtcCountdown from './components/UtcCountdown';
import MinisterTimer from './components/MinisterTimer';
import ServerAge from './components/ServerAge';
import EventsPanel from './components/EventsPanel';
import TaskBoard from './components/TaskBoard';
import SettingsPanel from './components/SettingsPanel';
import BaseCamp from './components/BaseCamp';
import Backpack from './components/Backpack';
import Library from './components/Library';
import LocationAccent from './components/LocationAccent';
import { CherryBlossoms } from './components/CampAnimations';
import './App.css';

const TABS = [
  { id: 'ichooseto', icon: '🌿', label: 'I choose to' },
  { id: 'events',    icon: '📅', label: 'Events' },
  { id: 'backpack',  icon: '🎒', label: 'Backpack' },
  { id: 'library',   icon: '📚', label: 'Library' },
  { id: 'camp',      icon: '🏕️',  label: 'My camp' },
];

export default function App() {
  const [tab, setTab] = useState('ichooseto');
  const [commanderName] = useLocalStorage('commanderName', 'Commander');
  const [showSettings, setShowSettings] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [dayStr, setDayStr] = useState('');
  const { coins, earn } = useCoins();
  const { play, playChord, soundEnabled, setSoundEnabled } = useSounds();
  const { haptic, hapticsEnabled, setHapticsEnabled } = useHaptics();
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

  const handleTabChange = (newTab) => {
    play('tabSwitch');
    haptic('light');
    setTab(newTab);
  };

  const handleTasksAdded = (tasks) => setPendingTasks(prev => [...prev, ...tasks]);

  const handleTaskComplete = (task) => {
    const base = task.type === 'event' ? COIN_REWARDS.eventTask : COIN_REWARDS.personalTask;
    const bonus = task.starred ? COIN_REWARDS.starredBonus : 0;
    earn(base + bonus, task.text);
    play('taskComplete');
    setTimeout(() => play('coinEarned'), 120);
    haptic('success');
  };

  const handleAllDone = () => {
    earn(COIN_REWARDS.allDoneBonus, 'All done for the day!');
    playChord();
    haptic('success');
  };

  const currentTab = TABS.find(t => t.id === tab);

  return (
    <div className="app" data-loc={locationId || undefined}>
      <div className="app-bg" />
      <LocationAccent locationId={locationId} />
      {/* Japan cherry blossoms ambient */}
      {locationId === 'japan' && <CherryBlossoms count={7} />}

      <div className="app-inner">

        {/* Header */}
        {tab === 'ichooseto' ? (
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
              <button className="settings-btn" onClick={() => { haptic('light'); setShowSettings(true); }}>⚙</button>
            </div>
          </header>
        ) : (
          <header className="app-header app-header-minimal">
            <div className="header-tab-title">{currentTab?.icon} {currentTab?.label}</div>
            <div className="header-right">
              <div className="coin-display">🪙 {coins}</div>
              <button className="settings-btn" onClick={() => { haptic('light'); setShowSettings(true); }}>⚙</button>
            </div>
          </header>
        )}

        {/* ── TAB 1: I CHOOSE TO ── */}
        {tab === 'ichooseto' && (
          <>
            {/* 1. Greeting */}
            <div className="greeting-section">
              <div className="greeting-day">{dayStr}</div>
              <div className="greeting-text">
                {greeting}, <span className="greeting-name">{commanderName}.</span>
              </div>
            </div>

            {/* Server + UTC strip */}
            <div className="info-strip">
              <ServerAge compact />
              <UtcCountdown compact />
            </div>

            {/* 2. Minister Position */}
            <MinisterTimer play={play} haptic={haptic} />

            {/* 3. Today's Adventures */}
            <div className="section-heading-pad">
              <div className="section-label">TODAY'S ADVENTURES</div>
            </div>
            <EventsPanel onTasksAdded={handleTasksAdded} />

            {/* 4. Daily tasks */}
            <div className="choose-to-heading">
              <div className="choose-to-title">I choose to…</div>
              <div className="choose-to-sub">What do I want to accomplish today?</div>
            </div>
            <TaskBoard
              externalTasks={pendingTasks}
              onTaskComplete={handleTaskComplete}
              onAllDone={handleAllDone}
              haptic={haptic}
            />
          </>
        )}

        {tab === 'events'   && <EventsPanel onTasksAdded={handleTasksAdded} fullPage />}
        {tab === 'backpack' && <Backpack />}
        {tab === 'library'  && <Library />}
        {tab === 'camp'     && <BaseCamp />}

      </div>

      <nav className="bottom-nav">
        <div className="nav-scroll">
          {TABS.map(t => (
            <button key={t.id}
              className={`nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => handleTabChange(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          hapticsEnabled={hapticsEnabled}
          setHapticsEnabled={setHapticsEnabled}
        />
      )}
    </div>
  );
}
