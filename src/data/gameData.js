// src/data/milestones.js
// State 3543 founding date — Day 234 as of 2026-05-30
const FOUNDING_DATE = new Date('2025-10-08T00:00:00Z');

export const STATE_FOUNDING_DATE = FOUNDING_DATE;

export const SERVER_MILESTONES = [
  { day: 0,   label: 'Initial Heroes',           detail: 'First heroes unlocked' },
  { day: 150, label: 'Crystal Infrastructure',   detail: 'Crystal buildings available' },
  { day: 180, label: 'Legendary Chief Gear',      detail: 'Legendary gear unlocked' },
  { day: 195, label: 'Gen 4 Heroes',              detail: '4th generation heroes' },
  { day: 200, label: 'Fourth Pets Update',        detail: 'New pets available' },
  { day: 220, label: 'War Academy Update',        detail: 'War Academy upgrades' },
  { day: 270, label: 'Gen 5 Heroes',              detail: '5th generation heroes' },
  { day: 280, label: 'Fifth Pets Update',         detail: 'New pets available' },
  { day: 315, label: 'Advanced Crystal Update',   detail: 'Crystal tiers 6-8 unlocked' },
  { day: 360, label: 'Gen 6 Heroes',              detail: '6th generation heroes' },
  { day: 370, label: 'Mammoth Update',            detail: 'Mammoth content unlocked' },
  { day: 440, label: 'Gen 7 Heroes',              detail: '7th generation heroes' },
  { day: 500, label: 'Crystal Mastery',           detail: 'Crystal tiers 9-10 unlocked' },
  { day: 520, label: 'Gen 8 Heroes',              detail: '8th generation heroes' },
  { day: 600, label: 'Gen 9 Heroes',              detail: '9th generation heroes' },
  { day: 700, label: 'Gen 10 Heroes',             detail: '10th generation heroes' },
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
