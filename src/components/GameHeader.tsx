import React from 'react';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { Crown, Clock, Users, Check } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  chips: number;
  isReady: boolean;
  avatar?: string;
}

interface GameHeaderProps {
  currentRound: 'Out of the Gate' | 'In the Running' | 'Final Furlong' | 'Photo Finish';
  timeRemaining: number;
  roomCode: string;
  players: Player[];
  roundProgress: number;
}

const roundEmojis = {
  'Out of the Gate': '🏁',
  'In the Running': '🏃',
  'Final Furlong': '🏇',
  'Photo Finish': '📸'
};

export function GameHeader({ currentRound, timeRemaining, roomCode, players, roundProgress }: GameHeaderProps) {
  return (
    <header className="w-full bg-[var(--color-dark-leather)] border-b-2 border-[var(--color-leather-brown)] px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[var(--color-gold-accent)] rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-[var(--color-dark-leather)]" />
          </div>
          <div>
            <h1 className="text-xl text-[var(--color-cream)] font-bold">Texas Hold</h1>
            <p className="text-sm text-[var(--color-gold-accent)] -mt-1">Your Horses</p>
          </div>
        </div>

        {/* Round Indicator & Timer */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 bg-[var(--color-leather-brown)] px-4 py-2 rounded-lg shadow-inner">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{roundEmojis[currentRound]}</span>
              <div>
                <div className="text-[var(--color-cream)] font-medium">{currentRound}</div>
                <div className="w-32 mt-1">
                  <Progress value={roundProgress} className="h-2 bg-[var(--color-dark-leather)]" />
                </div>
              </div>
              <div className="horse-icon text-[var(--color-gold-accent)] ml-2 horse-trot">🐎</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-[var(--color-leather-brown)] px-3 py-2 rounded-lg shadow-inner">
            <Clock className="w-4 h-4 text-[var(--color-teal-accent)]" />
            <span className="text-[var(--color-cream)] font-mono">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Room Code & Players */}
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-[var(--color-cream)] text-[var(--color-dark-leather)] border-[var(--color-gold-accent)]">
            Room: {roomCode}
          </Badge>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[var(--color-teal-accent)]" />
            <div className="flex space-x-2">
              {players.map((player) => (
                <div key={player.id} className="relative">
                  <Avatar className="w-8 h-8 border-2 border-[var(--color-leather-brown)]">
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-teal-accent)] to-[var(--color-dark-teal)] flex items-center justify-center text-white text-sm">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                  </Avatar>
                  {player.isReady && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs text-[var(--color-cream)] bg-[var(--color-dark-leather)] px-1 rounded whitespace-nowrap">
                      ${player.chips}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}