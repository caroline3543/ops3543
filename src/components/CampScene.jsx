// src/components/CampScene.jsx
// Living camp scene — layered SVG with day/night, seasons, growth over time
// Items purchased appear in the scene. Camp evolves visually over days.

import { useMemo } from 'react';
import CamperSVG from './CamperSVG';
import { Campfire } from './CampAnimations';

// Time of day from UTC hour
function getTimeOfDay(utcHour) {
  if (utcHour >= 5  && utcHour < 8)  return 'dawn';
  if (utcHour >= 8  && utcHour < 17) return 'day';
  if (utcHour >= 17 && utcHour < 20) return 'dusk';
  return 'night';
}

// Season from month (southern hemisphere aware for NZ)
function getSeason(month, locationId) {
  const isNZ = locationId === 'nz';
  if (isNZ) {
    if (month >= 11 || month <= 1) return 'summer';
    if (month >= 2  && month <= 4) return 'autumn';
    if (month >= 5  && month <= 7) return 'winter';
    return 'spring';
  }
  if (month >= 2  && month <= 4) return 'spring';
  if (month >= 5  && month <= 7) return 'summer';
  if (month >= 8  && month <= 10) return 'autumn';
  return 'winter';
}

// Sky gradients per time of day
const SKY_GRADIENTS = {
  dawn:  ['#ffb347','#ff8c69','#ffd5b8'],
  day:   ['#87ceeb','#b0d8f0','#e8f4f8'],
  dusk:  ['#ff6b6b','#ffa07a','#ffd4a8'],
  night: ['#0a0a2e','#1a1a4e','#2a2a5e'],
};

