import React from 'react';
import type { PlayerRole } from '../types/truco';

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
    <div className="relative w-10 h-10 border border-amber-900/10 rounded bg-amber-50/50 p-1 flex items-center justify-center shadow-inner">
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <radialGradient id="matchHead" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
        </defs>

        {/* Fósforo 1: Izquierda vertical */}
        {c >= 1 && (
          <g>
            <line x1="8" y1="8" x2="8" y2="32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="8" cy="8" r="2.2" fill="url(#matchHead)" />
          </g>
        )}

        {/* Fósforo 2: Superior horizontal */}
        {c >= 2 && (
          <g>
            <line x1="8" y1="8" x2="32" y2="8" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="8" r="2.2" fill="url(#matchHead)" />
          </g>
        )}

        {/* Fósforo 3: Derecha vertical */}
        {c >= 3 && (
          <g>
            <line x1="32" y1="8" x2="32" y2="32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="32" r="2.2" fill="url(#matchHead)" />
          </g>
        )}

        {/* Fósforo 4: Inferior horizontal */}
        {c >= 4 && (
          <g>
            <line x1="8" y1="32" x2="32" y2="32" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="8" cy="32" r="2.2" fill="url(#matchHead)" />
          </g>
        )}

        {/* Fósforo 5: Diagonal (cruza el cuadrado) */}
        {c >= 5 && (
          <g>
            <line x1="8" y1="8" x2="32" y2="32" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2.4" fill="url(#matchHead)" />
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
}> = ({ name, score, targetScore, isMano, isPlayer }) => {
  const is30 = targetScore === 30;
  const malasScore = Math.min(score, 15);
  const buenasScore = is30 ? Math.max(score - 15, 0) : 0;

  // Dividir puntajes en grupos de 5 fósforos
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
      className={`flex-1 flex flex-col p-3 rounded-xl border ${
        isPlayer ? 'bg-amber-950/20 border-amber-500/30' : 'bg-slate-900/30 border-slate-700/40'
      }`}
    >
      {/* Header del jugador */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-slate-100 text-sm">{name}</span>
          {isMano && (
            <span
              className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow"
              title="Es Mano (ventaja en empates y primer turno)"
            >
              MANO ✋
            </span>
          )}
        </div>
        <div className="text-xl font-mono font-black text-amber-400">
          {score}
          <span className="text-xs text-slate-400 font-normal">/{targetScore}</span>
        </div>
      </div>

      {/* Cajas de fósforos */}
      <div className="mt-2.5 flex flex-col gap-2">
        {/* Sección: Malas (Primeros 15) */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/70 block mb-1">
            {is30 ? 'A las Malas (1-15)' : 'Puntos (1-15)'}
          </span>
          <div className="flex gap-2">
            {malasBoxes.map((count, i) => (
              <MatchstickBox key={`m-${i}`} count={count} />
            ))}
          </div>
        </div>

        {/* Sección: Buenas (16-30 si es a 30) */}
        {is30 && (
          <div className="pt-1.5 border-t border-amber-900/10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80 block mb-1">
              A las Buenas (16-30)
            </span>
            <div className="flex gap-2">
              {buenasBoxes.map((count, i) => (
                <MatchstickBox key={`b-${i}`} count={count} />
              ))}
            </div>
          </div>
        )}
      </div>
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
  return (
    <div className="bg-gradient-to-b from-amber-950/80 via-stone-900/90 to-stone-950 border-2 border-amber-700/50 rounded-2xl p-3 shadow-2xl backdrop-blur-md max-w-md w-full">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-serif font-black text-xs uppercase tracking-widest">
          <span>🪵</span>
          <span>Tanteador Criollo</span>
        </div>
        <span className="text-[11px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded-full border border-amber-600/30">
          Partida a {targetScore}
        </span>
      </div>

      <div className="flex gap-3">
        <PlayerColumn
          name={playerName}
          score={playerScore}
          targetScore={targetScore}
          isMano={handOwner === 'player'}
          isPlayer={true}
        />
        <PlayerColumn
          name={opponentName}
          score={opponentScore}
          targetScore={targetScore}
          isMano={handOwner === 'opponent'}
          isPlayer={false}
        />
      </div>
    </div>
  );
};
