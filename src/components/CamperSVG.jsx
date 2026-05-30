// src/components/CamperSVG.jsx
// The camper — body B, cardigan, short messy hair, exhausted and hopeful
// Animated states: sitting, tending, standing, sleeping
// Items appear on her as purchased

import { useEffect, useState } from 'react';

// Colour palette for the camper
const C = {
  skin:       '#d4956a',
  skinShade:  '#b87a52',
  hair:       '#3d2b1f',
  hairLight:  '#5a3e2b',
  cardigan:   '#8b7355',
  cardiganL:  '#a08060',
  cardiganD:  '#6b5840',
  pants:      '#4a5568',
  pantsL:     '#5a6678',
  shoe:       '#2d2018',
  hat:        '#6b4c2a',
  hatL:       '#8b6a3a',
  blanket:    '#c4845a',
  blanketL:   '#d4946a',
  trowel:     '#8b7355',
  trowelMetal:'#9ca3af',
  lantern:    '#fcd34d',
  lanternG:   '#f59e0b',
  basket:     '#a0714a',
  jacket:     '#4a6fa5',
  jacketL:    '#5a7fb5',
};

// ── SITTING BY FIRE (default state)
function SittingPose({ items = [], timeOfDay = 'day', name = '' }) {
  const hasHat      = items.includes('worn_hat');
  const hasBlanket  = items.includes('wool_blanket');
  const hasLantern  = items.includes('lantern');
  const hasFieldGuide = items.includes('field_guide');
  const isNight     = timeOfDay === 'night';

  return (
    <g className="camper-sitting">
      {/* Shadow */}
      <ellipse cx="50" cy="118" rx="22" ry="4" fill="rgba(0,0,0,0.12)"/>

      {/* Blanket over lap/shoulders (night) */}
      {hasBlanket && isNight && (
        <path d="M28,85 Q30,100 35,115 Q50,118 65,115 Q70,100 72,85 Q60,90 50,88 Q40,90 28,85Z"
          fill={C.blanket} opacity="0.9"/>
      )}

      {/* Legs/sitting position */}
      <path d="M35,95 Q32,108 30,118 Q38,120 42,118 Q42,108 40,95Z" fill={C.pants}/>
      <path d="M65,95 Q68,108 70,118 Q62,120 58,118 Q58,108 60,95Z" fill={C.pants}/>
      {/* Shoes */}
      <ellipse cx="34" cy="119" rx="7" ry="3" fill={C.shoe}/>
      <ellipse cx="66" cy="119" rx="7" ry="3" fill={C.shoe}/>

      {/* Body — cardigan */}
      <path d="M34,60 Q28,70 28,85 Q38,90 50,90 Q62,90 72,85 Q72,70 66,60 Q58,56 50,56 Q42,56 34,60Z"
        fill={C.cardigan}/>
      {/* Cardigan lapels */}
      <path d="M50,60 L44,75 L50,90 L56,75 Z" fill={C.cardiganL} opacity="0.5"/>
      <path d="M50,60 Q46,62 44,68 Q47,70 50,68 Q53,70 56,68 Q54,62 50,60Z" fill={C.cardiganD} opacity="0.6"/>
      {/* Cardigan texture lines */}
      <path d="M34,68 Q40,72 50,71 Q60,72 66,68" fill="none" stroke={C.cardiganD} strokeWidth="0.5" opacity="0.4"/>
      <path d="M32,77 Q40,82 50,81 Q60,82 68,77" fill="none" stroke={C.cardiganD} strokeWidth="0.5" opacity="0.3"/>

      {/* Left arm — resting on knee */}
      <path d="M34,65 Q26,72 28,84 Q32,85 34,82 Q33,73 38,68Z" fill={C.cardigan}/>
      {/* Left hand */}
      <ellipse cx="29" cy="85" rx="5" ry="4" fill={C.skin}/>

      {/* Right arm — holding field guide or resting */}
      {hasFieldGuide ? (
        <>
          <path d="M66,65 Q74,72 72,80 Q68,82 66,78 Q67,71 62,68Z" fill={C.cardigan}/>
          {/* Field guide in hand */}
          <rect x="68" y="78" width="12" height="16" rx="1" fill="#8fbc8f" transform="rotate(-15 74 86)"/>
          <rect x="68" y="78" width="12" height="16" rx="1" fill="none" stroke="#4a7a4a" strokeWidth="0.5" transform="rotate(-15 74 86)"/>
          <line x1="70" y1="82" x2="78" y2="80" stroke="#4a7a4a" strokeWidth="0.5" opacity="0.5" transform="rotate(-15 74 86)"/>
          <line x1="70" y1="85" x2="78" y2="83" stroke="#4a7a4a" strokeWidth="0.5" opacity="0.5" transform="rotate(-15 74 86)"/>
        </>
      ) : (
        <>
          <path d="M66,65 Q74,75 70,84 Q66,85 65,82 Q67,73 62,68Z" fill={C.cardigan}/>
          <ellipse cx="70" cy="85" rx="5" ry="4" fill={C.skin}/>
        </>
      )}

      {/* Neck */}
      <rect x="46" y="52" width="8" height="10" rx="3" fill={C.skin}/>

      {/* Head */}
      <ellipse cx="50" cy="42" rx="16" ry="18" fill={C.skin}/>
      {/* Ear */}
      <ellipse cx="34" cy="43" rx="3.5" ry="4" fill={C.skin}/>
      <ellipse cx="34" cy="43" rx="2" ry="2.5" fill={C.skinShade} opacity="0.4"/>

      {/* Face — exhausted but hopeful */}
      {/* Eyes — slightly downcast, soft */}
      <ellipse cx="43" cy="40" rx="4" ry="3.5" fill="white"/>
      <ellipse cx="57" cy="40" rx="4" ry="3.5" fill="white"/>
      <ellipse cx="43" cy="41" rx="2.5" ry="2.5" fill="#3d2b1f"/>
      <ellipse cx="57" cy="41" rx="2.5" ry="2.5" fill="#3d2b1f"/>
      <ellipse cx="44" cy="40" rx="1" ry="1" fill="white" opacity="0.7"/>
      <ellipse cx="58" cy="40" rx="1" ry="1" fill="white" opacity="0.7"/>
      {/* Tired upper eyelids */}
      <path d="M39,38 Q43,36 47,38" fill="none" stroke={C.skin} strokeWidth="1.5"/>
      <path d="M53,38 Q57,36 61,38" fill="none" stroke={C.skin} strokeWidth="1.5"/>
      {/* Soft smile — hopeful */}
      <path d="M44,50 Q50,54 56,50" fill="none" stroke={C.skinShade} strokeWidth="1.2" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M48,45 Q50,47 52,45" fill="none" stroke={C.skinShade} strokeWidth="1" strokeLinecap="round"/>
      {/* Light under-eye shadow — exhausted */}
      <path d="M40,44 Q43,46 46,44" fill="none" stroke={C.skinShade} strokeWidth="0.7" opacity="0.5"/>
      <path d="M54,44 Q57,46 60,44" fill="none" stroke={C.skinShade} strokeWidth="0.7" opacity="0.5"/>

      {/* Hair — short, messy */}
      <path d="M34,34 Q34,20 50,18 Q66,20 66,34 Q62,28 54,26 Q50,25 46,26 Q38,28 34,34Z"
        fill={C.hair}/>
      {/* Messy bits */}
      <path d="M36,28 Q34,22 38,20" fill="none" stroke={C.hair} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M50,18 Q52,14 55,16" fill="none" stroke={C.hair} strokeWidth="2" strokeLinecap="round"/>
      <path d="M62,26 Q66,22 64,18" fill="none" stroke={C.hair} strokeWidth="2" strokeLinecap="round"/>
      <path d="M40,19 Q42,15 46,17" fill="none" stroke={C.hairLight} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Hat (if owned) */}
      {hasHat && (
        <g>
          <ellipse cx="50" cy="26" rx="20" ry="4" fill={C.hat}/>
          <path d="M36,26 Q36,10 50,8 Q64,10 64,26Z" fill={C.hat}/>
          <path d="M37,24 Q37,12 50,10 Q63,12 63,24Z" fill={C.hatL} opacity="0.4"/>
          <ellipse cx="50" cy="26" rx="20" ry="4" fill={C.hat}/>
          {/* Hat band */}
          <path d="M34,25 Q50,28 66,25" fill="none" stroke={C.cardiganD} strokeWidth="2"/>
        </g>
      )}

      {/* Lantern beside her */}
      {hasLantern && (
        <g transform="translate(78,95)">
          {/* Glow */}
          <circle cx="0" cy="0" r="12" fill={C.lantern} opacity="0.15" className="lantern-glow"/>
          {/* Lantern body */}
          <rect x="-5" y="-8" width="10" height="14" rx="2" fill={C.lanternG}/>
          <rect x="-5" y="-8" width="10" height="14" rx="2" fill="none" stroke="#92400e" strokeWidth="0.8"/>
          {/* Handle */}
          <path d="M-3,-8 Q0,-13 3,-8" fill="none" stroke="#92400e" strokeWidth="1.2"/>
          {/* Glass panels */}
          <line x1="-5" y1="-4" x2="5" y2="-4" stroke="#92400e" strokeWidth="0.5"/>
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#92400e" strokeWidth="0.5"/>
          {/* Flame */}
          <ellipse cx="0" cy="-1" rx="2" ry="3" fill="#fef3c7" opacity="0.9" className="flame-flicker"/>
        </g>
      )}
    </g>
  );
}