// Location-specific background elements
function LocationBackground({ locationId, season, timeOfDay, dayAge }) {
  const isNight = timeOfDay === 'night';

  if (locationId === 'japan') {
    const hasBlossoms = season === 'spring';
    const hasAutumnLeaves = season === 'autumn';
    return (
      <g className="location-bg">
        {/* Mountains */}
        <path d="M0,180 Q80,100 160,140 Q240,100 320,130 L320,320 L0,320Z" fill="#2d4a3e" opacity="0.6"/>
        <path d="M0,200 Q60,150 120,170 Q180,150 240,165 Q280,155 320,160 L320,320 L0,320Z" fill="#3d5a4e" opacity="0.7"/>
        {/* Cherry tree */}
        <rect x="240" y="140" width="8" height="60" rx="3" fill="#6b4c2a"/>
        {hasBlossoms ? (
          <>
            <circle cx="244" cy="130" r="28" fill="#ffb7c5" opacity="0.85"/>
            <circle cx="228" cy="138" r="18" fill="#ffb7c5" opacity="0.75"/>
            <circle cx="260" cy="135" r="22" fill="#ffc0cb" opacity="0.8"/>
            {/* Falling petals */}
            {[0,1,2,3,4].map(i=>(
              <ellipse key={i} cx={220+i*15} cy={160+i*8} rx="4" ry="2.5"
                fill="#ffb7c5" opacity={0.6-i*0.1} transform={`rotate(${i*30} ${220+i*15} ${160+i*8})`}
                className="petal-drift"/>
            ))}
          </>
        ) : hasAutumnLeaves ? (
          <>
            <circle cx="244" cy="130" r="28" fill="#d4704a" opacity="0.9"/>
            <circle cx="228" cy="138" r="18" fill="#c4603a" opacity="0.8"/>
            <circle cx="260" cy="135" r="22" fill="#e48050" opacity="0.85"/>
          </>
        ) : (
          <>
            <circle cx="244" cy="128" r="30" fill="#2d5a2d" opacity="0.85"/>
            <circle cx="226" cy="138" r="20" fill="#3d6a3d" opacity="0.8"/>
            <circle cx="262" cy="134" r="24" fill="#254a25" opacity="0.75"/>
          </>
        )}
        {/* Bamboo */}
        {[0,1,2].map(i=>(
          <g key={i} transform={`translate(${260+i*12},${150+i*5})`}>
            <rect x="-2" y="0" width="4" height={50+i*10} rx="2" fill="#5d8a3c" opacity="0.8"/>
            {[8,18,28,38].map((y,j)=>(
              <line key={j} x1="-2" y1={y} x2="2" y2={y} stroke="#7aaa4a" strokeWidth="0.8"/>
            ))}
          </g>
        ))}
        {/* Stone lantern */}
        {dayAge >= 7 && (
          <g transform="translate(60,195)">
            <rect x="-6" y="-20" width="12" height="20" rx="2" fill="#8a8a7a"/>
            <rect x="-8" y="-22" width="16" height="4" rx="1" fill="#9a9a8a"/>
            <path d="M-7,-22 L0,-30 L7,-22Z" fill="#8a8a7a"/>
            {isNight && <circle cx="0" cy="-12" r="4" fill="#fcd34d" opacity="0.6"/>}
            <rect x="-3" y="0" width="6" height="8" rx="1" fill="#7a7a6a"/>
          </g>
        )}
      </g>
    );
  }

  if (locationId === 'nz') {
    return (
      <g className="location-bg">
        {/* Hills */}
        <path d="M0,180 Q80,120 160,150 Q240,120 320,145 L320,320 L0,320Z" fill="#2d5a2d" opacity="0.7"/>
        {/* Tree ferns */}
        {[0,1,2].map(i=>(
          <g key={i} transform={`translate(${240+i*20},${155+i*5})`}>
            <rect x="-2" y="-10" width="4" height="60" rx="2" fill="#4a7a2a"/>
            {[-40,-25,-10,5,20,35].map((angle,j)=>(
              <path key={j} d={`M0,${j*8} Q${20*Math.cos(angle*Math.PI/180)},${8+j*8} ${14*Math.cos(angle*Math.PI/180)},${16+j*8}`}
                fill="none" stroke="#5a8a3a" strokeWidth="1.5" strokeLinecap="round"/>
            ))}
          </g>
        ))}
        {/* Rimu tree */}
        <rect x="56" y="155" width="10" height="55" rx="4" fill="#5a3a1a"/>
        <ellipse cx="62" cy="148" rx="22" ry="18" fill="#2d5a2d"/>
        <ellipse cx="50" cy="158" rx="14" ry="12" fill="#3d6a3d"/>
        <ellipse cx="74" cy="155" rx="16" ry="13" fill="#254a25"/>
        {/* Harakeke (flax) */}
        {dayAge >= 5 && [0,1,2].map(i=>(
          <path key={i} d={`M${70+i*8},${220-i*5} Q${66+i*8},${200-i*5} ${72+i*8},${185-i*5}`}
            fill="none" stroke="#4a7a2a" strokeWidth="2.5" strokeLinecap="round"/>
        ))}
      </g>
    );
  }

  if (locationId === 'scotland') {
    return (
      <g className="location-bg">
        {/* Moors */}
        <path d="M0,175 Q80,155 160,165 Q240,155 320,160 L320,320 L0,320Z"
          fill={season==='summer'?'#9a6a8a':'#6a5a4a'} opacity="0.7"/>
        {/* Heather */}
        {season==='summer' && [0,1,2,3,4].map(i=>(
          <circle key={i} cx={30+i*50} cy={185+Math.sin(i)*8} r={12+i%3*4}
            fill="#9a4a8a" opacity={0.6+i*0.05}/>
        ))}
        {/* Rowan tree */}
        <rect x="240" y="150" width="10" height="55" rx="3" fill="#5a3a1a"/>
        <circle cx="246" cy="142" r="24" fill="#3d5a2d"/>
        <circle cx="232" cy="150" r="16" fill="#4d6a3d"/>
        {season==='autumn' && (
          <>
            <circle cx="246" cy="142" r="5" fill="#cc4444" opacity="0.9"/>
            <circle cx="254" cy="148" r="4" fill="#cc3333" opacity="0.8"/>
            <circle cx="238" cy="150" r="4" fill="#dd4444" opacity="0.85"/>
          </>
        )}
        {/* Stone wall */}
        {dayAge >= 10 && (
          <g>
            {[0,1,2,3,4,5,6,7].map(i=>(
              <rect key={i} x={i*28} y={215+(i%2)*4} width="26" height="14" rx="2"
                fill="#7a7a6a" stroke="#5a5a4a" strokeWidth="0.5"/>
            ))}
          </g>
        )}
      </g>
    );
  }

  if (locationId === 'thailand') {
    return (
      <g className="location-bg">
        {/* Jungle background */}
        <path d="M0,170 Q80,140 160,160 Q240,140 320,155 L320,320 L0,320Z" fill="#1a5a1a" opacity="0.7"/>
        {/* Banana palms */}
        {[0,1].map(i=>(
          <g key={i} transform={`translate(${240+i*30},${160+i*10})`}>
            <path d="M0,0 Q-5,-30 0,-60" fill="none" stroke="#4a7a1a" strokeWidth="6" strokeLinecap="round"/>
            {[-50,-20,10,40].map((angle,j)=>(
              <path key={j} d={`M0,${-15-j*12} Q${25*Math.cos(angle*Math.PI/180)},${-20-j*12} ${40*Math.cos(angle*Math.PI/180)},${-10-j*12}`}
                fill="#5a9a2a" stroke="#4a8a1a" strokeWidth="0.5" strokeLinecap="round"/>
            ))}
          </g>
        ))}
        {/* Spirit house */}
        {dayAge >= 7 && (
          <g transform="translate(60,185)">
            <rect x="-4" y="-25" width="20" height="25" rx="1" fill="#c4843a"/>
            <path d="M-6,-25 L8,-38 L22,-25Z" fill="#d4943a"/>
            <rect x="-4" y="-14" width="20" height="3" rx="1" fill="#a46a2a" opacity="0.5"/>
            <rect x="0" y="0" width="4" height="8" rx="1" fill="#8a5a1a"/>
          </g>
        )}
        {/* Lotus if water */}
        {dayAge >= 14 && (
          <g transform="translate(280,215)">
            <ellipse cx="0" cy="0" rx="15" ry="6" fill="#1a4a6a" opacity="0.5"/>
            {[0,72,144,216,288].map((a,i)=>(
              <ellipse key={i} cx={8*Math.cos(a*Math.PI/180)} cy={4*Math.sin(a*Math.PI/180)}
                rx="5" ry="3" fill="#ffb7c5"
                transform={`rotate(${a} ${8*Math.cos(a*Math.PI/180)} ${4*Math.sin(a*Math.PI/180)})`}/>
            ))}
          </g>
        )}
      </g>
    );
  }

  if (locationId === 'pnw') {
    return (
      <g className="location-bg">
        <path d="M0,165 Q80,130 160,150 Q240,130 320,145 L320,320 L0,320Z" fill="#1a3a1a" opacity="0.7"/>
        {/* Cedar trees */}
        {[0,1,2].map(i=>(
          <g key={i} transform={`translate(${240+i*22},${145+i*5})`}>
            <rect x="-3" y="0" width="6" height={65+i*8} rx="2" fill="#4a2a0a"/>
            {[0,1,2,3,4].map((j)=>(
              <path key={j} d={`M${-(15-j*2)},${j*12} L0,${j*12-8} L${15-j*2},${j*12}Z`}
                fill="#2d5a1a" opacity={0.8+j*0.03}/>
            ))}
          </g>
        ))}
        {/* Ferns */}
        {dayAge >= 5 && [0,1,2].map(i=>(
          <g key={i} transform={`translate(${55+i*15},${215-i*5})`}>
            {[-30,-10,10,30].map((a,j)=>(
              <path key={j} d={`M0,0 Q${18*Math.sin(a*Math.PI/180)},${-10} ${14*Math.sin(a*Math.PI/180)},${-20}`}
                fill="none" stroke="#3d6a1a" strokeWidth="2" strokeLinecap="round"/>
            ))}
          </g>
        ))}
        {/* Story pole */}
        {dayAge >= 14 && (
          <g transform="translate(62,160)">
            <rect x="-4" y="0" width="8" height="55" rx="2" fill="#6b4a2a"/>
            <path d="M-6,5 L0,-5 L6,5Z" fill="#c44a1a"/>
            <ellipse cx="0" cy="15" rx="6" ry="5" fill="#4a8a4a"/>
            <path d="M-5,25 L0,20 L5,25" fill="#c4841a"/>
          </g>
        )}
      </g>
    );
  }

  if (locationId === 'okinawa') {
    return (
      <g className="location-bg">
        {/* Sea */}
        <path d="M0,200 Q80,190 160,195 Q240,188 320,193 L320,320 L0,320Z" fill="#1a6a9a" opacity="0.5"/>
        {/* Sky/sea horizon shimmer */}
        <path d="M0,205 Q160,195 320,200" fill="none" stroke="#5ab8d4" strokeWidth="1" opacity="0.4"/>
        {/* Hibiscus hedge */}
        {dayAge >= 5 && (
          <g>
            {[0,1,2,3].map(i=>(
              <g key={i} transform={`translate(${240+i*18},${180+i%2*5})`}>
                <circle cx="0" cy="0" r="12" fill="#3d7a3d"/>
                {[0,72,144,216,288].map((a,j)=>(
                  <ellipse key={j}
                    cx={7*Math.cos(a*Math.PI/180)} cy={7*Math.sin(a*Math.PI/180)}
                    rx="4" ry="2.5" fill="#e83060"
                    transform={`rotate(${a} ${7*Math.cos(a*Math.PI/180)} ${7*Math.sin(a*Math.PI/180)})`}/>
                ))}
              </g>
            ))}
          </g>
        )}
        {/* Coral wall */}
        {dayAge >= 10 && [0,1,2,3,4,5,6].map(i=>(
          <rect key={i} x={i*28} y={218+(i%2)*3} width="26" height="12" rx="3"
            fill="#e8c8a8" stroke="#d4a888" strokeWidth="0.5"/>
        ))}
      </g>
    );
  }

  // Default background
  return (
    <g>
      <path d="M0,180 Q160,150 320,165 L320,320 L0,320Z" fill="#3d5a3d" opacity="0.6"/>
    </g>
  );
}

