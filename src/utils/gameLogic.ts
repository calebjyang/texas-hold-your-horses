import { Card, Rank, Hand, Board, GameRound, Player, GameConfig } from '../types/game';

// Card ranking utilities
export const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14, '?': 0
};

export const SUIT_VALUES: Record<string, number> = {
  '♣': 0, '♦': 1, '♥': 2, '♠': 3
};

// Hand ranking system (simplified for MVP)
export enum HandRank {
  HIGH_CARD = 1,
  PAIR = 2,
  TWO_PAIR = 3,
  THREE_OF_A_KIND = 4,
  STRAIGHT = 5,
  FLUSH = 6,
  FULL_HOUSE = 7,
  FOUR_OF_A_KIND = 8,
  STRAIGHT_FLUSH = 9,
  ROYAL_FLUSH = 10
}

export interface HandEvaluation {
  rank: HandRank;
  value: number;
  description: string;
}

// Evaluate a hand (two cards + board)
export function evaluateHand(hand: Hand, board: Board): HandEvaluation {
  const allCards = [...hand.cards, ...board.flop, ...(board.turn ? [board.turn] : []), ...(board.river ? [board.river] : [])];
  
  // For MVP, we'll use a simplified ranking system
  // In production, this would implement full poker hand evaluation
  
  if (hand.isDarkHorse) {
    return {
      rank: HandRank.HIGH_CARD,
      value: 0,
      description: 'Dark Horse (Hidden)'
    };
  }
  
  // Simple evaluation based on card values
  const cardValues = allCards.map(card => RANK_VALUES[card.rank]).filter(v => v > 0);
  const maxValue = Math.max(...cardValues);
  
  return {
    rank: HandRank.HIGH_CARD,
    value: maxValue,
    description: `High Card: ${getRankName(maxValue)}`
  };
}

function getRankName(value: number): string {
  const rankNames: Record<number, string> = {
    14: 'Ace', 13: 'King', 12: 'Queen', 11: 'Jack',
    10: '10', 9: '9', 8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2'
  };
  return rankNames[value] || 'Unknown';
}

// Betting validation
export function validateBet(
  amount: number,
  playerChips: number,
  selectedHands: string[],
  config: GameConfig
): { isValid: boolean; error?: string } {
  if (amount < config.MIN_BET) {
    return { isValid: false, error: `Minimum bet is ${config.MIN_BET} chips` };
  }
  
  if (amount > playerChips) {
    return { isValid: false, error: 'Insufficient chips' };
  }
  
  if (selectedHands.length === 0) {
    return { isValid: false, error: 'Must select at least one hand' };
  }
  
  const totalBet = amount * selectedHands.length;
  if (totalBet > playerChips) {
    return { isValid: false, error: 'Insufficient chips for total bet' };
  }
  
  return { isValid: true };
}

// Round progression logic
export function getNextRound(currentRound: GameRound): GameRound | null {
  const rounds: GameRound[] = ['Out of the Gate', 'In the Running', 'Final Furlong', 'Photo Finish'];
  const currentIndex = rounds.indexOf(currentRound);
  
  if (currentIndex < rounds.length - 1) {
    return rounds[currentIndex + 1];
  }
  
  return null; // Game complete
}

export function getRoundProgress(currentRound: GameRound): number {
  const rounds: GameRound[] = ['Out of the Gate', 'In the Running', 'Final Furlong', 'Photo Finish'];
  const currentIndex = rounds.indexOf(currentRound);
  return ((currentIndex + 1) / rounds.length) * 100;
}

// Check if all players are ready
export function areAllPlayersReady(players: Player[]): boolean {
  return players.length > 0 && players.every(player => player.isReady);
}

// Calculate payouts for winning hands
export function calculatePayouts(
  hands: Hand[],
  board: Board,
  players: Player[]
): Array<{ handId: string; winners: string[]; amount: number }> {
  const handEvaluations = hands.map(hand => ({
    handId: hand.id,
    evaluation: evaluateHand(hand, board),
    pot: hand.pot
  }));
  
  // Find the highest ranking hand(s)
  const maxRank = Math.max(...handEvaluations.map(h => h.evaluation.rank));
  const winningHands = handEvaluations.filter(h => h.evaluation.rank === maxRank);
  
  return winningHands.map(hand => {
    // Find all players who bet on this hand
    const bettors = players.filter(player => player.bets[hand.handId] > 0);
    
    if (bettors.length === 0) {
      return { handId: hand.handId, winners: [], amount: hand.pot };
    }
    
    // Split pot among bettors proportionally
    const totalBets = bettors.reduce((sum, player) => sum + player.bets[hand.handId], 0);
    const winners = bettors.map(player => player.id);
    
    return {
      handId: hand.handId,
      winners,
      amount: hand.pot
    };
  });
}

// Generate mock data for development
export function generateMockData() {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Alex', chips: 1250, isReady: false, bets: {} },
    { id: '2', name: 'Sarah', chips: 890, isReady: true, bets: {} },
    { id: '3', name: 'Mike', chips: 1560, isReady: false, bets: {} },
    { id: '4', name: 'Luna', chips: 720, isReady: true, bets: {} },
  ];

  const mockHands: Hand[] = [
    {
      id: 'hand1',
      name: 'Royal Flush',
      label: 'Royal Flush',
      cards: [{ rank: 'A', suit: '♥' }, { rank: 'K', suit: '♥' }],
      pot: 245
    },
    {
      id: 'hand2',
      name: 'Full House',
      label: 'Full House',
      cards: [{ rank: 'K', suit: '♠' }, { rank: 'K', suit: '♣' }],
      pot: 180
    },
    {
      id: 'hand3',
      name: 'Straight',
      label: 'Straight',
      cards: [{ rank: '9', suit: '♦' }, { rank: '10', suit: '♥' }],
      pot: 165
    },
    {
      id: 'hand4',
      name: 'Two Pair',
      label: 'Two Pair',
      cards: [{ rank: 'Q', suit: '♣' }, { rank: 'Q', suit: '♦' }],
      pot: 95
    },
    {
      id: 'hand5',
      name: 'Dark Horse',
      label: 'Dark Horse',
      cards: [{ rank: '?', suit: '♥' }, { rank: '?', suit: '♠' }],
      pot: 420,
      isDarkHorse: true
    }
  ];

  const mockBoard: Board = {
    flop: [
      { rank: 'A', suit: '♠' },
      { rank: 'K', suit: '♦' },
      { rank: 'Q', suit: '♥' }
    ]
  };

  return { mockPlayers, mockHands, mockBoard };
}

// Adapter function to convert our Card format to component-expected format
export function convertCardForComponent(card: Card): { suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'; value: string } {
  // Map our suit symbols to component suit names
  const suitMap: Record<string, 'hearts' | 'diamonds' | 'clubs' | 'spades'> = {
    '♥': 'hearts',
    '♦': 'diamonds', 
    '♣': 'clubs',
    '♠': 'spades'
  };
  
  return {
    suit: suitMap[card.suit] || 'hearts',
    value: card.rank
  };
}
