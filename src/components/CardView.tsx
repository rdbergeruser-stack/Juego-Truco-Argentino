import React from 'react';
import type { Card, Suit } from '../types/truco';
import { CardCenterLayout, SuitSymbol } from './CardArt';

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
  // Dimensiones responsivas con aspecto 1.55 (proporción clásica de naipe español)
  const sizeClasses = {
    sm: 'w-[3.2rem] h-[4.9rem] xs:w-14 xs:h-22 sm:w-16 sm:h-24 text-[10px] sm:text-xs',
    md: 'w-[4.8rem] h-[7.4rem] xs:w-[5.2rem] xs:h-[8rem] sm:w-24 sm:h-36 text-xs sm:text-sm',
    lg: 'w-24 h-36 sm:w-32 sm:h-48 text-sm sm:text-base',
  }[size];

  // DORSO DEL NAIPE (Diseño tradicional de baraja española con filigrana y Sol de Mayo)
  if (faceDown || !card) {
    return (
      <div
        className={`${sizeClasses} rounded-xl border-2 border-amber-950 p-1 sm:p-1.5 shadow-xl select-none relative overflow-hidden touch-manipulation transition-transform duration-200`}
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0f172a 100%)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.6)',
        }}
      >
        {/* Marco con greca geométrica */}
        <div className="w-full h-full border border-amber-400/50 rounded-lg flex flex-col items-center justify-center p-1 relative overflow-hidden bg-blue-950/60">
          {/* Patrón de rombos entrelazados */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 8px),
                                repeating-linear-gradient(-45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 8px)`,
            }}
          />

          {/* Sol de Mayo Central en Vector */}
          <div className="relative z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-amber-300/80 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 text-amber-950">
              <circle cx="12" cy="12" r="4.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
              <circle cx="10.5" cy="11" r="0.6" fill="#78350f" />
              <circle cx="13.5" cy="11" r="0.6" fill="#78350f" />
              <path d="M10.5 13.5 Q12 15 13.5 13.5" stroke="#78350f" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              {/* Rayos rectos y flamígeros */}
              <path d="M12 1.5 L12 6.5 M12 17.5 L12 22.5 M1.5 12 L6.5 12 M17.5 12 L22.5 12 M4.6 4.6 L8.1 8.1 M15.9 15.9 L19.4 19.4 M4.6 19.4 L8.1 15.9 M15.9 8.1 L19.4 4.6" stroke="#fef08a" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative z-10 text-center mt-1">
            <span className="text-[7px] sm:text-[9px] font-serif font-extrabold uppercase tracking-widest text-amber-200 block drop-shadow-sm">
              NAIPES
            </span>
            <span className="text-[6px] sm:text-[8px] font-serif font-bold text-sky-300 tracking-wider block -mt-0.5">
              ARGENTINOS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Colores temáticos tradicionales para el marco y números
  const suitTheme: Record<Suit, { text: string; border: string; accent: string }> = {
    espada: { text: '#1e3a8a', border: '#3b82f6', accent: '#dbeafe' },
    basto: { text: '#14532d', border: '#22c55e', accent: '#dcfce7' },
    oro: { text: '#854d0e', border: '#eab308', accent: '#fef9c3' },
    copa: { text: '#7f1d1d', border: '#ef4444', accent: '#fee2e2' },
  };

  const theme = suitTheme[card.suit];
  const isBrava = card.isBrava;

  // Insignias especiales para las 4 cartas bravas
  const getBravaBadge = () => {
    if (!showBadge) return null;
    if (card.number === 1 && card.suit === 'espada') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 text-[7px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md border border-amber-100 whitespace-nowrap z-30">
          👑 MACHO #1
        </span>
      );
    }
    if (card.number === 1 && card.suit === 'basto') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 text-stone-950 text-[7px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md border border-emerald-100 whitespace-nowrap z-30">
          ⚔️ HEMBRA #2
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'espada') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 text-stone-950 text-[7px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md border border-blue-100 whitespace-nowrap z-30">
          ⚡ 7 BRAVO #3
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'oro') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-stone-950 text-[7px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md border border-amber-100 whitespace-nowrap z-30">
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
        relative rounded-xl border select-none cursor-pointer
        transition-all duration-200 transform touch-manipulation
        ${selected ? '-translate-y-3 sm:-translate-y-4 shadow-2xl ring-2 sm:ring-4 ring-amber-400 scale-[1.03]' : 'hover:-translate-y-1 sm:hover:-translate-y-2 shadow-md'}
        ${disabled ? 'opacity-40 cursor-not-allowed hover:translate-y-0' : 'active:scale-95'}
        ${animatePlay ? 'animate-bounce' : ''}
        ${isBrava ? 'ring-1 sm:ring-2 ring-amber-400/60' : ''}
        flex flex-col justify-between p-1 sm:p-1.5
      `}
      style={{
        background: 'radial-gradient(ellipse at center, #ffffff 40%, #fbf9f4 85%, #f1ecdf 100%)',
        borderColor: isBrava ? '#d97706' : '#d6d3d1',
        boxShadow: selected
          ? '0 16px 32px rgba(234, 179, 8, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
          : isBrava
          ? '0 6px 14px rgba(217, 119, 6, 0.25), 0 2px 6px rgba(0,0,0,0.15)'
          : '0 4px 10px rgba(0,0,0,0.16)',
      }}
    >
      {getBravaBadge()}

      {/* MARCO INTERIOR TÍPICO DE LA BARAJA ESPAÑOLA */}
      <div className="w-full h-full border border-stone-400/40 rounded-lg flex flex-col justify-between p-1 relative overflow-hidden bg-transparent">
        {/* Esquina Superior Izquierda: Número + Símbolo del palo */}
        <div className="flex items-center gap-0.5 leading-none z-10">
          <span
            className="font-serif font-black text-sm sm:text-lg tracking-tighter"
            style={{ color: theme.text }}
          >
            {card.number}
          </span>
          <div className="scale-75 sm:scale-90 origin-left">
            <SuitSymbol suit={card.suit} size={15} />
          </div>
        </div>

        {/* CENTRO ARTÍSTICO DEL NAIPE */}
        <div className="flex-1 flex items-center justify-center w-full my-0.5 relative z-10 overflow-hidden">
          <CardCenterLayout number={card.number} suit={card.suit} />
        </div>

        {/* Esquina Inferior Derecha (Invertida): Número + Símbolo del palo */}
        <div className="flex items-center gap-0.5 leading-none self-end rotate-180 z-10">
          <span
            className="font-serif font-black text-sm sm:text-lg tracking-tighter"
            style={{ color: theme.text }}
          >
            {card.number}
          </span>
          <div className="scale-75 sm:scale-90 origin-left">
            <SuitSymbol suit={card.suit} size={15} />
          </div>
        </div>

        {/* Filigrana sutil de fondo para naipes bravos */}
        {isBrava && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:8px_8px]" />
        )}
      </div>
    </div>
  );
};
