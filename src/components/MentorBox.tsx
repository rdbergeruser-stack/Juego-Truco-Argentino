import React, { useState } from 'react';
import type { MentorAdvice } from '../game/mentor';
import { ChevronDown, ChevronUp, Lightbulb, Sparkles, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

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
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  if (!enabled) {
    return (
      <>
        {/* Botón Desktop */}
        <button
          onClick={() => onToggle(true)}
          className="hidden sm:flex fixed bottom-4 right-4 z-40 items-center gap-1.5 bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-bold px-3 py-2 rounded-full shadow-xl border border-amber-300 transition transform hover:scale-105 touch-manipulation"
          title="Activar Mentor"
        >
          <span className="text-xl">🤠</span>
          <span className="text-xs">Activar Mentor</span>
        </button>

        {/* Botón Móvil (Superior) */}
        <button
          onClick={() => onToggle(true)}
          className="sm:hidden fixed top-14 right-2 z-40 flex items-center gap-1 bg-stone-900/90 border border-amber-500/70 text-amber-300 px-2 py-1 rounded-full shadow-lg text-[10px] font-bold touch-manipulation active:scale-95"
          title="Activar Mentor"
        >
          <span>🤠</span>
          <span>Mentor</span>
        </button>
      </>
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
    success: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
    warning: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
    tip: 'bg-yellow-950/70 border-yellow-500/40 text-yellow-200',
    info: 'bg-blue-950/70 border-blue-500/40 text-blue-200',
  }[advice.badge || 'info'];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MODO MÓVIL: Botón superior que NUNCA tapa las cartas */}
      {/* ======================================================== */}
      <div className="sm:hidden">
        {/* Botón pastilla en la parte superior derecha (debajo del header) */}
        <button
          onClick={() => setMobileModalOpen(true)}
          className="fixed top-14 right-2 z-40 flex items-center gap-1.5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-500/80 text-amber-300 px-2.5 py-1 rounded-full shadow-xl text-xs font-bold active:scale-95 touch-manipulation animate-pulse"
        >
          <span className="text-base leading-none">🤠</span>
          <span className="text-[11px] font-serif">Don Facundo</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </button>

        {/* Modal / Diálogo emergente en móvil cuando el usuario lo abre */}
        {mobileModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end xs:items-center justify-center p-3 animate-fade-in"
            onClick={() => setMobileModalOpen(false)}
          >
            <div
              className="bg-[#1c1009] border-2 border-amber-600 rounded-3xl max-w-sm w-full p-4 shadow-2xl text-[#fbf3df]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shadow">
                    🤠
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-amber-300">
                      Consejo de Don Facundo
                    </h3>
                    {envidoScore !== undefined && (
                      <span className="text-[11px] text-amber-400/90 font-body">
                        Tus tantos de envido: <strong className="text-amber-100">{envidoScore}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="p-1 rounded-full hover:bg-amber-950/50 text-amber-300/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido del Consejo */}
              <div className="mt-3 space-y-2.5">
                <div className={`flex items-start gap-2 p-3 rounded-2xl border text-xs ${badgeBg}`}>
                  {getBadgeIcon()}
                  <div>
                    <strong className="block font-display font-bold text-amber-200">{advice.headline}</strong>
                    <p className="mt-1 leading-relaxed font-body italic text-[#fbf3df]/90">{advice.advice}</p>
                  </div>
                </div>

                {advice.recommendedAction && (
                  <div className="flex items-center justify-between bg-[#120804] px-3 py-2 rounded-xl border border-amber-900/50">
                    <span className="text-[11px] text-amber-400/80 flex items-center gap-1 font-body">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sugerencia:
                    </span>
                    <span className="text-xs font-display font-bold text-amber-300">
                      {advice.recommendedAction}
                    </span>
                  </div>
                )}
              </div>

              {/* Botón Cerrar */}
              <button
                onClick={() => setMobileModalOpen(false)}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#140a05] font-display font-black rounded-xl text-xs shadow-lg transition active:scale-95 border border-amber-400/40"
              >
                ¡Entendido, volver a la mesa!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. MODO ESCRITORIO: Cuadro flotante estándar abajo a la derecha */}
      {/* ======================================================== */}
      <div className="hidden sm:block fixed bottom-4 right-4 z-40 max-w-sm w-96 bg-[#1c1009]/95 border-2 border-amber-600/70 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-[#fbf3df] transition-all duration-300">
        {/* Header Desktop */}
        <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-950 via-[#26130a] to-amber-950 border-b border-amber-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-lg shadow-sm shrink-0">
              🤠
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-amber-300 text-xs truncate">Don Facundo</span>
                <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono shrink-0 border border-amber-400/30">
                  TUTOR EN VIVO
                </span>
              </div>
              {envidoScore !== undefined && (
                <span className="text-[11px] text-amber-400/90 font-body block leading-tight">
                  Tus tantos de envido: <strong className="text-white">{envidoScore}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 rounded hover:bg-amber-900/50 text-amber-300/80 hover:text-white"
              title={minimized ? 'Expandir' : 'Minimizar'}
            >
              {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggle(false)}
              className="text-xs text-amber-300/60 hover:text-red-400 px-1 py-0.5"
              title="Ocultar Mentor"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body Desktop */}
        {!minimized && (
          <div className="p-3 space-y-2.5 max-h-56 overflow-y-auto">
            <div className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${badgeBg}`}>
              {getBadgeIcon()}
              <div>
                <strong className="block font-display font-bold text-amber-200">{advice.headline}</strong>
                <p className="mt-1 leading-relaxed font-body italic text-[#fbf3df]/90">{advice.advice}</p>
              </div>
            </div>

            {advice.recommendedAction && (
              <div className="flex items-center justify-between bg-[#120804] px-2.5 py-1.5 rounded-lg border border-amber-900/50">
                <span className="text-[11px] text-amber-400/80 flex items-center gap-1 font-body">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sugerencia:
                </span>
                <span className="text-xs font-display font-bold text-amber-300">
                  {advice.recommendedAction}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
