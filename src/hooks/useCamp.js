// src/hooks/useCamp.js
import { useLocalStorage } from './useLocalStorage';

const GRID_SIZE = 16; // 4x4 grid

const defaultCamp = (locationId) => ({
  locationId,
  startedAt: Date.now(),
  stage: 1,
  grid: Array(GRID_SIZE).fill(null),
  ownedItems: ['tent'],
  placedItems: { 0: 'tent' },
  animal: {
    trustLevel: 0,
    maxTrust: 5,
    named: false,
    name: null,
    happiness: 0,
    ownedItems: [],
    arrived: false,
  },
  harvestLog: [],
  monthlyStory: [],
});

export function useCamp() {
  const [camp, setCamp] = useLocalStorage('camp', null);

  const startCamp = (locationId) => {
    setCamp(defaultCamp(locationId));
  };

  const buyItem = (itemId) => {
    setCamp(c => ({
      ...c,
      ownedItems: [...(c.ownedItems || []), itemId],
    }));
  };

  const placeItem = (itemId, cellIndex) => {
    setCamp(c => ({
      ...c,
      placedItems: { ...(c.placedItems || {}), [cellIndex]: itemId },
    }));
  };

  const removeFromCell = (cellIndex) => {
    setCamp(c => {
      const placed = { ...(c.placedItems || {}) };
      delete placed[cellIndex];
      return { ...c, placedItems: placed };
    });
  };

  const progressAnimalTrust = () => {
    setCamp(c => {
      if (!c) return c;
      const animal = c.animal;
      if (animal.trustLevel >= animal.maxTrust) return c;
      const newTrust = animal.trustLevel + 1;
      const arrived = newTrust >= 2;
      return { ...c, animal: { ...animal, trustLevel: newTrust, arrived } };
    });
  };

  const nameAnimal = (name) => {
    setCamp(c => ({
      ...c,
      animal: { ...c.animal, named: true, name },
    }));
  };

  const buyAnimalItem = (itemId, happinessGain) => {
    setCamp(c => ({
      ...c,
      animal: {
        ...c.animal,
        happiness: Math.min(100, (c.animal.happiness || 0) + happinessGain),
        ownedItems: [...(c.animal.ownedItems || []), itemId],
      },
    }));
  };

  const advanceStage = (stage) => {
    setCamp(c => ({ ...c, stage }));
  };

  const leaveCamp = () => {
    setCamp(c => {
      if (!c) return null;
      return {
        ...c,
        monthlyStory: [...(c.monthlyStory || []), {
          locationId: c.locationId,
          startedAt: c.startedAt,
          endedAt: Date.now(),
          stage: c.stage,
          animalName: c.animal?.name,
          ownedItems: c.ownedItems,
        }],
      };
    });
    setCamp(null);
  };

  const getDaysAtCamp = () => {
    if (!camp) return 0;
    return Math.floor((Date.now() - camp.startedAt) / (24 * 60 * 60 * 1000));
  };

  const isMonthlyTransitionDue = () => {
    if (!camp) return false;
    return getDaysAtCamp() >= 30;
  };

  return {
    camp,
    startCamp,
    buyItem,
    placeItem,
    removeFromCell,
    progressAnimalTrust,
    nameAnimal,
    buyAnimalItem,
    advanceStage,
    leaveCamp,
    getDaysAtCamp,
    isMonthlyTransitionDue,
    GRID_SIZE,
  };
}
