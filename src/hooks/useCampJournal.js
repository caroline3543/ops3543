// src/hooks/useCampJournal.js
// The camp journal — writes itself based on events
import { useLocalStorage } from './useLocalStorage';

const JOURNAL_EVENTS = {
  firstDay:      (name, loc) => `${name} arrived at ${loc}. The fire was already going.`,
  day3:          (name) => `${name} found a smooth stone near the fire. Kept it.`,
  day7:          (name) => `A week here. ${name} is starting to know where everything is.`,
  day14:         (name) => `Two weeks. The camp feels different now. Less temporary.`,
  day21:         (name) => `${name} sat by the fire for a long time tonight without doing anything. That felt right.`,
  day30:         (name) => `A month. ${name} knows this place now. It knows her too.`,
  animalArrived: (name, animal) => `${animal} appeared at the edge of the clearing. ${name} didn't move. Neither did they.`,
  animalNamed:   (name, animal, animalName) => `${name} named the ${animal} ${animalName}. It looked up when she said it.`,
  animalTrust2:  (name, animal) => `The ${animal} came closer today. Close enough to really see.`,
  animalTrust5:  (name, animal) => `${name} and the ${animal} sat together for the first time without either of them moving away.`,
  firstPlant:    (name) => `${name} planted something today. It felt like a decision to stay.`,
  firstHarvest:  (name) => `First harvest. Small, imperfect, entirely hers.`,
  hutBuilt:      (name) => `The hut is finished. ${name} stood in the doorway for a while before going in.`,
  hatWorn:       (name) => `${name} found a hat that fits. She's kept it on all day.`,
  blanketOwned:  (name) => `The blanket arrived. Tonight the fire felt less necessary.`,
  lanternLit:    (name) => `The lantern glows at night now. The camp looks like somewhere people live.`,
  fieldGuide:    (name) => `${name} has been reading the field guide. Learning the names of things.`,
  fishingLine:   (name) => `${name} tried fishing today. Patience she didn't know she had.`,
  secret1:       (name) => `${name} noticed something in the grass. A four-leaf clover. She almost missed it.`,
  allTasksDone:  (name) => `${name} did everything she set out to do today. That doesn't happen often. It happened today.`,
};

export function useCampJournal() {
  const [journal, setJournal] = useLocalStorage('campJournal', []);

  const addEntry = (key, params = []) => {
    const fn = JOURNAL_EVENTS[key];
    if (!fn) return;
    const text = fn(...params);
    const entry = {
      id: Date.now(),
      text,
      date: new Date().toLocaleDateString('en-NZ', { month:'short', day:'numeric' }),
      key,
    };
    setJournal(prev => {
      // Don't duplicate the same key within 24h
      const recent = prev.find(e => e.key === key && Date.now() - e.id < 86400000);
      if (recent) return prev;
      return [entry, ...prev].slice(0, 50); // keep last 50 entries
    });
  };

  const clearJournal = () => setJournal([]);

  return { journal, addEntry, clearJournal };
}
