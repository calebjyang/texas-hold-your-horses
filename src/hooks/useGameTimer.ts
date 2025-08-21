import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameTimer() {
  const {
    timeRemaining,
    isReady,
    isAnimating,
    players,
    currentRound,
    updateTimer,
    advanceRound
  } = useGameStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown effect - use setInterval for continuous counting
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start timer if conditions are met
    // Note: We continue the timer even if current player is ready, because other players might not be ready yet
    if (timeRemaining > 0 && !isAnimating) {
      intervalRef.current = setInterval(() => {
        updateTimer();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeRemaining, isAnimating, updateTimer]);

  // Auto-advance round when timer hits 0 or all players ready
  useEffect(() => {
    const allReady = players.length > 0 && players.every(p => p.isReady);
    
    if (!isAnimating && (timeRemaining === 0 || allReady)) {
      // Clear the timer interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Small delay to allow UI updates
      setTimeout(() => {
        advanceRound();
      }, 1000);
    }
  }, [timeRemaining, players, currentRound, isAnimating, advanceRound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    timeRemaining,
    isReady,
    isAnimating
  };
}
