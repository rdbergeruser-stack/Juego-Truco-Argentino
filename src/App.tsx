import { useState } from 'react';
import type { GameSettings } from './types/truco';
import { TutorialView } from './components/Tutorial/TutorialView';
import { GameBoard } from './components/GameBoard';
import { MultiplayerView } from './components/Multiplayer/MultiplayerView';
import { HierarchyModal } from './components/HierarchyModal';
import { SettingsModal } from './components/SettingsModal';
import { GraduationCap, Swords, Settings, HelpCircle, Users } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'game' | 'multiplayer'>(() => {
    // Si la URL contiene un parámetro de sala, abrir directamente el modo multijugador
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('sala')) return 'multiplayer';
    }
    return 'tutorial';
  });

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
    <div className="min-h-screen bg-pulperia text-[#fbf3df] flex flex-col font-body selection:bg-amber-600 selection:text-[#fbf3df] w-full overflow-x-clip">
      {/* Barra de Navegación Principal de la Pulpería */}
      <header className="sticky top-0 z-30 bg-[#1c1009]/95 border-b border-amber-800/40 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
          
          {/* Fila Superior en Móvil / Lado Izquierdo en Desktop */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo y Título Criollo */}
            <div
              onClick={() => setActiveTab('tutorial')}
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border border-amber-500/50 flex items-center justify-center text-lg sm:text-xl shadow-md group-hover:scale-105 transition">
                🧉
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-amber-300 text-sm sm:text-base md:text-lg tracking-wider leading-none drop-shadow">
                    Truco Criollo
                  </span>
                  <span className="text-[9px] sm:text-[10px] bg-sky-950 text-sky-200 border border-sky-600/50 px-1.5 py-0.2 rounded font-mono font-bold">
                    ARG
                  </span>
                </div>
                <span className="text-[10px] text-amber-200/60 hidden md:block font-body italic -mt-0.5">
                  Pulpería, Escuela & Amigos Online
                </span>
              </div>
            </div>

            {/* Acciones Rápidas en Móvil (Ayuda y Ajustes) */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setIsHierarchyOpen(true)}
                className="p-1.5 rounded-xl bg-[#2a170d] hover:bg-[#381f12] text-amber-300 border border-amber-700/50 shadow-md transition touch-manipulation active:scale-95"
                title="Escala de Jerarquía de Cartas"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 rounded-xl bg-[#2a170d] hover:bg-[#381f12] text-amber-200 border border-amber-700/50 shadow-md transition touch-manipulation active:scale-95"
                title="Ajustes de la partida"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de Modos (Grid de 3 columnas en Móvil, Centrado en Desktop) */}
          <nav className="w-full md:w-auto grid grid-cols-3 md:flex items-center bg-[#120904] p-1 rounded-xl sm:rounded-2xl border border-amber-900/60 shadow-inner gap-1">
            <button
              onClick={() => setActiveTab('tutorial')}
              className={`flex items-center justify-center gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-display font-black tracking-wide transition touch-manipulation active:scale-95 ${
                activeTab === 'tutorial'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#140a05] shadow-md border border-amber-300/40'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Escuela</span>
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center justify-center gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-display font-black tracking-wide transition touch-manipulation active:scale-95 ${
                activeTab === 'game'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#140a05] shadow-md border border-amber-300/40'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">vs PC</span>
            </button>
            <button
              onClick={() => setActiveTab('multiplayer')}
              className={`flex items-center justify-center gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-display font-black tracking-wide transition touch-manipulation active:scale-95 relative ${
                activeTab === 'multiplayer'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#140a05] shadow-md border border-amber-300/40'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-emerald-400" />
              <span className="truncate">
                <span className="hidden min-[350px]:inline">Con </span>Amigos
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse absolute top-1 right-1" />
            </button>
          </nav>

          {/* Acciones Rápidas en Desktop */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsHierarchyOpen(true)}
              className="p-2 rounded-xl bg-[#2a170d] hover:bg-[#381f12] text-amber-300 border border-amber-700/50 shadow-md transition touch-manipulation active:scale-95"
              title="Escala de Jerarquía de Cartas"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-[#2a170d] hover:bg-[#381f12] text-amber-200 border border-amber-700/50 shadow-md transition touch-manipulation active:scale-95"
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
        ) : activeTab === 'game' ? (
          <GameBoard
            onOpenTutorial={() => setActiveTab('tutorial')}
            onOpenHierarchy={() => setIsHierarchyOpen(true)}
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        ) : (
          <MultiplayerView
            onBackToMenu={() => setActiveTab('game')}
            onOpenHierarchy={() => setIsHierarchyOpen(true)}
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