// Ground layer — base terrain
function GroundLayer({ timeOfDay }) {
  const isNight = timeOfDay === 'night';
  return (
    <g>
      <ellipse cx="160" cy="260" rx="160" ry="60" fill={isNight?'#1a2a1a':'#4a6a3a'} opacity="0.8"/>
      <ellipse cx="160" cy="255" rx="140" ry="45" fill={isNight?'#243424':'#5a7a4a'} opacity="0.9"/>
      {/* Grass tufts */}
      {[30,70,110,190,230,270].map((x,i)=>(
        <g key={i} transform={`translate(${x},${240+i%3*4})`}>
          <path d="M0,0 Q-3,-8 0,-12 Q3,-8 0,0" fill={isNight?'#2a3a2a':'#6a8a5a'} opacity="0.7"/>
          <path d="M3,0 Q0,-6 3,-10 Q6,-6 3,0" fill={isNight?'#2a3a2a':'#7a9a6a'} opacity="0.6"/>
        </g>
      ))}
      {/* Path stones if owned */}
      {[0,1,2,3].map(i=>(
        <ellipse key={i} cx={100+i*30} cy={255} rx="8" ry="4"
          fill={isNight?'#4a5a4a':'#8a9a7a'} opacity="0.5"/>
      ))}
    </g>
  );
}

