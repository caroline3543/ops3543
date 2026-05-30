// src/components/Backpack.jsx
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ResourceIcon } from './ResourceIcons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, Scatter
} from 'recharts';

// ── Constants
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
  { id: 'all', label: 'All' },
  { id: 'crystals', label: 'Crystals' },
  { id: 'heroes', label: 'Heroes' },
  { id: 'gear', label: 'Gear' },
  { id: 'currency', label: 'Currency' },
  { id: 'materials', label: 'Materials' },
  { id: 'custom', label: 'Custom' },
];

const LOG_TYPES = [
  { id: 'gain',       label: 'Gain',        color: '#5cb896' },
  { id: 'spend',      label: 'Spend',       color: '#e8705a' },
  { id: 'eventSpend', label: 'Event Spend', color: '#f0a742' },
  { id: 'correction', label: 'Correction',  color: '#8a8a9a' },
];

// ── Helpers
function calcDailyRate(logs) {
  if (!logs || logs.length < 2) return null;
  const sorted = [...logs].filter(l => l.logType === 'gain' || l.logType === 'correction')
    .sort((a, b) => a.date - b.date);
  if (sorted.length < 2) return null;
  const first = sorted[0], last = sorted[sorted.length - 1];
  const days = (last.date - first.date) / 86400000;
  if (days <= 0) return null;
  return (last.amount - first.amount) / days;
}

function calcProjection(current, target, dailyRate) {
  if (!target || !dailyRate || dailyRate <= 0) return null;
  const remaining = target - current;
  if (remaining <= 0) return { daysLeft: 0, eta: 'Done!' };
  const daysLeft = Math.ceil(remaining / dailyRate);
  const eta = new Date(Date.now() + daysLeft * 86400000);
  return {
    daysLeft,
    eta: eta.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' }),
  };
}

function fmtNum(n) {
  if (n === null || n === undefined) return '—';
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000) return (n/1000).toFixed(1)+'k';
  return Number(n).toLocaleString();
}

function dayLabel(ts) {
  return new Date(ts).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' });
}

