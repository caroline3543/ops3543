// src/components/AnimalCompanion.jsx
import { useState } from 'react';

export default function AnimalCompanion({ animal, animalData, onName, onBuyItem, coins, canAfford }) {
  const [showNaming, setShowNaming] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showItems, setShowItems] = useState(false);

  const trustPct = (animal.trustLevel / animal.maxTrust) * 100;
  const trustMsg = animalData.trust[Math.min(animal.trustLevel, animalData.trust.length - 1)];

  const handleName = () => {
    if (!nameInput.trim()) return;
    onName(nameInput.trim());
    setShowNaming(false);
  };

  if (!animal.arrived) {
    return (
      <div className="animal-card not-arrived">
        <div className="animal-emoji-large">{animalData.emoji}</div>
        <div className="animal-title">{animalData.name}</div>
        <div className="animal-english">{animalData.englishName}</div>
        <div className="animal-desc">{animalData.description}</div>
        <div className="animal-trust-section">
          <div className="animal-trust-label">Trust</div>
          <div className="trust-track">
            <div className="trust-fill" style={{ width: `${trustPct}%` }} />
          </div>
          <div className="animal-trust-msg">{trustMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-card arrived">
      <div className="animal-header">
        <span className="animal-emoji-large">{animalData.emoji}</span>
        <div>
          {animal.named ? (
            <>
              <div className="animal-given-name">{animal.name}</div>
              <div className="animal-species">{animalData.name} · {animalData.englishName}</div>
            </>
          ) : (
            <>
              <div className="animal-title">{animalData.name}</div>
              <div className="animal-english">{animalData.englishName}</div>
            </>
          )}
        </div>
        <div className="animal-happy-badge">
          {animal.happiness >= 80 ? '😊' : animal.happiness >= 40 ? '🙂' : '😐'}
          <span>{animal.happiness}%</span>
        </div>
      </div>

      {!animal.named && (
        <div className="animal-naming-prompt">
          <div className="naming-prompt-text">{animalData.namingPrompt}</div>
          {!showNaming ? (
            <button className="btn-primary animal-name-btn" onClick={() => setShowNaming(true)}>
              Give them a name 🌿
            </button>
          ) : (
            <div className="naming-form">
              <input
                className="text-input"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleName()}
                placeholder="Their name..."
                autoFocus
              />
              <button className="btn-primary" onClick={handleName}>Confirm</button>
            </div>
          )}
        </div>
      )}

      <div className="animal-happiness">
        <div className="animal-trust-label">Happiness</div>
        <div className="trust-track">
          <div className="trust-fill happiness-fill" style={{ width: `${animal.happiness}%` }} />
        </div>
      </div>

      <button className="btn-ghost animal-care-btn" onClick={() => setShowItems(!showItems)}>
        {showItems ? 'Close ↑' : 'How are they doing? ↓'}
      </button>

      {showItems && (
        <div className="animal-items">
          {animalData.items?.map(item => (
            <div key={item.id} className={`animal-item ${animal.ownedItems?.includes(item.id) ? 'owned' : ''}`}>
              <span>{item.emoji}</span>
              <div className="animal-item-info">
                <div className="animal-item-name">{item.name}</div>
                <div className="animal-item-effect">+{item.happinessGain} happiness</div>
              </div>
              {!animal.ownedItems?.includes(item.id) && (
                <button
                  className={`plant-buy-btn ${canAfford(item.cost) ? '' : 'disabled'}`}
                  onClick={() => canAfford(item.cost) && onBuyItem(item)}
                >
                  🪙 {item.cost}
                </button>
              )}
              {animal.ownedItems?.includes(item.id) && (
                <div className="plant-owned-badge">✓</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
