// src/components/BaseCamp.jsx
import { useState, useEffect } from 'react';
import { LOCATIONS } from '../data/locations';
import { useCamp } from '../hooks/useCamp';
import { useCoins } from '../hooks/useCoins';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCampJournal } from '../hooks/useCampJournal';
import { SURVIVAL_ITEMS, SECRET_ITEMS } from '../hooks/useVariableReward';
import LocationPicker from './LocationPicker';
import PlantCard from './PlantCard';
import AnimalCompanion from './AnimalCompanion';
import CampScene from './CampScene';
import { AnimatedRing } from './CampAnimations';

const SHOP_TABS = ['Build', 'Grow', 'Care', 'Survival'];

export default function BaseCamp() {
  const { camp, startCamp, buyItem, placeItem, removeFromCell,
          progressAnimalTrust, nameAnimal, buyAnimalItem,
          getDaysAtCamp, isMonthlyTransitionDue, leaveCamp, GRID_SIZE } = useCamp();
  const { coins, spend, canAfford } = useCoins();
  const [commanderName] = useLocalStorage('commanderName', 'Commander');
  const { journal, addEntry } = useCampJournal();
  const [showTransition, setShowTransition] = useState(false);
  const [view, setView] = useState('scene'); // 'scene' | 'shop' | 'animal' | 'journal'
  const [shopTab, setShopTab] = useState('Build');
  const [tappedItem, setTappedItem] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState(null);

  const loc = camp ? LOCATIONS[camp.locationId] : null;
  const daysHere = camp ? getDaysAtCamp() : 0;

  // Journal milestone entries
  useEffect(() => {
    if (!camp || !loc) return;
    const n = commanderName;
    const locName = loc.name;
    const animalName = camp.animal?.name || loc.animal.name;

    if (daysHere === 0)  addEntry('firstDay',  [n, locName]);
    if (daysHere === 3)  addEntry('day3',       [n]);
    if (daysHere === 7)  addEntry('day7',       [n]);
    if (daysHere === 14) addEntry('day14',      [n]);
    if (daysHere === 21) addEntry('day21',      [n]);
    if (daysHere === 30) addEntry('day30',      [n]);

    if (camp.animal?.arrived && !camp.animal?.named)
      addEntry('animalArrived', [n, loc.animal.englishName]);
    if (camp.animal?.named)
      addEntry('animalNamed', [n, loc.animal.englishName, camp.animal.name]);
    if (camp.animal?.trustLevel >= 2)
      addEntry('animalTrust2', [n, loc.animal.englishName]);
    if (camp.animal?.trustLevel >= 5)
      addEntry('animalTrust5', [n, loc.animal.englishName]);

    // Check secret items
    SECRET_ITEMS.forEach(secret => {
      if (secret.condition(daysHere, camp.animal?.trustLevel || 0)) {
        if (!camp.ownedItems?.includes(secret.id)) {
          buyItem(secret.id);
          if (secret.journalKey) addEntry(secret.journalKey, [n]);
          setJustUnlocked(secret);
          setTimeout(() => setJustUnlocked(null), 4000);
        }
      }
    });
  }, [daysHere, camp?.animal?.trustLevel, camp?.animal?.arrived, camp?.animal?.named]);

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
        <LocationPicker isTransition currentLocation={camp.locationId}
          onSelect={(id) => {
            if (id === camp.locationId) { setShowTransition(false); }
            else { leaveCamp(); startCamp(id); setShowTransition(false); }
          }}
        />
      </div>
    );
  }

  if (!loc) return null;

  const daysLeft = Math.max(0, 30 - daysHere);
  const ownedItems = camp.ownedItems || [];
  const animalItems = loc.animalItems || [];
  const allStructures = loc.structures || [];
  const allPlants = loc.plants || [];

  const handleBuyItem = (item, cost) => {
    if (!canAfford(cost)) return;
    spend(cost);
    buyItem(item.id);
    if (item.journalKey) addEntry(item.journalKey, [commanderName]);
    if (allPlants.find(p => p.id === item.id)) addEntry('firstPlant', [commanderName]);
  };

  const handleBuyAnimalItem = (item) => {
    if (!canAfford(item.cost)) return;
    spend(item.cost);
    buyAnimalItem(item.id, item.happinessGain);
  };

  // Survival items — find next affordable one for "almost there" mechanic
  const unownedSurvival = SURVIVAL_ITEMS.filter(s => !ownedItems.includes(s.id));
  const nextItem = unownedSurvival.sort((a,b)=>a.cost-b.cost)[0];
  const coinsNeeded = nextItem ? Math.max(0, nextItem.cost - coins) : 0;

  const VIEW_TABS = [
    { id: 'scene',   label: '🌿 Camp',    },
    { id: 'shop',    label: '🛒 Shop',    },
    { id: 'animal',  label: `${loc.animal.emoji} ${camp.animal?.name || loc.animal.name}` },
    { id: 'journal', label: '📖 Journal', },
  ];

  return (
    <div className="basecamp-wrap">

      {/* Header */}
      <div className="camp-header">
        <div>
          <div className="section-label">BASE CAMP</div>
          <div className="camp-location-name">{loc.name}</div>
          <div className="camp-location-sub">{loc.subtitle}</div>
        </div>
        <div className="camp-header-right">
          <div className="coin-badge">🪙 {coins}</div>
          <div className="camp-days">Day {daysHere}</div>
          {daysLeft <= 5 && daysLeft > 0 && <div className="transition-hint">{daysLeft}d left</div>}
          {daysLeft === 0 && (
            <button className="btn-primary camp-transition-btn" onClick={() => setShowTransition(true)}>
              A month has passed ✦
            </button>
          )}
        </div>
      </div>

      {/* View tabs */}
      <div className="camp-view-tabs">
        {VIEW_TABS.map(v => (
          <button key={v.id} className={`camp-tab ${view===v.id?'active':''}`}
            onClick={() => setView(v.id)}>{v.label}</button>
        ))}
      </div>

      {/* Secret item unlock toast */}
      {justUnlocked && (
        <div className="secret-unlock-toast">
          <div className="secret-unlock-icon">✨</div>
          <div>
            <div className="secret-unlock-name">{justUnlocked.name}</div>
            <div className="secret-unlock-desc">{justUnlocked.description}</div>
          </div>
        </div>
      )}

      {/* ── SCENE VIEW ── */}
      {view === 'scene' && (
        <div className="camp-scene-container">
          <CampScene
            locationId={camp.locationId}
            ownedItems={ownedItems}
            ownedAnimalItems={camp.animal?.ownedItems || []}
            animalTrust={camp.animal?.trustLevel || 0}
            animalName={camp.animal?.name}
            dayAge={daysHere}
            commanderName={commanderName}
            onItemTap={() => {}}
          />

          {/* Philosophy */}
          <div className="camp-philosophy">
            <div className="cp-word">{loc.philosophy}</div>
            <div className="cp-meaning">{loc.philosophyMeaning}</div>
          </div>

          {/* Progress ring */}
          <div className="camp-progress-strip">
            <AnimatedRing progress={Math.min(100,(daysHere/30)*100)} size={44} color="var(--warm)"/>
            <div className="camp-progress-info">
              <div className="camp-progress-label">Day {daysHere} of 30</div>
              <div className="camp-progress-sub">{daysLeft > 0 ? `${daysLeft} days remaining` : 'A month complete'}</div>
            </div>
          </div>

          {/* "Almost there" nudge */}
          {nextItem && coinsNeeded > 0 && coinsNeeded <= 15 && (
            <div className="almost-there-nudge">
              <div className="at-text">
                <span className="at-item">{nextItem.name}</span> is almost yours —
                <span className="at-coins"> {coinsNeeded} more 🪙</span>
              </div>
              <div className="at-sub">Complete {Math.ceil(coinsNeeded/3)} task{coinsNeeded > 3 ? 's' : ''} to unlock it</div>
            </div>
          )}
        </div>
      )}

      {/* ── SHOP VIEW ── */}
      {view === 'shop' && (
        <div className="shop-view">
          <div className="shop-tabs">
            {SHOP_TABS.map(t=>(
              <button key={t} className={`shop-tab ${shopTab===t?'active':''}`}
                onClick={()=>setShopTab(t)}>{t}</button>
            ))}
          </div>

          {shopTab === 'Build' && (
            <div className="shop-items">
              {allStructures.map(item=>(
                <div key={item.id} className={`shop-item ${ownedItems.includes(item.id)?'owned':''}`}>
                  <div className="shop-item-icon">🏕️</div>
                  <div className="shop-info">
                    <div className="shop-name">{item.name}</div>
                    <div className="shop-english">{item.english}</div>
                  </div>
                  {ownedItems.includes(item.id) ? (
                    <div className="plant-owned-badge">Owned</div>
                  ) : (
                    <button className={`plant-buy-btn ${canAfford(item.cost)?'':'disabled'}`}
                      onClick={()=>handleBuyItem(item, item.cost)} disabled={!canAfford(item.cost)}>
                      {item.cost===0?'Free':`🪙 ${item.cost}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {shopTab === 'Grow' && (
            <div className="shop-plants">
              {allPlants.map(plant=>(
                <PlantCard key={plant.id} plant={plant}
                  owned={ownedItems.includes(plant.id)}
                  onBuy={p=>handleBuyItem(p, p.cost)}
                  canAfford={canAfford(plant.cost)}/>
              ))}
            </div>
          )}

          {shopTab === 'Care' && (
            <div className="shop-items">
              {animalItems.map(item=>(
                <div key={item.id} className={`shop-item ${camp.animal?.ownedItems?.includes(item.id)?'owned':''}`}>
                  <div className="shop-item-icon">{item.emoji}</div>
                  <div className="shop-info">
                    <div className="shop-name">{item.name}</div>
                    <div className="shop-english">+{item.happinessGain} happiness</div>
                  </div>
                  {camp.animal?.ownedItems?.includes(item.id) ? (
                    <div className="plant-owned-badge">✓</div>
                  ) : (
                    <button className={`plant-buy-btn ${canAfford(item.cost)?'':'disabled'}`}
                      onClick={()=>handleBuyAnimalItem(item)} disabled={!canAfford(item.cost)}>
                      🪙 {item.cost}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {shopTab === 'Survival' && (
            <div className="shop-items">
              {SURVIVAL_ITEMS.map(item=>{
                const owned = ownedItems.includes(item.id);
                const isNext = nextItem?.id === item.id;
                return (
                  <div key={item.id}
                    className={`shop-item survival-item ${owned?'owned':''} ${isNext&&!owned?'next-item':''}`}>
                    <div className="survival-category-dot" style={{
                      background: item.category==='clothing'?'var(--warm)':
                                  item.category==='tools'?'var(--accent)':'var(--purple)'
                    }}/>
                    <div className="shop-info">
                      <div className="shop-name">{item.name}</div>
                      <div className="shop-english">{item.description}</div>
                      <div className="shop-scene-effect">✦ {item.sceneEffect}</div>
                    </div>
                    {owned ? (
                      <div className="plant-owned-badge">✓ Owned</div>
                    ) : (
                      <div className="survival-buy-col">
                        {isNext && coinsNeeded > 0 && (
                          <div className="coins-needed">{coinsNeeded} more</div>
                        )}
                        <button className={`plant-buy-btn ${canAfford(item.cost)?'':'disabled'}`}
                          onClick={()=>{
                            if (!canAfford(item.cost)) return;
                            spend(item.cost);
                            buyItem(item.id);
                            if (item.journalKey) addEntry(item.journalKey, [commanderName]);
                          }} disabled={!canAfford(item.cost)}>
                          🪙 {item.cost}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Secret items owned */}
              {SECRET_ITEMS.filter(s=>ownedItems.includes(s.id)).map(item=>(
                <div key={item.id} className="shop-item secret-item">
                  <div className="secret-item-icon">✨</div>
                  <div className="shop-info">
                    <div className="shop-name">{item.name}</div>
                    <div className="shop-english">{item.description}</div>
                  </div>
                  <div className="plant-owned-badge">Found</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ANIMAL VIEW ── */}
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
          <button className="btn-ghost trust-btn" style={{margin:'12px 16px 0',width:'calc(100%-32px)'}}
            onClick={() => {
              progressAnimalTrust();
              addEntry('animalArrived', [commanderName, loc.animal.englishName]);
            }}>
            Sit quietly nearby (+1 trust)
          </button>
        </div>
      )}

      {/* ── JOURNAL VIEW ── */}
      {view === 'journal' && (
        <div className="journal-view">
          <div className="journal-header">
            <div className="section-label">CAMP JOURNAL</div>
            <div className="panel-title">{loc.name}</div>
            <div className="journal-subtitle">Day {daysHere} · {loc.subtitle}</div>
          </div>
          {journal.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <div className="empty-text">Nothing written yet.</div>
              <div className="empty-sub">The journal fills as you live here.</div>
            </div>
          ) : (
            <div className="journal-entries">
              {journal.map(entry => (
                <div key={entry.id} className="journal-entry">
                  <div className="journal-date">{entry.date}</div>
                  <div className="journal-text">{entry.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