// Stars for night sky
function Stars({ count = 40 }) {
  const stars = useMemo(() => {
    const s = [];
    for (let i = 0; i < count; i++) {
      s.push({
        x: Math.random() * 320,
        y: Math.random() * 140,
        r: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 3,
      });
    }
    return s;
  }, []);

  return (
    <g className="stars-layer">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.opacity}
          className="star-twinkle" style={{ animationDelay: `${s.delay}s` }}/>
      ))}
    </g>
  );
}

// Campfire in scene
function SceneFire({ timeOfDay, owned }) {
  if (!owned) return null;
  const x = 145, y = 230;
  const isNight = timeOfDay === 'night';

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Fire glow on ground at night */}
      {isNight && (
        <ellipse cx="0" cy="8" rx="40" ry="16" fill="#f97316" opacity="0.1" className="fire-ground-glow"/>
      )}
      {/* Stones ring */}
      {[-15,-10,-5,0,5,10,15].map((dx,i)=>(
        <ellipse key={i} cx={dx} cy={12+Math.abs(dx)/3} rx="5" ry="3" fill="#6b7280" opacity="0.8"/>
      ))}
      {/* Log base */}
      <ellipse cx="0" cy="10" rx="12" ry="3.5" fill="#6B4226" opacity="0.9"/>
      {/* Flames */}
      <path d="M0,8 C-6,2 -8,-4 -4,-10 C-2,-14 0,-8 0,-8 C0,-8 2,-14 4,-10 C8,-4 6,2 0,8Z"
        fill="#FF8C00" className="flame-1"/>
      <path d="M0,6 C-4,1 -5,-4 -2,-8 C-1,-11 0,-6 0,-6 C0,-6 1,-11 2,-8 C5,-4 4,1 0,6Z"
        fill="#FFA500" className="flame-2"/>
      <path d="M0,4 C-2,0 -3,-3 -1,-6 C0,-8 0,-4 0,-4 C0,-4 0,-8 1,-6 C3,-3 2,0 0,4Z"
        fill="#FFD700" className="flame-3"/>
      {/* Ember glow */}
      <ellipse cx="0" cy="9" rx="8" ry="2.5" fill="#FF6B2B" opacity="0.6" className="ember-glow"/>
    </g>
  );
}

