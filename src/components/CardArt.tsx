import React from 'react';
import type { Suit, CardNumber } from '../types/truco';

// ============================================================================
// 1. ICONOS BÁSICOS DEL PALO (Estilo Baraja Española Tradicional / Fournier)
// ============================================================================

// Espada recta tradicional con empuñadura dorada de lazo
export const EspadaIcon: React.FC<{ className?: string; size?: number; color?: 'steel' | 'gold' }> = ({
  className = '',
  size = 24,
}) => (
  <svg
    viewBox="0 0 40 100"
    width={size * 0.4}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hoja recta de acero toledano */}
    <polygon points="19,4 21,4 22,66 18,66" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
    <polygon points="19,4 20,4 20,66 18,66" fill="#f8fafc" />
    <line x1="20" y1="6" x2="20" y2="65" stroke="#64748b" strokeWidth="1" />
    {/* Gavilán / Cruz dorada tradicional */}
    <path
      d="M7 66 C12 64, 18 67, 20 67 C22 67, 28 64, 33 66 C34 68, 30 71, 20 70 C10 71, 6 68, 7 66 Z"
      fill="#eab308"
      stroke="#78350f"
      strokeWidth="1.2"
    />
    {/* Empuñadura con cordoncillo */}
    <rect x="17.5" y="70" width="5" height="18" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
    <line x1="17.5" y1="74" x2="22.5" y2="74" stroke="#eab308" strokeWidth="1" />
    <line x1="17.5" y1="78" x2="22.5" y2="78" stroke="#eab308" strokeWidth="1" />
    <line x1="17.5" y1="82" x2="22.5" y2="82" stroke="#eab308" strokeWidth="1" />
    {/* Pomo esférico */}
    <circle cx="20" cy="91" r="4" fill="#eab308" stroke="#78350f" strokeWidth="1" />
  </svg>
);

// Basto de madera nudosa con brotes de hojas (color verde o naranja/marrón como en Fournier)
export const BastoIcon: React.FC<{ className?: string; size?: number; variant?: 'green' | 'orange' }> = ({
  className = '',
  size = 24,
  variant = 'green',
}) => {
  const isGreen = variant === 'green';
  const trunkFill = isGreen ? '#15803d' : '#c2410c';
  const trunkStroke = isGreen ? '#14532d' : '#7c2d12';
  const leafColor = isGreen ? '#86efac' : '#fde047';

  return (
    <svg
      viewBox="0 0 40 100"
      width={size * 0.4}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Garrote cónico nudoso */}
      <path
        d="M15 8 C13 15, 12 28, 14 42 C11 46, 12 55, 16 68 C15 75, 16 85, 18 94 L22 94 C24 85, 25 75, 24 68 C28 55, 29 46, 26 42 C28 28, 27 15, 25 8 Z"
        fill={trunkFill}
        stroke={trunkStroke}
        strokeWidth="1.3"
      />
      {/* Nudos de madera */}
      <ellipse cx="20" cy="22" rx="3.5" ry="2" fill="#fef08a" opacity="0.6" />
      <ellipse cx="19" cy="50" rx="3" ry="2" fill="#fef08a" opacity="0.6" />
      <ellipse cx="20.5" cy="74" rx="2.5" ry="1.8" fill="#fef08a" opacity="0.6" />
      {/* Brotes de hojas laterales */}
      <path d="M12 28 C7 25, 6 18, 12 20 C15 21, 14 26, 12 28 Z" fill={leafColor} stroke={trunkStroke} strokeWidth="0.8" />
      <path d="M28 38 C33 35, 34 28, 28 30 C25 31, 26 36, 28 38 Z" fill={leafColor} stroke={trunkStroke} strokeWidth="0.8" />
      <path d="M13 60 C8 57, 7 50, 13 52 C16 53, 15 58, 13 60 Z" fill={leafColor} stroke={trunkStroke} strokeWidth="0.8" />
      <path d="M27 70 C32 67, 33 60, 27 62 C24 63, 25 68, 27 70 Z" fill={leafColor} stroke={trunkStroke} strokeWidth="0.8" />
    </svg>
  );
};

