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
  // En móviles empieza minimizado para no tapar la mesa
  const [minimized, setMinimized] = useState(false);

  if (!enabled) {
    return (
      <button
        onClick={() => onToggle(true)}
        className="fixed bottom-20 right-3 sm:bottom-4 sm:right-4 z-40 flex items-center gap-1.5 bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full shadow-xl border border-amber-300 transition transform hover:scale-105 touch-manipulation"
        title="Activar el Asistente / Mentor de Truco"
      >
        <span className="text-lg sm:text-xl">🤠</span>
        <span className="text-[11px] sm:text-xs">Mentor</span>
      </button>
    );
  }

  const getBadgeIcon = () => {
    switch (advice.badge) {
      case 'success':
        return <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />;
      case 'tip':
        return <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />;
    }
  };

  const badgeBg = {
    success: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
    warning: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
    tip: 'bg-yellow-950/70 border-yellow-500/40 text-yellow-200',
    info: 'bg-blue-950/70 border-blue-500/40 text-blue-200',
  }[advice.badge || 'info'];

  return (
    <div className="fixed bottom-24 right-2 left-2 xs:left-auto xs:right-3 sm:bottom-4 sm:right-4 z-40 xs:max-w-xs sm:max-w-sm w-auto bg-stone-900/95 border border-amber-600/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100 transition-all duration-300 touch-manipulation">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-700/40">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0">
            🤠
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-serif font-black text-amber-300 text-xs truncate">Don Facundo</span>
              <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1 py-0.2 rounded font-mono shrink-0">
                TUTOR
              </span>
            </div>
            {envidoScore !== undefined && (
              <span className="text-[10px] text-amber-400/90 font-semibold block leading-tight">
                Tantos: <strong className="text-white">{envidoScore}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
            title={minimized ? 'Expandir' : 'Minimizar'}
          >
            {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggle(false)}
            className="text-xs text-stone-400 hover:text-red-400 px-1 py-0.5"
            title="Ocultar Mentor"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="p-2 sm:p-3 space-y-2 max-h-48 overflow-y-auto">
          <div className={`flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl border text-[11px] sm:text-xs ${badgeBg}`}>
            {getBadgeIcon()}
            <div>
              <strong className="block font-bold">{advice.headline}</strong>
              <p className="mt-0.5 leading-snug text-stone-300">{advice.advice}</p>
            </div>
          </div>

          {advice.recommendedAction && (
            <div className="flex items-center justify-between bg-stone-950/80 px-2 py-1 rounded-lg border border-stone-800">
              <span className="text-[10px] sm:text-[11px] text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Sugerencia:
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-amber-300">
                {advice.recommendedAction}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
