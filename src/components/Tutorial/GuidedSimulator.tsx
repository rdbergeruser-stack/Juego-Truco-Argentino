import React, { useState } from 'react';
import { GUIDED_SCENARIOS } from '../../data/guidedLessonsData';
import type { GuidedScenario, GuidedStepOption } from '../../data/guidedLessonsData';
import { CardView } from '../CardView';
import { sound } from '../../game/sounds';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Trophy,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedSimulatorProps {
  onStartGame: () => void;
}

export const GuidedSimulator: React.FC<GuidedSimulatorProps> = ({ onStartGame }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  const scenario: GuidedScenario = GUIDED_SCENARIOS[currentScenarioIndex];
  const selectedOption: GuidedStepOption | undefined = scenario.options.find(
    o => o.id === selectedOptionId
  );

  const handleChooseOption = (option: GuidedStepOption) => {
    setSelectedOptionId(option.id);

    if (option.isOptimal) {
      sound.playMatchstickScore();
      sound.playWinFanfare();
      setCompletedScenarios(prev => new Set(prev).add(scenario.id));

      if (completedScenarios.size + 1 === GUIDED_SCENARIOS.length) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      sound.playFold();
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < GUIDED_SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handlePrevScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(prev => prev - 1);
      setSelectedOptionId(null);
    }
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
  };

  return (
    <div className="space-y-4 text-slate-100">
      {/* Selector Rápido de Escenarios Guiados */}
      <div className="flex items-center justify-between bg-stone-900/90 border border-stone-800 rounded-2xl p-2.5 sm:p-3 shadow-md overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl">🤠</span>
          <div>
            <span className="font-serif font-black text-amber-300 text-xs sm:text-sm block leading-none">
              Laboratorio de Jugadas
            </span>
            <span className="text-[10px] text-stone-400">
              Escenario {currentScenarioIndex + 1} de {GUIDED_SCENARIOS.length}
            </span>
          </div>
        </div>

        {/* Píldoras de Progreso */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {GUIDED_SCENARIOS.map((sc, idx) => {
            const isCurrent = idx === currentScenarioIndex;
            const isDone = completedScenarios.has(sc.id);

            return (
              <button
                key={sc.id}
                onClick={() => {
                  setCurrentScenarioIndex(idx);
                  setSelectedOptionId(null);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center shrink-0 touch-manipulation ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400 shadow'
                    : isDone
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title={sc.title}
              >
                {isDone ? '✓' : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta Principal del Escenario */}
      <div className="bg-[#1c1009]/95 border-2 border-amber-600/60 rounded-3xl p-3 sm:p-6 shadow-2xl space-y-4 text-[#fbf3df]">
        {/* Encabezado del Desafío */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-900/40">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              {scenario.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.2 rounded-full font-mono font-bold uppercase">
                  {scenario.conceptBadge}
                </span>
                {completedScenarios.has(scenario.id) && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resuelto
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-display font-black text-amber-300 mt-0.5">
                {scenario.title}
              </h2>
              <p className="text-xs text-amber-200/70 font-body">{scenario.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={handlePrevScenario}
              disabled={currentScenarioIndex === 0}
              className="p-1.5 rounded-xl border border-amber-900/60 bg-[#26140b] text-amber-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextScenario}
              disabled={currentScenarioIndex === GUIDED_SCENARIOS.length - 1}
              className="p-1.5 rounded-xl border border-amber-900/60 bg-[#26140b] text-amber-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
              title="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explicación de Don Facundo sobre la Mesa */}
        <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-[#261309] border border-amber-600/40 shadow-inner">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shadow shrink-0">
            🤠
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-amber-300 text-xs sm:text-sm">
                Don Facundo te explica la situación:
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#fbf3df]/90 leading-relaxed font-body italic">
              &ldquo;{scenario.introDialogue.facundoComment}&rdquo;
            </p>
            <div className="pt-1 flex items-center gap-1 text-amber-400 font-display font-bold text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{scenario.introDialogue.question}</span>
            </div>
          </div>
        </div>

        {/* LA MESA VIRTUAL DEL DESAFÍO (Paño Verde de Fieltro con Marco de Madera) */}
        <div
          className="rounded-2xl sm:rounded-3xl border-[5px] sm:border-[8px] border-[#291408] p-3 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden ring-1 ring-amber-600/40"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #0d5435 0%, #063c26 55%, #022416 100%)',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Remaches de bronce en esquinas */}
          <div className="absolute top-1.5 left-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow pointer-events-none" />

          {/* Historial o Ronda actual */}
          <div className="flex items-center justify-between text-[11px] text-amber-200/90 border-b border-emerald-800/40 pb-2">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600/40">
                Ronda {scenario.roundInfo.round} de 3
              </span>
              <span>{scenario.roundInfo.isPlayerMano ? '• Sos MANO ✋' : '• Sos PIE'}</span>
            </div>

            {scenario.roundInfo.tricksHistory && (
              <span className="text-[10px] text-amber-300/80 italic hidden xs:inline">
                {scenario.roundInfo.tricksHistory[0].description}
              </span>
            )}
          </div>

          {/* CARTA DEL RIVAL EN LA MESA */}
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 mb-1.5">
              {scenario.tableContext.opponentActionText || 'La mesa'}
            </span>

            {scenario.tableContext.opponentCard ? (
              <div className="flex flex-col items-center">
                <CardView card={scenario.tableContext.opponentCard} size="md" />
                <span className="mt-1 text-[11px] font-bold text-stone-300">
                  Carta del Rival: {scenario.tableContext.opponentCard.name}
                </span>
              </div>
            ) : (
              <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-xl border-2 border-dashed border-emerald-600/40 flex flex-col items-center justify-center text-center p-2 text-emerald-400/80">
                <span className="text-xl">🪑</span>
                <span className="text-[10px] font-bold mt-1">Paño Libre</span>
                <span className="text-[9px] text-emerald-300/60">Te toca salir</span>
              </div>
            )}
          </div>

          {/* TUS CARTAS EN MANO (INTERACTIVAS: Tocá para jugar) */}
          <div className="pt-2 border-t border-emerald-800/40 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2">
              👇 TOCÁ LA CARTA O JUGADA QUE HARÍAS VOS 👇
            </span>

            {/* Opciones con Cartas Físicas */}
            <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-4">
              {scenario.options
                .filter(opt => opt.actionType === 'play_card' && opt.card)
                .map(opt => {
                  const isSelected = selectedOptionId === opt.id;

                  return (
                    <div key={opt.id} className="flex flex-col items-center">
                      <div className="relative">
                        <CardView
                          card={opt.card}
                          size="md"
                          selected={isSelected}
                          onClick={() => handleChooseOption(opt)}
                        />
                      </div>
                      <button
                        onClick={() => handleChooseOption(opt)}
                        className={`mt-1.5 px-3 py-1 rounded-xl text-[10px] sm:text-xs font-bold transition touch-manipulation active:scale-95 shadow ${
                          isSelected
                            ? opt.isOptimal
                              ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300'
                              : 'bg-red-500 text-white ring-2 ring-red-300'
                            : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                        }`}
                      >
                        {isSelected ? (opt.isOptimal ? '¡Elegida! ✓' : 'Elegida ✗') : 'Jugar Esta'}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Opciones con Acciones Especiales (Envido, Truco, Irse al mazo) */}
            {scenario.options.some(opt => opt.actionType !== 'play_card') && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
                {scenario.options
                  .filter(opt => opt.actionType !== 'play_card')
                  .map(opt => {
                    const isSelected = selectedOptionId === opt.id;

                    let btnStyle = 'bg-stone-800 hover:bg-stone-700 text-amber-200 border-amber-600/40';
                    if (opt.actionType === 'chant_envido') {
                      btnStyle = 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-400 font-black';
                    } else if (opt.actionType === 'chant_truco') {
                      btnStyle = 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black';
                    } else if (opt.actionType === 'no_quiero') {
                      btnStyle = 'bg-stone-800 hover:bg-red-950 text-stone-300 border-stone-700';
                    } else if (opt.actionType === 'quiero') {
                      btnStyle = 'bg-emerald-600 hover:bg-emerald-500 text-white font-black';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleChooseOption(opt)}
                        className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border shadow-lg transition touch-manipulation active:scale-95 ${btnStyle} ${
                          isSelected ? 'ring-4 ring-amber-300' : ''
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* DEVOLUCIÓN DE DON FACUNDO (Aparece al elegir) */}
        {selectedOption && (
          <div
            className={`p-3.5 sm:p-5 rounded-2xl border-2 transition animate-fade-in ${
              selectedOption.isOptimal
                ? 'bg-emerald-950/70 border-emerald-500/80 shadow-emerald-950/50 shadow-xl'
                : 'bg-amber-950/70 border-amber-500/80 shadow-amber-950/50 shadow-xl'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">
                {selectedOption.isOptimal ? '🎉' : '🤔'}
              </span>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h4
                    className={`font-serif font-black text-sm sm:text-base ${
                      selectedOption.isOptimal ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {selectedOption.donFacundoFeedback.headline}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      selectedOption.isOptimal
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                        : 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                    }`}
                  >
                    {selectedOption.isOptimal ? '¡Jugada Correcta!' : 'Jugada Peligrosa'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {selectedOption.donFacundoFeedback.explanation}
                </p>

                {/* Si fue correcta, mostrar la moraleja */}
                {selectedOption.isOptimal && (
                  <div className="mt-3 p-2.5 rounded-xl bg-stone-950/70 border border-emerald-600/40 flex items-center gap-2 text-xs text-amber-300 font-serif font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{scenario.takeawayMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción posterior a la respuesta */}
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2 flex-wrap">
              {!selectedOption.isOptimal ? (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition touch-manipulation active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Probar con otra carta</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Lección aprendida!</span>
                </div>
              )}

              {currentScenarioIndex < GUIDED_SCENARIOS.length - 1 ? (
                <button
                  onClick={handleNextScenario}
                  className="ml-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition touch-manipulation active:scale-95"
                >
                  <span>Siguiente Jugada Guiada</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onStartGame}
                  className="ml-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition touch-manipulation active:scale-95"
                >
                  <Trophy className="w-4 h-4" />
                  <span>¡A jugar contra la PC!</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
