import React, { useState } from 'react';
import type { Card, Suit } from '../types/truco';
import { CardCenterLayout } from './CardArt';

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
  const [imgLoadError, setImgLoadError] = useState(false);

  // Dimensiones responsivas con aspecto 1.55 (proporción clásica de naipe español)
  const sizeClasses = {
    sm: 'w-[3.2rem] h-[4.9rem] xs:w-14 xs:h-22 sm:w-16 sm:h-24 text-[10px] sm:text-xs',
    md: 'w-[4.8rem] h-[7.4rem] xs:w-[5.2rem] xs:h-[8rem] sm:w-24 sm:h-36 text-xs sm:text-sm',
    lg: 'w-24 h-36 sm:w-32 sm:h-48 text-sm sm:text-base',
  }[size];

  // DORSO DEL NAIPE (Diseño tradicional de baraja española de campo con desgaste)
  if (faceDown || !card) {
    return (
      <div
        className={`${sizeClasses} rounded-xl border-2 border-[#3d2010] p-1 sm:p-1.5 select-none relative overflow-hidden touch-manipulation transition-transform duration-200`}
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 45%, #0f172a 100%)',
          boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6), inset 0 0 2px rgba(180,83,9,0.3), 0 8px 18px rgba(0,0,0,0.55)',
        }}
      >
        {/* Borde desgastado perimetral */}
        <div className="absolute inset-0 border border-amber-500/25 rounded-lg pointer-events-none" />

        {/* Marco interior con greca geométrica */}
        <div className="w-full h-full border border-amber-400/50 rounded-lg flex flex-col items-center justify-center p-1 relative overflow-hidden bg-blue-950/70">
          {/* Patrón de rombos entrelazados */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 7px),
                                repeating-linear-gradient(-45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 7px)`,
            }}
          />

          {/* Sol de Mayo Central en Vector */}
          <div className="relative z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-amber-300/80 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 text-amber-950">
              <circle cx="12" cy="12" r="4.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
              <circle cx="10.5" cy="11" r="0.6" fill="#78350f" />
              <circle cx="13.5" cy="11" r="0.6" fill="#78350f" />
              <path d="M10.5 13.5 Q12 15 13.5 13.5" stroke="#78350f" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <path d="M12 1.5 L12 6.5 M12 17.5 L12 22.5 M1.5 12 L6.5 12 M17.5 12 L22.5 12 M4.6 4.6 L8.1 8.1 M15.9 15.9 L19.4 19.4 M4.6 19.4 L8.1 15.9 M15.9 8.1 L19.4 4.6" stroke="#fef08a" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative z-10 text-center mt-1">
            <span className="text-[7px] sm:text-[9px] font-display font-black uppercase tracking-widest text-amber-200 block drop-shadow">
              NAIPES
            </span>
            <span className="text-[6px] sm:text-[8px] font-display font-bold text-sky-300 tracking-wider block -mt-0.5">
              CRIOLLOS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Colores temáticos tradicionales para el marco y números
  const suitTheme: Record<Suit, { text: string; border: string; accent: string; label: string }> = {
    espada: { text: '#1e3a8a', border: '#2563eb', accent: '#dbeafe', label: 'ESPADA' },
    basto: { text: '#14532d', border: '#16a34a', accent: '#dcfce7', label: 'BASTO' },
    oro: { text: '#854d0e', border: '#ca8a04', accent: '#fef9c3', label: 'ORO' },
    copa: { text: '#991b1b', border: '#dc2626', accent: '#fee2e2', label: 'COPA' },
  };

  const theme = suitTheme[card.suit];
  const isBrava = card.isBrava;

  // Insignias especiales para las 4 cartas bravas (estilo cinta tejida de campo)
  const getBravaBadge = () => {
    if (!showBadge) return null;
    if (card.number === 1 && card.suit === 'espada') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 text-[7px] sm:text-[9px] font-display font-black px-2 py-0.2 rounded-full shadow-lg border border-amber-200 whitespace-nowrap z-30 tracking-wider">
          👑 MACHO #1
        </span>
      );
    }
    if (card.number === 1 && card.suit === 'basto') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-stone-950 text-[7px] sm:text-[9px] font-display font-black px-2 py-0.2 rounded-full shadow-lg border border-emerald-200 whitespace-nowrap z-30 tracking-wider">
          🌿 HEMBRA #2
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'espada') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 text-stone-950 text-[7px] sm:text-[9px] font-display font-black px-2 py-0.2 rounded-full shadow-lg border border-blue-200 whitespace-nowrap z-30 tracking-wider">
          ⚡ 7 BRAVO #3
        </span>
      );
    }
    if (card.number === 7 && card.suit === 'oro') {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 text-[7px] sm:text-[9px] font-display font-black px-2 py-0.2 rounded-full shadow-lg border border-amber-200 whitespace-nowrap z-30 tracking-wider">
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
        ${selected ? '-translate-y-3 sm:-translate-y-4 shadow-2xl ring-2 sm:ring-4 ring-amber-400 scale-[1.03]' : 'hover:-translate-y-1 sm:hover:-translate-y-2 shadow-lg'}
        ${disabled ? 'opacity-40 cursor-not-allowed hover:translate-y-0' : 'active:scale-95'}
        ${animatePlay ? 'animate-bounce' : ''}
        ${isBrava ? 'ring-1 sm:ring-2 ring-amber-500/80' : ''}
        flex flex-col justify-between p-1 sm:p-1.5
      `}
      style={{
        // Textura de papel manteca / cartulina envejecida y sobada en pulpería (bordes gastados)
        background: 'radial-gradient(ellipse at 50% 50%, #fffef9 25%, #f7f1df 68%, #ece0c3 92%, #dec99e 100%)',
        borderColor: isBrava ? '#b45309' : '#8c6d48',
        boxShadow: selected
          ? '0 16px 32px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(120, 75, 25, 0.25)'
          : isBrava
          ? '0 6px 16px rgba(180, 83, 9, 0.35), inset 0 0 8px rgba(120, 75, 25, 0.22), 0 2px 4px rgba(0,0,0,0.3)'
          : '0 5px 12px rgba(0,0,0,0.25), inset 0 0 8px rgba(120, 75, 25, 0.2)',
      }}
    >
      {getBravaBadge()}

      {/* Sombras en las 4 esquinas simulando manoseo y desgaste de campo */}
      <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-br from-[#8a5d33]/25 to-transparent rounded-tl-xl pointer-events-none z-20" />
      <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-[#8a5d33]/25 to-transparent rounded-tr-xl pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-gradient-to-tr from-[#8a5d33]/25 to-transparent rounded-bl-xl pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-tl from-[#8a5d33]/25 to-transparent rounded-br-xl pointer-events-none z-20" />

      {/* RENDERIZADO: Si existe imagen PNG ilustrada real, se muestra la imagen completa con textura de campo */}
      {!imgLoadError ? (
        <div className="absolute inset-0 rounded-xl overflow-hidden flex items-center justify-center bg-[#f5ede0]">
          <img
            src={`/cards/${card.suit}_${card.number}.png`}
            alt={card.name}
            className="w-full h-full object-cover scale-[1.06] select-none pointer-events-none"
            onError={() => setImgLoadError(true)}
          />
        </div>
      ) : (
        /* FALLBACK: Renderizado vectorial tradicional artesanal */
        <div className="w-full h-full border border-[#8f7556]/60 rounded-lg flex flex-col justify-between p-1 relative overflow-hidden bg-transparent">
          {/* Esquina Superior Izquierda: SOLO el número (sin iconos) */}
          <div className="flex items-center leading-none z-10 pl-0.5 pt-0.5">
            <span
              className="font-display font-black text-sm sm:text-lg tracking-tighter"
              style={{ color: theme.text }}
            >
              {card.number}
            </span>
          </div>

          {/* CENTRO ARTÍSTICO DEL NAIPE (Basado fielmente en el patrón tradicional Fournier) */}
          <div className="flex-1 flex items-center justify-center w-full my-0.5 relative z-10 overflow-hidden">
            <CardCenterLayout number={card.number} suit={card.suit} />
          </div>

          {/* Esquina Inferior Derecha (Invertida): SOLO el número (sin iconos) */}
          <div className="flex items-center leading-none self-end rotate-180 z-10 pr-0.5 pb-0.5">
            <span
              className="font-display font-black text-sm sm:text-lg tracking-tighter"
              style={{ color: theme.text }}
            >
              {card.number}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
