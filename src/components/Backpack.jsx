// src/components/Backpack.jsx
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_RESOURCES = [
  { id: 'fire_crystals',         name: 'Fire Crystals',          emoji: '🔥', category: 'crystals' },
  { id: 'refined_fire_crystals', name: 'Refined Fire Crystals',  emoji: '💎', category: 'crystals' },
  { id: 'fire_shards',           name: 'Fire Shards',            emoji: '✨', category: 'crystals' },
  { id: 'essence_stones',        name: 'Essence Stones',         emoji: '🪨', category: 'materials' },
  { id: 'gems',                  name: 'Gems',                   emoji: '💍', category: 'currency' },
  { id: 'hero_shards',           name: 'General Hero Shards',    emoji: '⚔️', category: 'heroes' },
  { id: 'common_wild_marks',     name: 'Common Wild Marks',      emoji: '🐾', category: 'heroes' },
  { id: 'advanced_wild_marks',   name: 'Advanced Wild Marks',    emoji: '🦁', category: 'heroes' },
  { id: 'chief_gear',            name: 'Chief Gear Materials',   emoji: '🛡️', category: 'gear' },
  { id: 'chief_charm',           name: 'Chief Charm Materials',  emoji: '🧿', category: 'gear' },
  { id: 'design_plans',          name: 'Design Plans',           emoji: '📐', category: 'gear' },
  { id: 'manuals',               name: 'Manuals',                emoji: '📖', category: 'gear' },
];

const CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'crystals',  label: 'Crystals' },
  { id: 'heroes',    label: 'Heroes' },
  { id: 'gear',      label: 'Gear' },
  { id: 'currency',  label: 'Currency' },
  { id: 'materials', label: 'Materials' },
  { id: 'custom',    label: 'Custom' },
];

export default function Backpack() {
  const [resources, setResources] = useLocalStorage('backpack_resources', DEFAULT_RESOURCES.map(r => ({ ...r, current: 0, target: 0, targetDate: '' })));
  const [category, setCategory] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name: '', emoji: '📦', category: 'custom' });

  const filtered = resources.filter(r => category === 'all' || r.category === category);

  const updateResource = (id, field, value) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addCustom = () => {
    if (!customForm.name.trim()) return;
    const newRes = {
      id: `custom_${Date.now()}`,
      name: customForm.name.trim(),
      emoji: customForm.emoji,
      category: 'custom',
      current: 0,
      target: 0,
      targetDate: '',
    };
    setResources(prev => [...prev, newRes]);
    setCustomForm({ name: '', emoji: '📦', category: 'custom' });
    setShowAddCustom(false);
  };

  const deleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const getProgress = (r) => {
    if (!r.target || r.target === 0) return 0;
    return Math.min(100, Math.round((r.current / r.target) * 100));
  };

  return (
    <div className="backpack-wrap">
      <div className="page-header">
        <div className="page-title">Backpack</div>
        <div className="page-subtitle">Your progression at a glance</div>
      </div>

      {/* Category filter */}
      <div className="chip-row">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`chip ${category === c.id ? 'active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Resource cards */}
      <div className="resource-list">
        {filtered.map(r => {
          const pct = getProgress(r);
          const isEditing = editingId === r.id;
          return (
            <div key={r.id} className={`resource-card ${isEditing ? 'resource-editing' : ''}`}>
              <div className="resource-top">
                <div className="resource-emoji">{r.emoji}</div>
                <div className="resource-info">
                  <div className="resource-name">{r.name}</div>
                  {r.target > 0 && (
                    <div className="resource-target-label">
                      {r.current.toLocaleString()} / {r.target.toLocaleString()}
                      {r.targetDate && <span className="resource-date"> · {r.targetDate}</span>}
                    </div>
                  )}
                  {r.target === 0 && (
                    <div className="resource-amount-large">{(r.current || 0).toLocaleString()}</div>
                  )}
                </div>
                <button
                  className="resource-edit-btn"
                  onClick={() => setEditingId(isEditing ? null : r.id)}
                >
                  {isEditing ? '✓' : '✎'}
                </button>
              </div>

              {r.target > 0 && (
                <div className="resource-progress-wrap">
                  <div className="progress-track">
                    <div
                      className="progress-fill resource-progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="resource-pct">{pct}%</div>
                </div>
              )}

              {isEditing && (
                <div className="resource-edit-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="input-label">Current</label>
                      <input
                        type="number"
                        className="text-input"
                        value={r.current || ''}
                        onChange={e => updateResource(r.id, 'current', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="form-group">
                      <label className="input-label">Target</label>
                      <input
                        type="number"
                        className="text-input"
                        value={r.target || ''}
                        onChange={e => updateResource(r.id, 'target', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Target date (optional)</label>
                    <input
                      type="date"
                      className="text-input"
                      value={r.targetDate || ''}
                      onChange={e => updateResource(r.id, 'targetDate', e.target.value)}
                    />
                  </div>
                  {r.category === 'custom' && (
                    <button
                      className="btn-ghost danger btn-small"
                      onClick={() => deleteResource(r.id)}
                    >
                      Remove resource
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add custom */}
      {showAddCustom ? (
        <div className="resource-card" style={{ marginTop: '12px' }}>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="input-label">Resource name</label>
            <input
              autoFocus
              className="text-input"
              value={customForm.name}
              onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="e.g. Widget: Lynn"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="input-label">Emoji</label>
            <input
              className="text-input"
              value={customForm.emoji}
              onChange={e => setCustomForm(f => ({ ...f, emoji: e.target.value }))}
              placeholder="📦"
              style={{ maxWidth: '80px' }}
            />
          </div>
          <div className="form-row">
            <button className="btn-primary" onClick={addCustom}>Add resource</button>
            <button className="btn-ghost" onClick={() => setShowAddCustom(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button
          className="add-resource-btn"
          onClick={() => setShowAddCustom(true)}
        >
          + Add custom resource
        </button>
      )}

      <div className="phase-note">
        📊 Trend charts and growth tracking coming in the next update.
      </div>
    </div>
  );
}