// Moneda de Oro tradicional con perfil clásico laureado
export const OroIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Disco exterior con gráfila de puntos */}
    <circle cx="50" cy="50" r="46" fill="#facc15" stroke="#854d0e" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="41" stroke="#a16207" strokeWidth="1" strokeDasharray="3,2" />
    {/* Anillo interior */}
    <circle cx="50" cy="50" r="36" fill="#eab308" stroke="#713f12" strokeWidth="1.5" />
    {/* Efigie / Rostro de perfil clásico español */}
    <path
      d="M48 24 C44 24, 38 28, 38 34 C38 38, 41 40, 39 44 C37 47, 34 49, 34 53 C34 56, 38 58, 40 60 C38 64, 35 68, 36 74 L60 74 C60 67, 56 61, 56 56 C59 54, 61 50, 60 45 C59 40, 56 36, 56 32 C56 26, 52 24, 48 24 Z"
      fill="#fef08a"
      stroke="#78350f"
      strokeWidth="1.2"
    />
    {/* Corona de laurel */}
    <path d="M42 27 Q48 25 54 29" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <circle cx="45" cy="27" r="1.5" fill="#22c55e" />
    <circle cx="51" cy="28" r="1.5" fill="#22c55e" />
    {/* Ojo y nariz */}
    <circle cx="44" cy="40" r="1.5" fill="#78350f" />
    <path d="M38 43 L34 47 L39 49" stroke="#78350f" strokeWidth="1" fill="none" />
  </svg>
);

// Copa renacentista tradicional (Cáliz labrado de oro y rubí con peana)
export const CopaIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Borde superior */}
    <ellipse cx="50" cy="20" rx="26" ry="6" fill="#facc15" stroke="#78350f" strokeWidth="1.8" />
    <ellipse cx="50" cy="20" rx="20" ry="3.5" fill="#dc2626" opacity="0.7" />
    {/* Cuerpo abombado con molduras acanaladas */}
    <path
      d="M24 20 C24 38, 33 52, 45 55 L45 72 L35 78 C28 82, 27 88, 30 92 L70 92 C73 88, 72 82, 65 78 L55 72 L55 55 C67 52, 76 38, 76 20 Z"
      fill="#eab308"
      stroke="#78350f"
      strokeWidth="1.8"
    />
    {/* Acanaladuras verticales en el cáliz */}
    <path d="M36 26 C36 42, 42 48, 46 51" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
    <path d="M64 26 C64 42, 58 48, 54 51" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
    <line x1="50" y1="23" x2="50" y2="52" stroke="#fef08a" strokeWidth="2" />
    {/* Nudo central del fuste */}
    <ellipse cx="50" cy="65" rx="8" ry="4.5" fill="#facc15" stroke="#78350f" strokeWidth="1.3" />
    <circle cx="50" cy="38" r="4.5" fill="#dc2626" stroke="#78350f" strokeWidth="1" />
  </svg>
);

export const SuitSymbol: React.FC<{ suit: Suit; size?: number; className?: string; variant?: 'green' | 'orange' }> = ({
  suit,
  size = 24,
  className = '',
  variant,
}) => {
  switch (suit) {
    case 'espada':
      return <EspadaIcon size={size} className={className} />;
    case 'basto':
      return <BastoIcon size={size} className={className} variant={variant} />;
    case 'oro':
      return <OroIcon size={size} className={className} />;
    case 'copa':
      return <CopaIcon size={size} className={className} />;
  }
};

// ============================================================================
// 2. OBRAS DE ARTE PRINCIPALES (Ases, 3 de Bastos, 7 Bravos, Figuras)
// ============================================================================

