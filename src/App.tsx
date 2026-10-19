import { useState } from 'react';
import type { GameSettings } from './types/truco';
import { TutorialView } from './components/Tutorial/TutorialView';
import { GameBoard } from './components/GameBoard';
import { HierarchyModal } from './components/HierarchyModal';
import { SettingsModal } from './components/SettingsModal';
import { GraduationCap, Swords, Settings, HelpCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'game'>('tutorial');
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [settings, setSettings] = useState<GameSettings>({
    targetPoints: 15,
    withFlor: true,
    difficulty: 'medium',
    mentorEnabled: true,
    soundEnabled: true,
  });

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-slate-100 flex flex-col font-sans">
      {/* Barra de Navegación Principal */}
      <header className="sticky top-0 z-30 bg-stone-900/95 border-b border-amber-900/40 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo y Título */}
          <div
            onClick={() => setActiveTab('tutorial')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
              🧉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-amber-400 text-base md:text-lg tracking-wide leading-none">
                  Truco Criollo
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/40 px-1.5 py-0.2 rounded font-mono font-bold">
                  ARGENTINO
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block -mt-0.5">
                Escuela Interactiva & Partida vs PC
              </span>
            </div>
          </div>

          {/* Selector de Modos Central */}
          <div className="flex items-center bg-stone-950/80 p-1 rounded-2xl border border-stone-800">
            <button
              onClick={() => setActiveTab('tutorial')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'tutorial'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Escuela</span>
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'game'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Jugar vs PC</span>
            </button>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsHierarchyOpen(true)}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-amber-300 border border-amber-900/40 transition"
              title="Escala de Jerarquía de Cartas"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 border border-stone-800 transition"
              title="Ajustes de la partida"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1">
        {activeTab === 'tutorial' ? (
          <TutorialView
            onStartGame={() => setActiveTab('game')}
            onOpenHierarchy={() => setIsHierarchyOpen(true)}
          />
        ) : (
          <GameBoard
            onOpenTutorial={() => setActiveTab('tutorial')}
            onOpenHierarchy={() => setIsHierarchyOpen(true)}
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
      </main>

      {/* Modales */}
      <HierarchyModal
        isOpen={isHierarchyOpen}
        onClose={() => setIsHierarchyOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onRestartMatch={() => {}}
      />
    </div>
  );
}

export default App;
