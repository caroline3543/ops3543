// src/components/SettingsPanel.jsx
import { useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function SettingsPanel({ onClose }) {
  const [commanderName, setCommanderName] = useLocalStorage('commanderName', 'Commander');
  const [milestoneCount, setMilestoneCount] = useLocalStorage('milestoneShowCount', 3);
  const [nameInput, setNameInput] = useState(commanderName);
  const [importStatus, setImportStatus] = useState('');
  const fileRef = useRef();

  const saveSettings = () => {
    setCommanderName(nameInput);
    onClose();
  };

  const exportData = () => {
    const keys = ['commanderName', 'tasks', 'events', 'ministerSession', 'milestoneShowCount'];
    const data = {};
    keys.forEach(k => {
      try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { data[k] = null; }
    });
    data._exported = new Date().toISOString();
    data._state = '3543';

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `state3543-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
        const keys = ['commanderName', 'tasks', 'events', 'ministerSession', 'milestoneShowCount'];
        keys.forEach(k => {
          if (data[k] !== undefined) {
            localStorage.setItem(k, JSON.stringify(data[k]));
          }
        });
        setImportStatus('✓ Data restored. Reload to apply.');
      } catch {
        setImportStatus('✕ Invalid file. Please use a valid backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer settings-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">Settings</div>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Commander Name</div>
          <div className="form-row">
            <input
              className="text-input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveSettings()}
              placeholder="Enter your name"
            />
            <button className="btn-primary" onClick={saveSettings}>Save</button>
          </div>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Milestone Display</div>
          <div className="form-group">
            <label className="input-label">Show next N milestones in drawer</label>
            <div className="show-more-btns">
              {[1, 3, 5, 10].map(n => (
                <button
                  key={n}
                  className={`show-btn ${milestoneCount === n ? 'active' : ''}`}
                  onClick={() => setMilestoneCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Data Management</div>
          <p className="settings-note">
            Export your tasks, events, and settings as a JSON file. Re-import to restore, or send to your dev to hardcode as defaults.
          </p>
          <div className="form-row" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={exportData}>⬇ Export Backup</button>
            <button className="btn-ghost" onClick={() => fileRef.current?.click()}>⬆ Import Backup</button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
          </div>
          {importStatus && (
            <div className={`import-status ${importStatus.startsWith('✓') ? 'success' : 'error'}`}>
              {importStatus}
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="drawer-section-label">Danger Zone</div>
          <button className="btn-ghost danger" onClick={() => {
            if (window.confirm('Clear all tasks and events? This cannot be undone.')) {
              localStorage.removeItem('tasks');
              localStorage.removeItem('events');
              window.location.reload();
            }
          }}>
            Clear All Tasks & Events
          </button>
        </div>
      </div>
    </div>
  );
}