// 1 de Espadas - El Macho (Espada con lazo/dragón espiralado tradicional)
export const AsDeEspadaArtwork: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
    <svg viewBox="0 0 100 150" className="w-full h-full max-h-40">
      <defs>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Espada recta central */}
      <polygon points="49,10 51,10 52,110 48,110" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
      <polygon points="49,10 50,10 50,110 48,110" fill="#f8fafc" />
      <line x1="50" y1="12" x2="50" y2="108" stroke="#64748b" strokeWidth="1.2" />

      {/* Cinta / Guirnalda ondulante que envuelve la hoja (Icono Fournier) */}
      {/* Tramo 1: Superior */}
      <path
        d="M32 30 C30 20, 68 20, 68 34 C68 44, 30 40, 32 54"
        stroke="url(#ribbonGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tramo 2: Medio */}
      <path
        d="M32 54 C34 68, 70 64, 68 80 C66 94, 30 88, 34 102"
        stroke="url(#ribbonGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Lazos y flores de la guirnalda */}
      <circle cx="34" cy="32" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <circle cx="66" cy="36" r="3" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
      <circle cx="32" cy="56" r="3.5" fill="#f43f5e" stroke="#9f1239" strokeWidth="0.8" />
      <circle cx="68" cy="80" r="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <circle cx="34" cy="102" r="3" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />

      {/* Gavilán dorado de la empuñadura */}
      <path
        d="M30 110 C40 107, 48 111, 50 111 C52 111, 60 107, 70 110 C72 113, 66 116, 50 115 C34 116, 28 113, 30 110 Z"
        fill="#eab308"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Mango encordelado */}
      <rect x="47" y="115" width="6" height="24" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" />
      <line x1="47" y1="120" x2="53" y2="120" stroke="#facc15" strokeWidth="1.2" />
      <line x1="47" y1="125" x2="53" y2="125" stroke="#facc15" strokeWidth="1.2" />
      <line x1="47" y1="130" x2="53" y2="130" stroke="#facc15" strokeWidth="1.2" />
      {/* Pomo esférico */}
      <circle cx="50" cy="142" r="5" fill="#eab308" stroke="#78350f" strokeWidth="1.5" />
    </svg>
    <div className="text-[7px] sm:text-[9px] font-display font-black text-amber-900 bg-amber-100/80 border border-amber-600/40 px-2 py-0.2 rounded-full shadow-sm tracking-wider uppercase mt-0.5">
      EL MACHO #1
    </div>
  </div>
);

// 1 de Bastos - La Hembra (Tronco nudoso diagonal con hojas brotadas)
export const AsDeBastoArtwork: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
    <svg viewBox="0 0 100 150" className="w-full h-full max-h-40">
      {/* Basto nudoso diagonal */}
      <g transform="rotate(-25 50 75)">
        <path
          d="M44 15 C41 24, 38 42, 42 62 C38 68, 40 82, 45 102 C43 112, 45 125, 47 135 L53 135 C55 125, 57 112, 55 102 C60 82, 62 68, 58 62 C62 42, 59 24, 56 15 Z"
          fill="#16a34a"
          stroke="#14532d"
          strokeWidth="2"
        />
        {/* Nudos oscuros */}
        <ellipse cx="50" cy="35" rx="5" ry="3" fill="#15803d" stroke="#14532d" strokeWidth="1" />
        <ellipse cx="48" cy="75" rx="4.5" ry="2.8" fill="#15803d" stroke="#14532d" strokeWidth="1" />
        <ellipse cx="51" cy="110" rx="3.5" ry="2.2" fill="#15803d" stroke="#14532d" strokeWidth="1" />
        {/* Hojas y brotes tiernos */}
        <path d="M38 40 C30 35, 28 25, 38 28 C42 30, 41 37, 38 40 Z" fill="#86efac" stroke="#14532d" strokeWidth="1" />
        <path d="M62 55 C70 50, 72 40, 62 43 C58 45, 59 52, 62 55 Z" fill="#86efac" stroke="#14532d" strokeWidth="1" />
        <path d="M39 85 C30 80, 29 70, 39 73 C43 75, 42 82, 39 85 Z" fill="#86efac" stroke="#14532d" strokeWidth="1" />
        <path d="M61 98 C69 93, 70 83, 61 86 C57 88, 58 95, 61 98 Z" fill="#86efac" stroke="#14532d" strokeWidth="1" />
      </g>
    </svg>
    <div className="text-[7px] sm:text-[9px] font-display font-black text-emerald-950 bg-emerald-100/80 border border-emerald-600/40 px-2 py-0.2 rounded-full shadow-sm tracking-wider uppercase mt-0.5">
      LA HEMBRA #2
    </div>
  </div>
);

