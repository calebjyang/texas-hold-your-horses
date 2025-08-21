import React from 'react';

interface CardBackProps {
  className?: string;
  isDarkHorse?: boolean;
}

export function CardBack({ className = '', isDarkHorse = false }: CardBackProps) {
  return (
    <div className={`relative w-12 h-16 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-800 rounded border-2 border-amber-400 shadow-lg transform transition-all duration-150 hover:scale-105 ${className}`}>
      {/* Main background with subtle texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded opacity-90"></div>
      
      {/* Ornate border pattern */}
      <div className="absolute inset-1 border border-amber-300 rounded-sm"></div>
      <div className="absolute inset-2 border border-amber-200 rounded-sm opacity-60"></div>
      
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-amber-400 rounded-full opacity-80"></div>
      <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full opacity-80"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-amber-400 rounded-full opacity-80"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-amber-400 rounded-full opacity-80"></div>
      
      {/* Center horseshoe emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-emerald-800 rounded-full"></div>
        </div>
      </div>
      
      {/* Horseshoe shape using CSS */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-5 h-5">
          {/* Horseshoe using multiple divs to create the shape */}
          <div className="absolute top-0 left-0 w-1 h-2 bg-amber-300 rounded-t-full"></div>
          <div className="absolute top-0 right-0 w-1 h-2 bg-amber-300 rounded-t-full"></div>
          <div className="absolute top-2 left-0 w-1 h-2 bg-amber-300"></div>
          <div className="absolute top-2 right-0 w-1 h-2 bg-amber-300"></div>
          <div className="absolute bottom-0 left-1 w-3 h-1 bg-amber-300 rounded-b-full"></div>
        </div>
      </div>
      
      {/* Subtle diamond pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1 left-2 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute top-3 left-1 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute top-3 right-1 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute top-1 right-2 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute bottom-1 left-2 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute bottom-3 left-1 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute bottom-3 right-1 w-1 h-1 bg-amber-200 rounded-full"></div>
        <div className="absolute bottom-1 right-2 w-1 h-1 bg-amber-200 rounded-full"></div>
      </div>
      
      {/* Dark Horse indicator */}
      {isDarkHorse && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-gold-accent)] rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
          <span className="text-xs font-bold text-black">?</span>
        </div>
      )}
    </div>
  );
}
