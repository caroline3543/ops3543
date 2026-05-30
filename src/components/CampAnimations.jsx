// src/components/CampAnimations.jsx
// CSS/SVG animated elements for the camp tab
// NOTE FOR DEVELOPERS: These are CSS/SVG placeholders.
// For richer animations, replace with Lottie JSON files (lottie-react),
// custom SVG animations, or GSAP keyframes.
// Lottie assets recommended: campfire, falling petals, snow shimmer, animal breathing.

import { useEffect, useRef } from 'react';

// ── Animated campfire (SVG + CSS keyframes)
export function Campfire({ size = 48 }) {
  return (
    <div className="campfire-wrap" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" className="campfire-svg">
        {/* Logs */}
        <ellipse cx="24" cy="40" rx="14" ry="4" fill="#8B5E3C" opacity="0.9"/>
        <rect x="10" y="36" width="28" height="6" rx="3" fill="#6B4226"/>
        {/* Embers */}
        <ellipse cx="24" cy="38" rx="10" ry="3" fill="#FF6B2B" opacity="0.6" className="ember-glow"/>
        {/* Flame layers — animated */}
        <path d="M24 36 C20 30 16 24 20 18 C22 14 24 20 24 20 C24 20 26 14 28 18 C32 24 28 30 24 36Z"
          fill="#FF8C00" className="flame-1"/>
        <path d="M24 34 C21 29 18 24 21 19 C23 16 24 21 24 21 C24 21 25 16 27 19 C30 24 27 29 24 34Z"
          fill="#FFA500" className="flame-2"/>
        <path d="M24 32 C22 28 20 24 22 20 C23 18 24 22 24 22 C24 22 25 18 26 20 C28 24 26 28 24 32Z"
          fill="#FFD700" className="flame-3"/>
        {/* Sparks */}
        <circle cx="20" cy="16" r="1.2" fill="#FFD700" className="spark spark-1"/>
        <circle cx="27" cy="14" r="1" fill="#FF8C00" className="spark spark-2"/>
        <circle cx="22" cy="12" r="0.8" fill="#FFD700" className="spark spark-3"/>
      </svg>
    </div>
  );
}

// ── Cherry blossom petals falling (Japan)
export function CherryBlossoms({ count = 6 }) {
  return (
    <div className="petals-wrap" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${10 + (i * 15) + Math.sin(i) * 8}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + (i % 3)}s`,
          }}
        >
          <svg viewBox="0 0 20 20" width="14" height="14">
            <ellipse cx="10" cy="10" rx="7" ry="4"
              fill="var(--accent)" opacity="0.55"
              transform="rotate(45 10 10)"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

// ── Frost shimmer overlay
export function FrostShimmer() {
  return (
    <div className="frost-shimmer" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="frost-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.4}s`,
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

// ── Animated progress ring
export function AnimatedRing({ progress = 0, size = 56, color = 'var(--accent)', label = '' }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="anim-ring-wrap" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3.5"
        />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      {label && (
        <div className="anim-ring-label">{label}</div>
      )}
    </div>
  );
}

// ── Pulsing status dot
export function PulsingDot({ color = 'var(--sage)', size = 10 }) {
  return (
    <span className="pulsing-dot" style={{ '--dot-color': color, width: size, height: size }} />
  );
}

// ── Animal trust indicator (soft breathing animation)
export function TrustBreath({ trust = 0, max = 5 }) {
  const pct = Math.round((trust / max) * 100);
  return (
    <div className="trust-breath">
      <AnimatedRing progress={pct} size={44} color="var(--accent)" />
      <div className="trust-breath-label">{trust}/{max}</div>
    </div>
  );
}