// 3 de Bastos - Los 3 bastos cruzados y atados con cinta celeste (Tradición Fournier)
export const TresDeBastosArtwork: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
    <svg viewBox="0 0 100 150" className="w-full h-full max-h-36">
      {/* Basto diagonal izquierda (Naranja) */}
      <g transform="rotate(28 50 75)">
        <path d="M47 15 L53 15 L52 135 L48 135 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
      </g>
      {/* Basto diagonal derecha (Verde) */}
      <g transform="rotate(-28 50 75)">
        <path d="M47 15 L53 15 L52 135 L48 135 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
      </g>
      {/* Basto vertical central (Naranja/Madera) */}
      <path d="M47 12 L53 12 L52 138 L48 138 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />

      {/* Lazo / Cinta Celeste central que ata los 3 bastos (Signo icónico Fournier) */}
      <ellipse cx="50" cy="75" rx="14" ry="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.8" />
      <circle cx="50" cy="75" r="4.5" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.2" />
      {/* Colas de la cinta celeste */}
      <path d="M46 80 C40 92, 36 96, 32 102" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M54 80 C60 92, 64 96, 68 102" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// 1 de Oros - Gran Medallón de Oro con corona de laureles
export const AsDeOroArtwork: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
    <svg viewBox="0 0 100 130" className="w-full h-full max-h-36">
      {/* Guirnalda y orla exterior con hojas de laurel */}
      <circle cx="50" cy="65" r="44" stroke="#15803d" strokeWidth="2" fill="none" strokeDasharray="6,3" />
      <circle cx="50" cy="65" r="39" fill="#facc15" stroke="#854d0e" strokeWidth="2.5" />
      <circle cx="50" cy="65" r="33" fill="#eab308" stroke="#713f12" strokeWidth="1.5" />
      {/* Efigie central del monarca / sol de mayo */}
      <circle cx="50" cy="65" r="24" fill="#fef08a" stroke="#a16207" strokeWidth="1.2" />
      <path
        d="M48 48 C44 48, 39 52, 39 57 C39 61, 41 63, 39 66 C37 69, 35 71, 35 75 C35 78, 38 80, 40 82 C38 85, 36 88, 37 92 L63 92 C63 86, 60 81, 60 77 C62 75, 64 72, 63 68 C62 64, 59 60, 59 56 C59 50, 55 48, 48 48 Z"
        fill="#facc15"
        stroke="#78350f"
        strokeWidth="1.2"
      />
      {/* Rayos exteriores */}
      <path d="M50 15 L50 24 M50 106 L50 115 M15 65 L24 65 M76 65 L85 65" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// 1 de Copas - Gran Copón Renacentista con tapa labrada
export const AsDeCopaArtwork: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
    <svg viewBox="0 0 100 140" className="w-full h-full max-h-36">
      {/* Remate superior / Perilla de la tapa */}
      <circle cx="50" cy="18" r="4" fill="#fde047" stroke="#78350f" strokeWidth="1.2" />
      {/* Tapa cónica del copón */}
      <polygon points="50,18 28,34 72,34" fill="#eab308" stroke="#78350f" strokeWidth="1.5" />
      {/* Borde / Reborde del cáliz */}
      <ellipse cx="50" cy="36" rx="26" ry="6" fill="#facc15" stroke="#78350f" strokeWidth="1.5" />
      {/* Cuerpo acanalado con rubíes */}
      <path
        d="M24 36 C24 60, 34 78, 46 82 L46 102 L34 110 C26 115, 26 122, 30 126 L70 126 C74 122, 74 115, 66 110 L54 102 L54 82 C66 78, 76 60, 76 36 Z"
        fill="#eab308"
        stroke="#78350f"
        strokeWidth="1.8"
      />
      {/* Asas laterales ornamentales */}
      <path d="M24 42 C14 42, 14 62, 26 66" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M76 42 C86 42, 86 62, 74 66" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Gran gema central */}
      <circle cx="50" cy="58" r="6" fill="#dc2626" stroke="#78350f" strokeWidth="1.2" />
      <circle cx="48" cy="56" r="1.5" fill="#fecaca" />
    </svg>
  </div>
);

