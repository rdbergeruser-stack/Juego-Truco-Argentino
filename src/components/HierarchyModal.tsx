import React from 'react';
import { HIERARCHY_LIST } from '../game/deck';
import { X, HelpCircle, Trophy } from 'lucide-react';

interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HierarchyModal: React.FC<HierarchyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-body">
      <div className="bg-[#1c1009] border-2 border-amber-600/70 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-[#fbf3df]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-950 via-[#261309] to-amber-950 border-b border-amber-700/50">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-display font-black text-amber-300">
                Escala de Jerarquía del Truco Argentino
              </h2>
              <p className="text-xs text-amber-200/80 font-body">
                De mayor poder (arriba) a menor poder (abajo). La carta superior mata a cualquiera inferior.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-amber-950/60 text-amber-200/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {HIERARCHY_LIST.map((item, idx) => {
            const isBrava = item.rank >= 11;
            return (
              <div
                key={item.rank}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  isBrava
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-stone-800/40 border-stone-700/50'
                }`}
              >
                {/* Rango */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                    isBrava
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow'
                      : 'bg-stone-700 text-stone-300'
                  }`}
                >
                  #{idx + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-amber-100 text-sm">{item.name}</span>
                    {isBrava && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-semibold">
                        CARTA BRAVA 🔥
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5 text-amber-400/90">
            <HelpCircle className="w-4 h-4" />
            <span>Regla de oro: En empates (parda), se define por las reglas de rondas o por la Mano.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

