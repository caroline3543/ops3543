// src/components/Backpack.jsx
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ResourceIcon, RESOURCE_ICONS } from './ResourceIcons';

const DEFAULT_RESOURCES = [
  { id: 'fire_crystals',         name: 'Fire Crystals',          category: 'crystals',  priority: 1 },
  { id: 'refined_fire_crystals', name: 'Refined Fire Crystals',  category: 'crystals',  priority: 2 },
  { id: 'fire_shards',           name: 'Fire Shards',            category: 'crystals',  priority: 3 },
  { id: 'essence_stones',        name: 'Essence Stones',         category: 'materials', priority: 4 },
  { id: 'gems',                  name: 'Gems',                   category: 'currency',  priority: 5 },
  { id: 'hero_shards',           name: 'General Hero Shards',    category: 'heroes',    priority: 6 },
  { id: 'common_wild_marks',     name: 'Common Wild Marks',      category: 'heroes',    priority: 7 },
  { id: 'advanced_wild_marks',   name: 'Advanced Wild Marks',    category: 'heroes',    priority: 8 },
  { id: 'chief_gear',            name: 'Chief Gear Materials',   category: 'gear',      priority: 9 },
  { id: 'chief_charm',           name: 'Chief Charm Materials',  category: 'gear',      priority: 10 },
  { id: 'design_plans',          name: 'Design Plans',           category: 'gear',      priority: 11 },
  { id: 'alloy',                 name: 'Alloy',                  category: 'gear',      priority: 12 },
  { id: 'polishing_solution',    name: 'Polishing Solution',     category: 'gear',      priority: 13 },
  { id: 'manuals',               name: 'Manuals',                category: 'gear',      priority: 14 },
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

function defaultData(res) {
  return {
    current: 0, target: 0, targetDate: '',
    pinned: false, snapshots: [], dailyGoal: 0,
  };
}

function calcProjection(data) {
  if (!data.snapshots || data.snapshots.length < 2) return null;
  const sorted = [...data.snapshots].sort((a,b)=>a.date-b.date);
  const first = sorted[0], last = sorted[sorted.length-1];
  const daysDiff = (last.date - first.date) / (1000*60*60*24);
  if (daysDiff <= 0) return null;
  const dailyRate = (last.amount - first.amount) / daysDiff;
  if (dailyRate <= 0) return null;
  const remaining = (data.target || 0) - (data.current || 0);
  if (remaining <= 0) return { daysLeft: 0, dailyRate, eta: 'Done!' };
  const daysLeft = Math.ceil(remaining / dailyRate);
  const eta = new Date(Date.now() + daysLeft * 86400000);
  return {
    daysLeft,
    dailyRate: Math.round(dailyRate),
    eta: eta.toLocaleDateString('en-NZ', { month:'short', day:'numeric' }),
  };
}

function MiniSparkline({ snapshots = [], target = 0 }) {
  if (snapshots.length < 2) return null;
  const sorted = [...snapshots].sort((a,b)=>a.date-b.date);
  const values = sorted.map(s=>s.amount);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, target || values[values.length-1]*1.2, 1);
  const w = 60, h = 24;
  const pts = values.map((v,i) => {
    const x = (i/(values.length-1))*w;
    const y = h - ((v-min)/(max-min))*h;
    return `${x},${y}`;
  }).join(' ');
  const targetY = h - ((target-min)/(max-min))*h;

  return (
    <svg width={w} height={h} style={{ overflow:'visible' }}>
      {target > 0 && (
        <line x1="0" y1={targetY} x2={w} y2={targetY}
          stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5"/>
      )}
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]} r="2" fill="var(--accent)"/>
    </svg>
  );
}

