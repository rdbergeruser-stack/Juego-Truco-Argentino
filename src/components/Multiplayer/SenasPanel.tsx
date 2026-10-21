import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { TRUCO_SENAS, type SenaType } from '../../types/multiplayer';

interface SenasPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSena: (sena: SenaType) => void;
  teammateName?: string;
}

export function SenasPanel({
  isOpen,
  onClose,
  onSendSena,
  teammateName = 'tu compañero',
}: SenasPanelProps) {
  const [lastSent, setLastSent] = useState<SenaType | null>(null);

  if (!isOpen) return null;

  const handleSend = (type: SenaType) => {
    onSendSena(type);
    setLastSent(type);
    setTimeout(() => {
      setLastSent(null);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#24130a] to-[#140a05] border-2 border-amber-600/70 rounded-2xl p-4 sm:p-5 max-w-md w-full shadow-2xl flex flex-col gap-3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-amber-300/70 hover:text-amber-200 p-1 rounded-lg hover:bg-amber-950/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-lg">
            🤫
          </div>
          <div>
            <h3 className="font-display font-black text-amber-200 text-base sm:text-lg tracking-wide">
              Señas Criollas Secretas
            </h3>
            <p className="text-[11px] text-amber-200/70 font-body">
              Se envían <strong>únicamente a {teammateName}</strong> sin que los rivales la vean.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {TRUCO_SENAS.map((s) => (
            <button
              key={s.type}
              onClick={() => handleSend(s.type)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition text-left active:scale-95 ${
                lastSent === s.type
                  ? 'bg-emerald-900 border-emerald-400 text-white shadow-lg'
                  : 'bg-[#1a0c06] hover:bg-[#2e170c] border-amber-800/50 hover:border-amber-500 text-amber-100'
              }`}
            >
              <div className="text-2xl w-8 h-8 flex items-center justify-center shrink-0">
                {s.faceEmoji}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 font-display font-bold text-xs truncate">
                  <span>{s.label}</span>
                </div>
                <div className="text-[10px] text-amber-300/70 truncate">{s.meaning}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#120803] p-2.5 rounded-xl border border-amber-900/60 text-[10px] text-amber-200/60 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>¡Ojo al piojo! No te demores mucho en tirar la seña para no avivar a los contrarios.</span>
        </div>
      </div>
    </div>
  );
}
