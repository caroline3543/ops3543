// src/components/Library.jsx
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CATEGORIES = ['Bear Trap', 'Foundry', 'SvS', 'Alliance Mail', 'Recruitment', 'Strategy', 'General'];

const DEFAULT_TEMPLATES = [
  {
    id: 1, title: 'Bear Trap Rally Call', category: 'Bear Trap', pinned: true, status: 'template',
    content: '🐻 BEAR TRAP — {event_time} UTC\n\nAlliance! Bear Trap is starting soon.\n\n✅ Set your rally\n✅ Send full march\n✅ Stay online\n\nLet\'s go! 💪',
  },
  {
    id: 2, title: 'SvS Prep Message', category: 'SvS', pinned: false, status: 'template',
    content: '⚔️ SVS PREP — {date}\n\nState vs State begins soon!\n\n🛡️ Shield if not participating\n⚔️ Coordinate rallies with R4s\n📍 Stay in alliance territory\n\nQuestions? Message an R4.',
  },
  {
    id: 3, title: 'Recruitment Post', category: 'Recruitment', pinned: true, status: 'draft',
    content: '🏔️ State 3543 — {alliance_name} is recruiting!\n\nLooking for active players who:\n✅ Check in daily\n✅ Participate in events\n✅ Communicate\n\nDM to apply 🌟',
  },
];

const VARIABLES = ['{event_name}', '{event_time}', '{date}', '{alliance_name}', '{server_day}'];

export default function Library() {
  const [items, setItems] = useLocalStorage('library_items', DEFAULT_TEMPLATES);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'General', content: '' });
  const [copied, setCopied] = useState(null);
  const [showVars, setShowVars] = useState(false);

  const filtered = items.filter(item => {
    const catMatch = filter === 'all' || item.category === filter;
    const statMatch = statusFilter === 'all' || item.status === statusFilter;
    return catMatch && statMatch;
  });

  const pinned = filtered.filter(i => i.pinned);
  const unpinned = filtered.filter(i => !i.pinned);

  const copyItem = (item) => {
    navigator.clipboard.writeText(item.content).catch(() => {});
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const togglePin = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i));
  const archiveItem = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));
  const deleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const duplicateItem = (item) => {
    setItems(prev => [...prev, { ...item, id: Date.now(), title: item.title + ' (copy)', pinned: false }]);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditContent(item.content);
    setEditTitle(item.title);
  };

  const saveEdit = () => {
    setItems(prev => prev.map(i => i.id === editingId ? { ...i, content: editContent, title: editTitle } : i));
    setEditingId(null);
  };

  const addNew = () => {
    if (!newItem.title.trim() || !newItem.content.trim()) return;
    setItems(prev => [...prev, { ...newItem, id: Date.now(), pinned: false, status: 'draft' }]);
    setNewItem({ title: '', category: 'General', content: '' });
    setShowNew(false);
  };

  const insertVar = (v) => {
    setEditContent(prev => prev + v);
  };

  const LibraryCard = ({ item }) => (
    <div className={`library-card ${item.pinned ? 'library-pinned' : ''}`}>
      <div className="library-card-header">
        <div className="library-card-meta">
          <span className="library-category-tag">{item.category}</span>
          {item.status === 'draft' && <span className="library-status-tag draft">Draft</span>}
          {item.status === 'archived' && <span className="library-status-tag archived">Archived</span>}
          {item.pinned && <span className="library-pin">📌</span>}
        </div>
        <div className="library-card-actions">
          <button className="lib-action-btn" onClick={() => copyItem(item)}>
            {copied === item.id ? '✓' : '⎘'}
          </button>
          <button className="lib-action-btn" onClick={() => togglePin(item.id)}>
            {item.pinned ? '📌' : '📍'}
          </button>
          <button className="lib-action-btn" onClick={() => duplicateItem(item)}>⊕</button>
          <button className="lib-action-btn" onClick={() => startEdit(item)}>✎</button>
          <button className="lib-action-btn danger" onClick={() => deleteItem(item.id)}>✕</button>
        </div>
      </div>

      <div className="library-card-title">{item.title}</div>

      {editingId === item.id ? (
        <div className="library-edit-form">
          <input
            className="text-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            style={{ marginBottom: '8px' }}
          />
          <textarea
            className="library-textarea"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={8}
          />
          <div className="var-row">
            <button className="breakdown-btn" onClick={() => setShowVars(!showVars)}>
              {showVars ? '↑ Variables' : '↓ Insert variable'}
            </button>
            {showVars && (
              <div className="var-chips">
                {VARIABLES.map(v => (
                  <button key={v} className="var-chip" onClick={() => insertVar(v)}>{v}</button>
                ))}
              </div>
            )}
          </div>
          <div className="form-row" style={{ marginTop: '10px' }}>
            <button className="btn-primary" onClick={saveEdit}>Save</button>
            <button className="btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="library-content-preview">{item.content}</div>
      )}
    </div>
  );

  return (
    <div className="library-wrap">
      <div className="page-header">
        <div className="page-title">Library</div>
        <div className="page-subtitle">Your messages, guides & templates</div>
      </div>

      {/* Filters */}
      <div className="chip-row">
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="chip-row" style={{ marginTop: '8px' }}>
        {['all', 'template', 'draft', 'archived'].map(s => (
          <button
            key={s}
            className={`chip chip-sm ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* New item button */}
      {!showNew && (
        <button className="add-resource-btn" onClick={() => setShowNew(true)}>
          + New message or guide
        </button>
      )}

      {/* New item form */}
      {showNew && (
        <div className="library-card" style={{ marginBottom: '14px' }}>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="input-label">Title</label>
            <input
              autoFocus className="text-input"
              value={newItem.title}
              onChange={e => setNewItem(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Bear Trap Reminder"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="input-label">Category</label>
            <select className="select-input" value={newItem.category} onChange={e => setNewItem(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="input-label">Content</label>
            <textarea
              className="library-textarea"
              value={newItem.content}
              onChange={e => setNewItem(f => ({ ...f, content: e.target.value }))}
              rows={6}
              placeholder="Write your message here... Use {event_name}, {event_time}, {date} as variables."
            />
          </div>
          <div className="form-row">
            <button className="btn-primary" onClick={addNew}>Add to library</button>
            <button className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Pinned */}
      {pinned.length > 0 && (
        <>
          <div className="library-section-label">📌 Pinned</div>
          {pinned.map(item => <LibraryCard key={item.id} item={item} />)}
        </>
      )}

      {/* Rest */}
      {unpinned.length > 0 && (
        <>
          {pinned.length > 0 && <div className="library-section-label">All items</div>}
          {unpinned.map(item => <LibraryCard key={item.id} item={item} />)}
        </>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-text">Nothing here yet.</div>
          <div className="empty-sub">Add a message or guide above.</div>
        </div>
      )}

      <div className="phase-note">
        📅 Content calendar and scheduled posts coming in the next update.
      </div>
    </div>
  );
}
