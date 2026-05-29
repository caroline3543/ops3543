// src/components/PlantCard.jsx
import { useState } from 'react';

export default function PlantCard({ plant, owned, onBuy, canAfford }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`plant-card ${owned ? 'plant-owned' : ''}`}>
      <div className="plant-top">
        <span className="plant-emoji">{plant.emoji}</span>
        <div className="plant-info">
          <div className="plant-name">{plant.name}</div>
          <div className="plant-english">{plant.english}</div>
        </div>
        {!owned && (
          <button
            className={`plant-buy-btn ${canAfford ? '' : 'disabled'}`}
            onClick={() => canAfford && onBuy(plant)}
            disabled={!canAfford}
          >
            🪙 {plant.cost}
          </button>
        )}
        {owned && <div className="plant-owned-badge">Growing</div>}
      </div>

      <div className="plant-note">{plant.culturalNote}</div>

      <button className="plant-expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Show less ↑' : 'Learn more ↓'}
      </button>

      {expanded && (
        <div className="plant-expanded">
          <div className="plant-expanded-text">{plant.expandedNote}</div>
          <div className="plant-harvest">Harvest in ~{plant.harvestDays} day{plant.harvestDays > 1 ? 's' : ''}</div>
        </div>
      )}
    </div>
  );
}
