import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  GameState, 
  GameRound, 
  Player, 
  Hand, 
  Board, 
  ToastMessage, 
  ChatMessage,
  GameConfig,
  DEFAULT_CONFIG 
} from '../types/game';
import { 
  generateMockData, 
  validateBet, 
  getNextRound, 
  getRoundProgress, 
  areAllPlayersReady,
  calculatePayouts
} from '../utils/gameLogic';

interface GameStore extends GameState {
  // Actions
  initializeGame: (roomCode?: string) => void;
  setCurrentPlayer: (playerId: string) => void;
  selectHand: (handId: string) => void;
  deselectHand: (handId: string) => void;
  setBetAmount: (amount: number) => void;
  placeBet: () => { success: boolean; error?: string };
  setReady: (ready: boolean) => void;
  advanceRound: () => void;
  updateTimer: () => void;
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setAnimationState: (isAnimating: boolean) => void;
  resetGame: () => void;
  
  // Computed values
  getCurrentPlayer: () => Player | null;
  getPlayerChips: () => number;
  getTotalBet: () => number;
  canReady: () => boolean;
  isBettingLocked: () => boolean;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      roomCode: null,
      isConnected: false,
      currentRound: 'Out of the Gate',
      timeRemaining: DEFAULT_CONFIG.ROUND_SECONDS,
      roundProgress: 25,
      isAnimating: false,
      currentPlayerId: null,
      players: [],
      selectedHands: [],
      betAmount: DEFAULT_CONFIG.MIN_BET,
      isReady: false,
      hasConfirmedBet: false, // Initialize new state
      hands: [],
      board: { flop: [] },
      toastMessages: [],
      chatMessages: [],

      // Actions
      initializeGame: (roomCode = 'TXHS42') => {
        const { mockPlayers, mockHands, mockBoard } = generateMockData();
        
        set({
          roomCode,
          isConnected: true,
          currentRound: 'Out of the Gate',
          timeRemaining: DEFAULT_CONFIG.ROUND_SECONDS,
          roundProgress: 25,
          isAnimating: false,
          currentPlayerId: '1', // Default to first player for MVP
          players: mockPlayers,
          selectedHands: [],
          betAmount: DEFAULT_CONFIG.MIN_BET,
          isReady: false,
          hasConfirmedBet: false, // Reset new state
          hands: mockHands,
          board: mockBoard,
          toastMessages: [{
            id: '1',
            type: 'info',
            message: 'Round started! Place your bets or click READY to skip betting.',
            timestamp: Date.now()
          }],
          chatMessages: []
        });
      },

      setCurrentPlayer: (playerId: string) => {
        set({ currentPlayerId: playerId });
      },

      selectHand: (handId: string) => {
        const { isBettingLocked } = get();
        
        if (isBettingLocked()) {
          get().addToast({
            type: 'info',
            message: 'Betting is locked during Photo Finish stage!'
          });
          return;
        }

        set(state => ({
          selectedHands: state.selectedHands.includes(handId) 
            ? state.selectedHands 
            : [...state.selectedHands, handId]
        }));
      },

      deselectHand: (handId: string) => {
        const { isBettingLocked } = get();
        
        if (isBettingLocked()) {
          get().addToast({
            type: 'info',
            message: 'Betting is locked during Photo Finish stage!'
          });
          return;
        }

        set(state => ({
          selectedHands: state.selectedHands.filter(id => id !== handId),
          hasConfirmedBet: false // Reset bet confirmation if hands change
        }));
      },

      setBetAmount: (amount: number) => {
        const { isBettingLocked } = get();
        
        if (isBettingLocked()) {
          get().addToast({
            type: 'info',
            message: 'Betting is locked during Photo Finish stage!'
          });
          return;
        }

        set({ 
          betAmount: Math.max(DEFAULT_CONFIG.MIN_BET, amount),
          hasConfirmedBet: false // Reset bet confirmation if amount changes
        });
      },

      placeBet: () => {
        const { selectedHands, betAmount, players, currentPlayerId, isBettingLocked } = get();
        
        if (isBettingLocked()) {
          return { success: false, error: 'Betting is locked during Photo Finish stage!' };
        }

        const currentPlayer = players.find(p => p.id === currentPlayerId);
        if (!currentPlayer) {
          return { success: false, error: 'Player not found' };
        }

        if (selectedHands.length === 0) {
          return { success: false, error: 'Please select at least one hand' };
        }

        const totalBet = betAmount * selectedHands.length;
        const validation = validateBet(betAmount, currentPlayer.chips, selectedHands, DEFAULT_CONFIG);
        
        if (!validation.isValid) {
          return { success: false, error: validation.error };
        }

        // Update player chips and bets
        const updatedPlayers = players.map(player => {
          if (player.id === currentPlayerId) {
            const updatedBets = { ...player.bets };
            selectedHands.forEach(handId => {
              updatedBets[handId] = (updatedBets[handId] || 0) + betAmount;
            });
            
            return {
              ...player,
              chips: player.chips - totalBet,
              bets: updatedBets
            };
          }
          return player;
        });

        set({ 
          players: updatedPlayers,
          hasConfirmedBet: true // Mark bet as confirmed
        });

        get().addToast({
          type: 'action',
          message: `Bet $${totalBet} placed on ${selectedHands.length} hand(s)!`
        });

        return { success: true };
      },

