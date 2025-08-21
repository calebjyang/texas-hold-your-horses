import React, { useEffect } from 'react';
import { GameHeader } from './components/GameHeader';
import { CommunityCardRail } from './components/CommunityCardRail';
import { CommunityBoard } from './components/CommunityBoard';
import { BettingDashboard } from './components/BettingDashboard';
import { EventToast } from './components/EventToast';
import { ChatDrawer } from './components/ChatDrawer';
import { useGameStore } from './store/gameStore';
import { useGameTimer } from './hooks/useGameTimer';

export default function App() {
  const {
    // Game state
    currentRound,
    timeRemaining,
    roundProgress,
    isAnimating,
    
    // Player state
    players,
    selectedHands,
    betAmount,
    isReady,
    
    // Game entities
    hands,
    board,
    
    // UI state
    toastMessages,
    chatMessages,
    
    // Actions
    initializeGame,
    selectHand,
    setBetAmount,
    setReady,
    dismissToast,
    addChatMessage,
    setAnimationState,
    canReady
  } = useGameStore();

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Use the timer hook
  useGameTimer();

  const handleHandSelect = (handId: string) => {
    if (selectedHands.includes(handId)) {
      // Deselect hand
      const newSelected = selectedHands.filter(id => id !== handId);
      useGameStore.setState({ selectedHands: newSelected });
    } else {
      // Select hand
      selectHand(handId);
    }
  };

  const handleReady = () => {
    if (canReady()) {
      setReady(true);
    }
  };

  const handleDismissToast = (id: string) => {
    dismissToast(id);
  };

  const handleSendMessage = (message: string) => {
    addChatMessage({
      player: 'You',
      message,
      type: 'message'
    });
  };

  const handleSendReaction = (reaction: string) => {
    addChatMessage({
      player: 'You',
      message: reaction,
      type: 'reaction'
    });
  };

  const handleAnimationComplete = () => {
    setAnimationState(false);
  };

  const playerChips = players.find(p => p.id === '1')?.chips || 1250;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-dark-leather)] via-[var(--color-leather-brown)] to-[var(--color-dark-leather)]">
      {/* Game Header */}
      <GameHeader
        currentRound={currentRound}
        timeRemaining={timeRemaining}
        roomCode="TXHS42"
        players={players}
        roundProgress={roundProgress}
      />

      {/* Main Game Area */}
      <main className="flex-1 pt-8 pb-32 space-y-8">
        {/* Community Card Rail */}
        <CommunityCardRail
          hands={hands}
          selectedHands={selectedHands}
          onHandSelect={handleHandSelect}
          isBettingLocked={useGameStore.getState().isBettingLocked()}
        />

        {/* Community Board (Flop, Turn, River) */}
        <CommunityBoard
          currentRound={currentRound}
          onAnimationComplete={handleAnimationComplete}
        />
      </main>

      {/* Betting Dashboard */}
      <BettingDashboard
        playerChips={playerChips}
        betAmount={betAmount}
        selectedHands={selectedHands}
        isReady={isReady}
        onBetChange={setBetAmount}
        onConfirmBet={() => {
          const result = useGameStore.getState().placeBet();
          if (!result.success) {
            useGameStore.getState().addToast({
              type: 'info',
              message: result.error || 'Failed to place bet'
            });
          }
        }}
        onReady={handleReady}
        canReady={canReady()}
        hasConfirmedBet={useGameStore.getState().hasConfirmedBet}
        isBettingLocked={useGameStore.getState().isBettingLocked()}
      />

      {/* Event Toasts */}
      <EventToast
        messages={toastMessages}
        onDismiss={handleDismissToast}
      />

      {/* Chat Drawer */}
      <ChatDrawer
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onSendReaction={handleSendReaction}
      />
    </div>
  );
}