// ── TENDING GARDEN (when plants owned)
function TendingPose({ items = [] }) {
  const hasHat    = items.includes('worn_hat');
  const hasTrowel = items.includes('hand_trowel');
  const hasBasket = items.includes('woven_basket');

  return (
    <g className="camper-tending">
      <ellipse cx="50" cy="120" rx="20" ry="3.5" fill="rgba(0,0,0,0.12)"/>

      {/* Legs — crouching */}
      <path d="M38,90 Q34,105 32,118 Q38,121 42,119 Q42,106 44,90Z" fill={C.pants}/>
      <path d="M62,90 Q66,105 68,118 Q62,121 58,119 Q58,106 56,90Z" fill={C.pants}/>
      <ellipse cx="35" cy="119" rx="7" ry="3" fill={C.shoe}/>
      <ellipse cx="65" cy="119" rx="7" ry="3" fill={C.shoe}/>

      {/* Body */}
      <path d="M36,58 Q30,68 30,85 Q40,90 50,90 Q60,90 70,85 Q70,68 64,58 Q57,54 50,54 Q43,54 36,58Z"
        fill={C.cardigan}/>
      <path d="M50,58 L44,74 L50,90 L56,74 Z" fill={C.cardiganL} opacity="0.5"/>

      {/* Left arm — reaching down to garden */}
      <path d="M36,63 Q24,72 22,85 Q26,88 29,86 Q30,74 38,67Z" fill={C.cardigan}/>
      <ellipse cx="22" cy="88" rx="5" ry="4" fill={C.skin}/>

      {/* Trowel in left hand */}
      {hasTrowel && (
        <g transform="translate(12,90) rotate(-30)">
          <rect x="-2" y="-14" width="4" height="10" rx="1" fill={C.trowel}/>
          <path d="M-3,-4 Q0,4 3,-4Z" fill={C.trowelMetal}/>
          <path d="M-3,-4 Q0,-8 3,-4" fill={C.trowelMetal}/>
        </g>
      )}

      {/* Right arm — supporting */}
      <path d="M64,63 Q74,70 72,82 Q68,84 66,81 Q67,71 60,66Z" fill={C.cardigan}/>
      <ellipse cx="72" cy="83" rx="5" ry="4" fill={C.skin}/>

      {/* Basket on back */}
      {hasBasket && (
        <g transform="translate(70,75)">
          <path d="M-6,0 Q0,-10 6,0 Q6,12 0,14 Q-6,12 -6,0Z" fill={C.basket}/>
          <path d="M-5,2 Q0,-6 5,2" fill="none" stroke="#7a5132" strokeWidth="1"/>
          <path d="M-5,6 Q0,0 5,6" fill="none" stroke="#7a5132" strokeWidth="0.8"/>
          {/* Strap */}
          <path d="M-6,0 Q-14,-4 -16,-12" fill="none" stroke={C.basket} strokeWidth="2" strokeLinecap="round"/>
        </g>
      )}

      {/* Neck + head (slightly forward lean) */}
      <rect x="46" y="50" width="8" height="10" rx="3" fill={C.skin} transform="rotate(10 50 55)"/>
      <ellipse cx="48" cy="40" rx="16" ry="17" fill={C.skin}/>
      <ellipse cx="32" cy="41" rx="3.5" ry="4" fill={C.skin}/>

      {/* Face — focused downward */}
      <ellipse cx="41" cy="40" rx="3.5" ry="3" fill="white"/>
      <ellipse cx="55" cy="39" rx="3.5" ry="3" fill="white"/>
      <ellipse cx="41" cy="41" rx="2.5" ry="2.5" fill="#3d2b1f"/>
      <ellipse cx="55" cy="40" rx="2.5" ry="2.5" fill="#3d2b1f"/>
      {/* Eyes looking down */}
      <path d="M38,38 Q41,36 44,38" fill={C.skin} opacity="0.7"/>
      <path d="M52,37 Q55,35 58,37" fill={C.skin} opacity="0.7"/>
      <path d="M38,44 Q44,48 50,47" fill="none" stroke={C.skinShade} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M46,44 Q48,46 50,44" fill="none" stroke={C.skinShade} strokeWidth="1" strokeLinecap="round"/>

      {/* Hair */}
      <path d="M32,34 Q32,20 48,18 Q64,20 64,34 Q60,28 52,26 Q48,25 44,26 Q36,28 32,34Z" fill={C.hair}/>
      <path d="M34,28 Q32,22 36,20" fill="none" stroke={C.hair} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M60,26 Q64,22 62,18" fill="none" stroke={C.hair} strokeWidth="2" strokeLinecap="round"/>

      {hasHat && (
        <g transform="translate(-2,0)">
          <ellipse cx="50" cy="26" rx="20" ry="4" fill={C.hat}/>
          <path d="M36,26 Q36,10 50,8 Q64,10 64,26Z" fill={C.hat}/>
          <path d="M37,24 Q37,12 50,10 Q63,12 63,24Z" fill={C.hatL} opacity="0.4"/>
          <ellipse cx="50" cy="26" rx="20" ry="4" fill={C.hat}/>
          <path d="M34,25 Q50,28 66,25" fill="none" stroke={C.cardiganD} strokeWidth="2"/>
        </g>
      )}
    </g>
  );
}

