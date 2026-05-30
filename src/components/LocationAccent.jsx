// src/components/LocationAccent.jsx
// Subtle botanical/animal decorative SVG accents per location

const ACCENTS = {
  nz: [
    // Koru (unfurling fern frond) — top right
    { x: '78%', y: '3%', opacity: 0.07, size: 120, element: (
      <svg viewBox="0 0 100 100">
        <path d="M50 90 C50 90 20 70 20 45 C20 20 40 10 55 15 C70 20 75 35 65 45 C55 55 40 50 40 45 C40 35 50 30 55 35"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 90 L50 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="55" cy="35" r="4" fill="currentColor" opacity="0.6"/>
      </svg>
    )},
    // Small kawakawa leaf — bottom left
    { x: '-2%', y: '82%', opacity: 0.05, size: 90, element: (
      <svg viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="30" ry="20" fill="currentColor" transform="rotate(-20 50 50)"/>
        <circle cx="42" cy="44" r="5" fill="white" opacity="0.6"/>
        <circle cx="58" cy="52" r="4" fill="white" opacity="0.6"/>
      </svg>
    )},
  ],

  japan: [
    // Cherry blossom cluster — top right
    { x: '65%', y: '1%', opacity: 0.09, size: 140, element: (
      <svg viewBox="0 0 100 100">
        {/* Five petals */}
        {[0,72,144,216,288].map((angle, i) => (
          <ellipse key={i}
            cx={50 + 18 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 18 * Math.sin((angle * Math.PI) / 180)}
            rx="10" ry="7"
            fill="currentColor"
            transform={`rotate(${angle} ${50 + 18 * Math.cos((angle * Math.PI) / 180)} ${50 + 18 * Math.sin((angle * Math.PI) / 180)})`}
          />
        ))}
        <circle cx="50" cy="50" r="6" fill="white" opacity="0.5"/>
        {/* Small blossom */}
        {[0,72,144,216,288].map((angle, i) => (
          <ellipse key={`s${i}`}
            cx={22 + 8 * Math.cos((angle * Math.PI) / 180)}
            cy={22 + 8 * Math.sin((angle * Math.PI) / 180)}
            rx="5" ry="3.5"
            fill="currentColor"
            transform={`rotate(${angle} ${22 + 8 * Math.cos((angle * Math.PI) / 180)} ${22 + 8 * Math.sin((angle * Math.PI) / 180)})`}
          />
        ))}
        <circle cx="22" cy="22" r="3" fill="white" opacity="0.5"/>
        {/* Falling petal */}
        <ellipse cx="75" cy="70" rx="6" ry="4" fill="currentColor" transform="rotate(45 75 70)" opacity="0.7"/>
        <ellipse cx="85" cy="55" rx="5" ry="3" fill="currentColor" transform="rotate(20 85 55)" opacity="0.5"/>
      </svg>
    )},
  ],

  thailand: [
    // Lotus — top right
    { x: '72%', y: '1%', opacity: 0.07, size: 110, element: (
      <svg viewBox="0 0 100 100">
        <ellipse cx="50" cy="60" rx="8" ry="20" fill="currentColor"/>
        <ellipse cx="35" cy="65" rx="7" ry="18" fill="currentColor" transform="rotate(-20 35 65)"/>
        <ellipse cx="65" cy="65" rx="7" ry="18" fill="currentColor" transform="rotate(20 65 65)"/>
        <ellipse cx="22" cy="72" rx="6" ry="15" fill="currentColor" transform="rotate(-40 22 72)" opacity="0.7"/>
        <ellipse cx="78" cy="72" rx="6" ry="15" fill="currentColor" transform="rotate(40 78 72)" opacity="0.7"/>
        <ellipse cx="50" cy="78" rx="12" ry="6" fill="currentColor" opacity="0.4"/>
      </svg>
    )},
  ],

  pnw: [
    // Cedar branch — top right
    { x: '68%', y: '0%', opacity: 0.06, size: 130, element: (
      <svg viewBox="0 0 100 100">
        <path d="M50 95 L50 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 70 L25 50 M50 70 L75 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 55 L30 38 M50 55 L70 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 40 L35 25 M50 40 L65 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M50 28 L42 18 M50 28 L58 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )},
  ],

  scotland: [
    // Heather sprig — top right
    { x: '70%', y: '1%', opacity: 0.07, size: 120, element: (
      <svg viewBox="0 0 100 100">
        <path d="M50 90 L50 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M50 60 L30 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 50 L70 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 40 L35 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="28" cy="43" r="5" fill="currentColor"/>
        <circle cx="24" cy="38" r="4" fill="currentColor" opacity="0.7"/>
        <circle cx="72" cy="36" r="5" fill="currentColor"/>
        <circle cx="76" cy="30" r="4" fill="currentColor" opacity="0.7"/>
        <circle cx="33" cy="25" r="4" fill="currentColor"/>
        <circle cx="50" cy="27" r="3" fill="currentColor" opacity="0.6"/>
      </svg>
    )},
  ],

  okinawa: [
    // Hibiscus — top right
    { x: '70%', y: '1%', opacity: 0.08, size: 120, element: (
      <svg viewBox="0 0 100 100">
        {[0,72,144,216,288].map((angle, i) => (
          <ellipse key={i}
            cx={50 + 22 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 22 * Math.sin((angle * Math.PI) / 180)}
            rx="14" ry="9"
            fill="currentColor"
            transform={`rotate(${angle + 90} ${50 + 22 * Math.cos((angle * Math.PI) / 180)} ${50 + 22 * Math.sin((angle * Math.PI) / 180)})`}
          />
        ))}
        <circle cx="50" cy="50" r="8" fill="white" opacity="0.4"/>
        <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.8"/>
        <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="50" cy="18" r="3" fill="currentColor" opacity="0.6"/>
      </svg>
    )},
  ],
};

// Frost accent — always present, subtle
const FrostAccent = () => (
  <div className="frost-accent">
    <svg viewBox="0 0 200 200" className="frost-svg">
      {/* Snowflake 1 */}
      <g transform="translate(30,30)" opacity="0.4">
        {[0,60,120].map(a => (
          <line key={a} x1="0" y1="-12" x2="0" y2="12"
            stroke="currentColor" strokeWidth="1"
            transform={`rotate(${a})`}/>
        ))}
        {[0,60,120].map(a => [
          <line key={`${a}a`} x1="0" y1="-9" x2="-4" y2="-6" stroke="currentColor" strokeWidth="0.8" transform={`rotate(${a})`}/>,
          <line key={`${a}b`} x1="0" y1="-9" x2="4" y2="-6" stroke="currentColor" strokeWidth="0.8" transform={`rotate(${a})`}/>,
        ])}
      </g>
      {/* Snowflake 2 — smaller */}
      <g transform="translate(160,50)" opacity="0.25">
        {[0,60,120].map(a => (
          <line key={a} x1="0" y1="-7" x2="0" y2="7"
            stroke="currentColor" strokeWidth="0.8"
            transform={`rotate(${a})`}/>
        ))}
      </g>
      {/* Ice crystal top */}
      <g transform="translate(100,15)" opacity="0.2">
        {[0,60,120].map(a => (
          <line key={a} x1="0" y1="-10" x2="0" y2="10"
            stroke="currentColor" strokeWidth="0.8"
            transform={`rotate(${a})`}/>
        ))}
      </g>
    </svg>
  </div>
);

export default function LocationAccent({ locationId }) {
  const accents = ACCENTS[locationId] || [];

  return (
    <>
      <FrostAccent />
      {accents.map((accent, i) => (
        <div
          key={i}
          className="location-accent"
          style={{
            left: accent.x,
            top: accent.y,
            width: accent.size,
            height: accent.size,
            opacity: accent.opacity,
          }}
        >
          {accent.element}
        </div>
      ))}
    </>
  );
}
