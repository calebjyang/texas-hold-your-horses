import React, { useEffect, useState } from 'react';
import { PlayingCard } from './PlayingCard';

interface CommunityBoardProps {
  currentRound: 'Out of the Gate' | 'In the Running' | 'Final Furlong' | 'Photo Finish';
  onAnimationComplete?: () => void;
}

// Mock community cards for demonstration
const communityCards = [
  // Flop
  { suit: 'hearts' as const, value: 'A' },
  { suit: 'spades' as const, value: 'K' },
  { suit: 'diamonds' as const, value: 'Q' },
  // Turn
  { suit: 'clubs' as const, value: 'J' },
  // River
  { suit: 'hearts' as const, value: '10' },
];

export function CommunityBoard({ currentRound, onAnimationComplete }: CommunityBoardProps) {
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const [dealingCards, setDealingCards] = useState<boolean[]>([false, false, false, false, false]);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Determine how many cards should be visible based on round
  const getCardsForRound = (round: string) => {
    switch (round) {
      case 'Out of the Gate': return 0; // Pre-flop
      case 'In the Running': return 3;  // Flop
      case 'Final Furlong': return 4;   // Turn
      case 'Photo Finish': return 5;    // River
      default: return 0;
    }
  };

  useEffect(() => {
    const targetCards = getCardsForRound(currentRound);
    
    if (targetCards > visibleCards) {
      setShouldAnimate(true);
      
      // Start dealing animation for new cards
      const newDealingCards = [...dealingCards];
      for (let i = visibleCards; i < targetCards; i++) {
        newDealingCards[i] = true;
      }
      setDealingCards(newDealingCards);

      // Stagger the card dealing
      let dealIndex = visibleCards;
      const dealInterval = setInterval(() => {
        if (dealIndex < targetCards) {
          setVisibleCards(prev => prev + 1);
          dealIndex++;
        } else {
          clearInterval(dealInterval);
          setShouldAnimate(false);
          
          // Reset dealing state after animation
          setTimeout(() => {
            setDealingCards([false, false, false, false, false]);
            onAnimationComplete?.();
          }, 1000);
        }
      }, 200);

      return () => clearInterval(dealInterval);
    }
  }, [currentRound]);

  const getRoundTitle = () => {
    switch (currentRound) {
      case 'In the Running': return 'The Flop';
      case 'Final Furlong': return 'The Turn';
      case 'Photo Finish': return 'The River';
      default: return '';
    }
  };

  if (visibleCards === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="text-center">
          <div className="w-80 h-24 border-2 border-dashed border-[var(--color-leather-brown)] rounded-lg flex items-center justify-center">
            <p className="text-[var(--color-cream)] opacity-60">
              Community cards will appear here!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-6">
        <h2 className="text-[var(--color-gold-accent)] font-bold text-xl mb-2">
          {getRoundTitle()}
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold-accent)] to-transparent"></div>
      </div>

      <div className={`relative bg-gradient-to-br from-[var(--color-dark-leather)] to-[var(--color-leather-brown)] rounded-xl p-8 border-2 border-[var(--color-gold-accent)] ${
        shouldAnimate ? 'board-glow' : ''
      }`}>
        <div className="flex justify-center items-center space-x-4">
          {communityCards.slice(0, visibleCards).map((card, index) => (
            <div
              key={index}
              className={`relative ${
                dealingCards[index] ? 'card-dealing card-deal' : ''
              } card-deal-${index + 1}`}
            >
              <PlayingCard
                suit={card.suit}
                value={card.value}
                className="w-16 h-24 shadow-xl"
              />
              
              {/* Card position labels */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <span className="text-xs text-[var(--color-cream)] opacity-75">
                  {index < 3 ? `Flop ${index + 1}` : index === 3 ? 'Turn' : 'River'}
                </span>
              </div>
              
              {/* Dealing effect overlay */}
              {dealingCards[index] && (
                <div className="absolute inset-0 bg-[var(--color-teal-accent)] opacity-20 rounded animate-pulse"></div>
              )}
            </div>
          ))}

          {/* Placeholder spots for remaining cards */}
          {Array.from({ length: 5 - visibleCards }, (_, index) => (
            <div
              key={`placeholder-${index}`}
              className="w-16 h-24 border-2 border-dashed border-[var(--color-leather-brown)] rounded opacity-30 flex items-center justify-center"
            >
              <div className="w-8 h-12 bg-[var(--color-leather-brown)] rounded opacity-50"></div>
            </div>
          ))}
        </div>

        {/* Poker table felt texture overlay */}
        <div className="absolute inset-0 opacity-10 rounded-xl pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-green-800 via-green-700 to-green-800 rounded-xl"></div>
        </div>
      </div>

      {/* Round description */}
      <div className="text-center mt-4">
        <p className="text-[var(--color-cream)] text-sm opacity-75">
          {currentRound === 'In the Running' && 'Three community cards have been dealt'}
          {currentRound === 'Final Furlong' && 'The fourth community card is revealed'}
          {currentRound === 'Photo Finish' && 'The final community card completes the board'}
        </p>
      </div>
    </div>
  );
}