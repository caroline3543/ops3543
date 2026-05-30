// src/components/ResourceIcons.jsx
// SVG icons designed from WOS game reference screenshots
// Each icon captures the essential visual identity of the resource

export function FireCrystalIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#c4410c"/>
      <rect width="40" height="40" rx="10" fill="url(#fc-bg)"/>
      <defs>
        <radialGradient id="fc-bg" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#ff6b1a"/>
          <stop offset="100%" stopColor="#9a2200"/>
        </radialGradient>
        <radialGradient id="fc-glow" cx="40%" cy="55%" r="45%">
          <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#ff6600" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Crystal shape */}
      <polygon points="20,6 30,14 32,26 20,34 8,26 10,14" fill="#c44010" stroke="#ff8040" strokeWidth="1"/>
      <polygon points="20,6 30,14 32,26 20,34 8,26 10,14" fill="url(#fc-glow)"/>
      {/* Inner glow facets */}
      <polygon points="20,10 27,16 20,30 13,16" fill="none" stroke="#ffaa40" strokeWidth="0.8" opacity="0.7"/>
      <ellipse cx="19" cy="20" rx="5" ry="6" fill="#ffdd88" opacity="0.5"/>
      {/* Highlight */}
      <polygon points="15,10 20,7 22,14 16,17" fill="white" opacity="0.25"/>
    </svg>
  );
}

export function FireShardIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#8B4513"/>
      <defs>
        <linearGradient id="fs-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0522d"/>
          <stop offset="100%" stopColor="#6b3410"/>
        </linearGradient>
      </defs>
      {/* Container box */}
      <rect x="8" y="22" width="24" height="12" rx="2" fill="url(#fs-box)" stroke="#c47840" strokeWidth="0.8"/>
      <rect x="6" y="20" width="28" height="4" rx="1" fill="#c47840"/>
      {/* Rivets */}
      <circle cx="11" cy="28" r="1.5" fill="#8B4513"/>
      <circle cx="29" cy="28" r="1.5" fill="#8B4513"/>
      {/* Red shard pile */}
      <ellipse cx="20" cy="21" rx="12" ry="5" fill="#cc2200"/>
      <ellipse cx="20" cy="19" rx="10" ry="4" fill="#ee3300"/>
      <ellipse cx="18" cy="17" rx="7" ry="3" fill="#ff4400"/>
      <ellipse cx="22" cy="16" rx="5" ry="2.5" fill="#ff5500"/>
      {/* Sparkle */}
      <circle cx="24" cy="14" r="1" fill="#ffaa00" opacity="0.8"/>
      <circle cx="16" cy="16" r="0.8" fill="#ffcc44" opacity="0.6"/>
    </svg>
  );
}

export function EssenceStoneIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#6b7280"/>
      <defs>
        <linearGradient id="es-grad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#9ca3af"/>
          <stop offset="100%" stopColor="#4b5563"/>
        </linearGradient>
      </defs>
      {/* Stone body */}
      <polygon points="20,5 33,15 30,32 10,32 7,15" fill="url(#es-grad)" stroke="#d1d5db" strokeWidth="0.8"/>
      {/* Facets */}
      <polygon points="20,5 33,15 20,20" fill="#b0b8c4" opacity="0.5"/>
      <polygon points="20,20 7,15 10,32" fill="#374151" opacity="0.4"/>
      {/* Red hammer mark */}
      <rect x="16" y="17" width="8" height="3" rx="1" fill="#dc2626"/>
      <rect x="18" y="14" width="4" height="9" rx="1" fill="#dc2626"/>
      <rect x="15" y="14" width="10" height="3" rx="1" fill="#ef4444"/>
      {/* Highlight */}
      <polygon points="13,8 20,5 22,13 16,14" fill="white" opacity="0.2"/>
    </svg>
  );
}

export function MythicShardIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#d97706"/>
      <defs>
        <linearGradient id="ms-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d"/>
          <stop offset="50%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#d97706"/>
        </linearGradient>
      </defs>
      {/* Puzzle piece shape */}
      <path d="M12,10 L22,10 Q22,10 22,14 Q26,12 28,15 Q26,18 22,16 L22,22 Q18,22 18,26 Q20,28 20,30 Q17,32 15,30 Q15,28 18,26 Q18,22 12,22 Z"
        fill="url(#ms-grad)" stroke="#fbbf24" strokeWidth="0.8"/>
      {/* Sheen */}
      <path d="M13,11 L20,11 L20,16 L16,16" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      {/* Pink/purple edge */}
      <path d="M12,10 L22,10 Q22,10 22,14 Q26,12 28,15 Q26,18 22,16 L22,22 Q18,22 18,26 Q20,28 20,30 Q17,32 15,30 Q15,28 18,26 Q18,22 12,22 Z"
        fill="none" stroke="#e879f9" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}

