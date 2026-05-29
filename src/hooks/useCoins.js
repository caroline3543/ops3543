// src/hooks/useCoins.js
import { useLocalStorage } from './useLocalStorage';

export const COIN_REWARDS = {
  personalTask: 3,
  eventTask: 5,
  starredBonus: 2,
  allDoneBonus: 10,
};

export function useCoins() {
  const [coins, setCoins] = useLocalStorage('coins', 0);
  const [coinLog, setCoinLog] = useLocalStorage('coinLog', []);

  const earn = (amount, reason) => {
    setCoins(c => c + amount);
    setCoinLog(log => [{
      amount, reason, ts: Date.now()
    }, ...log.slice(0, 49)]);
  };

  const spend = (amount) => {
    setCoins(c => Math.max(0, c - amount));
  };

  const canAfford = (amount) => coins >= amount;

  return { coins, earn, spend, canAfford, coinLog };
}