// 7 de Espadas - Siete Bravo (3 arriba, 1 horizontal, 3 abajo)
export const SieteDeEspadasArtwork: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between items-center py-1 px-1">
    {/* 3 espadas arriba apuntando hacia abajo */}
    <div className="w-full flex justify-between px-1">
      <EspadaIcon size={26} className="rotate-180" />
      <EspadaIcon size={26} className="rotate-180" />
      <EspadaIcon size={26} className="rotate-180" />
    </div>
    {/* 1 espada horizontal central (Marca distintiva del 7 de Espadas) */}
    <div className="w-full flex justify-center py-0.5">
      <EspadaIcon size={30} className="rotate-90" />
    </div>
    {/* 3 espadas abajo apuntando hacia arriba */}
    <div className="w-full flex justify-between px-1">
      <EspadaIcon size={26} />
      <EspadaIcon size={26} />
      <EspadaIcon size={26} />
    </div>
  </div>
);

// 7 de Bastos - (3 arriba, 1 horizontal central, 3 abajo)
export const SieteDeBastosArtwork: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between items-center py-1 px-1">
    <div className="w-full flex justify-between px-1">
      <BastoIcon size={25} variant="orange" className="rotate-180" />
      <BastoIcon size={25} variant="green" className="rotate-180" />
      <BastoIcon size={25} variant="orange" className="rotate-180" />
    </div>
    {/* Basto horizontal central */}
    <div className="w-full flex justify-center py-0.5">
      <BastoIcon size={28} variant="green" className="rotate-90" />
    </div>
    <div className="w-full flex justify-between px-1">
      <BastoIcon size={25} variant="green" />
      <BastoIcon size={25} variant="orange" />
      <BastoIcon size={25} variant="green" />
    </div>
  </div>
);

// 7 de Oros - El Velo (3 a la izquierda, 3 a la derecha, 1 arriba al centro)
export const SieteDeOrosArtwork: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between items-center py-1 px-1">
    {/* Fila superior con moneda central */}
    <div className="w-full flex justify-between items-center">
      <OroIcon size={20} />
      <OroIcon size={22} className="filter drop-shadow-sm -mt-1" />
      <OroIcon size={20} />
    </div>
    {/* Fila media */}
    <div className="w-full flex justify-between px-1">
      <OroIcon size={20} />
      <OroIcon size={20} />
    </div>
    {/* Fila inferior */}
    <div className="w-full flex justify-between px-1">
      <OroIcon size={20} />
      <OroIcon size={20} />
    </div>
  </div>
);

// ============================================================================
// 3. FIGURAS TRADICIONALES: 10 Sota, 11 Caballo, 12 Rey (Ilustraciones de época)
// ============================================================================

