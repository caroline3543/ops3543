// src/data/milestones.js
// Server start: ~6 Oct 2025. Day 237 = 31 May 2026.
const FOUNDING_DATE = new Date('2025-10-06T00:00:00Z');

export const STATE_FOUNDING_DATE = FOUNDING_DATE;

export const SERVER_MILESTONES = [
  { day: 270, label: 'Gen 5 Heroes',     detail: '5th generation heroes unlock',  date: '2026-07-06', icon: '⚔️' },
  { day: 280, label: '5th Pets',         detail: 'Fifth pets update',              date: '2026-07-16', icon: '🐾' },
  { day: 315, label: 'FC6–FC8',          detail: 'Fire Crystal tiers 6–8 unlock', date: '2026-08-20', icon: '🔥' },
  { day: 360, label: 'Gen 6 Heroes',     detail: '6th generation heroes unlock',  date: '2026-10-04', icon: '⚔️' },
  { day: 370, label: 'Mammoth',          detail: 'Mammoth content unlocked',      date: '2026-10-14', icon: '🦣' },
  { day: 440, label: 'Gen 7 Heroes',     detail: '7th generation heroes unlock',  date: '2026-12-23', icon: '⚔️' },
  { day: 500, label: 'Crystal Mastery',  detail: 'Crystal tiers 9–10 unlock',     date: '2027-02-21', icon: '💎' },
  { day: 520, label: 'Gen 8 Heroes',     detail: '8th generation heroes unlock',  date: '2027-03-13', icon: '⚔️' },
  { day: 600, label: 'Gen 9 Heroes',     detail: '9th generation heroes unlock',  date: '2027-06-01', icon: '⚔️' },
  { day: 700, label: 'Gen 10 Heroes',    detail: '10th generation heroes unlock', date: '2027-09-09', icon: '⚔️' },
];

// src/data/eventTemplates.js
export const EVENT_TEMPLATES = {
  'Bear Trap': {
    color: '#ef4444',
    priority: 'high',
    tasks: [
      { text: 'Set rally point', quadrant: 'do-now' },
      { text: 'Send troops to trap', quadrant: 'do-now' },
      { text: 'Coordinate with R4s', quadrant: 'do-now' },
      { text: 'Check troop counts', quadrant: 'do-soon' },
      { text: 'Post results in Discord', quadrant: 'do-later' },
    ],
  },
  'SVS': {
    color: '#f59e0b',
    priority: 'high',
    tasks: [
      { text: 'Confirm troop deployment strategy', quadrant: 'do-now' },
      { text: 'Brief alliance on targets', quadrant: 'do-now' },
      { text: 'Shield vulnerable members', quadrant: 'do-now' },
      { text: 'Assign rally leaders', quadrant: 'do-soon' },
      { text: 'Prepare resource packs', quadrant: 'do-soon' },
      { text: 'Post SVS recap', quadrant: 'do-later' },
    ],
  },
  'King of Icefield': {
    color: '#3b82f6',
    priority: 'high',
    tasks: [
      { text: 'Register KoI team', quadrant: 'do-now' },
      { text: 'Assign KoI roles', quadrant: 'do-now' },
      { text: 'Review KoI strategy doc', quadrant: 'do-soon' },
      { text: 'Confirm attendance in Discord', quadrant: 'do-soon' },
      { text: 'Log KoI scores', quadrant: 'do-later' },
    ],
  },
  'Canyon Clash': {
    color: '#8b5cf6',
    priority: 'medium',
    tasks: [
      { text: 'Assign canyon positions', quadrant: 'do-now' },
      { text: 'Brief team on clash timing', quadrant: 'do-now' },
      { text: 'Confirm participation list', quadrant: 'do-soon' },
      { text: 'Post clash debrief', quadrant: 'do-later' },
    ],
  },
  'Alliance Mobilization': {
    color: '#10b981',
    priority: 'medium',
    tasks: [
      { text: 'Send mass mobilization message', quadrant: 'do-now' },
      { text: 'Track member response', quadrant: 'do-soon' },
      { text: 'Assign mobilization targets', quadrant: 'do-soon' },
      { text: 'Log mobilization points', quadrant: 'do-later' },
    ],
  },
  'Frostfire Mine': {
    color: '#06b6d4',
    priority: 'medium',
    tasks: [
      { text: 'Assign mine slots', quadrant: 'do-now' },
      { text: 'Coordinate mine rotation', quadrant: 'do-soon' },
      { text: 'Check mine timers', quadrant: 'do-soon' },
      { text: 'Log mine contributions', quadrant: 'do-later' },
    ],
  },
  'Custom': {
    color: '#6b7280',
    priority: 'low',
    tasks: [],
  },
};

export const MINISTER_POSITIONS = [
  { id: 'education', label: 'Minister of Education', icon: '📚' },
  { id: 'vp', label: 'Vice President', icon: '⚔️' },
];
