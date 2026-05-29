// src/components/BackpackTab.jsx
// Phase 1 — resource tracker foundation
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_RESOURCES = [
  { id: 'fire_crystals',         name: 'Fire Crystals',          emoji: '💎', current: 0, target: 0, category: 'crystals' },
  { id: 'refined_fire_crystals', name: 'Refined Fire Crystals',  emoji: '🔷', current: 0, target: 0, category: 'crystals' },
  { id: 'fire_shards',           name: 'Fire Shards',            emoji: '🔥', current: 0, target: 0, category: 'crystals' },
  { id: 'essence_stones',        name: 'Essence Stones',         emoji: '🪨', current: 0, target: 0, category: 'materials' },
  { id: 'gems',                  name: 'Gems',                   emoji: '💠', current: 0, target: 0, category: 'currency' },
  { id: 'hero_shards',           name: 'General Hero Shards',    emoji: '⚔️', current: 0, target: 0, category: 'heroes' },
  { id: 'common_wild_marks',     name: 'Common Wild Marks',      emoji: '🏹', current: 0, target: 0, category: 'heroes' },
  { id: 'advanced_wild_marks',   name: 'Advanced Wild Marks',    emoji: '🎯', current: 0, target: 0, category: 'heroes' },
  { id: 'gear_materials',        name: 'Chief Gear Materials',   emoji: '🛡️', current: 0, target: 0, category: 'gear' },
  { id: 'charm_materials',       name: 'Chief Charm Materials',  emoji: '✨', current: 0, target: 0, category: 'gear' },
  { id: 'design_plans',          name: 'Design Plans',           emoji: '📐', current: 0, target: 0, category: 'gear' },
  { id: 'manuals',               name: 'Manuals',                emoji: '📖', current: 0, target: 0, category: 'materials' },
];

function ResourceCard({ resource, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [vals, setVals] = useState({ current: resource.current, target: resource.target });

  const pct = resource.target > 0 ? Math.min(100, (resource.current / resource.target) * 100) : 0;

  const save = () => {
    onUpdate({ ...resource, current: Number(vals.current) || 0, target: Number(vals.target) || 0 });
    setEditing(false);
  };

  return (
    <div className="bp-card">
      <div className="bp-card-top">
        <span className="bp-emoji">{resource.emoji}</span>
        <div className="bp-info">
          <div className="bp-name">{resource.name}</div>
          {resource.target > 0 && (
            <div className="bp-progress-row">
              <div className="bp-progress-track">
                <div className="bp-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="bp-pct">{Math.round(pct)}%</span>
            </div>
          )}
        </div>
        <button className="bp-edit-btn" onClick={() => setEditing(!editing)}>
          {editing ? '✓' : '✎'}
        </button>
      </div>

      {!editing ? (
        <div className="bp-amounts">
          <div className="bp-amount-block">
            <div className="bp-amount-num">{resource.current.toLocaleString()}</div>
            <div className="bp-amount-label">Current</div>
          </div>
          {resource.target > 0 && (
            <div className="bp-amount-block">
              <div className="bp-amount-num">{resource.target.toLocaleString()}</div>
              <div className="bp-amount-label">Target</div>
            </div>
          )}
          {resource.target > 0 && (
            <div className="bp-amount-block">
              <div className="bp-amount-num" style={{ color: resource.current >= resource.target ? 'var(--sage)' : 'var(--warm)' }}>
                {resource.current >= resource.target ? '✓' : (resource.target - resource.current).toLocaleString()}
              </div>
              <div className="bp-amount-label">
                {resource.current >= resource.target ? 'Done!' : 'To go'}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bp-edit-form">
          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label">Current</label>
              <input className="text-input" type="number" value={vals.current}
                onChange={e => setVals(v => ({ ...v, current: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && save()} />
            </div>
            <div className="form-group">
              <label className="input-label">Target</label>
              <input className="text-input" type="number" value={vals.target}
                onChange={e => setVals(v => ({ ...v, target: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && save()} />
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '8px' }}>
            <button className="btn-primary" onClick={save}>Save</button>
            {resource.custom && (
              <button className="btn-ghost danger" onClick={() => onDelete(resource.id)}>Remove</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BackpackTab() {
  const [resources, setResources] = useLocalStorage('resources', DEFAULT_RESOURCES);
  const [showAdd, setShowAdd] = useState(false);
  const [newRes, setNewRes] = useState({ name: '', emoji: '📦', current: 0, target: 0 });
  const [filter, setFilter] = useState('all');

  const CATEGORIES = ['all', 'crystals', 'heroes', 'gear', 'currency', 'materials', 'custom'];

  const addResource = () => {
    if (!newRes.name.trim()) return;
    setResources(prev => [...prev, {
      id: Date.now().toString(),
      name: newRes.name.trim(),
      emoji: newRes.emoji || '📦',
      current: Number(newRes.current) || 0,
      target: Number(newRes.target) || 0,
      category: 'custom',
      custom: true,
    }]);
    setNewRes({ name: '', emoji: '📦', current: 0, target: 0 });
    setShowAdd(false);
  };

  const updateResource = (updated) => {
    setResources(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const deleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter);

  const totalProgress = resources.filter(r => r.target > 0);
  const doneCount = totalProgress.filter(r => r.current >= r.target).length;

  return (
    <div className="backpack-tab">
      <div className="tab-page-header">
        <div>
          <div className="tab-page-eyebrow">Progression</div>
          <div className="tab-page-title">Backpack</div>
        </div>
        <button className="btn-icon" onClick={() => setShowAdd(!showAdd)}>+</button>
      </div>

      {totalProgress.length > 0 && (
        <div className="bp-summary-card">
          <div className="bp-summary-text">
            {doneCount === totalProgress.length
              ? `All ${totalProgress.length} goals reached! 🎉`
              : `${doneCount} of ${totalProgress.length} goals reached`}
          </div>
          <div className="bp-summary-bar">
            <div className="bp-progress-fill" style={{ width: `${(doneCount / totalProgress.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="filter-scroll-row">
        {CATEGORIES.map(c => (
          <button key={c} className={`view-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="add-event-card">
          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label">Emoji</label>
              <input className="text-input" value={newRes.emoji} onChange={e => setNewRes(v => ({ ...v, emoji: e.target.value }))} style={{ textAlign: 'center', fontSize: '20px' }} maxLength={2} />
            </div>
            <div className="form-group">
              <label className="input-label">Resource name</label>
              <input className="text-input" value={newRes.name} onChange={e => setNewRes(v => ({ ...v, name: e.target.value }))} placeholder="e.g. Widget: Lynn" />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label">Current amount</label>
              <input className="text-input" type="number" value={newRes.current} onChange={e => setNewRes(v => ({ ...v, current: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="input-label">Target amount</label>
              <input className="text-input" type="number" value={newRes.target} onChange={e => setNewRes(v => ({ ...v, target: e.target.value }))} />
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '8px' }}>
            <button className="btn-primary" onClick={addResource}>Add resource</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="bp-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎒</div>
            <div className="empty-text">Nothing here yet.</div>
            <div className="empty-sub">Tap + to track a resource.</div>
          </div>
        )}
        {filtered.map(r => (
          <ResourceCard key={r.id} resource={r} onUpdate={updateResource} onDelete={deleteResource} />
        ))}
      </div>
    </div>
  );
}