export const FigureArtwork: React.FC<{ number: 10 | 11 | 12; suit: Suit }> = ({ number, suit }) => {
  const titles = {
    10: 'SOTA',
    11: 'CABALLO',
    12: 'REY',
  }[number];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-1">
      <span className="text-[7px] sm:text-[9px] font-display font-black tracking-widest text-amber-950/80 uppercase">
        {titles}
      </span>

      <svg viewBox="0 0 100 130" className="w-full h-full max-h-28">
        {/* ======================= 10 - SOTA (Paje de pie) ======================= */}
        {number === 10 && (
          <g>
            {/* Sombrero / Bonete con pluma */}
            <path d="M40 20 C40 14, 60 14, 60 20 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
            <path d="M55 16 C62 10, 68 12, 70 18" stroke="#facc15" strokeWidth="1.5" fill="none" />
            {/* Rostro del paje */}
            <circle cx="50" cy="25" r="7" fill="#fed7aa" stroke="#78350f" strokeWidth="0.8" />
            {/* Jubón / Túnica renacentista */}
            <path d="M40 32 L34 58 L66 58 L60 32 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1" />
            {/* Cinturón */}
            <rect x="36" y="56" width="28" height="4" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
            {/* Calzas / Piernas */}
            <line x1="44" y1="60" x2="43" y2="92" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
            <line x1="56" y1="60" x2="57" y2="92" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
            {/* Zapatos con hebilla */}
            <polygon points="38,92 46,92 48,97 36,97" fill="#78350f" />
            <polygon points="54,92 62,92 64,97 52,97" fill="#78350f" />
            {/* Capa corta al hombro */}
            <path d="M38 32 C30 42, 28 60, 32 68" stroke="#f59e0b" strokeWidth="3" fill="none" />
            {/* Sostiene el palo en la mano derecha */}
            <rect x="64" y="38" width="4" height="40" fill="#a16207" rx="1" />
          </g>
        )}

        {/* ======================= 11 - CABALLO (Jinete montado) ======================= */}
        {number === 11 && (
          <g>
            {/* Caballo: Cuerpo, grupa y cuello */}
            <path
              d="M24 75 C24 60, 35 56, 48 56 C56 56, 68 50, 72 40 C75 36, 78 40, 77 46 C75 52, 68 62, 68 70 C72 74, 76 76, 74 85 L68 85 C68 78, 64 76, 56 76 C46 76, 40 85, 34 85 C30 85, 24 82, 24 75 Z"
              fill="#d97706"
              stroke="#78350f"
              strokeWidth="1.2"
            />
            {/* Cabeza del corcel */}
            <path d="M72 40 L82 44 L80 50 L74 48 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            {/* Crin y cola */}
            <path d="M68 42 C64 46, 62 54, 64 58" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M24 70 C18 76, 16 88, 18 95" stroke="#451a03" strokeWidth="3" fill="none" />
            {/* Patas delanteras y traseras */}
            <line x1="70" y1="82" x2="72" y2="104" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="32" y1="82" x2="30" y2="104" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
            {/* Caballero / Jinete */}
            <circle cx="50" cy="30" r="6" fill="#fed7aa" stroke="#78350f" strokeWidth="0.8" />
            {/* Yelmo con penacho */}
            <polygon points="45,28 50,20 55,28" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
            <path d="M50 20 C54 12, 62 14, 60 22" stroke="#dc2626" strokeWidth="2" fill="none" />
            {/* Torso del jinete con coraza */}
            <path d="M44 36 L42 56 L58 56 L56 36 Z" fill="#047857" stroke="#064e3b" strokeWidth="1" />
            {/* Riendas */}
            <path d="M52 48 L74 48" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="2,2" />
          </g>
        )}

        {/* ======================= 12 - REY (Monarca en su trono) ======================= */}
        {number === 12 && (
          <g>
            {/* Corona Imperial dorada */}
            <polygon points="36,20 40,12 46,17 50,9 54,17 60,12 64,20" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
            <circle cx="50" cy="8" r="2" fill="#dc2626" />
            {/* Cabeza del Rey con barba regia */}
            <circle cx="50" cy="24" r="7" fill="#fed7aa" stroke="#78350f" strokeWidth="0.8" />
            <path d="M44 26 C44 34, 56 34, 56 26 Z" fill="#78350f" />
            {/* Manto Real majestuoso */}
            <path d="M34 32 C34 32, 42 30, 50 33 C58 30, 66 32, 66 32 L72 90 L28 90 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
            {/* Cuello de armiño blanco con motas */}
            <path d="M40 32 C42 42, 58 42, 60 32 L50 40 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="48" cy="36" r="0.8" fill="#1c1917" />
            <circle cx="52" cy="36" r="0.8" fill="#1c1917" />
            {/* Cetro dorado de mando */}
            <line x1="30" y1="42" x2="26" y2="82" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="40" r="3" fill="#facc15" stroke="#78350f" strokeWidth="1" />
          </g>
        )}
      </svg>

      {/* Emblema del palo sostenido por la figura */}
      <div className="flex items-center gap-1 mt-0.5">
        <SuitSymbol suit={suit} size={17} />
      </div>
    </div>
  );
};

