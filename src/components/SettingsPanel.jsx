// src/components/SettingsPanel.jsx
import { useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function SettingsPanel({ onClose, soundEnabled, setSoundEnabled, hapticsEnabled, setHapticsEnabled }) {
  const [commanderName, setCommanderName] = useLocalStorage('commanderName', 'Commander');
  const [milestoneCount, setMilestoneCount] = useLocalStorage('milestoneShowCount', 3);
  const [nameInput, setNameInput] = useState(commanderName);
  const [importStatus, setImportStatus] = useState('');
  const fileRef = useRef();

  const saveSettings = () => { setCommanderName(nameInput); onClose(); };

  const exportData = () => {
    const keys = ['commanderName', 'tasks', 'events', 'ministerSession', 'milestoneShowCount', 'coins', 'camp', 'backpack_resources', 'library_items'];
    const data = {};
    keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { data[k] = null; } });
    data._exported = new Date().toISOString();
    data._state = '3543';
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `state3543-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const keys = ['commanderName', 'tasks', 'events', 'ministerSession', 'milestoneShowCount', 'coins', 'camp', 'backpack_resources', 'library_items'];
        keys.forEach(k => { if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k])); });
        setImportStatus('✓ Restored. Reload to apply.');
      } catch { setImportStatus('✕ Invalid file.'); }
    };
    reader.readAsText(file);
  };

  const Toggle = ({ value, onChange, label, description }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <div>
        <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text)' }}>{label}</div>
        {description && <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '50px', height: '28px', borderRadius: '99px', border: 'none', cursor: 'pointer',
          background: value ? 'var(--accent)' : 'rgba(0,0,0,0.12)',
          transition: 'background 0.2s',
          position: 'relative', flexShrink: 0,
        }}
      >
        <div style={{
          width: '22px', height: '22px', borderRadius: '99px', background: '#fff',
          position: 'absolute', top: '3px',
          left: value ? '25px' : '3px',
          transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer settings-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">Settings</div>
          <button className="btn-ghost btn-small" onClick={onClose}>✕</button>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Your name</div>
          <div className="form-row">
            <input className="text-input" value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveSettings()} placeholder="Enter your name" />
            <button className="btn-primary" onClick={saveSettings}>Save</button>
          </div>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Experience</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toggle value={soundEnabled} onChange={setSoundEnabled}
              label="Sounds" description="Gentle tones when completing tasks" />
            <Toggle value={hapticsEnabled} onChange={setHapticsEnabled}
              label="Haptics" description="Subtle vibration feedback" />
          </div>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Milestones shown on card</div>
          <div className="show-more-btns">
            {[1, 2, 3, 5].map(n => (
              <button key={n} className={`show-btn ${milestoneCount === n ? 'active' : ''}`}
                onClick={() => setMilestoneCount(n)}>{n}</button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Data</div>
          <p className="settings-note">Export your data as a backup. Re-import to restore everything.</p>
          <div className="form-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <button className="btn-primary" onClick={exportData}>⬇ Export</button>
            <button className="btn-ghost" onClick={() => fileRef.current?.click()}>⬆ Import</button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
          </div>
          {importStatus && (
            <div className={`import-status ${importStatus.startsWith('✓') ? 'success' : 'error'}`}>
              {importStatus}
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Reset</div>
          <button className="btn-ghost danger" onClick={() => {
            if (window.confirm('Clear all tasks and events?')) {
              localStorage.removeItem('tasks');
              localStorage.removeItem('events');
              window.location.reload();
            }
          }}>Clear tasks & events</button>
        </div>
      </div>
    </div>
  );
}
