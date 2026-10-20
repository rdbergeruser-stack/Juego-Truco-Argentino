import React from 'react';
import type { Suit, CardNumber } from '../types/truco';

// SVG Icono de Espada Tradicional Española
export const EspadaIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="40%" stopColor="#94a3b8" />
        <stop offset="70%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="goldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
    </defs>
    {/* Hoja curvada de sable español */}
    <path
      d="M50 8 C48 24 45 48 43 68 L50 68 C50 48 53 24 50 8 Z"
      fill="url(#bladeGrad)"
      stroke="#1e293b"
      strokeWidth="1.5"
    />
    {/* Filo y acanaladura central */}
    <line x1="47" y1="12" x2="47" y2="67" stroke="#cbd5e1" strokeWidth="1" />
    {/* Punta afilada */}
    <path d="M47 8 L50 4 L49 14 Z" fill="#e2e8f0" />
    {/* Gavilán / Guardia dorada curvada */}
    <path
      d="M28 66 C36 63 42 66 50 68 C58 66 64 63 72 66 C73 68 70 71 62 70 C54 69 50 71 47 71 C44 71 38 69 31 70 C27 70 26 68 28 66 Z"
      fill="url(#goldHilt)"
      stroke="#713f12"
      strokeWidth="1.2"
    />
    {/* Empuñadura con cordón */}
    <rect x="44.5" y="70" width="7" height="18" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" />
    <line x1="44.5" y1="74" x2="51.5" y2="74" stroke="url(#goldHilt)" strokeWidth="1.2" />
    <line x1="44.5" y1="78" x2="51.5" y2="78" stroke="url(#goldHilt)" strokeWidth="1.2" />
    <line x1="44.5" y1="82" x2="51.5" y2="82" stroke="url(#goldHilt)" strokeWidth="1.2" />
    {/* Pomo esférico dorado */}
    <circle cx="48" cy="91" r="5" fill="url(#goldHilt)" stroke="#713f12" strokeWidth="1.2" />
  </svg>
);

// SVG Icono de Basto Tradicional (Garrote nudoso con hojas)
export const BastoIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="40%" stopColor="#78350f" />
        <stop offset="80%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#291002" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Tronco nudoso del garrote */}
    <path
      d="M45 8 C42 12 40 22 41 32 C37 34 36 38 42 42 C41 52 38 62 42 72 C39 75 40 79 44 82 L46 94 L54 94 L56 82 C60 78 59 74 57 71 C61 61 58 50 57 41 C63 37 61 33 58 31 C59 21 57 11 53 8 Z"
      fill="url(#woodGrad)"
      stroke="#1c0a00"
      strokeWidth="1.5"
    />
    {/* Nudos de madera */}
    <ellipse cx="49" cy="24" rx="3" ry="4" fill="#3f1704" stroke="#78350f" strokeWidth="1" />
    <ellipse cx="50" cy="54" rx="3.5" ry="5" fill="#3f1704" stroke="#78350f" strokeWidth="1" />
    <ellipse cx="48" cy="74" rx="2.5" ry="3.5" fill="#3f1704" stroke="#78350f" strokeWidth="1" />
    {/* Brotes verdes / hojas que nacen de la madera */}
    <path d="M37 34 C30 30 28 22 36 24 C40 25 39 31 37 34 Z" fill="url(#leafGrad)" stroke="#14532d" strokeWidth="0.8" />
    <path d="M63 46 C70 42 72 34 64 36 C60 37 61 43 63 46 Z" fill="url(#leafGrad)" stroke="#14532d" strokeWidth="0.8" />
    <path d="M36 68 C28 65 29 57 37 59 C40 60 39 66 36 68 Z" fill="url(#leafGrad)" stroke="#14532d" strokeWidth="0.8" />
    <path d="M62 76 C69 73 70 65 62 67 C59 68 60 74 62 76 Z" fill="url(#leafGrad)" stroke="#14532d" strokeWidth="0.8" />
  </svg>
);

