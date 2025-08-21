import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({
      roomCode: null,
      isConnected: false,
      currentRound: 'Out of the Gate',
      timeRemaining: 45,
      roundProgress: 25,
      isAnimating: false,
      currentPlayerId: null,
      players: [],
      selectedHands: [],
      betAmount: 10,
      isReady: false,
      hands: [],
      board: { flop: [] },
      toastMessages: [],
      chatMessages: []
    });
  });

  it('should initialize game with mock data', () => {
    const store = useGameStore.getState();
    store.initializeGame('TEST123');
    
    expect(store.roomCode).toBe('TEST123');
    expect(store.isConnected).toBe(true);
    expect(store.players).toHaveLength(4);
    expect(store.hands).toHaveLength(5);
    expect(store.currentPlayerId).toBe('1');
  });

  it('should select and deselect hands', () => {
    const store = useGameStore.getState();
    store.initializeGame();
    
    store.selectHand('hand1');
    expect(store.selectedHands).toContain('hand1');
    
    store.deselectHand('hand1');
    expect(store.selectedHands).not.toContain('hand1');
  });

  it('should validate bet placement', () => {
    const store = useGameStore.getState();
    store.initializeGame();
    
    // Select a hand and set bet amount
    store.selectHand('hand1');
    store.setBetAmount(50);
    
    const result = store.placeBet();
    expect(result.success).toBe(true);
    
    // Check that chips were deducted
    const currentPlayer = store.getCurrentPlayer();
    expect(currentPlayer?.chips).toBe(1200); // 1250 - 50
  });

  it('should check if player can ready', () => {
    const store = useGameStore.getState();
    store.initializeGame();
    
    // No hands selected, should not be able to ready
    expect(store.canReady()).toBe(false);
    
    // Select a hand and set bet amount
    store.selectHand('hand1');
    store.setBetAmount(50);
    
    // Should be able to ready now
    expect(store.canReady()).toBe(true);
  });
});
