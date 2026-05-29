// src/components/LocationPicker.jsx
import { useState } from 'react';
import { LOCATION_LIST } from '../data/locations';

export default function LocationPicker({ onSelect, isTransition = false, currentLocation = null }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const loc = selected ? LOCATION_LIST.find(l => l.id === selected) : null;

  if (confirmed && loc) {
    return (
      <div className="location-confirm">
        <div className="lc-emoji">🌿</div>
        <div className="lc-title">You're heading to {loc.name}</div>
        <div className="lc-sub">{loc.subtitle}</div>
        <div className="lc-philosophy">
          <div className="lc-phil-word">{loc.philosophy}</div>
          <div className="lc-phil-meaning">{loc.philosophyMeaning}</div>
        </div>
        <div className="lc-landscape">{loc.landscape}</div>
        <button className="btn-primary lc-btn" onClick={() => onSelect(selected)}>
          Begin your new life
        </button>
        <button className="btn-ghost lc-btn-back" onClick={() => setConfirmed(false)}>
          ← Choose differently
        </button>
      </div>
    );
  }

  return (
    <div className="location-picker">
      {isTransition ? (
        <>
          <div className="lp-title">30 days have passed.</div>
          <div className="lp-sub">Your camp has become familiar. Do you want to stay, or is it time to find a new place?</div>
          {currentLocation && (
            <button className="btn-ghost lp-stay" onClick={() => onSelect(currentLocation)}>
              Stay in {LOCATION_LIST.find(l => l.id === currentLocation)?.name}
            </button>
          )}
          <div className="lp-divider">or choose somewhere new</div>
        </>
      ) : (
        <>
          <div className="lp-title">Where will you build your life?</div>
          <div className="lp-sub">Choose a place to call home. You'll spend 30 days here, living off the land.</div>
        </>
      )}

      <div className="location-grid">
        {LOCATION_LIST.filter(l => !isTransition || l.id !== currentLocation).map(l => (
          <button
            key={l.id}
            className={`location-card ${selected === l.id ? 'selected' : ''}`}
            onClick={() => setSelected(l.id)}
          >
            <div className="loc-name">{l.name}</div>
            <div className="loc-sub">{l.subtitle}</div>
            <div className="loc-lang">{l.language}</div>
            <div className="loc-animal">{l.animal.emoji}</div>
          </button>
        ))}
      </div>

      {selected && (
        <button className="btn-primary lp-confirm" onClick={() => setConfirmed(true)}>
          Choose {loc?.name} →
        </button>
      )}
    </div>
  );
}
