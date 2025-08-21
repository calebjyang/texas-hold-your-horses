// Game Types based on GAME_DESIGN.md specifications

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | '?';
export type Suit = '♣' | '♦' | '♥' | '♠';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export interface Player {
  id: string;
  name: string;
  chips: number;
  isReady: boolean;
  bets: Record<string, number>; // handId -> amount
}

export interface Hand {
  id: string;
  name: string; // Added to match component interface
  label: string;
  cards: [Card, Card];
  pot: number;
  isDarkHorse?: boolean;
}

export interface Board {
  flop: Card[];
  turn?: Card;
  river?: Card;
}

export type GameRound = 'Out of the Gate' | 'In the Running' | 'Final Furlong' | 'Photo Finish';

export interface Room {
  code: string;
  players: Player[];
  round: GameRound;
  timer: number;
  hands: Hand[];
  board: Board;
  history: Array<{ winners: string[]; payouts: Record<string, number> }>;
}

export interface GameState {
  // Room state
  roomCode: string | null;
  isConnected: boolean;
  
  // Game state
  currentRound: GameRound;
  timeRemaining: number;
  roundProgress: number;
  isAnimating: boolean;
  
  // Player state
  currentPlayerId: string | null;
  players: Player[];
  selectedHands: string[];
  betAmount: number;
  isReady: boolean;
  hasConfirmedBet: boolean; // Track if bet is confirmed
  
  // Game entities
  hands: Hand[];
  board: Board;
  
  // UI state
  toastMessages: ToastMessage[];
  chatMessages: ChatMessage[];
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'player' | 'timer' | 'action'; // Updated to match EventToast component
  message: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: number;
  type: 'message' | 'reaction';
}

// Game configuration
export interface GameConfig {
  ROUND_SECONDS: number;
  MIN_BET: number;
  MAX_PLAYERS: number;
  ANTE: number;
  HOUSE_EDGE: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  ROUND_SECONDS: 15,
  MIN_BET: 10,
  MAX_PLAYERS: 6,
  ANTE: 0,
  HOUSE_EDGE: 0,
};