// SVG Icono de Oro Tradicional (Moneda de oro con Sol de Mayo radiante)
export const OroIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="coinGold" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="30%" stopColor="#facc15" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </radialGradient>
      <linearGradient id="rayGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    {/* Borde exterior acordonado */}
    <circle cx="50" cy="50" r="44" fill="url(#coinGold)" stroke="#78350f" strokeWidth="2" />
    <circle cx="50" cy="50" r="39" stroke="#854d0e" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
    {/* Rayos del sol */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
      <line
        key={deg}
        x1="50"
        y1="50"
        x2={50 + 26 * Math.cos((deg * Math.PI) / 180)}
        y2={50 + 26 * Math.sin((deg * Math.PI) / 180)}
        stroke="url(#rayGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    ))}
    {/* Círculo central con rostro solar */}
    <circle cx="50" cy="50" r="15" fill="#fef08a" stroke="#a16207" strokeWidth="1.5" />
    {/* Ojos y sonrisa del sol */}
    <ellipse cx="45" cy="48" rx="1.5" ry="2" fill="#713f12" />
    <ellipse cx="55" cy="48" rx="1.5" ry="2" fill="#713f12" />
    <path d="M46 55 Q50 58 54 55" stroke="#713f12" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// SVG Icono de Copa Tradicional (Cáliz real cincelado)
export const CopaIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gobletGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <radialGradient id="rubyGem" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="50%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
    </defs>
    {/* Tapa / Borde superior */}
    <ellipse cx="50" cy="18" rx="25" ry="6" fill="url(#gobletGold)" stroke="#78350f" strokeWidth="1.5" />
    <ellipse cx="50" cy="18" rx="20" ry="4" fill="#991b1b" opacity="0.6" />
    {/* Cuerpo del cáliz acampanado */}
    <path
      d="M25 18 C25 38 34 52 46 55 L46 72 L36 78 C30 82 28 88 32 92 L68 92 C72 88 70 82 64 78 L54 72 L54 55 C66 52 75 38 75 18 Z"
      fill="url(#gobletGold)"
      stroke="#78350f"
      strokeWidth="1.5"
    />
    {/* Moldura / Nudo central del fuste */}
    <ellipse cx="50" cy="65" rx="7" ry="4" fill="#fef08a" stroke="#854d0e" strokeWidth="1.2" />
    {/* Pedrería / Rubí en el centro de la copa */}
    <circle cx="50" cy="36" r="5" fill="url(#rubyGem)" stroke="#78350f" strokeWidth="1" />
    {/* Cincelados decorativos */}
    <path d="M35 30 Q50 36 65 30" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
    <path d="M38 42 Q50 48 62 42" stroke="#713f12" strokeWidth="1.2" fill="none" />
  </svg>
);

export const SuitSymbol: React.FC<{ suit: Suit; size?: number; className?: string }> = ({
  suit,
  size = 24,
  className = '',
}) => {
  switch (suit) {
    case 'espada':
      return <EspadaIcon size={size} className={className} />;
    case 'basto':
      return <BastoIcon size={size} className={className} />;
    case 'oro':
      return <OroIcon size={size} className={className} />;
    case 'copa':
      return <CopaIcon size={size} className={className} />;
  }
};

