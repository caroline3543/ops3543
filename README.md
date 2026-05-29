# State 3543 — Command Center

Alliance Ops dashboard for Whiteout Survival, State 3543.

---

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Framework: Create React App (auto-detected)
4. Deploy ✓

---

## File Map — What to edit where

| File | What it controls |
|------|-----------------|
| `src/data/gameData.js` | Server milestones, event templates & auto-tasks, minister positions |
| `src/components/UtcCountdown.jsx` | UTC reset timer |
| `src/components/MinisterTimer.jsx` | Minister position booking & countdown |
| `src/components/ServerAge.jsx` | State age display + milestone drawer |
| `src/components/EventsPanel.jsx` | Events list, add event form |
| `src/components/TaskBoard.jsx` | Task list + Eisenhower matrix |
| `src/components/SettingsPanel.jsx` | Settings drawer, export/import |
| `src/App.jsx` | Main layout, greeting, pulse stats |
| `src/App.css` | All styling |
| `src/hooks/useLocalStorage.js` | Shared persistence — do not edit |

---

## Hardcoding data from an export

1. Use the Export button in Settings to download `state3543-backup-YYYY-MM-DD.json`
2. Open the file, copy the `events` array
3. Paste it as the default value in `EventsPanel.jsx` line: `useLocalStorage('events', [ HERE ])`
4. Do the same for `tasks` in `TaskBoard.jsx`
5. Redeploy

---

## Adding event templates

Open `src/data/gameData.js` and add to `EVENT_TEMPLATES`:

```js
'My New Event': {
  color: '#10b981',
  priority: 'medium',
  tasks: [
    { text: 'Task one', quadrant: 'do-now' },
    { text: 'Task two', quadrant: 'do-soon' },
  ],
},
```

---

## When asking Claude to edit

Paste only the **single file** that needs changing. Say which file it is. Claude will edit just that file without touching anything else.