// ── Resource bottom sheet
function ResourceSheet({ resource, data, logs, onClose, onSave }) {
  const recentLogs = (logs || [])
    .filter(l => l.resourceId === resource.id)
    .sort((a, b) => b.date - a.date);

  // All local state — never touches global until Log/Save
  const [amountInput, setAmountInput] = useState('');
  const [logType, setLogType] = useState('gain');
  const [noteInput, setNoteInput] = useState('');
  const [targetInput, setTargetInput] = useState(data?.target ? String(data.target) : '');
  const [targetDateInput, setTargetDateInput] = useState(data?.targetDate || '');
  const [activeTab, setActiveTab] = useState('log');

  // Lock background scroll
  useEffect(() => {
    document.body.classList.add('sheet-open');
    return () => document.body.classList.remove('sheet-open');
  }, []);

  const current  = data?.current  || 0;
  const target   = data?.target   || 0;
  const pct      = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : null;
  const dailyRate = calcDailyRate(recentLogs);
  const proj      = target > 0 && dailyRate ? calcProjection(current, target, dailyRate) : null;

  const lastLog  = recentLogs[0];
  const prevLog  = recentLogs[1];
  const changeSinceLast = lastLog && prevLog ? lastLog.amount - prevLog.amount : null;

  // 7-day average
  const sevenDayLogs = recentLogs.filter(l => l.date > Date.now() - 7*86400000);
  const sevenDayAvg = sevenDayLogs.length >= 2
    ? Math.round((sevenDayLogs[0].amount - sevenDayLogs[sevenDayLogs.length-1].amount) / 7)
    : null;

  const isValidAmount = amountInput.trim().length > 0 && !isNaN(parseInt(amountInput, 10));

  const handleLog = () => {
    const amount = parseInt(amountInput.replace(/,/g, ''), 10);
    if (isNaN(amount)) return;
    const entry = {
      id: Date.now(),
      resourceId: resource.id,
      amount,
      date: Date.now(),
      note: noteInput.trim(),
      logType,
    };
    const newTarget = targetInput ? parseInt(targetInput.replace(/,/g,''), 10) : data?.target || 0;
    onSave(resource.id, {
      current: amount,
      target: newTarget,
      targetDate: targetDateInput,
    }, entry);
    setAmountInput('');
    setNoteInput('');
  };

  const handleSaveTarget = () => {
    const t = parseInt(targetInput.replace(/,/g,''), 10);
    onSave(resource.id, {
      current: data?.current || 0,
      target: isNaN(t) ? 0 : t,
      targetDate: targetDateInput,
    }, null);
  };

  // Chart data
  const chartLogs = recentLogs.slice(0, 30).reverse();
  const chartData = chartLogs.map(l => ({
    date: dayLabel(l.date),
    amount: l.amount,
    isEventSpend: l.logType === 'eventSpend',
  }));

  const combinedData = [...chartData];
  if (dailyRate && target > 0 && chartData.length > 0) {
    const lastAmount = chartData[chartData.length-1]?.amount || current;
    const daysToProject = Math.min(proj?.daysLeft || 30, 60);
    for (let i = 1; i <= daysToProject; i++) {
      const d = new Date(Date.now() + i * 86400000);
      combinedData.push({
        date: dayLabel(d.getTime()),
        projected: Math.min(target, Math.round(lastAmount + dailyRate * i)),
        target,
      });
    }
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet-panel"
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '88svh',
          maxHeight: '88svh',
          borderRadius: '20px 20px 0 0',
          background: '#262218',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* ── STICKY TOP — never scrolls ── */}
        <div
          className="sheet-sticky-top"
          style={{ flexShrink: 0, background: '#262218', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}
        >
          <div className="sheet-handle"/>

          {/* Header */}
          <div className="sheet-header">
            <div className="sheet-header-left">
              <ResourceIcon resourceId={resource.id} size={34}/>
              <div style={{ minWidth: 0 }}>
                <div className="sheet-resource-name">{resource.name}</div>
                <div className="sheet-resource-meta">
                  <span className="sheet-current">{fmtNum(current)}</span>
                  {target > 0 && <><span className="sheet-sep"> / </span><span className="sheet-target">{fmtNum(target)}</span></>}
                  {pct !== null && <span className="sheet-pct"> · {pct}%</span>}
                </div>
              </div>
            </div>
            <button className="sheet-close" onClick={onClose}>✕</button>
          </div>

          {/* Progress bar */}
          {pct !== null && (
            <div className="sheet-progress-track">
              <div className="sheet-progress-fill" style={{ width: `${pct}%` }}/>
            </div>
          )}

          {/* Summary grid */}
          <div className="sheet-summary-grid">
            {changeSinceLast !== null && (
              <div className="sheet-summary-cell">
                <div className="sheet-summary-val" style={{ color: changeSinceLast >= 0 ? 'var(--sage)' : 'var(--rose)' }}>
                  {changeSinceLast >= 0 ? '+' : ''}{fmtNum(changeSinceLast)}
                </div>
                <div className="sheet-summary-lbl">Last change</div>
              </div>
            )}
            {sevenDayAvg !== null && (
              <div className="sheet-summary-cell">
                <div className="sheet-summary-val" style={{ color: sevenDayAvg >= 0 ? 'var(--sage)' : 'var(--rose)' }}>
                  {sevenDayAvg >= 0 ? '+' : ''}{fmtNum(sevenDayAvg)}/d
                </div>
                <div className="sheet-summary-lbl">7d avg</div>
              </div>
            )}
            {proj && (
              <div className="sheet-summary-cell">
                <div className="sheet-summary-val">{proj.eta}</div>
                <div className="sheet-summary-lbl">Est. done</div>
              </div>
            )}
            {proj && proj.daysLeft > 0 && (
              <div className="sheet-summary-cell">
                <div className="sheet-summary-val">{proj.daysLeft}d</div>
                <div className="sheet-summary-lbl">Days left</div>
              </div>
            )}
            {dailyRate !== null && !proj && (
              <div className="sheet-summary-cell">
                <div className="sheet-summary-val">+{Math.round(dailyRate)}/d</div>
                <div className="sheet-summary-lbl">Daily gain</div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="sheet-tabs" style={{ margin: '0 16px 10px' }}>
            {['log','graph','history'].map(t => (
              <button key={t} className={`sheet-tab ${activeTab===t?'active':''}`}
                onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div
          className="sheet-scrollable"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
            paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 20px))',
          }}
        >

          {/* LOG TAB */}
          {activeTab === 'log' && (
            <div className="sheet-tab-content">

              {/* Log type — segmented control */}
              <div className="sheet-log-type-section">
                <div className="sheet-log-type-label">Log type</div>
                <div className="log-type-segment">
                  {LOG_TYPES.map(lt => (
                    <button key={lt.id}
                      className={`log-seg-btn ${logType===lt.id?'active':''}`}
                      style={{ '--lt-color': lt.color }}
                      onClick={() => setLogType(lt.id)}>
                      {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount — type=text, inputMode=numeric, local state only */}
              <div className="sheet-input-group">
                <label className="input-label">Current amount</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="sheet-input"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={fmtNum(current)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>

              <div className="sheet-input-group">
                <label className="input-label">Note (optional)</label>
                <input
                  type="text"
                  className="sheet-input"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder={logType === 'eventSpend' ? 'e.g. SVS, Lucky Wheel, Armament' : 'e.g. After Bear Trap'}
                  autoComplete="off"
                />
              </div>

              <button
                className="btn-primary sheet-log-btn"
                onClick={handleLog}
                disabled={!isValidAmount}
                style={{ opacity: isValidAmount ? 1 : 0.35 }}
              >
                Log amount
              </button>

              <div className="sheet-divider"/>
              <div className="sheet-input-section-label">Target</div>

              <div className="sheet-input-row">
                <div className="sheet-input-group" style={{ flex: 1 }}>
                  <label className="input-label">Target amount</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="sheet-input"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    autoComplete="off"
                  />
                </div>
                <div className="sheet-input-group" style={{ flex: 1 }}>
                  <label className="input-label">By date</label>
                  <input
                    type="date"
                    className="sheet-input"
                    value={targetDateInput}
                    onChange={e => setTargetDateInput(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-ghost sheet-save-target-btn" onClick={handleSaveTarget}>
                Save target
              </button>
            </div>
          )}

          {/* GRAPH TAB */}
          {activeTab === 'graph' && (
            <div className="sheet-tab-content">
              {chartData.length < 2 ? (
                <div className="sheet-empty">
                  Log at least 2 entries to see a chart.
                </div>
              ) : (
                <div className="sheet-chart-wrap">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={combinedData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
                      <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 9 }} tickLine={false} interval="preserveStartEnd"/>
                      <YAxis tick={{ fill: 'var(--text3)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => fmtNum(v)}/>
                      <Tooltip
                        contentStyle={{
                          background: '#1a1612', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px', fontSize: '12px', color: 'var(--text)',
                        }}
                        formatter={(v, n) => [fmtNum(v), n === 'amount' ? 'Actual' : n === 'projected' ? 'Projected' : 'Target']}
                      />
                      {target > 0 && (
                        <ReferenceLine y={target} stroke="var(--warm)" strokeDasharray="4 4"
                          label={{ value: 'Target', fill: 'var(--warm)', fontSize: 9, position: 'insideTopRight' }}/>
                      )}
                      {/* Event spend vertical markers */}
                      {chartData.filter(d => d.isEventSpend).map((d, i) => (
                        <ReferenceLine key={i} x={d.date} stroke="var(--rose)" strokeDasharray="2 3" strokeOpacity={0.6}/>
                      ))}
                      <Area type="monotone" dataKey="amount"
                        stroke="var(--accent)" fill="url(#areaGrad)" strokeWidth={2}
                        dot={{ fill: 'var(--accent)', r: 2.5 }} connectNulls={false}/>
                      <Line type="monotone" dataKey="projected"
                        stroke="var(--text3)" strokeDasharray="4 4" strokeWidth={1.5}
                        dot={false} connectNulls/>
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="legend-dot" style={{background:'var(--accent)'}}/>Actual</span>
                    <span className="legend-item"><span className="legend-dash"/>Projected</span>
                    {target > 0 && <span className="legend-item"><span className="legend-dash" style={{background:'var(--warm)'}}/>Target</span>}
                    <span className="legend-item"><span className="legend-dash" style={{background:'var(--rose)'}}/>Event spend</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="sheet-tab-content">
              {recentLogs.length === 0 ? (
                <div className="sheet-empty">No logs yet.<br/>Tap Log to start tracking.</div>
              ) : (
                <div className="history-list">
                  {recentLogs.map((log, idx) => {
                    const lt = LOG_TYPES.find(t => t.id === log.logType);
                    const prev = recentLogs[idx + 1];
                    const change = prev ? log.amount - prev.amount : null;
                    return (
                      <div key={log.id} className="history-entry">
                        <div className="history-entry-left">
                          <span className="history-type-dot" style={{ background: lt?.color }}/>
                          <div>
                            <div className="history-amount">{fmtNum(log.amount)}</div>
                            {change !== null && (
                              <div className="history-change"
                                style={{ color: change >= 0 ? 'var(--sage)' : 'var(--rose)' }}>
                                {change >= 0 ? '+' : ''}{fmtNum(change)}
                              </div>
                            )}
                            {log.note && <div className="history-note">{log.note}</div>}
                          </div>
                        </div>
                        <div className="history-entry-right">
                          <div className="history-type">{lt?.label}</div>
                          <div className="history-date">{dayLabel(log.date)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compact resource card
function ResourceCard({ resource, data, logs, onTap }) {
  const current = data?.current || 0;
  const target = data?.target || 0;
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : null;

  const recentLogs = (logs || []).filter(l => l.resourceId === resource.id)
    .sort((a, b) => b.date - a.date);
  const lastLog = recentLogs[0];
  const prevLog = recentLogs[1];
  const change = lastLog && prevLog ? lastLog.amount - prevLog.amount : null;

  const dailyRate = calcDailyRate(recentLogs);
  const proj = target > 0 && dailyRate ? calcProjection(current, target, dailyRate) : null;

  return (
    <button className="resource-compact-card" onClick={() => onTap(resource)}>
      <ResourceIcon resourceId={resource.id} size={30}/>

      <div className="rcc-body">
        <div className="rcc-name-row">
          <span className="rcc-name">{resource.name}</span>
          {proj && <span className="rcc-eta">{proj.eta}</span>}
        </div>

        <div className="rcc-values-row">
          <span className="rcc-current">{fmtNum(current)}</span>
          {target > 0 && <span className="rcc-target"> / {fmtNum(target)}</span>}
          {pct !== null && <span className="rcc-pct">{pct}%</span>}
          {change !== null && (
            <span className="rcc-change" style={{ color: change >= 0 ? 'var(--sage)' : 'var(--rose)' }}>
              {change >= 0 ? '+' : ''}{fmtNum(change)}
            </span>
          )}
        </div>

        {pct !== null && (
          <div className="rcc-track">
            <div className="rcc-fill" style={{ width: `${pct}%` }}/>
          </div>
        )}
      </div>

      <span className="rcc-chevron">›</span>
    </button>
  );
}

// ── Main Backpack
export default function Backpack() {
  const [resourceData, setResourceData] = useLocalStorage('backpack_data', {});
  const [resourceLogs, setResourceLogs] = useLocalStorage('backpack_logs', []);
  const [customResources, setCustomResources] = useLocalStorage('backpack_custom', []);
  const [category, setCategory] = useState('all');
  const [activeSheet, setActiveSheet] = useState(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  const allResources = [
    ...DEFAULT_RESOURCES,
    ...customResources.map(r => ({ ...r, priority: 999 })),
  ];

  const filtered = allResources.filter(r => category === 'all' || r.category === category);

  const getData = useCallback((id) => resourceData[id] || { current: 0, target: 0, targetDate: '' }, [resourceData]);
  const getLogs = useCallback(() => resourceLogs, [resourceLogs]);

  const handleSave = useCallback((id, newData, logEntry) => {
    setResourceData(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...newData } }));
    if (logEntry) {
      setResourceLogs(prev => [logEntry, ...prev].slice(0, 500));
    }
  }, [setResourceData, setResourceLogs]);

  const addCustomResource = () => {
    if (!customName.trim()) return;
    setCustomResources(prev => [...prev, {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: 'custom',
    }]);
    setCustomName('');
    setShowAddCustom(false);
  };

  // Summary
  const withTargets = allResources.filter(r => getData(r.id).target > 0);
  const onTrack = withTargets.filter(r => {
    const d = getData(r.id);
    const logs = resourceLogs.filter(l => l.resourceId === r.id);
    const rate = calcDailyRate(logs);
    const proj = rate ? calcProjection(d.current, d.target, rate) : null;
    if (!proj || !d.targetDate) return !!proj;
    return Date.now() + proj.daysLeft * 86400000 <= new Date(d.targetDate).getTime();
  });
  const behind = withTargets.length - onTrack.length;

  return (
    <div className="backpack-v3">

      {/* Summary strip */}
      {withTargets.length > 0 && (
        <div className="bp-summary">
          <div className="bp-stat"><span className="bp-stat-n">{withTargets.length}</span><span className="bp-stat-l">Tracked</span></div>
          <div className="bp-stat-div"/>
          <div className="bp-stat"><span className="bp-stat-n" style={{color:'var(--sage)'}}>{onTrack.length}</span><span className="bp-stat-l">On track</span></div>
          <div className="bp-stat-div"/>
          <div className="bp-stat"><span className="bp-stat-n" style={{color:behind>0?'var(--rose)':'var(--text3)'}}>{behind}</span><span className="bp-stat-l">Behind</span></div>
        </div>
      )}

      {/* Category chips */}
      <div className="chip-row" style={{padding:'0 14px',margin:'8px 0 4px'}}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={`chip chip-sm ${category===c.id?'active':''}`}
            onClick={() => setCategory(c.id)}>{c.label}</button>
        ))}
      </div>

      {/* Resource list */}
      <div className="bp-resource-list">
        {filtered.map(r => (
          <ResourceCard
            key={r.id}
            resource={r}
            data={getData(r.id)}
            logs={resourceLogs}
            onTap={setActiveSheet}
          />
        ))}

        {/* Add custom */}
        {showAddCustom ? (
          <div className="bp-add-custom-form">
            <input
              type="text"
              className="text-input"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => e.key==='Enter' && addCustomResource()}
              placeholder="Resource name"
              autoFocus
              autoComplete="off"
            />
            <div className="form-row" style={{marginTop:'8px'}}>
              <button className="btn-primary" onClick={addCustomResource}>Add</button>
              <button className="btn-ghost" onClick={()=>setShowAddCustom(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="bp-add-btn" onClick={()=>setShowAddCustom(true)}>
            + Add custom resource
          </button>
        )}
      </div>

      {/* Bottom sheet */}
      {activeSheet && (
        <ResourceSheet
          resource={activeSheet}
          data={getData(activeSheet.id)}
          logs={resourceLogs}
          onClose={() => setActiveSheet(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
