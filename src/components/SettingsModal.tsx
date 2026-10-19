import React from 'react';
import type { DifficultyLevel, GameSettings } from '../types/truco';
import { X, Trophy, Settings } from 'lucide-react';
import { sound } from '../game/sounds';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onRestartMatch: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onRestartMatch,
}) => {
  if (!isOpen) return null;

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    onUpdateSettings({ difficulty: diff });
    sound.playMatchstickScore();
  };

  const handlePointsChange = (pts: 15 | 30) => {
    onUpdateSettings({ targetPoints: pts });
    sound.playMatchstickScore();
    onRestartMatch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100">
      <div className="bg-stone-900 border-2 border-amber-600/70 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-700/40">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-serif font-black text-amber-300">
              Ajustes de la Partida
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Opciones */}
        <div className="p-5 space-y-5 text-xs">
          {/* Nivel del Rival */}
          <div>
            <label className="font-bold text-amber-200 block mb-2 flex items-center gap-1.5">
              <span>🤠</span> Nivel de la Computadora:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy', label: 'Aprendiz', icon: '👦' },
                { id: 'medium', label: 'Criollo', icon: '🤠' },
                { id: 'hard', label: 'Zorro', icon: '🦊' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => handleDifficultyChange(d.id as DifficultyLevel)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    settings.difficulty === d.id
                      ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold ring-2 ring-amber-500/40 shadow'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-850'
                  }`}
                >
                  <span className="text-xl">{d.icon}</span>
                  <span className="text-[11px]">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duración de la Partida */}
          <div>
            <label className="font-bold text-amber-200 block mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Puntos de la Partida:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePointsChange(15)}
                className={`p-2.5 rounded-xl border transition text-center ${
                  settings.targetPoints === 15
                    ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold ring-2 ring-amber-500/40'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                <div className="font-bold text-sm">A 15 Puntos</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Partida rápida (un chico)</div>
              </button>
              <button
                onClick={() => handlePointsChange(30)}
                className={`p-2.5 rounded-xl border transition text-center ${
                  settings.targetPoints === 30
                    ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold ring-2 ring-amber-500/40'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                <div className="font-bold text-sm">A 30 Puntos</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Tradicional (Malas y Buenas)</div>
              </button>
            </div>
          </div>

          {/* Regla de Flor */}
          <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div>
              <span className="font-bold text-stone-200 block">Jugar con Flor</span>
              <span className="text-[11px] text-stone-400">3 cartas del mismo palo valen 3 puntos</span>
            </div>
            <button
              onClick={() => {
                onUpdateSettings({ withFlor: !settings.withFlor });
                sound.playMatchstickScore();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.withFlor ? 'bg-amber-500' : 'bg-stone-850 border border-stone-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                  settings.withFlor ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Asistente / Mentor en vivo */}
          <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div>
              <span className="font-bold text-stone-200 block">Mentor en Vivo (Don Facundo)</span>
              <span className="text-[11px] text-stone-400">Consejos y explicaciones tácticas paso a paso</span>
            </div>
            <button
              onClick={() => {
                onUpdateSettings({ mentorEnabled: !settings.mentorEnabled });
                sound.playMatchstickScore();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.mentorEnabled ? 'bg-amber-500' : 'bg-stone-850 border border-stone-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                  settings.mentorEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition text-xs"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
