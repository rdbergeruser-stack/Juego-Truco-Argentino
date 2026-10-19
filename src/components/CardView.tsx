import React from 'react';
import type { Card, Suit } from '../types/truco';

interface CardViewProps {
  card?: Card;
  faceDown?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  animatePlay?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  onClick,
  selected = false,
  disabled = false,
  size = 'md',
  showBadge = true,
  animatePlay = false,
}) => {
  // Dimensiones responsivas para móvil y escritorio
  const sizeClasses = {
    sm: 'w-11 h-16 sm:w-16 sm:h-24 text-[10px] sm:text-xs',
    md: 'w-[4.8rem] h-[7.2rem] xs:w-20 xs:h-30 sm:w-24 sm:h-36 text-xs sm:text-sm',
    lg: 'w-24 h-36 sm:w-32 sm:h-48 text-sm sm:text-base',
  }[size];

  if (faceDown || !card) {
    return (
      <div
        className={`${sizeClasses} rounded-xl border border-amber-900/40 bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 p-1 sm:p-2 shadow-md flex items-center justify-center select-none relative overflow-hidden touch-manipulation`}
        style={{
          boxShadow: '0 4px 10px rgba(0,0,0,0.4), inset 0 0 8px rgba(0,0,0,0.6)',
        }}
      >
        <div className="w-full h-full border border-amber-600/40 rounded-lg flex flex-col items-center justify-center p-0.5 bg-amber-950/40">
          <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-[9px] sm:text-xs shadow-inner">
            🇦🇷
          </div>
          <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-amber-300/80 mt-0.5 font-serif font-semibold">
            TRUCO
          </span>
        </div>
      </div>
    );
  }

  const suitColors: Record<Suit, { main: string; bg: string; border: string }> = {
    espada: { main: '#1e40af', bg: '#eff6ff', border: '#93c5fd' },
    basto: { main: '#166534', bg: '#f0fdf4', border: '#86efac' },
    oro: { main: '#854d0e', bg: '#fefce8', border: '#fde047' },
    copa: { main: '#991b1b', bg: '#fef2f2', border: '#fca5a5' },
  };

  const suitIcons: Record<Suit, string> = {
    espada: '⚔️',
    basto: '🪵',
    oro: '🪙',
    copa: '🍷',
  };

  const config = suitColors[card.suit];

  const getBravaBadge = () => {
    if (!showBadge) return null;
    if (card.number === 1 && card.suit === 'espada') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full shadow-md border border-amber-300 whitespace-nowrap z-20">
          👑 #1
        </span>
      );
    }
    if (card.number === 1 && card.suit === 'basto') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full shadow-md border border-emerald-300 whitespace-nowrap z-20">
          ⚔️ #2
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'espada') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full shadow-md border border-blue-300 whitespace-nowrap z-20">
          ⚡ #3
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'oro') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full shadow-md border border-yellow-200 whitespace-nowrap z-20">
          ✨ #4
        </span>
      );
    }
    return null;
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        ${sizeClasses}
        relative rounded-xl border select-none cursor-pointer
        transition-all duration-200 transform touch-manipulation
        ${selected ? '-translate-y-3 sm:-translate-y-4 shadow-xl ring-2 sm:ring-4 ring-amber-400' : 'hover:-translate-y-1 sm:hover:-translate-y-2 shadow-sm'}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : 'active:scale-95'}
        ${animatePlay ? 'animate-bounce' : ''}
        flex flex-col justify-between p-1.5 sm:p-2.5
      `}
      style={{
        backgroundColor: '#fffcf7',
        borderColor: config.border,
        boxShadow: selected
          ? '0 12px 24px rgba(234, 179, 8, 0.35), 0 2px 8px rgba(0,0,0,0.2)'
          : '0 4px 10px rgba(0,0,0,0.15)',
      }}
    >
      {getBravaBadge()}

      {/* Esquina Superior Izquierda */}
      <div className="flex flex-col items-center leading-none">
        <span className="font-extrabold font-serif text-sm sm:text-lg tracking-tighter" style={{ color: config.main }}>
          {card.number}
        </span>
        <span className="text-[10px] sm:text-sm mt-0.5">{suitIcons[card.suit]}</span>
      </div>

      {/* Centro de la Carta */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="w-7 h-7 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-inner"
          style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}
        >
          <span className="text-sm sm:text-2xl filter drop-shadow-sm">{suitIcons[card.suit]}</span>
        </div>
        <span className="text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase mt-0.5 opacity-70 hidden xs:inline" style={{ color: config.main }}>
          {card.suit}
        </span>
      </div>

      {/* Esquina Inferior Derecha (Invertida) */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="font-extrabold font-serif text-sm sm:text-lg tracking-tighter" style={{ color: config.main }}>
          {card.number}
        </span>
        <span className="text-[10px] sm:text-sm mt-0.5">{suitIcons[card.suit]}</span>
      </div>
    </div>
  );
};