export default function Backpack() {
  const [resourceData, setResourceData] = useLocalStorage('backpack_resources_v2', {});
  const [customResources, setCustomResources] = useLocalStorage('backpack_custom', []);
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name:'', category:'custom' });
  const [snapshotInput, setSnapshotInput] = useState({});

  const allResources = [
    ...DEFAULT_RESOURCES,
    ...customResources.map(r=>({...r, priority:999})),
  ];

  const filtered = allResources.filter(r=>category==='all'||r.category===category);

  const getData = (id) => resourceData[id] || defaultData();

  const updateData = (id, updates) => {
    setResourceData(prev => ({
      ...prev,
      [id]: { ...(prev[id] || defaultData()), ...updates },
    }));
  };

  const addSnapshot = (id) => {
    const val = parseInt(snapshotInput[id]);
    if (isNaN(val)) return;
    const data = getData(id);
    const newSnap = { date: Date.now(), amount: val };
    updateData(id, {
      current: val,
      snapshots: [...(data.snapshots||[]).slice(-9), newSnap],
    });
    setSnapshotInput(prev=>({...prev,[id]:''}));
  };

  const togglePin = (id) => updateData(id, { pinned: !getData(id).pinned });

  const addCustomResource = () => {
    if (!customForm.name.trim()) return;
    const newRes = { id: `custom_${Date.now()}`, name: customForm.name.trim(), category: 'custom', priority: 999 };
    setCustomResources(prev=>[...prev,newRes]);
    setCustomForm({ name:'', category:'custom' });
    setShowAddCustom(false);
  };

  const deleteCustom = (id) => {
    setCustomResources(prev=>prev.filter(r=>r.id!==id));
    setResourceData(prev=>{ const n={...prev}; delete n[id]; return n; });
  };

  // Summary stats
  const withTargets = allResources.filter(r=>getData(r.id).target>0);
  const onTrack = withTargets.filter(r=>{
    const proj = calcProjection(getData(r.id));
    if (!proj) return false;
    const data = getData(r.id);
    if (!data.targetDate) return true;
    const target = new Date(data.targetDate).getTime();
    return Date.now() + proj.daysLeft*86400000 <= target;
  });
  const behind = withTargets.length - onTrack.length;

  const pinnedResources = filtered.filter(r=>getData(r.id).pinned);
  const unpinnedResources = filtered.filter(r=>!getData(r.id).pinned);
  const displayResources = [...pinnedResources, ...unpinnedResources];

  const ResourceRow = ({ resource }) => {
    const data = getData(resource.id);
    const pct = data.target>0 ? Math.min(100,Math.round((data.current/data.target)*100)) : null;
    const proj = calcProjection(data);
    const isExpanded = expandedId===resource.id;
    const isCustom = resource.category==='custom';

    return (
      <div className={`resource-row ${data.pinned?'resource-pinned':''} ${isExpanded?'resource-row-expanded':''}`}>
        <div className="resource-row-main" onClick={()=>setExpandedId(isExpanded?null:resource.id)}>
          {/* Icon */}
          <div className="resource-icon-wrap">
            <ResourceIcon resourceId={resource.id} size={32}/>
          </div>

          {/* Name + progress */}
          <div className="resource-row-info">
            <div className="resource-row-name">{resource.name}</div>
            {data.target>0 ? (
              <div className="resource-row-progress-wrap">
                <div className="resource-mini-track">
                  <div className="resource-mini-fill" style={{width:`${pct}%`}}/>
                </div>
                <span className="resource-row-pct">{pct}%</span>
              </div>
            ) : (
              <div className="resource-row-amount">{(data.current||0).toLocaleString()}</div>
            )}
          </div>

          {/* Right side */}
          <div className="resource-row-right">
            {data.target>0 && (
              <div className="resource-row-values">
                <span className="resource-current">{(data.current||0).toLocaleString()}</span>
                <span className="resource-sep">/</span>
                <span className="resource-target-val">{data.target.toLocaleString()}</span>
              </div>
            )}
            {proj && data.target>0 && (
              <div className={`resource-eta ${proj.daysLeft===0?'eta-done':''}`}>
                {proj.daysLeft===0?'Done!':proj.eta}
              </div>
            )}
            <span className="resource-expand-arrow">{isExpanded?'▲':'▼'}</span>
          </div>
        </div>

        {/* Expanded */}
        {isExpanded && (
          <div className="resource-expanded-panel">
            {/* Snapshot input */}
            <div className="snapshot-section">
              <div className="snapshot-label">Log current amount</div>
              <div className="snapshot-row">
                <input
                  type="number"
                  className="snapshot-input"
                  placeholder="Enter amount"
                  value={snapshotInput[resource.id]||''}
                  onChange={e=>setSnapshotInput(p=>({...p,[resource.id]:e.target.value}))}
                  onKeyDown={e=>e.key==='Enter'&&addSnapshot(resource.id)}
                />
                <button className="snapshot-btn" onClick={()=>addSnapshot(resource.id)}>Log</button>
              </div>
              {data.snapshots?.length>0 && (
                <div className="snapshot-history">
                  Last: {data.snapshots[data.snapshots.length-1].amount.toLocaleString()} · {new Date(data.snapshots[data.snapshots.length-1].date).toLocaleDateString('en-NZ',{month:'short',day:'numeric'})}
                </div>
              )}
            </div>

            {/* Target + date */}
            <div className="form-row-2" style={{gap:'8px',marginBottom:'10px'}}>
              <div className="form-group">
                <label className="input-label">Target</label>
                <input type="number" className="text-input" value={data.target||''}
                  onChange={e=>updateData(resource.id,{target:Number(e.target.value)})} placeholder="0"/>
              </div>
              <div className="form-group">
                <label className="input-label">By date</label>
                <input type="date" className="text-input" value={data.targetDate||''}
                  onChange={e=>updateData(resource.id,{targetDate:e.target.value})}/>
              </div>
            </div>

            {/* Projections */}
            {proj && data.target>0 && (
              <div className="projection-card">
                <div className="projection-row">
                  <span className="proj-label">Daily gain</span>
                  <span className="proj-value">+{proj.dailyRate}/day</span>
                </div>
                <div className="projection-row">
                  <span className="proj-label">Days to target</span>
                  <span className="proj-value">{proj.daysLeft===0?'Done!':proj.daysLeft+' days'}</span>
                </div>
                <div className="projection-row">
                  <span className="proj-label">Est. completion</span>
                  <span className={`proj-value ${proj.daysLeft===0?'proj-done':''}`}>{proj.eta}</span>
                </div>
                {data.targetDate && proj.daysLeft>0 && (
                  <div className="projection-row">
                    <span className="proj-label">Status</span>
                    <span className={`proj-value ${Date.now()+proj.daysLeft*86400000<=new Date(data.targetDate).getTime()?'proj-on-track':'proj-behind'}`}>
                      {Date.now()+proj.daysLeft*86400000<=new Date(data.targetDate).getTime()?'✓ On track':'⚠ Behind'}
                    </span>
                  </div>
                )}
                {/* Sparkline */}
                {data.snapshots?.length>=2 && (
                  <div className="sparkline-wrap">
                    <MiniSparkline snapshots={data.snapshots} target={data.target}/>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="resource-actions-row">
              <button className="resource-action-btn" onClick={()=>togglePin(resource.id)}>
                {data.pinned?'📌 Unpin':'📍 Pin to top'}
              </button>
              {isCustom && (
                <button className="resource-action-btn danger" onClick={()=>deleteCustom(resource.id)}>Remove</button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="backpack-wrap">
      {/* Summary strip */}
      {withTargets.length>0 && (
        <div className="backpack-summary">
          <div className="summary-stat">
            <div className="summary-num">{withTargets.length}</div>
            <div className="summary-lbl">Tracked</div>
          </div>
          <div className="summary-divider"/>
          <div className="summary-stat">
            <div className="summary-num" style={{color:'var(--sage)'}}>{onTrack.length}</div>
            <div className="summary-lbl">On track</div>
          </div>
          <div className="summary-divider"/>
          <div className="summary-stat">
            <div className="summary-num" style={{color:behind>0?'var(--rose)':'var(--text3)'}}>{behind}</div>
            <div className="summary-lbl">Behind</div>
          </div>
        </div>
      )}

      {/* Category chips */}
      <div className="chip-row" style={{padding:'0 14px 0',marginBottom:'4px'}}>
        {CATEGORIES.map(c=>(
          <button key={c.id} className={`chip chip-sm ${category===c.id?'active':''}`}
            onClick={()=>setCategory(c.id)}>{c.label}</button>
        ))}
      </div>

      {/* Resource list */}
      <div className="resource-list-compact">
        {displayResources.map(r=><ResourceRow key={r.id} resource={r}/>)}
      </div>

      {/* Add custom */}
      {showAddCustom ? (
        <div className="resource-row" style={{margin:'8px 14px',padding:'12px'}}>
          <input autoFocus className="text-input" value={customForm.name}
            onChange={e=>setCustomForm(f=>({...f,name:e.target.value}))}
            onKeyDown={e=>e.key==='Enter'&&addCustomResource()}
            placeholder="Resource name" style={{marginBottom:'8px'}}/>
          <div className="form-row">
            <button className="btn-primary" onClick={addCustomResource}>Add</button>
            <button className="btn-ghost" onClick={()=>setShowAddCustom(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="add-resource-btn" onClick={()=>setShowAddCustom(true)}>
          + Add custom resource
        </button>
      )}
    </div>
  );
}
