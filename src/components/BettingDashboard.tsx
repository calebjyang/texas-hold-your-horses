import React, { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tooltip } from './ui/tooltip';
import { Coins, Minus, Plus, Zap, CheckCircle } from 'lucide-react';

interface BettingDashboardProps {
  playerChips: number;
  betAmount: number;
  selectedHands: string[];
  isReady: boolean;
  onBetChange: (amount: number) => void;
  onConfirmBet: () => void;
  onReady: () => void;
  canReady: boolean;
  hasConfirmedBet: boolean;
  isBettingLocked: boolean;
}

export function BettingDashboard({ 
  playerChips, 
  betAmount, 
  selectedHands, 
  isReady, 
  onBetChange, 
  onConfirmBet,
  onReady,
  canReady,
  hasConfirmedBet,
  isBettingLocked
}: BettingDashboardProps) {
  const [showReadyPulse, setShowReadyPulse] = useState(false);

  const handleBetIncrease = () => {
    const newAmount = Math.min(betAmount + 10, playerChips);
    onBetChange(newAmount);
  };

  const handleBetDecrease = () => {
    const newAmount = Math.max(betAmount - 10, 0);
    onBetChange(newAmount);
  };

  const handleConfirmBet = () => {
    onConfirmBet();
  };

  const handleReadyClick = () => {
    if (canReady && !isReady) {
      setShowReadyPulse(true);
      setTimeout(() => setShowReadyPulse(false), 1000);
      onReady();
    }
  };

  const totalBet = betAmount * selectedHands.length;
  const canConfirmBet = selectedHands.length > 0 && betAmount > 0 && !hasConfirmedBet;
  const needsBetConfirmation = selectedHands.length > 0 && betAmount > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-dark-leather)] to-[var(--color-leather-brown)] border-t-2 border-[var(--color-gold-accent)] shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Player Chips Display */}
          <div className="flex items-center space-x-4">
            <div className="bg-[var(--color-dark-leather)] px-4 py-3 rounded-lg shadow-inner border border-[var(--color-gold-accent)]">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-[var(--color-gold-accent)]" />
                <div>
                  <div className="text-[var(--color-cream)] text-sm">Your Chips</div>
                  <div className="text-[var(--color-gold-accent)] font-bold text-lg">
                    ${playerChips.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Hands Display */}
            <div className="flex items-center space-x-2">
              <span className="text-[var(--color-cream)] text-sm">Betting on:</span>
              {selectedHands.length > 0 ? (
                <div className="flex space-x-1">
                  {selectedHands.map((handId, index) => (
                    <Badge key={handId} variant="secondary" className="bg-[var(--color-teal-accent)] text-[var(--color-dark-leather)] chip-slide">
                      Hand {index + 1}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-[var(--color-muted-foreground)] text-sm italic">Select hands to bet</span>
              )}
            </div>
          </div>

          {/* Betting Controls */}
          <div className="flex items-center space-x-6">
            {/* Bet Amount Controls */}
            <div className="bg-[var(--color-dark-leather)] px-6 py-4 rounded-lg shadow-inner border border-[var(--color-leather-brown)]">
              <div className="flex items-center space-x-4">
                <label className="text-[var(--color-cream)] text-sm font-medium">Bet Amount</label>
                
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBetDecrease}
                    disabled={betAmount <= 0 || isBettingLocked}
                    className="w-8 h-8 p-0 border-[var(--color-gold-accent)] text-[var(--color-gold-accent)] hover:bg-[var(--color-gold-accent)] hover:text-[var(--color-dark-leather)]"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <div className="w-32">
                    <Slider
                      value={[betAmount]}
                      onValueChange={(value) => onBetChange(value[0])}
                      max={playerChips}
                      min={0}
                      step={5}
                      disabled={isBettingLocked}
                      className="chip-slider"
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBetIncrease}
                    disabled={betAmount >= playerChips || isBettingLocked}
                    className="w-8 h-8 p-0 border-[var(--color-gold-accent)] text-[var(--color-gold-accent)] hover:bg-[var(--color-gold-accent)] hover:text-[var(--color-dark-leather)]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <div className="text-[var(--color-cream)] text-sm">Per Hand</div>
                  <div className="text-[var(--color-gold-accent)] font-bold text-lg">
                    ${betAmount}
                  </div>
                </div>
              </div>

              {selectedHands.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[var(--color-leather-brown)]">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-cream)] text-sm">Total Bet:</span>
                    <span className="text-[var(--color-teal-accent)] font-bold">
                      ${totalBet} ({selectedHands.length} hands)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Bet Button - Only show when bet confirmation is needed */}
            {needsBetConfirmation && (
              <Tooltip content={isBettingLocked ? "Betting is locked during Photo Finish stage!" : "Confirm your bet amount and selected hands"}>
                <Button
                  size="lg"
                  onClick={handleConfirmBet}
                  disabled={!canConfirmBet || isBettingLocked}
                  className={`px-6 py-4 text-lg font-bold transition-all duration-300 ${
                    hasConfirmedBet
                      ? 'bg-green-600 hover:bg-green-600 text-white cursor-default'
                      : canConfirmBet && !isBettingLocked
                        ? 'bg-[var(--color-gold-accent)] hover:bg-[var(--color-dark-gold)] text-[var(--color-dark-leather)]'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isBettingLocked ? 'BETTING LOCKED' : (hasConfirmedBet ? 'BET CONFIRMED!' : 'CONFIRM BET')}
                </Button>
              </Tooltip>
            )}

            {/* Helper text when no bet confirmation needed */}
            {!needsBetConfirmation && !isBettingLocked && (
              <div className="px-6 py-4 text-center">
                <div className="text-[var(--color-cream)] text-sm">
                  {selectedHands.length === 0 && betAmount === 0 
                    ? "No bet selected - you can click READY to skip betting"
                    : "Select a hand to bet or click \"READY\""
                  }
                </div>
              </div>
            )}

            {/* Ready Button */}
            <Tooltip content={isBettingLocked ? "Photo Finish stage - no actions allowed" : "Click when you're finished – the round advances once everyone is ready (or when timer hits 0)."}>
              <Button
                size="lg"
                onClick={handleReadyClick}
                disabled={!canReady || isReady || isBettingLocked}
                className={`px-8 py-4 text-lg font-bold transition-all duration-300 ${
                  isReady
                    ? 'bg-green-600 hover:bg-green-600 text-white cursor-default'
                    : canReady && !isBettingLocked
                      ? `bg-[var(--color-teal-accent)] hover:bg-[var(--color-dark-teal)] text-[var(--color-dark-leather)] ${showReadyPulse ? 'ready-pulse' : ''}`
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-5 h-5 mr-2" />
                {isBettingLocked ? 'PHOTO FINISH' : (isReady ? 'READY!' : 'READY')}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}