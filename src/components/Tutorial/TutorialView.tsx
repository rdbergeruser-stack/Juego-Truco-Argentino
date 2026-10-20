import React, { useState } from 'react';
import { GLOSSARY_ITEMS, TUTORIAL_MODULES } from '../../data/tutorialData';
import type { TutorialModule } from '../../data/tutorialData';
import { GuidedSimulator } from './GuidedSimulator';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Play, Award, HelpCircle, Gamepad2 } from 'lucide-react';
import { sound } from '../../game/sounds';

interface TutorialViewProps {
  onStartGame: () => void;
  onOpenHierarchy: () => void;
}

export const TutorialView: React.FC<TutorialViewProps> = ({ onStartGame, onOpenHierarchy }) => {
  const [currentTab, setCurrentTab] = useState<'guided' | 'lessons' | 'glossary'>('guided');
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  
  // Estado de los cuestionarios interactivos { [quizId]: selectedOptionIndex }
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const currentModule: TutorialModule = TUTORIAL_MODULES[selectedModuleIndex];

  const handleSelectOption = (quizId: string, optionIdx: number, isCorrect: boolean) => {
    setQuizAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
    if (isCorrect) {
      sound.playMatchstickScore();
    } else {
      sound.playFold();
    }

    // Verificar si se completó el módulo actual
    const moduleQuizzes = currentModule.interactiveChallenge.quizzes;
    const allAnswered = moduleQuizzes.every(q => {
      if (q.id === quizId) return optionIdx === q.correctOptionIndex;
      return quizAnswers[q.id] === q.correctOptionIndex;
    });

    if (allAnswered) {
      setCompletedModules(prev => new Set(prev).add(currentModule.id));
      sound.playWinFanfare();
    }
  };

  const handleNextModule = () => {
    if (selectedModuleIndex < TUTORIAL_MODULES.length - 1) {
      setSelectedModuleIndex(prev => prev + 1);
    }
  };

  const handlePrevModule = () => {
    if (selectedModuleIndex > 0) {
      setSelectedModuleIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6 text-[#fbf3df] font-body">
      {/* Banner Principal de la Pulpería */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#24130a] via-[#1c0f08] to-[#24130a] border-2 border-amber-600/60 p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-8xl sm:text-9xl select-none pointer-events-none">
          🧉
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-display font-black text-[11px] sm:text-xs uppercase tracking-widest mb-1">
              <span>🇦🇷</span>
              <span>Escuela de Truco Criollo</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-display font-black text-amber-300 drop-shadow">
              Aprendé a Jugar al Truco Argentino
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed italic">
              De principiante a maestro: cartas bravas, tanteo de envido, pardas y el arte de mentir con picardía.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onOpenHierarchy}
              className="px-3.5 py-2 bg-[#2a170d] hover:bg-[#3d2013] text-amber-200 border border-amber-600/50 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition touch-manipulation active:scale-95 shadow-md"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Jerarquía de Cartas</span>
            </button>
            <button
              onClick={onStartGame}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-[#140a05] rounded-xl font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl border border-amber-300 transition transform active:scale-95 touch-manipulation tracking-wide"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Jugar contra la PC</span>
            </button>
          </div>
        </div>

        {/* Pestañas de modo: Simulador Guiado vs Manual Teórico vs Diccionario */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-amber-800/40">
          <button
            onClick={() => setCurrentTab('guided')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs font-display font-black tracking-wide transition flex items-center justify-center gap-1.5 touch-manipulation active:scale-95 ${
              currentTab === 'guided'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#140a05] shadow-lg border border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-[#2a170d]/80 text-amber-200/80 hover:bg-[#2a170d] border border-amber-900/40'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Simulador de Jugadas Guiadas (8)</span>
          </button>
          <button
            onClick={() => setCurrentTab('lessons')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs font-display font-black tracking-wide transition flex items-center justify-center gap-1.5 touch-manipulation active:scale-95 ${
              currentTab === 'lessons'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#140a05] shadow-lg border border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-[#2a170d]/80 text-amber-200/80 hover:bg-[#2a170d] border border-amber-900/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manual Teórico ({TUTORIAL_MODULES.length})</span>
          </button>
          <button
            onClick={() => setCurrentTab('glossary')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs font-display font-black tracking-wide transition flex items-center justify-center gap-1.5 touch-manipulation active:scale-95 ${
              currentTab === 'glossary'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#140a05] shadow-lg border border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-[#2a170d]/80 text-amber-200/80 hover:bg-[#2a170d] border border-amber-900/40'
            }`}
          >
            <span>📜</span>
            <span>Diccionario Criollo</span>
          </button>
        </div>
      </div>

      {/* Vista de Simulador Guiado Paso a Paso */}
      {currentTab === 'guided' && (
        <GuidedSimulator onStartGame={onStartGame} />
      )}

      {/* Vista de Diccionario Criollo */}
      {currentTab === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GLOSSARY_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-lg hover:border-amber-600/40 transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-black text-base text-amber-300">{item.term}</h3>
                <span className="text-xs text-stone-500">#{i + 1}</span>
              </div>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">{item.definition}</p>
              <div className="mt-3 pt-2 border-t border-stone-800/80">
                <span className="text-[11px] text-amber-400/80 font-mono italic">
                  &ldquo;{item.example}&rdquo;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Lecciones */}
      {currentTab === 'lessons' && (
        <div className="space-y-6">
          {/* Navegador horizontal de módulos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {TUTORIAL_MODULES.map((mod, index) => {
              const isSelected = selectedModuleIndex === index;
              const isDone = completedModules.has(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModuleIndex(index)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/30 text-amber-200 shadow-xl'
                      : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:bg-stone-850 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xl">{mod.icon}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-bold mt-1 line-clamp-1">{mod.title}</span>
                </button>
              );
            })}
          </div>

          {/* Contenido del Módulo Activo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Columna Izquierda: Teoría */}
            <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
                <span className="text-3xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  {currentModule.icon}
                </span>
                <div>
                  <h2 className="text-xl font-serif font-black text-amber-300">
                    {currentModule.title}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">{currentModule.shortDesc}</p>
                </div>
              </div>

              {/* Secciones de teoría */}
              <div className="space-y-4">
                {currentModule.theory.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <h3 className="font-bold text-amber-200 text-sm">{section.heading}</h3>
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs text-stone-300 leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {section.bulletPoints && (
                      <ul className="space-y-1.5 pl-2 mt-2">
                        {section.bulletPoints.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-stone-200 leading-relaxed flex items-start gap-1.5">
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.alert && (
                      <div
                        className={`p-3 rounded-xl border text-xs mt-3 ${
                          section.alert.type === 'important'
                            ? 'bg-red-950/40 border-red-500/50 text-red-200'
                            : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                        }`}
                      >
                        {section.alert.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Desafío Interactivo / Quiz */}
            <div className="lg:col-span-5 bg-stone-900/90 border-2 border-amber-600/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif font-black text-sm text-amber-300 uppercase tracking-wider">
                      {currentModule.interactiveChallenge.title}
                    </h3>
                  </div>
                  {completedModules.has(currentModule.id) && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                      ¡COMPLETADO! 🎉
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-2">
                  {currentModule.interactiveChallenge.instructions}
                </p>

                {/* Preguntas */}
                <div className="mt-4 space-y-5">
                  {currentModule.interactiveChallenge.quizzes.map((quiz, qIdx) => {
                    const selectedIdx = quizAnswers[quiz.id];
                    const isAnswered = selectedIdx !== undefined;
                    const isCorrect = isAnswered && selectedIdx === quiz.correctOptionIndex;

                    return (
                      <div key={quiz.id} className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800">
                        <span className="text-[11px] font-mono text-amber-400/80 font-bold block mb-1">
                          Pregunta #{qIdx + 1}
                        </span>
                        <p className="text-xs font-semibold text-slate-100">{quiz.question}</p>

                        <div className="mt-3 space-y-1.5">
                          {quiz.options.map((opt, optIdx) => {
                            const isThisSelected = selectedIdx === optIdx;
                            const isThisCorrect = optIdx === quiz.correctOptionIndex;

                            let btnStyle = 'bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-300';
                            if (isAnswered) {
                              if (isThisCorrect) {
                                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                              } else if (isThisSelected && !isCorrect) {
                                btnStyle = 'bg-red-950/80 border-red-500 text-red-200 font-bold';
                              } else {
                                btnStyle = 'bg-stone-900/40 opacity-40 border-stone-800 text-stone-400';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(quiz.id, optIdx, isThisCorrect)}
                                disabled={isAnswered}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && isThisCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                                {isAnswered && isThisSelected && !isThisCorrect && (
                                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explicación tras responder */}
                        {isAnswered && (
                          <div
                            className={`mt-3 p-2.5 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                              isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                                : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                            }`}
                          >
                            <span className="font-bold block mb-0.5">
                              {isCorrect ? '¡Excelente decisión!' : '¡Ojo con esto!'}
                            </span>
                            {quiz.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botones de navegación de módulo */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  onClick={handlePrevModule}
                  disabled={selectedModuleIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-stone-800 text-xs font-semibold text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                {selectedModuleIndex < TUTORIAL_MODULES.length - 1 ? (
                  <button
                    onClick={handleNextModule}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span>Siguiente Lección</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onStartGame}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg transition"
                  >
                    <span>¡A Jugar la Partida!</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

