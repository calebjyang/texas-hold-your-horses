import React from 'react';

interface PlayingCardProps {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  faceDown?: boolean;
  className?: string;
  isDarkHorse?: boolean;
}

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const suitColors = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
  spades: 'text-black'
};

export function PlayingCard({ suit, value, faceDown = false, className = '', isDarkHorse = false }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div 
        className={`relative w-12 h-16 rounded shadow-lg transform transition-all duration-150 hover:scale-105 ${className}`}
        style={{
          background: 'linear-gradient(135deg, #065f46, #047857, #065f46)',
          border: '2px solid #f59e0b',
          position: 'relative'
        }}
      >
        {/* Main background with subtle texture */}
        <div 
          className="absolute inset-0 rounded-sm"
          style={{
            background: 'linear-gradient(135deg, #047857, #065f46)',
            opacity: 0.9
          }}
        ></div>
        
        {/* Ornate border pattern */}
        <div 
          className="absolute inset-1 rounded-sm"
          style={{
            border: '1px solid #fcd34d',
            top: '2px',
            left: '2px',
            right: '2px',
            bottom: '2px'
          }}
        ></div>
        <div 
          className="absolute rounded-sm opacity-60"
          style={{
            border: '1px solid #fef3c7',
            top: '4px',
            left: '4px',
            right: '4px',
            bottom: '4px'
          }}
        ></div>
        
        {/* Corner decorations */}
        <div 
          className="absolute w-2 h-2 rounded-full opacity-80"
          style={{
            background: '#f59e0b',
            top: '2px',
            left: '2px',
            width: '8px',
            height: '8px'
          }}
        ></div>
        <div 
          className="absolute w-2 h-2 rounded-full opacity-80"
          style={{
            background: '#f59e0b',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px'
          }}
        ></div>
        <div 
          className="absolute w-2 h-2 rounded-full opacity-80"
          style={{
            background: '#f59e0b',
            bottom: '2px',
            left: '2px',
            width: '8px',
            height: '8px'
          }}
        ></div>
        <div 
          className="absolute w-2 h-2 rounded-full opacity-80"
          style={{
            background: '#f59e0b',
            bottom: '2px',
            right: '2px',
            width: '8px',
            height: '8px'
          }}
        ></div>
        
        {/* Center horseshoe emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              width: '24px',
              height: '24px'
            }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{
                background: '#065f46',
                width: '16px',
                height: '16px'
              }}
            ></div>
          </div>
        </div>
        
        {/* Horseshoe shape using CSS */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-5 h-5">
            {/* Horseshoe using multiple divs to create the shape */}
            <div 
              className="absolute rounded-t-full"
              style={{
                background: '#f59e0b',
                top: '0px',
                left: '0px',
                width: '4px',
                height: '8px',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
              }}
            ></div>
            <div 
              className="absolute rounded-t-full"
              style={{
                background: '#f59e0b',
                top: '0px',
                right: '0px',
                width: '4px',
                height: '8px',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
              }}
            ></div>
            <div 
              className="absolute"
              style={{
                background: '#f59e0b',
                top: '8px',
                left: '0px',
                width: '4px',
                height: '8px'
              }}
            ></div>
            <div 
              className="absolute"
              style={{
                background: '#f59e0b',
                top: '8px',
                right: '0px',
                width: '4px',
                height: '8px'
              }}
            ></div>
            <div 
              className="absolute rounded-b-full"
              style={{
                background: '#f59e0b',
                bottom: '0px',
                left: '4px',
                width: '12px',
                height: '4px',
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px'
              }}
            ></div>
          </div>
        </div>
        
        {/* Subtle diamond pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              top: '2px',
              left: '8px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              top: '12px',
              left: '4px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              top: '12px',
              right: '4px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              top: '2px',
              right: '8px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              bottom: '2px',
              left: '8px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              bottom: '12px',
              left: '4px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              bottom: '12px',
              right: '4px',
              width: '4px',
              height: '4px'
            }}
          ></div>
          <div 
            className="absolute rounded-full"
            style={{
              background: '#fef3c7',
              bottom: '2px',
              right: '8px',
              width: '4px',
              height: '4px'
            }}
          ></div>
        </div>
        
        {/* Dark Horse indicator */}
        {isDarkHorse && (
          <div 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white"
            style={{
              background: 'var(--color-gold-accent)',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px'
            }}
          >
            <span className="text-xs font-bold text-black">?</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-12 h-16 bg-white rounded border border-gray-300 shadow-lg transform transition-all duration-150 hover:scale-105 ${className}`}>
      <div className="absolute top-1 left-1">
        <div className={`text-xs ${suitColors[suit]}`}>{value}</div>
        <div className={`text-xs ${suitColors[suit]}`}>{suitSymbols[suit]}</div>
      </div>
      <div className="absolute bottom-1 right-1 rotate-180">
        <div className={`text-xs ${suitColors[suit]}`}>{value}</div>
        <div className={`text-xs ${suitColors[suit]}`}>{suitSymbols[suit]}</div>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center text-2xl ${suitColors[suit]}`}>
        {suitSymbols[suit]}
      </div>
    </div>
  );
}