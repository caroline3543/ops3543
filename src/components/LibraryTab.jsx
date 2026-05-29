// src/components/LibraryTab.jsx
// Phase 1 — message library with copy, edit, archive, duplicate
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_ITEMS = [
  { id: 1, title: 'Bear Trap Rally Call', category: 'Bear Trap', content: '🐻 BEAR TRAP — {event_time} UTC\n\nAll members please:\n• Send troops to the rally point\n• Check your shields\n• Coordinate with your R4\n\nLet\'s go! 💪', pinned: true, archived: false },
  { id: 2, title: 'SVS Briefing', category: 'SvS', content: '⚔️ SVS STARTING SOON\n\nStrategy:\n• Focus fire on priority targets\n• Shield vulnerable members\n• Rally leaders: check Discord\n\nState 3543 — let\'s show them what we\'re made of.', pinned: false, archived: false },
  { id: 3, title: 'Recruitment Post', category: 'Recruitment', content: '🏔️ JOIN STATE 3543\n\nLooking for active players who:\n• Participate in alliance events\n• Communicate in Discord\n• Help their alliance grow\n\nDM an R4 to apply!', pinned: false, archived: false },
];

const CATEGORIES = ['All', 'Bear Trap', 'Foundry', 'SvS', 'Alliance Mail', 'Recruitment', 'Strategy', 'Pinned'];

function LibraryItem({ item, onUpdate, onDelete, onDuplicate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTitle, setEditTitle] = useState(item.title);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(item.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = () => {
    onUpdate({ ...item, title: editTitle, content: editContent });
    setEditing(false);
  };

  if (item.archived) return null;

  return (
    <div className={`lib-card ${item.pinned ? 'lib-pinned' : ''}`}>
      <div className="lib-card-top" onClick={() => !editing && setExpanded(!expanded)}>
        <div className="lib-card-left">
          {item.pinned && <span className="lib-pin">📌</span>}
          <div>
            {editing ? (
              <input className="lib-title-input" value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onClick={e => e.stopPropagation()} />
            ) : (
              <div className="lib-title">{item.title}</div>
            )}
            <div className="lib-category">{item.category}</div>
          </div>
        </div>
        <span className="ev-chevron">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="lib-expanded">
          {editing ? (
            <textarea
              className="lib-textarea"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              rows={8}
            />
          ) : (
            <pre className="lib-content">{item.content}</pre>
          )}

          <div className="lib-actions">
            <button className={`lib-action-btn ${copied ? 'copied' : ''}`} onClick={copy}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            {!editing ? (
              <button className="lib-action-btn" onClick={() => setEditing(true)}>✎ Edit</button>
            ) : (
              <button className="lib-action-btn accent" onClick={save}>✓ Save</button>
            )}
            <button className="lib-action-btn" onClick={() => onDuplicate(item)}>⧉ Duplicate</button>
            <button className="lib-action-btn" onClick={() => onUpdate({ ...item, pinned: !item.pinned })}>
              {item.pinned ? '📌 Unpin' : '📌 Pin'}
            </button>
            <button className="lib-action-btn danger" onClick={() => onUpdate({ ...item, archived: true })}>
              Archive
            </button>
          </div>

          <div className="lib-variables-hint">
            Variables: <code>{'{event_name}'}</code> <code>{'{event_time}'}</code> <code>{'{date}'}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LibraryTab() {
  const [items, setItems] = useLocalStorage('library', DEFAULT_ITEMS);
  const [category, setCategory] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'Alliance Mail', content: '' });

  const addItem = () => {
    if (!newItem.title.trim()) return;
    setItems(prev => [{
      id: Date.now(),
      title: newItem.title.trim(),
      category: newItem.category,
      content: newItem.content,
      pinned: false,
      archived: false,
    }, ...prev]);
    setNewItem({ title: '', category: 'Alliance Mail', content: '' });
    setShowAdd(false);
  };

  const updateItem = (updated) => setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  const deleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const duplicateItem = (item) => setItems(prev => [{ ...item, id: Date.now(), title: `${item.title} (copy)`, pinned: false }, ...prev]);

  const filtered = items.filter(i => {
    if (i.archived) return false;
    if (category === 'All') return true;
    if (category === 'Pinned') return i.pinned;
    return i.category === category;
  });

  const pinnedItems = filtered.filter(i => i.pinned);
  const unpinnedItems = filtered.filter(i => !i.pinned);

  return (
    <div className="library-tab">
      <div className="tab-page-header">
        <div>
          <div className="tab-page-eyebrow">Messages & Guides</div>
          <div className="tab-page-title">Library</div>
        </div>
        <button className="btn-icon" onClick={() => setShowAdd(!showAdd)}>+</button>
      </div>

      <div className="filter-scroll-row">
        {CATEGORIES.map(c => (
          <button key={c} className={`view-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="add-event-card">
          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label">Title</label>
              <input className="text-input" value={newItem.title} onChange={e => setNewItem(v => ({ ...v, title: e.target.value }))} placeholder="Message title" />
            </div>
            <div className="form-group">
              <label className="input-label">Category</label>
              <select className="select-input" value={newItem.category} onChange={e => setNewItem(v => ({ ...v, category: e.target.value }))}>
                {['Bear Trap','Foundry','SvS','Alliance Mail','Recruitment','Strategy'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="input-label">Content</label>
            <textarea className="lib-textarea" rows={5} value={newItem.content}
              onChange={e => setNewItem(v => ({ ...v, content: e.target.value }))}
              placeholder="Write your message here..." />
          </div>
          <div className="form-row" style={{ marginTop: '8px' }}>
            <button className="btn-primary" onClick={addItem}>Add to library</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="lib-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <div className="empty-text">Nothing here yet.</div>
            <div className="empty-sub">Tap + to add a message or guide.</div>
          </div>
        )}
        {pinnedItems.map(item => (
          <LibraryItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} onDuplicate={duplicateItem} />
        ))}
        {unpinnedItems.map(item => (
          <LibraryItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} onDuplicate={duplicateItem} />
        ))}
      </div>
    </div>
  );
}
