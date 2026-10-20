import React, { useState } from 'react';
import type { PlayerRole } from '../types/truco';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreBoardProps {
  playerScore: number;
  opponentScore: number;
  targetScore: 15 | 30;
  handOwner: PlayerRole; // Quien es Mano
  playerName?: string;
  opponentName?: string;
}

// Representa un grupo de hasta 5 fósforos (un cuadrado con diagonal)
const MatchstickBox: React.FC<{ count: number }> = ({ count }) => {
  const c = Math.min(Math.max(count, 0), 5);

  return (
    <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 border border-stone-700/80 rounded-lg bg-stone-900/90 p-0.5 flex items-center justify-center shadow-inner shrink-0">
      <svg viewBox="0 0 40 40" className="w-full h-full filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
        <defs>
          <radialGradient id="matchHead" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="45%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <linearGradient id="matchWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Fósforo 1: Izquierda vertical */}
        {c >= 1 && (
          <g>
            <line x1="8" y1="8" x2="8" y2="32" stroke="url(#matchWood)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="8" cy="8" r="3" fill="url(#matchHead)" stroke="#450a0a" strokeWidth="0.8" />
          </g>
        )}

        {/* Fósforo 2: Superior horizontal */}
        {c >= 2 && (
          <g>
            <line x1="8" y1="8" x2="32" y2="8" stroke="url(#matchWood)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="8" r="3" fill="url(#matchHead)" stroke="#450a0a" strokeWidth="0.8" />
          </g>
        )}

        {/* Fósforo 3: Derecha vertical */}
        {c >= 3 && (
          <g>
            <line x1="32" y1="8" x2="32" y2="32" stroke="url(#matchWood)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="32" r="3" fill="url(#matchHead)" stroke="#450a0a" strokeWidth="0.8" />
          </g>
        )}

        {/* Fósforo 4: Inferior horizontal */}
        {c >= 4 && (
          <g>
            <line x1="8" y1="32" x2="32" y2="32" stroke="url(#matchWood)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="8" cy="32" r="3" fill="url(#matchHead)" stroke="#450a0a" strokeWidth="0.8" />
          </g>
        )}

        {/* Fósforo 5: Diagonal (cruza el cuadrado) */}
        {c >= 5 && (
          <g>
            <line x1="8" y1="8" x2="32" y2="32" stroke="url(#matchWood)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3.2" fill="url(#matchHead)" stroke="#450a0a" strokeWidth="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
};

const PlayerColumn: React.FC<{
  name: string;
  score: number;
  targetScore: 15 | 30;
  isMano: boolean;
  isPlayer: boolean;
  showMatchsticks: boolean;
}> = ({ name, score, targetScore, isMano, isPlayer, showMatchsticks }) => {
  const is30 = targetScore === 30;
  const malasScore = Math.min(score, 15);
  const buenasScore = is30 ? Math.max(score - 15, 0) : 0;

  const getBoxes = (points: number) => {
    const boxes = [];
    for (let i = 0; i < 3; i++) {
      const boxScore = Math.min(Math.max(points - i * 5, 0), 5);
      boxes.push(boxScore);
    }
    return boxes;
  };

  const malasBoxes = getBoxes(malasScore);
  const buenasBoxes = getBoxes(buenasScore);

  return (
    <div
      className={`flex-1 flex flex-col p-2 sm:p-2.5 rounded-xl border ${
        isPlayer ? 'bg-amber-950/30 border-amber-500/40' : 'bg-slate-900/40 border-slate-700/50'
      }`}
    >
      {/* Header del jugador */}
      <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-amber-900/20">
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-serif font-bold text-slate-100 text-xs sm:text-sm truncate max-w-[85px] sm:max-w-none">
            {name}
          </span>
          {isMano && (
            <span
              className="text-[8px] sm:text-[10px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-black tracking-wider uppercase shadow shrink-0"
              title="Es Mano"
            >
              MANO ✋
            </span>
          )}
        </div>
        <div className="text-base sm:text-lg font-mono font-black text-amber-400 shrink-0">
          {score}
          <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/{targetScore}</span>
        </div>
      </div>

      {/* Cajas de fósforos (plegables o reducidas en móvil) */}
      {showMatchsticks && (
        <div className="mt-1.5 sm:mt-2 flex flex-col gap-1 sm:gap-1.5">
          {/* Malas */}
          <div>
            <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-amber-300/70 block mb-0.5">
              {is30 ? 'Malas' : 'Puntos'}
            </span>
            <div className="flex gap-1 sm:gap-1.5">
              {malasBoxes.map((count, i) => (
                <MatchstickBox key={`m-${i}`} count={count} />
              ))}
            </div>
          </div>

          {/* Buenas */}
          {is30 && (
            <div className="pt-1 border-t border-amber-900/10">
              <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-emerald-400/80 block mb-0.5">
                Buenas
              </span>
              <div className="flex gap-1 sm:gap-1.5">
                {buenasBoxes.map((count, i) => (
                  <MatchstickBox key={`b-${i}`} count={count} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerScore,
  opponentScore,
  targetScore,
  handOwner,
  playerName = 'Vos',
  opponentName = 'La PC',
}) => {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="bg-gradient-to-b from-amber-950/80 via-stone-900/90 to-stone-950 border border-amber-700/50 rounded-2xl p-2 sm:p-3 shadow-xl backdrop-blur-md w-full max-w-md">
      <div className="flex items-center justify-between px-1 mb-1.5">
        <div className="flex items-center gap-1.5 text-amber-400 font-serif font-black text-[10px] sm:text-xs uppercase tracking-wider">
          <span>🪵</span>
          <span>Tanteador</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] sm:text-[11px] bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded-full border border-amber-600/30">
            A {targetScore} pts
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-0.5 rounded text-stone-400 hover:text-white"
            title={showDetails ? 'Ocultar fósforos' : 'Ver fósforos'}
          >
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <PlayerColumn
          name={playerName}
          score={playerScore}
          targetScore={targetScore}
          isMano={handOwner === 'player'}
          isPlayer={true}
          showMatchsticks={showDetails}
        />
        <PlayerColumn
          name={opponentName}
          score={opponentScore}
          targetScore={targetScore}
          isMano={handOwner === 'opponent'}
          isPlayer={false}
          showMatchsticks={showDetails}
        />
      </div>
    </div>
  );
};