// Renderizado de las 4 Cartas Bravas con Arte Tradicional Completo
export const BravaArtwork: React.FC<{ number: CardNumber; suit: Suit }> = ({ number, suit }) => {
  // 1 de Espadas - El Macho
  if (number === 1 && suit === 'espada') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
        {/* Corona superior y laureles */}
        <div className="text-amber-500 font-serif font-black text-[9px] sm:text-[10px] tracking-wider uppercase flex items-center gap-1">
          <span>👑</span>
          <span className="drop-shadow-sm">EL MACHO</span>
          <span>👑</span>
        </div>
        <div className="relative my-1">
          <EspadaIcon size={52} className="filter drop-shadow-md" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-serif font-black text-blue-950 uppercase tracking-widest bg-blue-100/90 border border-blue-400 px-2 py-0.5 rounded-full shadow-sm">
          ANCHO DE ESPADA
        </span>
      </div>
    );
  }

  // 1 de Bastos - La Hembra
  if (number === 1 && suit === 'basto') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
        <div className="text-emerald-700 font-serif font-black text-[9px] sm:text-[10px] tracking-wider uppercase flex items-center gap-1">
          <span>🌿</span>
          <span className="drop-shadow-sm">LA HEMBRA</span>
          <span>🌿</span>
        </div>
        <div className="relative my-1">
          <BastoIcon size={52} className="filter drop-shadow-md" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-serif font-black text-emerald-950 uppercase tracking-widest bg-emerald-100/90 border border-emerald-400 px-2 py-0.5 rounded-full shadow-sm">
          ANCHO DE BASTO
        </span>
      </div>
    );
  }

  // 7 de Espadas - Siete Bravo
  if (number === 7 && suit === 'espada') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
        <span className="text-blue-700 font-serif font-black text-[8px] sm:text-[9px] tracking-wider uppercase">
          ⚡ 7 BRAVO ⚡
        </span>
        <div className="grid grid-cols-3 gap-1 my-1 items-center justify-center">
          <EspadaIcon size={20} className="rotate-[-25deg]" />
          <EspadaIcon size={26} className="filter drop-shadow-sm" />
          <EspadaIcon size={20} className="rotate-[25deg]" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-serif font-bold text-blue-900 bg-blue-50 border border-blue-300 px-1.5 py-0.2 rounded">
          ESPADILLA
        </span>
      </div>
    );
  }

  // 7 de Oros - El Velo
  if (number === 7 && suit === 'oro') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
        <span className="text-amber-700 font-serif font-black text-[8px] sm:text-[9px] tracking-wider uppercase">
          ✨ EL VELO ✨
        </span>
        <div className="flex flex-col items-center gap-0.5 my-1">
          <div className="flex gap-1.5">
            <OroIcon size={18} />
            <OroIcon size={18} />
          </div>
          <OroIcon size={22} className="filter drop-shadow-sm" />
          <div className="flex gap-1.5">
            <OroIcon size={18} />
            <OroIcon size={18} />
          </div>
        </div>
        <span className="text-[8px] sm:text-[9px] font-serif font-bold text-amber-950 bg-amber-100 border border-amber-400 px-1.5 py-0.2 rounded">
          7 DE ORO
        </span>
      </div>
    );
  }

  return null;
};

