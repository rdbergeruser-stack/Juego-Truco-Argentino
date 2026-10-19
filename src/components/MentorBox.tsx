import React, { useState } from 'react';
import type { MentorAdvice } from '../game/mentor';
import { ChevronDown, ChevronUp, Lightbulb, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface MentorBoxProps {
  advice: MentorAdvice;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  envidoScore?: number;
}

export const MentorBox: React.FC<MentorBoxProps> = ({
  advice,
  enabled,
  onToggle,
  envidoScore,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (!enabled) {
    return (
      <button
        onClick={() => onToggle(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-bold px-3 py-2 rounded-full shadow-xl border border-amber-300 transition transform hover:scale-105"
        title="Activar el Asistente / Mentor de Truco"
      >
        <span className="text-xl">🤠</span>
        <span className="text-xs">Activar Mentor</span>
      </button>
    );
  }

  const getBadgeIcon = () => {
    switch (advice.badge) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  const badgeBg = {
    success: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
    warning: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    tip: 'bg-yellow-950/60 border-yellow-500/40 text-yellow-200',
    info: 'bg-blue-950/60 border-blue-500/40 text-blue-200',
  }[advice.badge || 'info'];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[90vw] sm:w-96 bg-stone-900/95 border-2 border-amber-600/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-700/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-lg shadow-sm">
            🤠
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-amber-300 text-xs">Don Facundo</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                TUTOR EN VIVO
              </span>
            </div>
            {envidoScore !== undefined && (
              <span className="text-[11px] text-amber-400/90 font-semibold">
                Tus tantos de envido: <strong className="text-white">{envidoScore}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
            title={minimized ? 'Expandir' : 'Minimizar'}
          >
            {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggle(false)}
            className="text-[10px] text-stone-400 hover:text-red-400 px-1.5 py-1"
            title="Ocultar Mentor"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="p-3 space-y-2.5">
          <div className={`flex items-start gap-2 p-2 rounded-xl border text-xs ${badgeBg}`}>
            {getBadgeIcon()}
            <div>
              <strong className="block font-bold">{advice.headline}</strong>
              <p className="mt-0.5 leading-relaxed text-stone-300">{advice.advice}</p>
            </div>
          </div>

          {advice.recommendedAction && (
            <div className="flex items-center justify-between bg-stone-950/80 px-2.5 py-1.5 rounded-lg border border-stone-800">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sugerencia:
              </span>
              <span className="text-xs font-bold text-amber-300">
                {advice.recommendedAction}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