// Plants/garden layer — grows over time
function GardenLayer({ ownedItems, dayAge, timeOfDay }) {
  const plantItems = ownedItems.filter(id =>
    ['kumara','kawakawa','harakeke','puha','feijoa','wasabi','shiso','bamboo_shoot','yuzu',
     'camas','salal','fiddlehead','heather','rowan','sea_kale','goya','beni_imo','hibiscus',
     'lemongrass','galangal','sticky_rice'].includes(id)
  );

  if (plantItems.length === 0) return null;

  const growthStage = Math.min(1, dayAge / 14); // 0 to 1 over 14 days

  return (
    <g className="garden-layer">
      {plantItems.slice(0,6).map((plant, i) => {
        const x = 60 + i * 32;
        const y = 240;
        const h = 8 + growthStage * 24; // grows from 8 to 32
        const bloom = growthStage > 0.6;

        return (
          <g key={plant} transform={`translate(${x},${y})`}>
            {/* Soil mound */}
            <ellipse cx="0" cy="2" rx="10" ry="3" fill="#5a3a1a" opacity="0.5"/>
            {/* Stem */}
            <path d={`M0,0 Q${Math.sin(i)*3},${-h/2} 0,${-h}`}
              fill="none" stroke="#4a7a2a" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Leaves */}
            {bloom ? (
              <>
                <ellipse cx="-6" cy={-h*0.6} rx="6" ry="3" fill="#5a8a2a" opacity="0.85"
                  transform={`rotate(-30 -6 ${-h*0.6})`}/>
                <ellipse cx="6" cy={-h*0.5} rx="6" ry="3" fill="#4a7a2a" opacity="0.8"
                  transform={`rotate(30 6 ${-h*0.5})`}/>
                {/* Flower/fruit */}
                <circle cx="0" cy={-h} r="4" fill={
                  plant.includes('feijoa')?'#7dc47a':
                  plant.includes('heather')?'#9a4a8a':
                  plant.includes('hibiscus')?'#e83060':'#ffb7c5'
                } opacity="0.9"/>
              </>
            ) : (
              <>
                <ellipse cx="-4" cy={-h*0.5} rx="4" ry="2" fill="#5a8a2a" opacity="0.7"
                  transform={`rotate(-20 -4 ${-h*0.5})`}/>
                <ellipse cx="4" cy={-h*0.4} rx="4" ry="2" fill="#4a7a2a" opacity="0.65"
                  transform={`rotate(20 4 ${-h*0.4})`}/>
                {/* Bud */}
                <circle cx="0" cy={-h} r="2.5" fill="#7aaa4a" opacity="0.8"/>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

// Structure layer
function StructureLayer({ ownedItems, dayAge }) {
  const hasHut     = ownedItems.includes('hut');
  const hasTent    = ownedItems.includes('tent') || true; // always start with tent
  const hasPorch   = ownedItems.includes('porch');
  const hasStorage = ownedItems.includes('storage');
  const hasWall    = ownedItems.includes('stone_wall') || ownedItems.includes('stone_wall');
  const hasTorii   = ownedItems.includes('torii');

  return (
    <g className="structure-layer">
      {hasHut ? (
        // Full hut
        <g transform="translate(30,175)">
          {hasPorch && (
            <g>
              <rect x="-5" y="35" width="80" height="8" rx="2" fill="#8B6914" opacity="0.9"/>
              <rect x="0" y="30" width="4" height="12" rx="1" fill="#7a5a10"/>
              <rect x="66" y="30" width="4" height="12" rx="1" fill="#7a5a10"/>
            </g>
          )}
          {/* Walls */}
          <rect x="5" y="30" width="65" height="40" rx="3" fill="#c4843a" stroke="#a0642a" strokeWidth="0.8"/>
          {/* Roof */}
          <path d="M0,32 L37,-5 L75,32Z" fill="#8B4513" stroke="#6b3010" strokeWidth="0.8"/>
          <path d="M5,32 L37,2 L70,32Z" fill="#a05020" opacity="0.6"/>
          {/* Door */}
          <rect x="28" y="48" width="18" height="22" rx="2" fill="#7a4a18"/>
          <circle cx="40" cy="60" r="1.5" fill="#fcd34d"/>
          {/* Windows */}
          <rect x="8" y="38" width="14" height="12" rx="2" fill="#87ceeb" opacity="0.8"/>
          <rect x="53" y="38" width="14" height="12" rx="2" fill="#87ceeb" opacity="0.8"/>
          {/* Window cross */}
          <line x1="15" y1="38" x2="15" y2="50" stroke="#7a6a4a" strokeWidth="0.5"/>
          <line x1="8" y1="44" x2="22" y2="44" stroke="#7a6a4a" strokeWidth="0.5"/>
          {hasStorage && (
            <g transform="translate(68,10)">
              <rect x="0" y="20" width="20" height="20" rx="2" fill="#a0704a"/>
              <path d="M-2,22 L10,14 L22,22Z" fill="#8B5523"/>
            </g>
          )}
        </g>
      ) : (
        // Tent
        <g transform="translate(40,195)">
          <path d="M0,40 L35,0 L70,40Z" fill="#7a8a6a" stroke="#5a6a4a" strokeWidth="0.8"/>
          <path d="M8,40 L35,5 L62,40Z" fill="#8a9a7a" opacity="0.6"/>
          {/* Door flap */}
          <path d="M28,40 L35,18 L42,40Z" fill="#4a5a3a"/>
          {/* Guy ropes */}
          <line x1="0" y1="40" x2="-10" y2="50" stroke="#8a7a5a" strokeWidth="0.8" strokeDasharray="2,1"/>
          <line x1="70" y1="40" x2="80" y2="50" stroke="#8a7a5a" strokeWidth="0.8" strokeDasharray="2,1"/>
        </g>
      )}

      {/* Torii gate (Japan) */}
      {hasTorii && (
        <g transform="translate(240,180)">
          <rect x="0" y="-30" width="5" height="50" rx="1" fill="#c44a1a"/>
          <rect x="35" y="-30" width="5" height="50" rx="1" fill="#c44a1a"/>
          <rect x="-5" y="-32" width="50" height="6" rx="2" fill="#c44a1a"/>
          <rect x="-2" y="-24" width="44" height="4" rx="1" fill="#c44a1a"/>
        </g>
      )}
    </g>
  );
}

// Moon
function Moon() {
  return (
    <g>
      <circle cx="260" cy="50" r="18" fill="#fef3c7"/>
      <circle cx="268" cy="44" r="16" fill="#1a1a4e"/>
      <circle cx="260" cy="50" r="18" fill="none" stroke="#fef9c3" strokeWidth="0.5" opacity="0.5"/>
    </g>
  );
}

export default function CampScene({
  locationId = 'nz',
  ownedItems = [],
  ownedAnimalItems = [],
  animalTrust = 0,
  animalName = null,
  dayAge = 0,
  onItemTap = () => {},
  commanderName = 'you',
}) {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const month = now.getMonth();
  const timeOfDay = getTimeOfDay(utcHour);
  const season = getSeason(month, locationId);
  const isNight = timeOfDay === 'night';
  const isDawn = timeOfDay === 'dawn';
  const isDusk = timeOfDay === 'dusk';

  const skyColors = SKY_GRADIENTS[timeOfDay];

  // Camper pose based on time and items
  const hasPlantsOwned = ownedItems.some(id =>
    ['kumara','kawakawa','harakeke','wasabi','shiso','lemongrass','heather','goya'].includes(id));

  let camperPose = 'sitting';
  if (isNight && utcHour >= 23 || utcHour < 4) camperPose = 'sleeping';
  else if (hasPlantsOwned && (utcHour >= 8 && utcHour < 12)) camperPose = 'tending';

  const hasFire = ownedItems.includes('fire_pit') || ownedItems.includes('ahi') || true;

  return (
    <div className="camp-scene-wrap" onClick={e => onItemTap(e)}>
      <svg
        viewBox="0 0 320 280"
        className="camp-scene-svg"
        style={{ width: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={skyColors[0]}/>
            <stop offset="50%"  stopColor={skyColors[1]}/>
            <stop offset="100%" stopColor={skyColors[2]}/>
          </linearGradient>
          {/* Fire light gradient for night */}
          {isNight && (
            <radialGradient id="fire-light" cx="46%" cy="82%" r="35%">
              <stop offset="0%"   stopColor="#f97316" stopOpacity="0.18"/>
              <stop offset="60%"  stopColor="#f97316" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          )}
        </defs>

        {/* Sky */}
        <rect width="320" height="280" fill="url(#sky-grad)"/>

        {/* Stars at night */}
        {isNight && <Stars count={50}/>}

        {/* Moon at night */}
        {isNight && <Moon/>}

        {/* Sun at dawn/day/dusk */}
        {(isDawn || isDusk) && (
          <circle cx={isDawn?40:280} cy="60" r="20" fill={isDawn?'#ffb347':'#ff6b35'} opacity="0.8"/>
        )}
        {timeOfDay==='day' && (
          <circle cx="260" cy="40" r="22" fill="#fff7aa" opacity="0.9"/>
        )}

        {/* Location-specific background */}
        <LocationBackground locationId={locationId} season={season} timeOfDay={timeOfDay} dayAge={dayAge}/>

        {/* Ground */}
        <GroundLayer timeOfDay={timeOfDay}/>

        {/* Fire light overlay at night */}
        {isNight && hasFire && <rect width="320" height="280" fill="url(#fire-light)"/>}

        {/* Structures */}
        <StructureLayer ownedItems={ownedItems} dayAge={dayAge}/>

        {/* Garden */}
        <GardenLayer ownedItems={ownedItems} dayAge={dayAge} timeOfDay={timeOfDay}/>

        {/* Campfire */}
        <SceneFire timeOfDay={timeOfDay} owned={hasFire}/>

        {/* Camper */}
        <g transform="translate(100,110)">
          <CamperSVG
            pose={camperPose}
            items={ownedItems}
            timeOfDay={timeOfDay}
            width={120}
            height={140}
          />
        </g>

        {/* Name label at night by fire */}
        {isNight && (
          <text x="160" y="270" textAnchor="middle" fontSize="8"
            fill="white" opacity="0.4" fontStyle="italic">
            {commanderName}'s camp
          </text>
        )}
      </svg>
    </div>
  );
}