export function AdvancedWildMarkIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#92400e"/>
      <defs>
        <radialGradient id="awm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Dark jagged crystal */}
      <polygon points="20,5 26,10 32,18 28,30 20,34 12,30 8,18 14,10" fill="#1f2937" stroke="#374151" strokeWidth="0.8"/>
      <polygon points="20,5 26,10 32,18 28,30 20,34 12,30 8,18 14,10" fill="url(#awm-glow)"/>
      {/* Orange flame slashes */}
      <path d="M15,14 L22,20 L18,22" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M19,12 L26,18 L22,20" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M13,20 L20,26 L16,28" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Glow spots */}
      <circle cx="22" cy="19" r="2" fill="#fbbf24" opacity="0.6"/>
      {/* Highlight */}
      <polygon points="14,8 20,5 21,11 16,13" fill="white" opacity="0.15"/>
    </svg>
  );
}

export function CommonWildMarkIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#1e40af"/>
      <defs>
        <radialGradient id="cwm-glow" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Smooth stone */}
      <ellipse cx="20" cy="21" rx="13" ry="14" fill="#6b7280"/>
      <ellipse cx="20" cy="21" rx="13" ry="14" fill="url(#cwm-glow)"/>
      {/* Blue light streaks */}
      <path d="M16,14 Q20,18 17,24" stroke="#bfdbfe" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
      <path d="M20,12 Q24,16 22,22" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
      {/* Highlight */}
      <ellipse cx="16" cy="14" rx="4" ry="3" fill="white" opacity="0.2" transform="rotate(-20 16 14)"/>
      <ellipse cx="15" cy="13" rx="2" ry="1.5" fill="white" opacity="0.35" transform="rotate(-20 15 13)"/>
    </svg>
  );
}

export function DesignPlanIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#b45309"/>
      <defs>
        <linearGradient id="dp-scroll" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7"/>
          <stop offset="100%" stopColor="#d4a96a"/>
        </linearGradient>
      </defs>
      {/* Scroll body */}
      <rect x="10" y="12" width="22" height="18" rx="2" fill="url(#dp-scroll)" transform="rotate(-5 21 21)"/>
      {/* Scroll ends */}
      <ellipse cx="10" cy="21" rx="3" ry="9" fill="#92400e" transform="rotate(-5 10 21)"/>
      <ellipse cx="30" cy="21" rx="3" ry="9" fill="#92400e" transform="rotate(-5 30 21)"/>
      <ellipse cx="10" cy="21" rx="2" ry="8" fill="#c4732a" transform="rotate(-5 10 21)"/>
      <ellipse cx="30" cy="21" rx="2" ry="8" fill="#c4732a" transform="rotate(-5 30 21)"/>
      {/* Scroll lines */}
      <line x1="14" y1="18" x2="26" y2="16" stroke="#92400e" strokeWidth="0.8" opacity="0.5"/>
      <line x1="14" y1="21" x2="26" y2="19" stroke="#92400e" strokeWidth="0.8" opacity="0.5"/>
      <line x1="14" y1="24" x2="26" y2="22" stroke="#92400e" strokeWidth="0.8" opacity="0.5"/>
      {/* Gold wax seal */}
      <circle cx="24" cy="26" r="5" fill="#f59e0b" transform="rotate(-5 24 26)"/>
      <circle cx="24" cy="26" r="4" fill="#fcd34d" transform="rotate(-5 24 26)"/>
      <circle cx="24" cy="26" r="2" fill="#d97706" transform="rotate(-5 24 26)"/>
    </svg>
  );
}

export function AlloyIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#1e3a5f"/>
      <defs>
        <linearGradient id="al-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb"/>
          <stop offset="40%" stopColor="#9ca3af"/>
          <stop offset="100%" stopColor="#6b7280"/>
        </linearGradient>
        <linearGradient id="al-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af"/>
          <stop offset="100%" stopColor="#374151"/>
        </linearGradient>
      </defs>
      {/* Metal ingot — top face */}
      <path d="M8,18 L32,18 L28,26 L12,26 Z" fill="url(#al-grad)"/>
      {/* Side face */}
      <path d="M12,26 L28,26 L28,30 L12,30 Z" fill="url(#al-side)"/>
      {/* Left side */}
      <path d="M8,18 L12,26 L12,30 L8,22 Z" fill="#4b5563"/>
      {/* Arrow stamp */}
      <polygon points="20,20 24,23 20,26 16,23" fill="#374151" opacity="0.6"/>
      <polygon points="20,21 23,23 20,25 17,23" fill="#6b7280"/>
      <polygon points="19,23 21,23 21,21 23,23 21,25 21,23 19,23" fill="#9ca3af"/>
      {/* Shine */}
      <path d="M10,19 L30,19 L29,21 L11,21 Z" fill="white" opacity="0.2"/>
    </svg>
  );
}