// Disposición geométrica tradicional española según el número de la carta
export const CardCenterLayout: React.FC<{ number: CardNumber; suit: Suit }> = ({ number, suit }) => {
  // Para las 4 bravas
  if ((number === 1 && (suit === 'espada' || suit === 'basto')) || (number === 7 && (suit === 'espada' || suit === 'oro'))) {
    return <BravaArtwork number={number} suit={suit} />;
  }

  // Figuras (10 - Sota, 11 - Caballo, 12 - Rey)
  if (number >= 10) {
    const figureData: Record<number, { name: string; subtitle: string }> = {
      10: { name: 'SOTA', subtitle: 'Paje / Infante' },
      11: { name: 'CABALLO', subtitle: 'Caballero' },
      12: { name: 'REY', subtitle: 'Monarca' },
    };
    const info = figureData[number] || { name: 'FIGURA', subtitle: '' };

    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-1.5 py-2">
        <div className="flex items-center gap-1 opacity-70">
          <span className="text-[7px] sm:text-[9px] font-serif font-black tracking-widest text-amber-950 uppercase">
            {info.name}
          </span>
        </div>

        {/* Heraldic figure center emblem */}
        <div className="relative flex items-center justify-center my-0.5">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-amber-800/30 bg-amber-50/80 flex items-center justify-center shadow-inner">
            {number === 10 && (
              // Sota: Infante con alabarda y estandarte
              <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-9 sm:h-9 text-amber-900 fill-current">
                <circle cx="20" cy="11" r="5" fill="#c2410c" />
                <path d="M16 17 C16 16, 24 16, 24 17 L25 32 L15 32 Z" fill="#b45309" />
                <path d="M12 18 L16 23 L14 34 L12 34 Z" fill="#78350f" />
                <path d="M28 18 L24 23 L26 34 L28 34 Z" fill="#78350f" />
                <rect x="29" y="4" width="2" height="34" fill="#57534e" />
                <polygon points="27,4 33,4 30,1" fill="#78716c" />
                <path d="M29 6 C23 7, 23 14, 29 15 Z" fill="#dc2626" opacity="0.8" />
              </svg>
            )}
            {number === 11 && (
              // Caballo: Corcel rampante
              <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-9 sm:h-9 text-amber-900 fill-current">
                <path d="M12 32 C12 28, 15 22, 18 19 C18 16, 17 12, 19 8 C20 6, 23 6, 24 9 C25 12, 28 13, 31 16 C33 18, 32 21, 29 20 C27 20, 26 21, 26 24 C28 26, 30 29, 29 32 L26 32 C26 29, 24 27, 22 27 C20 27, 19 29, 18 32 Z" fill="#92400e" />
                <circle cx="22" cy="11" r="1.5" fill="#fef08a" />
                <path d="M19 14 C17 14, 15 17, 16 19 C18 18, 19 16, 19 14 Z" fill="#78350f" />
              </svg>
            )}
            {number === 12 && (
              // Rey: Corona imperial y manto
              <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-9 sm:h-9">
                {/* Corona */}
                <polygon points="12,14 14,8 18,12 20,6 22,12 26,8 28,14" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
                <circle cx="20" cy="5" r="1.5" fill="#dc2626" />
                {/* Cabeza */}
                <circle cx="20" cy="17" r="4" fill="#fed7aa" />
                {/* Barba regia */}
                <path d="M17 18 C17 23, 23 23, 23 18 Z" fill="#78350f" />
                {/* Manto real */}
                <path d="M13 22 C13 22, 17 21, 20 23 C23 21, 27 22, 27 22 L29 34 L11 34 Z" fill="#991b1b" />
                {/* Armiño / cuello */}
                <path d="M16 22 C17 25, 23 25, 24 22 L20 26 Z" fill="#fef08a" />
              </svg>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <SuitSymbol suit={suit} size={16} />
        </div>
      </div>
    );
  }

  // Disposiciones numéricas tradicionales (1 a 7)
  switch (number) {
    case 1: // Ases falsos (copa y oro)
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <SuitSymbol suit={suit} size={36} className="filter drop-shadow-sm" />
          <span className="text-[8px] font-serif font-semibold text-stone-500 uppercase mt-0.5">As</span>
        </div>
      );
    case 2:
      return (
        <div className="w-full h-full flex flex-col justify-around items-center py-2">
          <SuitSymbol suit={suit} size={24} />
          <SuitSymbol suit={suit} size={24} className="rotate-180" />
        </div>
      );
    case 3:
      return (
        <div className="w-full h-full flex flex-col justify-between items-center py-1">
          <SuitSymbol suit={suit} size={22} />
          <SuitSymbol suit={suit} size={22} />
          <SuitSymbol suit={suit} size={22} className="rotate-180" />
        </div>
      );
    case 4:
      return (
        <div className="w-full h-full grid grid-cols-2 gap-x-2 gap-y-3 items-center justify-items-center p-2">
          <SuitSymbol suit={suit} size={20} />
          <SuitSymbol suit={suit} size={20} />
          <SuitSymbol suit={suit} size={20} className="rotate-180" />
          <SuitSymbol suit={suit} size={20} className="rotate-180" />
        </div>
      );
    case 5:
      return (
        <div className="w-full h-full flex flex-col justify-between items-center py-1 px-2">
          <div className="w-full flex justify-between">
            <SuitSymbol suit={suit} size={18} />
            <SuitSymbol suit={suit} size={18} />
          </div>
          <SuitSymbol suit={suit} size={20} />
          <div className="w-full flex justify-between">
            <SuitSymbol suit={suit} size={18} className="rotate-180" />
            <SuitSymbol suit={suit} size={18} className="rotate-180" />
          </div>
        </div>
      );
    case 6:
      return (
        <div className="w-full h-full grid grid-cols-2 gap-x-2 gap-y-1 items-center justify-items-center py-1 px-2">
          <SuitSymbol suit={suit} size={17} />
          <SuitSymbol suit={suit} size={17} />
          <SuitSymbol suit={suit} size={17} />
          <SuitSymbol suit={suit} size={17} />
          <SuitSymbol suit={suit} size={17} className="rotate-180" />
          <SuitSymbol suit={suit} size={17} className="rotate-180" />
        </div>
      );
    case 7: // 7 falsos (copa y basto)
      return (
        <div className="w-full h-full flex flex-col justify-between items-center py-1 px-2">
          <div className="w-full flex justify-between">
            <SuitSymbol suit={suit} size={16} />
            <SuitSymbol suit={suit} size={16} />
          </div>
          <div className="w-full flex justify-around">
            <SuitSymbol suit={suit} size={17} />
            <SuitSymbol suit={suit} size={17} />
            <SuitSymbol suit={suit} size={17} />
          </div>
          <div className="w-full flex justify-between">
            <SuitSymbol suit={suit} size={16} className="rotate-180" />
            <SuitSymbol suit={suit} size={16} className="rotate-180" />
          </div>
        </div>
      );
    default:
      return <SuitSymbol suit={suit} size={28} />;
  }
};
