// src/hooks/useHaptics.js
import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

export function useHaptics() {
  const [hapticsEnabled, setHapticsEnabled] = useLocalStorage('hapticsEnabled', true);

  const haptic = useCallback((type = 'light') => {
    if (!hapticsEnabled) return;
    if (!navigator.vibrate) return;
    switch (type) {
      case 'light':   navigator.vibrate(8);        break;
      case 'medium':  navigator.vibrate(15);       break;
      case 'success': navigator.vibrate([10, 30, 10]); break;
      case 'coin':    navigator.vibrate([5, 20, 5]);   break;
      default:        navigator.vibrate(8);
    }
  }, [hapticsEnabled]);

  return { haptic, hapticsEnabled, setHapticsEnabled };
}