export function PolishingSolutionIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#7e22ce"/>
      <defs>
        <linearGradient id="ps-bottle" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#d4f5a0"/>
          <stop offset="60%" stopColor="#86c832"/>
          <stop offset="100%" stopColor="#4d7c0f"/>
        </linearGradient>
      </defs>
      {/* Bottle body */}
      <path d="M14,18 Q12,20 12,26 Q12,32 20,32 Q28,32 28,26 Q28,20 26,18 Z" fill="url(#ps-bottle)"/>
      {/* Bottle neck */}
      <rect x="16" y="12" width="8" height="8" rx="2" fill="#a3e635"/>
      {/* Cork */}
      <rect x="17" y="9" width="6" height="5" rx="1.5" fill="#a16207"/>
      <rect x="17.5" y="9" width="5" height="2" rx="1" fill="#ca8a04"/>
      {/* Label */}
      <rect x="14" y="22" width="12" height="7" rx="1.5" fill="white" opacity="0.25"/>
      {/* Liquid shimmer */}
      <ellipse cx="18" cy="23" rx="2" ry="3" fill="white" opacity="0.2"/>
      {/* Shine */}
      <path d="M15,19 Q14,22 14,25" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    </svg>
  );
}

export function GemsIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#0e7490"/>
      <defs>
        <linearGradient id="gem-grad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#a5f3fc"/>
          <stop offset="50%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#0e7490"/>
        </linearGradient>
      </defs>
      {/* Main gem */}
      <polygon points="20,6 30,14 26,30 14,30 10,14" fill="url(#gem-grad)" stroke="#67e8f9" strokeWidth="0.8"/>
      {/* Facets */}
      <polygon points="20,6 30,14 20,18" fill="#cffafe" opacity="0.4"/>
      <polygon points="20,6 10,14 20,18" fill="#0e7490" opacity="0.3"/>
      <polygon points="20,18 14,30 26,30" fill="#0891b2" opacity="0.4"/>
      {/* Shine */}
      <polygon points="15,9 20,6 22,13 17,15" fill="white" opacity="0.35"/>
      <polygon points="17,10 20,8 21,12" fill="white" opacity="0.5"/>
      {/* Small gems */}
      <polygon points="30,24 34,27 32,32 28,32 26,27" fill="#67e8f9" opacity="0.8" transform="scale(0.7) translate(15,10)"/>
    </svg>
  );
}

export function RefinedFireCrystalIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#7c1d00"/>
      <defs>
        <radialGradient id="rfc-glow" cx="45%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9"/>
          <stop offset="40%" stopColor="#f97316" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Larger, more refined crystal — two overlapping crystals */}
      <polygon points="20,4 32,13 30,30 20,35 10,30 8,13" fill="#991b00" stroke="#f97316" strokeWidth="1"/>
      <polygon points="20,4 32,13 30,30 20,35 10,30 8,13" fill="url(#rfc-glow)"/>
      {/* Inner crystal structure */}
      <polygon points="20,8 28,15 26,28 20,32 14,28 12,15" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5"/>
      {/* Bright core */}
      <ellipse cx="20" cy="19" rx="6" ry="7" fill="#fde68a" opacity="0.4"/>
      <ellipse cx="20" cy="18" rx="3" ry="4" fill="#fef3c7" opacity="0.5"/>
      {/* Facet lines */}
      <line x1="20" y1="4" x2="20" y2="35" stroke="#f97316" strokeWidth="0.5" opacity="0.4"/>
      <line x1="8" y1="13" x2="32" y2="13" stroke="#f97316" strokeWidth="0.5" opacity="0.3"/>
      {/* Highlights */}
      <polygon points="13,8 20,4 22,12 15,14" fill="white" opacity="0.2"/>
      {/* Refined sparkles */}
      <path d="M28,8 L30,6 L28,10 L26,8 Z" fill="#fef3c7" opacity="0.8"/>
      <path d="M10,10 L11,8 L12,10 L11,12 Z" fill="#fde68a" opacity="0.6"/>
    </svg>
  );
}

export function HeroShardIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#4c1d95"/>
      <defs>
        <linearGradient id="hs-grad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#c4b5fd"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
      {/* Star/shard shape */}
      <polygon points="20,5 23,16 34,16 25,23 28,34 20,27 12,34 15,23 6,16 17,16"
        fill="url(#hs-grad)" stroke="#a78bfa" strokeWidth="0.8"/>
      {/* Inner glow */}
      <polygon points="20,10 22,17 28,17 23,21 25,28 20,24 15,28 17,21 12,17 18,17"
        fill="#ddd6fe" opacity="0.3"/>
      {/* Center */}
      <circle cx="20" cy="20" r="3" fill="#ede9fe" opacity="0.6"/>
      {/* Highlight */}
      <polygon points="16,10 20,5 21,12 18,14" fill="white" opacity="0.3"/>
    </svg>
  );
}

