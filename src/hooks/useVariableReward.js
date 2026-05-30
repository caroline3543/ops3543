// src/hooks/useVariableReward.js
// Variable coin rewards — weighted toward 3-5, occasional surprises up to 10

export function getVariableReward(base = 3, isEvent = false, isStarred = false) {
  // Weighted random: mostly 3-5, occasionally 6-8, rarely 9-10
  const rand = Math.random();
  let bonus = 0;
  if (rand < 0.50) bonus = 0;       // 50%: base
  else if (rand < 0.75) bonus = 1;  // 25%: +1
  else if (rand < 0.88) bonus = 2;  // 13%: +2
  else if (rand < 0.95) bonus = 3;  //  7%: +3
  else bonus = Math.floor(Math.random() * 4) + 4; // 5%: +4 to +7 (surprise!)

  const eventBonus  = isEvent  ? 2 : 0;
  const starBonus   = isStarred ? 2 : 0;

  return base + bonus + eventBonus + starBonus;
}

// Survival items for the camp shop
export const SURVIVAL_ITEMS = [
  {
    id: 'worn_hat',
    name: 'Worn hat',
    description: 'A battered hat. Keeps the sun off. Keeps the rain mostly off.',
    cost: 20,
    category: 'clothing',
    journalKey: 'hatWorn',
    sceneEffect: 'Appears on her head.',
  },
  {
    id: 'wool_blanket',
    name: 'Wool blanket',
    description: 'Thick and slightly scratchy. At night, entirely worth it.',
    cost: 25,
    category: 'clothing',
    journalKey: 'blanketOwned',
    sceneEffect: 'Draped over her shoulders at night.',
  },
  {
    id: 'hand_trowel',
    name: 'Hand trowel',
    description: 'For planting. Plants grow faster when tended properly.',
    cost: 30,
    category: 'tools',
    journalKey: null,
    sceneEffect: 'In her hand when tending the garden.',
  },
  {
    id: 'lantern',
    name: 'Lantern',
    description: 'Warm light for long evenings. The camp looks lived-in with it on.',
    cost: 35,
    category: 'tools',
    journalKey: 'lanternLit',
    sceneEffect: 'Glows beside her at night.',
  },
  {
    id: 'rain_jacket',
    name: 'Rain jacket',
    description: "Ugly. Practical. She's glad she has it.",
    cost: 35,
    category: 'clothing',
    journalKey: null,
    sceneEffect: 'Replaces the cardigan in rain.',
  },
  {
    id: 'woven_basket',
    name: 'Woven basket',
    description: "Made locally. Carries more than you'd think.",
    cost: 40,
    category: 'tools',
    journalKey: null,
    sceneEffect: 'On her back when harvesting.',
  },
  {
    id: 'fishing_line',
    name: 'Fishing line',
    description: 'Requires patience. Rewards it occasionally.',
    cost: 45,
    category: 'tools',
    journalKey: 'fishingLine',
    sceneEffect: 'Appears near water.',
  },
  {
    id: 'field_guide',
    name: 'Field guide',
    description: 'Names of plants, birds, stones. Learning to see what was always there.',
    cost: 50,
    category: 'knowledge',
    journalKey: 'fieldGuide',
    sceneEffect: 'Open in her lap when sitting.',
  },
];

// Secret items — never shown in shop, discovered through conditions
export const SECRET_ITEMS = [
  {
    id: 'four_leaf_clover',
    name: 'Four-leaf clover',
    description: 'Found on day 17. You almost missed it.',
    condition: (dayAge) => dayAge === 17,
    journalKey: 'secret1',
  },
  {
    id: 'smooth_stone',
    name: 'Smooth river stone',
    description: 'Found near the fire on day 3.',
    condition: (dayAge) => dayAge === 3,
    journalKey: 'day3',
  },
  {
    id: 'first_feather',
    name: "Animal's first feather",
    description: 'Left near your sleeping spot. A small gift.',
    condition: (dayAge, animalTrust) => animalTrust >= 4,
    journalKey: null,
  },
];