      setReady: (ready: boolean) => {
        const { players, currentPlayerId } = get();
        
        if (ready) {
          // Validate that player has placed bets
          const currentPlayer = players.find(p => p.id === currentPlayerId);
          if (!currentPlayer || Object.keys(currentPlayer.bets).length === 0) {
            get().addToast({
              type: 'info',
              message: 'You must place bets before marking ready'
            });
            return;
          }
        }

        set({ isReady: ready });
        
        // Update player ready state
        const updatedPlayers = players.map(player => {
          if (player.id === currentPlayerId) {
            return { ...player, isReady: ready };
          }
          return player;
        });
        
        set({ players: updatedPlayers });

        if (ready) {
          get().addToast({
            type: 'action',
            message: 'You are ready! Waiting for other players...'
          });
        } else {
          get().addToast({
            type: 'info',
            message: 'You are no longer ready'
          });
        }
      },

      advanceRound: () => {
        const { currentRound, players } = get();
        const nextRound = getNextRound(currentRound);
        
        if (nextRound) {
          set({
            currentRound: nextRound,
            roundProgress: getRoundProgress(nextRound),
            timeRemaining: DEFAULT_CONFIG.ROUND_SECONDS,
            isAnimating: true,
            isReady: false,
            hasConfirmedBet: false, // Reset bet confirmation for new round
            selectedHands: [], // Reset hand selection for new round
            betAmount: DEFAULT_CONFIG.MIN_BET // Reset bet amount for new round
          });

          // Reset all players to not ready
          const updatedPlayers = players.map(player => ({ ...player, isReady: false }));
          set({ players: updatedPlayers });

          // Add round-specific toasts
          if (nextRound === 'In the Running') {
            get().addToast({
              type: 'info',
              message: 'The flop is being dealt! 🃏'
            });
          } else if (nextRound === 'Final Furlong') {
            get().addToast({
              type: 'info',
              message: 'The turn card is revealed! 🎯'
            });
          } else if (nextRound === 'Photo Finish') {
            get().addToast({
              type: 'info',
              message: 'The river completes the board! 🌊 Betting is now LOCKED!'
            });
          }

          get().addToast({
            type: 'timer',
            message: `${nextRound} phase begins!`
          });
        } else {
          // Game complete - calculate payouts
          const { hands, board } = get();
          const payouts = calculatePayouts(hands, board, players);
          
          // For MVP, just show results
          get().addToast({
            type: 'info',
            message: 'Game complete! Check results above.'
          });
        }
      },

      updateTimer: () => {
        const { timeRemaining, isAnimating } = get();
        
        // Continue timer countdown regardless of player ready state
        // We need to wait for ALL players to be ready or timer to hit 0
        if (timeRemaining > 0 && !isAnimating) {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      addToast: (toast) => {
        const newToast: ToastMessage = {
          ...toast,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now()
        };
        
        set(state => ({
          toastMessages: [...state.toastMessages, newToast]
        }));
      },

      dismissToast: (id: string) => {
        set(state => ({
          toastMessages: state.toastMessages.filter(msg => msg.id !== id)
        }));
      },

      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString(),
          timestamp: Date.now()
        };
        
        set(state => ({
          chatMessages: [...state.chatMessages, newMessage]
        }));
      },

      setAnimationState: (isAnimating: boolean) => {
        set({ isAnimating });
      },

      resetGame: () => {
        get().initializeGame();
      },

      // Computed values
      getCurrentPlayer: () => {
        const { players, currentPlayerId } = get();
        return players.find(p => p.id === currentPlayerId) || null;
      },

      getPlayerChips: () => {
        const currentPlayer = get().getCurrentPlayer();
        return currentPlayer?.chips || 0;
      },

      getTotalBet: () => {
        const { betAmount, selectedHands } = get();
        return betAmount * selectedHands.length;
      },

      canReady: () => {
        const { selectedHands, betAmount, players, currentPlayerId, hasConfirmedBet, isBettingLocked } = get();
        
        // Can't be ready during Photo Finish stage
        if (isBettingLocked()) {
          return false;
        }
        
        const currentPlayer = players.find(p => p.id === currentPlayerId);
        if (!currentPlayer) {
          return false;
        }

        // If player has selected hands and bet amount, they must confirm the bet
        if (selectedHands.length > 0 && betAmount > 0) {
          return hasConfirmedBet;
        }
        
        // If player has no hands selected or no bet amount, they can be ready immediately
        return true;
      },

      // Check if betting is locked (during Photo Finish stage)
      isBettingLocked: () => {
        const { currentRound } = get();
        return currentRound === 'Photo Finish';
      }
    }),
    {
      name: 'game-store'
    }
  )
);

