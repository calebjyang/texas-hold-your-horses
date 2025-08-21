import React from 'react';
import { PlayingCard } from './PlayingCard';
import { Coins } from 'lucide-react';
import { Hand } from '../types/game';
import { convertCardForComponent } from '../utils/gameLogic';

interface CommunityCardRailProps {
  hands: Hand[];
  selectedHands: string[];
  onHandSelect: (handId: string) => void;
  isBettingLocked: boolean;
}

export function CommunityCardRail({ hands, selectedHands, onHandSelect, isBettingLocked }: CommunityCardRailProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-center items-end space-x-8">
        {hands.map((hand, index) => {
          const isSelected = selectedHands.includes(hand.id);
          const arcOffset = (index - 2) * 8; // Creates gentle arc effect
          
          return (
            <div
              key={hand.id}
              className={`relative transform transition-all duration-300 ${
                isBettingLocked 
                  ? 'cursor-not-allowed opacity-75' 
                  : isSelected 
                    ? 'scale-110 -translate-y-2 cursor-pointer' 
                    : 'hover:scale-105 hover:-translate-y-1 cursor-pointer group'
              }`}
              style={{ transform: `translateY(${Math.abs(arcOffset)}px) ${isSelected ? 'scale(1.1) translateY(-8px)' : ''}` }}
              onClick={() => !isBettingLocked && onHandSelect(hand.id)}
            >
              {/* Hand Cards */}
              <div className="flex -space-x-2 mb-4">
                {hand.cards.map((card, cardIndex) => {
                  // For Dark Horse cards, don't try to convert invalid card data
                  if (hand.isDarkHorse) {
                    return (
                      <div key={cardIndex} className={`z-${10 + cardIndex} ${cardIndex > 0 ? 'ml-1' : ''}`}>
                        <PlayingCard
                          suit="hearts" // Default suit, won't be visible anyway
                          value="?" // Default value, won't be visible anyway
                          faceDown={true}
                          isDarkHorse={true}
                          className=""
                        />
                      </div>
                    );
                  }
                  
                  // For regular cards, convert the data
                  const componentCard = convertCardForComponent(card);
                  return (
                    <div key={cardIndex} className={`z-${10 + cardIndex} ${cardIndex > 0 ? 'ml-1' : ''}`}>
                      <PlayingCard
                        suit={componentCard.suit}
                        value={componentCard.value}
                        faceDown={false}
                        isDarkHorse={false}
                        className=""
                      />
                    </div>
                  );
                })}
              </div>

              {/* Hand Name & Selection Indicator */}
              <div className="text-center mb-2">
                {hand.isDarkHorse && (
                  <div className="text-xs text-[var(--color-gold-accent)] mt-1">
                    Dark Horse
                  </div>
                )}
              </div>

              {/* Pot Display */}
              <div className={`mx-auto w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
                isSelected 
                  ? 'bg-[var(--color-teal-accent)] text-[var(--color-dark-leather)] shadow-lg shadow-[var(--color-teal-accent)]/50' 
                  : 'bg-[var(--color-leather-brown)] text-[var(--color-cream)]'
              } border-2 ${
                isSelected ? 'border-[var(--color-cream)]' : 'border-[var(--color-dark-leather)]'
              }`}>
                <Coins className="w-4 h-4 mb-1" />
                <span className="text-xs font-bold">${hand.pot}</span>
              </div>

              {/* Selection Ring */}
              {isSelected && (
                <div className="absolute inset-0 -m-4 border-2 border-[var(--color-teal-accent)] rounded-lg animate-pulse"></div>
              )}

              {/* Dark Horse Glow Effect */}
              {hand.isDarkHorse && (
                <div className="absolute inset-0 -m-2 bg-gradient-to-r from-[var(--color-gold-accent)]/10 to-[var(--color-gold-accent)]/5 rounded-lg border border-[var(--color-gold-accent)]/30"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}