// ============================================================================
// 4. DISPOSICIÓN COMPLETA DEL CENTRO DEL NAIPE SEGÚN NÚMERO Y PALO
// ============================================================================

export const CardCenterLayout: React.FC<{ number: CardNumber; suit: Suit }> = ({ number, suit }) => {
  // Figuras 10, 11, 12
  if (number >= 10) {
    return <FigureArtwork number={number as 10 | 11 | 12} suit={suit} />;
  }

  // Cartas singulares y bravas
  if (number === 1) {
    if (suit === 'espada') return <AsDeEspadaArtwork />;
    if (suit === 'basto') return <AsDeBastoArtwork />;
    if (suit === 'oro') return <AsDeOroArtwork />;
    if (suit === 'copa') return <AsDeCopaArtwork />;
  }

  if (number === 3 && suit === 'basto') {
    return <TresDeBastosArtwork />;
  }

  if (number === 7) {
    if (suit === 'espada') return <SieteDeEspadasArtwork />;
    if (suit === 'oro') return <SieteDeOrosArtwork />;
    if (suit === 'basto') return <SieteDeBastosArtwork />;
  }

  // Disposiciones canónicas españolas (2 a 7)
  switch (number) {
    case 2:
      return (
        <div className="w-full h-full flex flex-col justify-around items-center py-2 px-1">
          <SuitSymbol suit={suit} size={25} variant="orange" />
          <SuitSymbol suit={suit} size={25} variant="green" className="rotate-180" />
        </div>
      );
    case 3:
      return (
        <div className="w-full h-full flex flex-col justify-between items-center py-1.5 px-1">
          <SuitSymbol suit={suit} size={22} variant="orange" />
          <SuitSymbol suit={suit} size={22} variant="green" />
          <SuitSymbol suit={suit} size={22} variant="orange" className="rotate-180" />
        </div>
      );
    case 4:
      return (
        <div className="w-full h-full grid grid-cols-2 gap-x-2 gap-y-2 items-center justify-items-center p-1.5">
          <SuitSymbol suit={suit} size={20} variant="orange" />
          <SuitSymbol suit={suit} size={20} variant="green" />
          <SuitSymbol suit={suit} size={20} variant="green" className="rotate-180" />
          <SuitSymbol suit={suit} size={20} variant="orange" className="rotate-180" />
        </div>
      );
    case 5:
      return (
        <div className="w-full h-full flex flex-col justify-between items-center py-1 px-1.5">
          <div className="w-full flex justify-between">
            <SuitSymbol suit={suit} size={18} variant="orange" />
            <SuitSymbol suit={suit} size={18} variant="green" />
          </div>
          <SuitSymbol suit={suit} size={21} variant="green" />
          <div className="w-full flex justify-between">
            <SuitSymbol suit={suit} size={18} variant="green" className="rotate-180" />
            <SuitSymbol suit={suit} size={18} variant="orange" className="rotate-180" />
          </div>
        </div>
      );
    case 6:
      return (
        <div className="w-full h-full grid grid-cols-2 gap-x-2 gap-y-1 items-center justify-items-center py-1 px-1">
          <SuitSymbol suit={suit} size={17} variant="orange" />
          <SuitSymbol suit={suit} size={17} variant="green" />
          <SuitSymbol suit={suit} size={17} variant="green" />
          <SuitSymbol suit={suit} size={17} variant="orange" />
          <SuitSymbol suit={suit} size={17} variant="orange" className="rotate-180" />
          <SuitSymbol suit={suit} size={17} variant="green" className="rotate-180" />
        </div>
      );
    case 7:
      // Para copas (7 de copas)
      return (
        <div className="w-full h-full flex flex-col justify-between items-center py-1 px-1">
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