export function ChiefGearIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#1c1917"/>
      <defs>
        <linearGradient id="cg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d"/>
          <stop offset="100%" stopColor="#d97706"/>
        </linearGradient>
      </defs>
      {/* Shield shape */}
      <path d="M20,6 L32,10 L32,22 Q32,30 20,35 Q8,30 8,22 L8,10 Z"
        fill="#374151" stroke="#6b7280" strokeWidth="0.8"/>
      {/* Gold emblem */}
      <path d="M20,10 L28,13 L28,21 Q28,27 20,31 Q12,27 12,21 L12,13 Z"
        fill="url(#cg-grad)" opacity="0.9"/>
      {/* Gear teeth on emblem */}
      <circle cx="20" cy="21" r="5" fill="#92400e"/>
      <circle cx="20" cy="21" r="3" fill="#fcd34d"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <rect key={i} x="19" y="14" width="2" height="3" rx="1" fill="#fcd34d"
          transform={`rotate(${a} 20 21)`}/>
      ))}
      {/* Highlight */}
      <path d="M14,11 L20,9 L26,11 L20,12 Z" fill="white" opacity="0.2"/>
    </svg>
  );
}

export function ChiefCharmIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#831843"/>
      <defs>
        <radialGradient id="cc-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fbcfe8"/>
          <stop offset="100%" stopColor="#be185d"/>
        </radialGradient>
      </defs>
      {/* Charm circle */}
      <circle cx="20" cy="22" r="12" fill="url(#cc-glow)" stroke="#f9a8d4" strokeWidth="0.8"/>
      {/* Inner symbol */}
      <circle cx="20" cy="22" r="7" fill="#be185d" opacity="0.6"/>
      <circle cx="20" cy="22" r="4" fill="#fce7f3" opacity="0.5"/>
      {/* Chain link at top */}
      <rect x="18" y="8" width="4" height="6" rx="2" fill="none" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Decorative dots */}
      {[0,60,120,180,240,300].map((a,i)=>(
        <circle key={i} cx={20+10*Math.cos(a*Math.PI/180)} cy={22+10*Math.sin(a*Math.PI/180)} r="1.2" fill="#fce7f3" opacity="0.7"/>
      ))}
      {/* Star center */}
      <polygon points="20,18 21,21 24,21 22,23 23,26 20,24 17,26 18,23 16,21 19,21"
        fill="#fce7f3" opacity="0.8"/>
    </svg>
  );
}

export function ManualIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#064e3b"/>
      <defs>
        <linearGradient id="mn-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {/* Book spine */}
      <rect x="8" y="8" width="6" height="26" rx="2" fill="url(#mn-grad)"/>
      {/* Book pages */}
      <rect x="12" y="8" width="20" height="26" rx="2" fill="#f0fdf4"/>
      <rect x="12" y="8" width="20" height="26" rx="2" fill="none" stroke="#6ee7b7" strokeWidth="0.5"/>
      {/* Page lines */}
      <line x1="16" y1="14" x2="28" y2="14" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
      <line x1="16" y1="17" x2="28" y2="17" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
      <line x1="16" y1="20" x2="28" y2="20" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
      <line x1="16" y1="23" x2="24" y2="23" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
      {/* Top stripe */}
      <rect x="12" y="8" width="20" height="4" rx="2" fill="#34d399" opacity="0.4"/>
      {/* Bookmark */}
      <path d="M26,8 L26,16 L23,14 L20,16 L20,8 Z" fill="#f59e0b"/>
    </svg>
  );
}

// Resource icon map
export const RESOURCE_ICONS = {
  fire_crystals:         FireCrystalIcon,
  refined_fire_crystals: RefinedFireCrystalIcon,
  fire_shards:           FireShardIcon,
  essence_stones:        EssenceStoneIcon,
  hero_shards:           HeroShardIcon,
  common_wild_marks:     CommonWildMarkIcon,
  advanced_wild_marks:   AdvancedWildMarkIcon,
  gems:                  GemsIcon,
  chief_gear:            ChiefGearIcon,
  chief_charm:           ChiefCharmIcon,
  design_plans:          DesignPlanIcon,
  alloy:                 AlloyIcon,
  polishing_solution:    PolishingSolutionIcon,
  manuals:               ManualIcon,
};

export function ResourceIcon({ resourceId, size = 36 }) {
  const Icon = RESOURCE_ICONS[resourceId];
  if (Icon) return <Icon size={size} />;
  // Fallback for custom resources
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" fill="#374151"/>
      <text x="20" y="25" textAnchor="middle" fontSize="18" fill="white">📦</text>
    </svg>
  );
}