// ── SLEEPING (night, late)
function SleepingPose({ items = [] }) {
  const hasBlanket = items.includes('wool_blanket');

  return (
    <g className="camper-sleeping">
      <ellipse cx="55" cy="115" rx="35" ry="6" fill="rgba(0,0,0,0.1)"/>
      {/* Sleeping roll / blanket on ground */}
      {hasBlanket ? (
        <path d="M20,108 Q55,104 90,108 Q90,120 55,122 Q20,120 20,108Z"
          fill={C.blanket} opacity="0.9"/>
      ) : (
        <path d="M20,110 Q55,106 90,110 Q90,120 55,122 Q20,120 20,110Z"
          fill="#8b7355" opacity="0.6"/>
      )}
      {/* Body curled on side */}
      <ellipse cx="50" cy="110" rx="28" ry="8" fill={C.cardigan}/>
      {/* Head */}
      <ellipse cx="22" cy="108" rx="13" ry="12" fill={C.skin}/>
      {/* Hair */}
      <path d="M10,104 Q12,96 22,94 Q30,96 32,102 Q24,100 18,104Z" fill={C.hair}/>
      <path d="M14,100 Q12,96 16,94" fill="none" stroke={C.hair} strokeWidth="2" strokeLinecap="round"/>
      {/* Closed eyes */}
      <path d="M16,106 Q19,104 22,106" fill="none" stroke={C.skinShade} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M23,105 Q26,103 29,105" fill="none" stroke={C.skinShade} strokeWidth="1.2" strokeLinecap="round"/>
      {/* ZZZ */}
      <text x="36" y="96" fontSize="8" fill={C.skinShade} opacity="0.5" fontStyle="italic" className="sleep-z">z</text>
      <text x="40" y="90" fontSize="10" fill={C.skinShade} opacity="0.35" fontStyle="italic" className="sleep-z">z</text>
      <text x="45" y="83" fontSize="12" fill={C.skinShade} opacity="0.2" fontStyle="italic" className="sleep-z">z</text>
    </g>
  );
}

export default function CamperSVG({
  pose = 'sitting',   // 'sitting' | 'tending' | 'sleeping'
  items = [],
  timeOfDay = 'day',
  width = 120,
  height = 140,
}) {
  return (
    <svg
      viewBox="0 0 100 130"
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
      className="camper-svg"
    >
      {pose === 'sitting'  && <SittingPose  items={items} timeOfDay={timeOfDay}/>}
      {pose === 'tending'  && <TendingPose  items={items}/>}
      {pose === 'sleeping' && <SleepingPose items={items}/>}
    </svg>
  );
}
