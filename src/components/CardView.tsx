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
  // Dimensiones
  const sizeClasses = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-24 h-36 text-sm',
    lg: 'w-32 h-48 text-base',
  }[size];

  if (faceDown || !card) {
    return (
      <div
        className={`${sizeClasses} rounded-xl border-2 border-amber-900/40 bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 p-2 shadow-lg flex items-center justify-center select-none relative overflow-hidden`}
        style={{
          boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 0 12px rgba(0,0,0,0.6)',
        }}
      >
        <div className="w-full h-full border border-amber-600/40 rounded-lg flex flex-col items-center justify-center p-1 bg-amber-950/40">
          <div className="w-8 h-8 rounded-full border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-xs shadow-inner">
            🇦🇷
          </div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300/80 mt-1 font-serif font-semibold">
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
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-amber-300 whitespace-nowrap">
          👑 MACHO #1
        </span>
      );
    }
    if (card.number === 1 && card.suit === 'basto') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-emerald-300 whitespace-nowrap">
          ⚔️ HEMBRA #2
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'espada') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-blue-300 whitespace-nowrap">
          ⚡ 7 BRAVO #3
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'oro') {
      return (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-yellow-200 whitespace-nowrap">
          ✨ EL VELO #4
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
        relative rounded-xl border-2 select-none cursor-pointer
        transition-all duration-200 transform
        ${selected ? '-translate-y-4 shadow-2xl ring-4 ring-amber-400' : 'hover:-translate-y-2 shadow-md'}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : 'active:scale-95'}
        ${animatePlay ? 'animate-bounce' : ''}
        flex flex-col justify-between p-2.5
      `}
      style={{
        backgroundColor: '#fffcf7',
        borderColor: config.border,
        boxShadow: selected
          ? '0 16px 32px rgba(234, 179, 8, 0.3), 0 4px 12px rgba(0,0,0,0.2)'
          : '0 6px 14px rgba(0,0,0,0.18)',
      }}
    >
      {getBravaBadge()}

      {/* Esquina Superior Izquierda */}
      <div className="flex flex-col items-center leading-none">
        <span className="font-extrabold font-serif text-lg tracking-tighter" style={{ color: config.main }}>
          {card.number}
        </span>
        <span className="text-sm mt-0.5">{suitIcons[card.suit]}</span>
      </div>

      {/* Centro de la Carta */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
          style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}
        >
          <span className="text-2xl filter drop-shadow-sm">{suitIcons[card.suit]}</span>
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase mt-1 opacity-70" style={{ color: config.main }}>
          {card.suit}
        </span>
      </div>

      {/* Esquina Inferior Derecha (Invertida) */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="font-extrabold font-serif text-lg tracking-tighter" style={{ color: config.main }}>
          {card.number}
        </span>
        <span className="text-sm mt-0.5">{suitIcons[card.suit]}</span>
      </div>
    </div>
  );
};
