// src/components/BaseCamp.jsx
import { useState } from 'react';
import { LOCATIONS } from '../data/locations';
import { useCamp } from '../hooks/useCamp';
import { useCoins } from '../hooks/useCoins';
import LocationPicker from './LocationPicker';
import PlantCard from './PlantCard';
import AnimalCompanion from './AnimalCompanion';

const SHOP_TABS = ['Build', 'Grow', 'Care'];

export default function BaseCamp() {
  const { camp, startCamp, buyItem, placeItem, removeFromCell,
          progressAnimalTrust, nameAnimal, buyAnimalItem,
          getDaysAtCamp, isMonthlyTransitionDue, leaveCamp, GRID_SIZE } = useCamp();
  const { coins, spend, canAfford, earn } = useCoins();

  const [view, setView] = useState('camp'); // 'camp' | 'shop' | 'animal'
  const [shopTab, setShopTab] = useState('Build');
  const [dragging, setDragging] = useState(null);
  const [showTransition, setShowTransition] = useState(false);

  if (!camp) {
    return (
      <div className="basecamp-wrap">
        <LocationPicker onSelect={(id) => startCamp(id)} />
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="basecamp-wrap">
        <LocationPicker
          isTransition
          currentLocation={camp.locationId}
          onSelect={(id) => {
            if (id === camp.locationId) {
              setShowTransition(false);
            } else {
              leaveCamp();
              startCamp(id);
              setShowTransition(false);
            }
          }}
        />
      </div>
    );
  }

  const loc = LOCATIONS[camp.locationId];
  if (!loc) return null;

  const daysHere = getDaysAtCamp();
  const daysLeft = Math.max(0, 30 - daysHere);

  const handleBuyPlant = (plant) => {
    if (!canAfford(plant.cost)) return;
    spend(plant.cost);
    buyItem(plant.id);
  };

  const handleBuyStructure = (item) => {
    if (!canAfford(item.cost)) return;
    spend(item.cost);
    buyItem(item.id);
  };

  const handleBuyAnimalItem = (item) => {
    if (!canAfford(item.cost)) return;
    spend(item.cost);
    buyAnimalItem(item.id, item.happinessGain);
  };

  const handleCellDrop = (cellIndex) => {
    if (dragging) {
      placeItem(dragging, cellIndex);
      setDragging(null);
    }
  };

  const ownedItems = camp.ownedItems || [];
  const placedItems = camp.placedItems || {};

  // Items owned but not placed
  const unplaced = ownedItems.filter(id => !Object.values(placedItems).includes(id));

  // All items from this location
  const allStructures = loc.structures || [];
  const allPlants = loc.plants || [];
  const animalItems = loc.animalItems || [];

  const getItemEmoji = (id) => {
    const struct = allStructures.find(s => s.id === id);
    if (struct) return struct.emoji;
    const plant = allPlants.find(p => p.id === id);
    if (plant) return plant.emoji;
    return '📦';
  };

  return (
    <div className="basecamp-wrap">

      {/* Header */}
      <div className="camp-header">
        <div>
          <div className="section-label">Your camp</div>
          <div className="camp-location-name">{loc.name}</div>
          <div className="camp-location-sub">{loc.subtitle}</div>
        </div>
        <div className="camp-header-right">
          <div className="coin-badge">🪙 {coins}</div>
          <div className="camp-days">Day {daysHere}</div>
          {daysLeft <= 5 && daysLeft > 0 && (
            <div className="transition-hint">{daysLeft}d left</div>
          )}
          {daysLeft === 0 && (
            <button className="btn-primary camp-transition-btn" onClick={() => setShowTransition(true)}>
              A month has passed ✦
            </button>
          )}
        </div>
      </div>

      {/* View tabs */}
      <div className="camp-view-tabs">
        {['camp', 'shop', 'animal'].map(v => (
          <button
            key={v}
            className={`camp-tab ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v === 'camp' ? '🌿 Camp' : v === 'shop' ? '🛒 Shop' : `${loc.animal.emoji} ${loc.animal.name}`}
          </button>
        ))}
      </div>

      {/* CAMP VIEW — grid */}
      {view === 'camp' && (
        <div className="camp-view">
          <div className="camp-philosophy">
            <div className="cp-word">{loc.philosophy}</div>
            <div className="cp-meaning">{loc.philosophyMeaning}</div>
          </div>

          {/* Grid */}
          <div className="camp-grid">
            {Array(GRID_SIZE).fill(null).map((_, i) => {
              const placed = placedItems[i];
              return (
                <div
                  key={i}
                  className={`grid-cell ${placed ? 'occupied' : 'empty'}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleCellDrop(i)}
                  onClick={() => placed && removeFromCell(i)}
                >
                  {placed ? (
                    <span className="grid-emoji">{getItemEmoji(placed)}</span>
                  ) : (
                    <span className="grid-empty-dot" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Unplaced items tray */}
          {unplaced.length > 0 && (
            <div className="item-tray">
              <div className="tray-label">Place in your camp</div>
              <div className="tray-items">
                {unplaced.map(id => (
                  <div
                    key={id}
                    className="tray-item"
                    draggable
                    onDragStart={() => setDragging(id)}
                  >
                    {getItemEmoji(id)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="camp-tap-hint">Tap a placed item to remove · drag from below to place</div>
        </div>
      )}

      {/* SHOP VIEW */}
      {view === 'shop' && (
        <div className="shop-view">
          <div className="shop-tabs">
            {SHOP_TABS.map(t => (
              <button
                key={t}
                className={`shop-tab ${shopTab === t ? 'active' : ''}`}
                onClick={() => setShopTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {shopTab === 'Build' && (
            <div className="shop-items">
              {allStructures.map(item => (
                <div key={item.id} className={`shop-item ${ownedItems.includes(item.id) ? 'owned' : ''}`}>
                  <span className="shop-emoji">{item.emoji}</span>
                  <div className="shop-info">
                    <div className="shop-name">{item.name}</div>
                    <div className="shop-english">{item.english}</div>
                  </div>
                  {ownedItems.includes(item.id) ? (
                    <div className="plant-owned-badge">Owned</div>
                  ) : (
                    <button
                      className={`plant-buy-btn ${canAfford(item.cost) ? '' : 'disabled'}`}
                      onClick={() => handleBuyStructure(item)}
                      disabled={!canAfford(item.cost)}
                    >
                      {item.cost === 0 ? 'Free' : `🪙 ${item.cost}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {shopTab === 'Grow' && (
            <div className="shop-plants">
              {allPlants.map(plant => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  owned={ownedItems.includes(plant.id)}
                  onBuy={handleBuyPlant}
                  canAfford={canAfford(plant.cost)}
                />
              ))}
            </div>
          )}

          {shopTab === 'Care' && (
            <div className="shop-items">
              {animalItems.map(item => (
                <div key={item.id} className={`shop-item ${camp.animal?.ownedItems?.includes(item.id) ? 'owned' : ''}`}>
                  <span className="shop-emoji">{item.emoji}</span>
                  <div className="shop-info">
                    <div className="shop-name">{item.name}</div>
                    <div className="shop-english">+{item.happinessGain} happiness</div>
                  </div>
                  {camp.animal?.ownedItems?.includes(item.id) ? (
                    <div className="plant-owned-badge">✓</div>
                  ) : (
                    <button
                      className={`plant-buy-btn ${canAfford(item.cost) ? '' : 'disabled'}`}
                      onClick={() => handleBuyAnimalItem(item)}
                      disabled={!canAfford(item.cost)}
                    >
                      🪙 {item.cost}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANIMAL VIEW */}
      {view === 'animal' && (
        <div className="animal-view">
          <AnimalCompanion
            animal={camp.animal}
            animalData={{ ...loc.animal, items: animalItems }}
            onName={nameAnimal}
            onBuyItem={handleBuyAnimalItem}
            coins={coins}
            canAfford={canAfford}
          />
          <button
            className="btn-ghost trust-btn"
            onClick={progressAnimalTrust}
            style={{ marginTop: '12px', width: '100%' }}
          >
            Spend time near them (+1 trust)
          </button>
        </div>
      )}
    </div>
  );
}
