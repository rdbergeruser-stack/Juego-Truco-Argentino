import React, { useState, useEffect, useRef } from 'react';
import type { Card, DifficultyLevel, GameSettings, PlayerRole, TrickResult, TrucoChantLevel } from '../types/truco';
import { createDeck, dealCards } from '../game/deck';
import { calculateEnvido, hasFlor, resolveEnvidoDuel } from '../game/envido';
import { checkHandWinner, evaluateTrick, getTrucoPoints, getTrucoRefusedPoints } from '../game/trucoLogic';
import { makeAIDecision } from '../game/ai';
import { getMentorAdvice } from '../game/mentor';
import { sound } from '../game/sounds';
import { CardView } from './CardView';
import { ScoreBoard } from './ScoreBoard';
import { MentorBox } from './MentorBox';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, RotateCcw, HelpCircle, GraduationCap, Flame, ShieldAlert } from 'lucide-react';

interface GameBoardProps {
  onOpenTutorial: () => void;
  onOpenHierarchy: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  onOpenTutorial,
  onOpenHierarchy,
  settings,
  onUpdateSettings,
}) => {
  // Puntajes del partido
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  // Quién es Mano en la mano actual (se alterna en cada mano)
  const [handMano, setHandMano] = useState<PlayerRole>('player');

  // Cartas en mano
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);

  // Cartas jugadas en la mesa (organizadas por ronda 1, 2, 3)
  const [tableTricks, setTableTricks] = useState<TrickResult[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1); // 1, 2, 3

  // Turno actual para jugar carta o responder
  const [currentTurn, setCurrentTurn] = useState<PlayerRole>('player');

  // Estados de cantos
  const [envidoDone, setEnvidoDone] = useState<boolean>(false);
  const [trucoLevel, setTrucoLevel] = useState<TrucoChantLevel>('none');
  const [trucoChantedBy, setTrucoChantedBy] = useState<PlayerRole | undefined>(undefined);

  // Canto pendiente al que hay que responder
  // ej: 'envido', 'real_envido', 'falta_envido', 'truco', 'retruco', 'vale_cuatro', 'flor'
  const [pendingCall, setPendingCall] = useState<string | null>(null);
  const [callInitiator, setCallInitiator] = useState<PlayerRole | null>(null);

  // Registro de envidos encadenados para calcular puntos finales
  const [envidoChain, setEnvidoChain] = useState<string[]>([]);

  // Cartas tiradas en la ronda en curso
  const [roundPlayerCard, setRoundPlayerCard] = useState<Card | null>(null);
  const [roundOpponentCard, setRoundOpponentCard] = useState<Card | null>(null);

  // Burbujas de diálogo
  const [opponentBubble, setOpponentBubble] = useState<string | null>(null);
  const [playerBubble, setPlayerBubble] = useState<string | null>(null);
  const [centerBanner, setCenterBanner] = useState<string | null>(null);

  // Carta seleccionada por el jugador
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Fin de la mano / Fin del partido
  const [handEnded, setHandEnded] = useState<boolean>(false);
  const [handEndMessage, setHandEndMessage] = useState<string>('');
  const [gameWinner, setGameWinner] = useState<PlayerRole | null>(null);

  // Referencia para timeouts
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Iniciar una nueva mano
  const startNewHand = (nextMano: PlayerRole) => {
    const deck = createDeck();
    const dealt = dealCards(deck);

    setHandMano(nextMano);
    setPlayerHand(dealt.playerHand);
    setOpponentHand(dealt.opponentHand);
    setTableTricks([]);
    setCurrentRound(1);
    setCurrentTurn(nextMano);

    setEnvidoDone(false);
    setTrucoLevel('none');
    setTrucoChantedBy(undefined);
    setPendingCall(null);
    setCallInitiator(null);
    setEnvidoChain([]);

    setRoundPlayerCard(null);
    setRoundOpponentCard(null);
    setPlayerBubble(null);
    setOpponentBubble(null);
    setSelectedCardId(null);
    setHandEnded(false);
    setHandEndMessage('');

    sound.playCard();
    setCenterBanner(`¡Nueva mano! ${nextMano === 'player' ? 'Sos MANO' : 'La PC es MANO'}`);
    setTimeout(() => setCenterBanner(null), 2500);
  };

  // Iniciar partido desde cero
  const restartMatch = () => {
    setPlayerScore(0);
    setOpponentScore(0);
    setGameWinner(null);
    startNewHand('player');
  };

  // Efecto inicial al montar
  useEffect(() => {
    startNewHand('player');
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Verificar si alguien ganó el partido
  useEffect(() => {
    if (playerScore >= settings.targetPoints && !gameWinner) {
      setGameWinner('player');
      sound.playWinFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else if (opponentScore >= settings.targetPoints && !gameWinner) {
      setGameWinner('opponent');
      sound.playFold();
    }
  }, [playerScore, opponentScore, settings.targetPoints, gameWinner]);

  // Manejo del turno de la IA
  useEffect(() => {
    if (handEnded || gameWinner) return;

    if (currentTurn === 'opponent') {
      const delay = Math.random() * 800 + 700; // 0.7s - 1.5s para naturalidad
      timerRef.current = setTimeout(() => {
        executeAITurn();
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentTurn, pendingCall, roundPlayerCard, roundOpponentCard, handEnded, gameWinner]);

  // Turno de la IA
  const executeAITurn = () => {
    const decision = makeAIDecision({
      aiHand: opponentHand,
      playerHandCount: playerHand.length,
      tableCardsPlayer: tableTricks.map(t => t.playerCards.find(p => p.playedBy === 'player')?.card).filter(Boolean) as Card[],
      tableCardsAI: tableTricks.map(t => t.playerCards.find(p => p.playedBy === 'opponent')?.card).filter(Boolean) as Card[],
      tricks: tableTricks,
      currentRound,
      isAIMano: handMano === 'opponent',
      difficulty: settings.difficulty,
      envidoDone,
      trucoLevel,
      trucoChantedBy,
      currentTurn: 'opponent',
      pendingCall: pendingCall || undefined,
      aiScore: opponentScore,
      playerScore: playerScore,
      targetPoints: settings.targetPoints,
      withFlor: settings.withFlor,
    });

    if (decision.voiceLine) {
      setOpponentBubble(decision.voiceLine);
      setTimeout(() => setOpponentBubble(null), 3000);
    }

    // Procesar acción de la IA
    switch (decision.action) {
      case 'cantar_flor':
        handleOpponentFlor();
        break;
      case 'chant_envido':
        handleOpponentChant('envido');
        break;
      case 'chant_real_envido':
        handleOpponentChant('real_envido');
        break;
      case 'chant_falta_envido':
        handleOpponentChant('falta_envido');
        break;
      case 'chant_truco':
        handleOpponentChant('truco');
        break;
      case 'chant_retruco':
        handleOpponentChant('retruco');
        break;
      case 'chant_vale_cuatro':
        handleOpponentChant('vale_cuatro');
        break;
      case 'quiero':
        handleOpponentResponse(true);
        break;
      case 'no_quiero':
        handleOpponentResponse(false);
        break;
      case 'irse_al_mazo':
        handleOpponentFold();
        break;
      case 'play_card':
        if (decision.cardToPlay) {
          playOpponentCard(decision.cardToPlay);
        }
        break;
    }
  };

  // Opponent tira una carta
  const playOpponentCard = (card: Card) => {
    sound.playCard();
    setOpponentHand(prev => prev.filter(c => c.id !== card.id));
    setRoundOpponentCard(card);

    if (roundPlayerCard) {
      // El jugador ya había tirado en esta ronda; evaluar ronda
      evaluateRoundCompletion(roundPlayerCard, card);
    } else {
      // La IA jugó primera en esta ronda; le toca al jugador responder
      setCurrentTurn('player');
    }
  };

  // Jugador tira una carta
  const handlePlayerPlayCard = (card: Card) => {
    if (currentTurn !== 'player' || pendingCall) return;

    sound.playCard();
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    setSelectedCardId(null);
    setRoundPlayerCard(card);

    if (roundOpponentCard) {
      // La IA ya había jugado en esta ronda; evaluar ronda
      evaluateRoundCompletion(card, roundOpponentCard);
    } else {
      // El jugador jugó primero en esta ronda; le toca a la IA responder
      setCurrentTurn('opponent');
    }
  };

  // Evaluar finalización de una ronda de cartas (primera, segunda o tercera)
  const evaluateRoundCompletion = (pCard: Card, oCard: Card) => {
    const trickEval = evaluateTrick(pCard, oCard);
    sound.playTableKnock();

    const newTrick: TrickResult = {
      round: currentRound,
      playerCards: [
        { card: pCard, playedBy: 'player' },
        { card: oCard, playedBy: 'opponent' },
      ],
      winner: trickEval.winner,
    };

    const updatedTricks = [...tableTricks, newTrick];
    setTableTricks(updatedTricks);

    // Mensaje de resultado de ronda
    setCenterBanner(trickEval.reason);
    setTimeout(() => setCenterBanner(null), 2500);

    // Limpiar cartas tiradas en la ronda
    setTimeout(() => {
      setRoundPlayerCard(null);
      setRoundOpponentCard(null);

      // Verificar si la mano se terminó
      const outcome = checkHandWinner(updatedTricks, handMano);
      if (outcome.finished && outcome.winner) {
        finishHand(outcome.winner, outcome.reason || '');
      } else {
        // Continuar a la siguiente ronda
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);

        // Quien ganó la ronda juega primero en la siguiente. Si fue parda, juega el que era mano en la ronda
        let nextTurn: PlayerRole;
        if (trickEval.winner === 'player') nextTurn = 'player';
        else if (trickEval.winner === 'opponent') nextTurn = 'opponent';
        else nextTurn = handMano; // En parda, sale la mano

        setCurrentTurn(nextTurn);
      }
    }, 1200);
  };

  // Finalizar la mano y repartir puntos de Truco
  const finishHand = (winner: PlayerRole, reason: string) => {
    setHandEnded(true);
    const points = getTrucoPoints(trucoLevel);

    if (winner === 'player') {
      sound.playWinFanfare();
      setPlayerScore(prev => prev + points);
      setHandEndMessage(`¡Ganaste la mano! +${points} pts. (${reason})`);
    } else {
      sound.playFold();
      setOpponentScore(prev => prev + points);
      setHandEndMessage(`La PC ganó la mano. +${points} pts. (${reason})`);
    }
  };

  // JUGADOR CANTA ALGO
  const handlePlayerChant = (chant: string) => {
    sound.playChantTrumpet();
    setCallInitiator('player');
    setPendingCall(chant);

    const labels: Record<string, string> = {
      envido: '¡ENVIDO!',
      real_envido: '¡REAL ENVIDO!',
      falta_envido: '¡FALTA ENVIDO!',
      truco: '¡TRUCO!',
      retruco: '¡QUIERO RETRUCO!',
      vale_cuatro: '¡QUIERO VALE CUATRO!',
      flor: '¡FLOR!',
    };

    setPlayerBubble(labels[chant] || chant.toUpperCase());
    setTimeout(() => setPlayerBubble(null), 3000);

    if (chant.includes('envido')) {
      setEnvidoChain(prev => [...prev, chant]);
    }

    if (chant === 'truco') {
      setTrucoLevel('truco');
      setTrucoChantedBy('player');
    } else if (chant === 'retruco') {
      setTrucoLevel('retruco');
      setTrucoChantedBy('player');
    } else if (chant === 'vale_cuatro') {
      setTrucoLevel('vale_cuatro');
      setTrucoChantedBy('player');
    }

    // Pasa el turno a la IA para responder al canto
    setCurrentTurn('opponent');
  };

  // IA CANTA ALGO
  const handleOpponentChant = (chant: string) => {
    sound.playChantTrumpet();
    setCallInitiator('opponent');
    setPendingCall(chant);

    if (chant.includes('envido')) {
      setEnvidoChain(prev => [...prev, chant]);
    }

    if (chant === 'truco') {
      setTrucoLevel('truco');
      setTrucoChantedBy('opponent');
    } else if (chant === 'retruco') {
      setTrucoLevel('retruco');
      setTrucoChantedBy('opponent');
    } else if (chant === 'vale_cuatro') {
      setTrucoLevel('vale_cuatro');
      setTrucoChantedBy('opponent');
    }

    // Pasa el turno al jugador para responder
    setCurrentTurn('player');
  };

  // IA CANTA FLOR
  const handleOpponentFlor = () => {
    sound.playWinFanfare();
    setOpponentScore(prev => prev + 3);
    setEnvidoDone(true);
    setCenterBanner('¡El rival cantó Flor! (+3 puntos)');
    setTimeout(() => setCenterBanner(null), 3000);
  };

  // JUGADOR RESPONDE AL CANTO (QUIERO / NO QUIERO)
  const handlePlayerResponse = (accepted: boolean) => {
    if (!pendingCall) return;

    if (accepted) {
      sound.playTableKnock();
      setPlayerBubble('¡QUIERO!');
      setTimeout(() => setPlayerBubble(null), 2500);

      if (pendingCall.includes('envido')) {
        // Resolver duelo de envido
        resolveEnvidoShowdown();
      } else {
        // Truco aceptado
        setPendingCall(null);
        setCurrentTurn(callInitiator === 'player' ? 'opponent' : 'player');
      }
    } else {
      // NO QUIERO
      sound.playFold();
      setPlayerBubble('¡NO QUIERO!');
      setTimeout(() => setPlayerBubble(null), 2500);

      if (pendingCall.includes('envido')) {
        // Puntos de no quiero en envido
        const points = calculateEnvidoRefusedPoints(envidoChain);
        setOpponentScore(prev => prev + points);
        setEnvidoDone(true);
        setPendingCall(null);
        setCenterBanner(`No quisiste el envido. La PC suma +${points} pt.`);
        setTimeout(() => setCenterBanner(null), 2500);
        setCurrentTurn(handMano);
      } else {
        // No quiero en Truco: termina la mano inmediatamente para el que cantó
        const refusedPoints = getTrucoRefusedPoints(trucoLevel);
        setOpponentScore(prev => prev + refusedPoints);
        setHandEnded(true);
        setHandEndMessage(`Te fuiste al no quiero. La PC suma +${refusedPoints} pt(s).`);
      }
    }
  };

  // IA RESPONDE AL CANTO (QUIERO / NO QUIERO)
  const handleOpponentResponse = (accepted: boolean) => {
    if (!pendingCall) return;

    if (accepted) {
      sound.playTableKnock();
      setOpponentBubble('¡QUIERO!');
      setTimeout(() => setOpponentBubble(null), 2500);

      if (pendingCall.includes('envido')) {
        resolveEnvidoShowdown();
      } else {
        setPendingCall(null);
        setCurrentTurn(callInitiator === 'opponent' ? 'player' : 'opponent');
      }
    } else {
      // IA DIJO NO QUIERO
      sound.playFold();
      setOpponentBubble('¡NO QUIERO!');
      setTimeout(() => setOpponentBubble(null), 2500);

      if (pendingCall.includes('envido')) {
        const points = calculateEnvidoRefusedPoints(envidoChain);
        setPlayerScore(prev => prev + points);
        setEnvidoDone(true);
        setPendingCall(null);
        setCenterBanner(`La PC no quiso el envido. ¡Sumás +${points} pt(s)!`);
        setTimeout(() => setCenterBanner(null), 2500);
        setCurrentTurn(handMano);
      } else {
        // No quiso el truco: gana el jugador
        const refusedPoints = getTrucoRefusedPoints(trucoLevel);
        setPlayerScore(prev => prev + refusedPoints);
        setHandEnded(true);
        setHandEndMessage(`¡La PC no quiso el truco! Sumás +${refusedPoints} pt(s).`);
      }
    }
  };

  // Calcular puntos de no quiero en cadena de envido
  const calculateEnvidoRefusedPoints = (chain: string[]): number => {
    if (chain.length <= 1) return 1;
    // Si cantaron envido-envido y no quisieron, son 2; si envido-real envido, son 2, etc.
    return chain.length;
  };

  // Comparar tantos de envido
  const resolveEnvidoShowdown = () => {
    const pEnvido = calculateEnvido(playerHand);
    const oEnvido = calculateEnvido(opponentHand);

    const duel = resolveEnvidoDuel(pEnvido.score, oEnvido.score, handMano);
    const duelPoints = calculateAcceptedEnvidoPoints(envidoChain);

    sound.playMatchstickScore();

    if (duel.winner === 'player') {
      setPlayerScore(prev => prev + duelPoints);
      setCenterBanner(`¡Ganaste el envido! ${pEnvido.score} vs ${oEnvido.score} (+${duelPoints} pts)`);
    } else {
      setOpponentScore(prev => prev + duelPoints);
      setCenterBanner(`La PC ganó el envido: ${oEnvido.score} vs ${pEnvido.score} (+${duelPoints} pts)`);
    }

    setEnvidoDone(true);
    setPendingCall(null);
    setTimeout(() => setCenterBanner(null), 3500);

    // Luego de resolver envido, el juego continúa normalmente en la primera mano
    setCurrentTurn(handMano);
  };

  const calculateAcceptedEnvidoPoints = (chain: string[]): number => {
    if (chain.includes('falta_envido')) {
      const leader = Math.max(playerScore, opponentScore);
      return Math.max(settings.targetPoints - leader, 1);
    }
    let pts = 0;
    chain.forEach(c => {
      if (c === 'envido') pts += 2;
      else if (c === 'real_envido') pts += 3;
    });
    return Math.max(pts, 2);
  };

  // Jugador se va al mazo
  const handlePlayerFold = () => {
    sound.playFold();
    const pts = trucoLevel === 'none' ? 1 : getTrucoRefusedPoints(trucoLevel);
    setOpponentScore(prev => prev + pts);
    setHandEnded(true);
    setHandEndMessage(`Te fuiste al mazo. La PC suma +${pts} pt.`);
  };

  // IA se va al mazo
  const handleOpponentFold = () => {
    sound.playFold();
    const pts = trucoLevel === 'none' ? 1 : getTrucoRefusedPoints(trucoLevel);
    setPlayerScore(prev => prev + pts);
    setHandEnded(true);
    setHandEndMessage(`¡La PC se fue al mazo! Sumás +${pts} pt.`);
  };

  // Flor del jugador
  const handlePlayerFlor = () => {
    if (!settings.withFlor || !hasFlor(playerHand)) return;
    sound.playWinFanfare();
    setPlayerScore(prev => prev + 3);
    setEnvidoDone(true);
    setPlayerBubble('¡FLOR!');
    setCenterBanner('¡Cantaste Flor! (+3 puntos)');
    setTimeout(() => {
      setPlayerBubble(null);
      setCenterBanner(null);
    }, 3000);
  };

  // Consejo en vivo del Mentor
  const mentorAdvice = getMentorAdvice({
    playerHand,
    opponentCardOnTable: roundOpponentCard || undefined,
    tricks: tableTricks,
    currentRound,
    isPlayerMano: handMano === 'player',
    envidoDone,
    trucoLevel,
    pendingCall: pendingCall || undefined,
    withFlor: settings.withFlor,
  });

  const playerEnvidoCalc = calculateEnvido(playerHand);

  // Dificultad labels
  const diffLabels: Record<DifficultyLevel, { name: string; avatar: string }> = {
    easy: { name: 'El Gauchito Aprendiz', avatar: '👦' },
    medium: { name: 'Don Facundo (Criollo)', avatar: '🤠' },
    hard: { name: 'El Zorro de las Pampas', avatar: '🦊' },
  };

  return (
    <div className="relative min-h-[100dvh] bg-stone-950 flex flex-col justify-between p-2 sm:p-3 md:p-6 text-slate-100 select-none overflow-x-hidden">
      {/* Barra Superior de Control y Tanteador */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 max-w-6xl mx-auto w-full">
        {/* Tanteador Criollo */}
        <ScoreBoard
          playerScore={playerScore}
          opponentScore={opponentScore}
          targetScore={settings.targetPoints}
          handOwner={handMano}
          playerName="Vos"
          opponentName={diffLabels[settings.difficulty].name}
        />

        {/* Botones de acción rápida y configuración */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full md:w-auto">
          <button
            onClick={onOpenTutorial}
            className="flex-1 md:flex-none px-2.5 sm:px-3 py-1.5 sm:py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-600/50 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow transition touch-manipulation active:scale-95"
          >
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Escuela</span>
          </button>

          <button
            onClick={onOpenHierarchy}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow transition touch-manipulation active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden xs:inline">Jerarquía</span>
          </button>

          <button
            onClick={() => {
              const newSound = !settings.soundEnabled;
              sound.enabled = newSound;
              onUpdateSettings({ soundEnabled: newSound });
            }}
            className="p-1.5 sm:p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl transition touch-manipulation active:scale-95"
            title={settings.soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          <button
            onClick={restartMatch}
            className="p-1.5 sm:p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl transition touch-manipulation active:scale-95"
            title="Reiniciar partida desde cero"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* MESA DE TRUCO (Paño verde tradicional de fieltro con marco de caoba y remaches de bronce) */}
      <div
        className="my-2 sm:my-4 max-w-5xl mx-auto w-full flex-1 rounded-2xl sm:rounded-3xl border-[6px] sm:border-[10px] border-[#291408] shadow-2xl p-2.5 sm:p-4 md:p-8 flex flex-col justify-between relative overflow-hidden ring-1 ring-amber-600/50"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #0d5435 0%, #063c26 55%, #022416 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 50px rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Remaches de bronce pulido en las 4 esquinas de la mesa de madera */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border border-amber-800 shadow-md pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border border-amber-800 shadow-md pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border border-amber-800 shadow-md pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border border-amber-800 shadow-md pointer-events-none" />

        {/* Textura de paño de fieltro sutil */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Cartel Flotante Central de Avisos */}
        {centerBanner && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-stone-950/95 text-amber-300 border-2 border-amber-500 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-serif font-black text-xs sm:text-base md:text-lg shadow-2xl backdrop-blur-md animate-fade-in text-center max-w-[85vw] sm:max-w-md pointer-events-none">
            {centerBanner}
          </div>
        )}

        {/* ZONA OPONENTE (PC) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-stone-900 border-2 border-amber-600/70 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                {diffLabels[settings.difficulty].avatar}
              </div>
              {handMano === 'opponent' && (
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 text-[8px] sm:text-[9px] font-black px-1 rounded-full shadow">
                  MANO
                </span>
              )}
            </div>

            <div>
              <span className="font-serif font-bold text-xs sm:text-sm text-stone-200">
                {diffLabels[settings.difficulty].name}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] sm:text-[10px] text-stone-400">
                  {opponentHand.length} cartas
                </span>
                {currentTurn === 'opponent' && !handEnded && (
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
            </div>

            {/* Globo de Diálogo de la PC */}
            {opponentBubble && (
              <div className="ml-1 sm:ml-2 bg-stone-900 text-amber-300 border border-amber-500/80 px-2.5 sm:px-4 py-1 sm:py-2 rounded-2xl rounded-bl-none font-serif font-bold text-[11px] sm:text-sm shadow-xl animate-fade-in max-w-[140px] sm:max-w-xs">
                &ldquo;{opponentBubble}&rdquo;
              </div>
            )}
          </div>

          {/* Cartas de la PC (Boca abajo) */}
          <div className="flex gap-1.5 sm:gap-2 mt-2">
            {opponentHand.map((_, idx) => (
              <CardView key={`opp-${idx}`} faceDown={true} size="sm" />
            ))}
          </div>
        </div>

        {/* CENTRO DE LA MESA: CARTAS TIRADAS POR RONDA (1, 2, 3) */}
        <div className="relative z-10 my-2 sm:my-4 flex items-center justify-center gap-1.5 xs:gap-3 sm:gap-6 md:gap-8 min-h-[130px] sm:min-h-[160px]">
          {[1, 2, 3].map(roundNum => {
            const trick = tableTricks.find(t => t.round === roundNum);
            const isCurrent = currentRound === roundNum;
            const pCard = roundPlayerCard && isCurrent ? roundPlayerCard : trick?.playerCards.find(p => p.playedBy === 'player')?.card;
            const oCard = roundOpponentCard && isCurrent ? roundOpponentCard : trick?.playerCards.find(p => p.playedBy === 'opponent')?.card;

            return (
              <div
                key={roundNum}
                className={`flex flex-col items-center p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-amber-500/50 shadow-lg ring-1 ring-amber-500/30'
                    : 'bg-emerald-950/20 border-emerald-800/30 opacity-80'
                }`}
              >
                <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300/80 mb-0.5 sm:mb-1">
                  {roundNum === 1 ? '1ra' : roundNum === 2 ? '2da' : '3ra'}
                </span>

                <div className="flex flex-col gap-1 sm:gap-2 items-center">
                  {/* Carta del rival */}
                  <div className="w-11 h-16 sm:w-16 sm:h-24 flex items-center justify-center border border-dashed border-emerald-700/50 rounded-lg sm:rounded-xl bg-black/10">
                    {oCard ? <CardView card={oCard} size="sm" /> : <span className="text-[8px] sm:text-[10px] text-emerald-600">Rival</span>}
                  </div>

                  {/* Carta del jugador */}
                  <div className="w-11 h-16 sm:w-16 sm:h-24 flex items-center justify-center border border-dashed border-emerald-700/50 rounded-lg sm:rounded-xl bg-black/10">
                    {pCard ? <CardView card={pCard} size="sm" /> : <span className="text-[8px] sm:text-[10px] text-emerald-600">Vos</span>}
                  </div>
                </div>

                {/* Resultado de la ronda */}
                {trick && (
                  <span
                    className={`mt-1 text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 rounded shadow ${
                      trick.winner === 'player'
                        ? 'bg-amber-500 text-stone-950'
                        : trick.winner === 'opponent'
                        ? 'bg-stone-800 text-amber-300 border border-stone-700'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {trick.winner === 'player' ? 'GANASTE' : trick.winner === 'opponent' ? 'PERDISTE' : 'PARDA'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ZONA JUGADOR (VOS) */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Globo de Diálogo del Jugador */}
          {playerBubble && (
            <div className="mb-1.5 sm:mb-2 bg-amber-500 text-stone-950 font-serif font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl rounded-br-none text-xs sm:text-sm shadow-xl animate-fade-in">
              {playerBubble}
            </div>
          )}

          {/* Cartas del Jugador */}
          <div className="flex gap-1.5 xs:gap-3 sm:gap-4 items-end justify-center">
            {playerHand.map(card => {
              const isSelected = selectedCardId === card.id;
              const canPlay = currentTurn === 'player' && !pendingCall && !handEnded;
              const isRecommended = settings.mentorEnabled && mentorAdvice.recommendedAction?.includes(card.name);

              return (
                <div key={card.id} className="relative touch-manipulation">
                  {isRecommended && canPlay && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[7px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-lg border border-amber-200 whitespace-nowrap z-30 animate-pulse flex items-center gap-0.5">
                      <span>🤠</span>
                      <span>SUGERIDA</span>
                    </span>
                  )}
                  <CardView
                    card={card}
                    selected={isSelected || (isRecommended && canPlay)}
                    disabled={!canPlay}
                    size="md"
                    onClick={() => {
                      if (canPlay) {
                        handlePlayerPlayCard(card);
                      }
                    }}
                  />
                  {canPlay && (
                    <button
                      onClick={() => handlePlayerPlayCard(card)}
                      className={`absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow transition touch-manipulation active:scale-95 z-20 ${
                        isRecommended
                          ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 ring-2 ring-amber-300'
                          : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                      }`}
                    >
                      TIRAR
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-amber-200/80">
            {handMano === 'player' && (
              <span className="bg-amber-500 text-stone-950 text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full shadow">
                SOS MANO ✋
              </span>
            )}
            <span>
              Envido: <strong className="text-white">{playerEnvidoCalc.score}</strong> ({playerEnvidoCalc.explanation})
            </span>
          </div>
        </div>
      </div>

      {/* PANEL DE ACCIONES Y CANTOS */}
      <div className="max-w-4xl mx-auto w-full bg-stone-900/95 border border-stone-800 rounded-2xl p-2 sm:p-3 shadow-xl backdrop-blur-md">
        {/* Caso 1: Hay un canto pendiente para responder */}
        {pendingCall && currentTurn === 'player' ? (
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs text-amber-300 font-bold flex items-center gap-1 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              ¡El rival cantó {pendingCall.toUpperCase()}! ¿Qué respondés?
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full">
              <button
                onClick={() => handlePlayerResponse(true)}
                className="flex-1 sm:flex-none min-h-[42px] px-4 sm:px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95 touch-manipulation"
              >
                ¡QUIERO! 👍
              </button>
              <button
                onClick={() => handlePlayerResponse(false)}
                className="flex-1 sm:flex-none min-h-[42px] px-4 sm:px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs sm:text-sm border border-stone-700 transition active:scale-95 touch-manipulation"
              >
                NO QUIERO 👎
              </button>

              {/* Redoblar si es Truco */}
              {pendingCall === 'truco' && (
                <button
                  onClick={() => handlePlayerChant('retruco')}
                  className="w-full sm:w-auto min-h-[42px] px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow transition active:scale-95 touch-manipulation"
                >
                  ¡QUIERO RETRUCO! 🔥
                </button>
              )}
              {pendingCall === 'retruco' && (
                <button
                  onClick={() => handlePlayerChant('vale_cuatro')}
                  className="w-full sm:w-auto min-h-[42px] px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs sm:text-sm shadow transition active:scale-95 touch-manipulation"
                >
                  ¡QUIERO VALE CUATRO! ⚡
                </button>
              )}

              {/* Redoblar si es Envido */}
              {pendingCall === 'envido' && (
                <>
                  <button
                    onClick={() => handlePlayerChant('real_envido')}
                    className="flex-1 sm:flex-none min-h-[40px] px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow transition active:scale-95 touch-manipulation"
                  >
                    REAL ENVIDO
                  </button>
                  <button
                    onClick={() => handlePlayerChant('falta_envido')}
                    className="flex-1 sm:flex-none min-h-[40px] px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-black rounded-xl text-xs sm:text-sm shadow transition active:scale-95 touch-manipulation"
                  >
                    FALTA ENVIDO
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Caso 2: Controles normales del jugador */
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            {/* Cantos de Envido y Flor */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {!envidoDone && currentRound === 1 && trucoLevel === 'none' && (
                <>
                  {settings.withFlor && hasFlor(playerHand) && (
                    <button
                      onClick={handlePlayerFlor}
                      disabled={currentTurn !== 'player'}
                      className="min-h-[38px] px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-xl text-[11px] sm:text-xs shadow hover:from-pink-500 hover:to-purple-500 transition disabled:opacity-40 active:scale-95 touch-manipulation"
                    >
                      🌸 ¡FLOR!
                    </button>
                  )}
                  <button
                    onClick={() => handlePlayerChant('envido')}
                    disabled={currentTurn !== 'player'}
                    className="min-h-[38px] px-2.5 sm:px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold rounded-xl text-[11px] sm:text-xs shadow transition disabled:opacity-40 active:scale-95 touch-manipulation"
                  >
                    Envido
                  </button>
                  <button
                    onClick={() => handlePlayerChant('real_envido')}
                    disabled={currentTurn !== 'player'}
                    className="min-h-[38px] px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-[11px] sm:text-xs shadow transition disabled:opacity-40 active:scale-95 touch-manipulation"
                  >
                    Real Envido
                  </button>
                  <button
                    onClick={() => handlePlayerChant('falta_envido')}
                    disabled={currentTurn !== 'player'}
                    className="min-h-[38px] px-2.5 sm:px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-[11px] sm:text-xs shadow transition disabled:opacity-40 active:scale-95 touch-manipulation"
                  >
                    Falta Envido
                  </button>
                </>
              )}
            </div>

            {/* Cantos de Truco y Mazo */}
            <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
              {trucoLevel === 'none' && (
                <button
                  onClick={() => handlePlayerChant('truco')}
                  disabled={currentTurn !== 'player'}
                  className="min-h-[38px] sm:min-h-[42px] px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95 touch-manipulation disabled:opacity-40"
                >
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> ¡TRUCO!
                  </span>
                </button>
              )}

              {trucoLevel === 'truco' && trucoChantedBy === 'opponent' && (
                <button
                  onClick={() => handlePlayerChant('retruco')}
                  disabled={currentTurn !== 'player'}
                  className="min-h-[38px] px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black rounded-xl text-xs shadow transition active:scale-95 touch-manipulation disabled:opacity-40"
                >
                  ¡RETRUCO!
                </button>
              )}

              {trucoLevel === 'retruco' && trucoChantedBy === 'opponent' && (
                <button
                  onClick={() => handlePlayerChant('vale_cuatro')}
                  disabled={currentTurn !== 'player'}
                  className="min-h-[38px] px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs shadow transition active:scale-95 touch-manipulation disabled:opacity-40"
                >
                  ¡VALE CUATRO!
                </button>
              )}

              {/* Botón Irse al mazo */}
              <button
                onClick={handlePlayerFold}
                disabled={handEnded}
                className="min-h-[38px] px-2.5 sm:px-3 py-1.5 bg-stone-800 hover:bg-red-950/60 hover:text-red-300 text-stone-400 border border-stone-700 rounded-xl text-[11px] sm:text-xs font-semibold transition disabled:opacity-40 active:scale-95 touch-manipulation"
              >
                Al mazo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Fin de Mano */}
      {handEnded && !gameWinner && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-stone-900 border-2 border-amber-500 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <span className="text-4xl block mb-2">🃏</span>
            <h3 className="font-serif font-black text-xl text-amber-300">Mano Finalizada</h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">{handEndMessage}</p>

            <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-around">
              <div>
                <span className="text-[10px] text-stone-400 uppercase">Tus Puntos</span>
                <div className="text-xl font-bold text-amber-400">{playerScore}</div>
              </div>
              <div className="w-[1px] bg-stone-800" />
              <div>
                <span className="text-[10px] text-stone-400 uppercase">Rival</span>
                <div className="text-xl font-bold text-stone-300">{opponentScore}</div>
              </div>
            </div>

            <button
              onClick={() => startNewHand(handMano === 'player' ? 'opponent' : 'player')}
              className="w-full mt-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-xl text-sm shadow-lg transition"
            >
              Jugar Próxima Mano ➔
            </button>
          </div>
        </div>
      )}

      {/* Modal Fin de Partido (Victoria / Derrota) */}
      {gameWinner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-4 border-amber-500 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <span className="text-6xl block mb-2">
              {gameWinner === 'player' ? '🏆' : '💀'}
            </span>
            <h2 className="font-serif font-black text-2xl md:text-3xl text-amber-300">
              {gameWinner === 'player' ? '¡CAMPEÓN DEL TRUCO!' : '¡TE GANÓ LA PC!'}
            </h2>
            <p className="text-xs text-stone-300 mt-2">
              {gameWinner === 'player'
                ? `Alcanzaste los ${settings.targetPoints} puntos primero. ¡Gran demostración de picardía criolla!`
                : `La computadora llegó a los ${settings.targetPoints} puntos. ¡A levantar cabeza para la revancha!`}
            </p>

            <div className="mt-4 p-4 bg-stone-950/80 rounded-2xl border border-stone-800 flex justify-around items-center">
              <div>
                <span className="text-xs text-stone-400">Vos</span>
                <div className="text-3xl font-black text-amber-400">{playerScore}</div>
              </div>
              <span className="text-stone-600 font-serif font-bold text-lg">VS</span>
              <div>
                <span className="text-xs text-stone-400">La PC</span>
                <div className="text-3xl font-black text-stone-300">{opponentScore}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={restartMatch}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black rounded-xl text-sm shadow-lg transition"
              >
                Revancha Inmediata 🔁
              </button>
              <button
                onClick={onOpenTutorial}
                className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-xl text-xs font-bold transition"
              >
                Ir a la Escuela 🎓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asistente / Mentor Don Facundo */}
      <MentorBox
        advice={mentorAdvice}
        enabled={settings.mentorEnabled}
        onToggle={enabled => onUpdateSettings({ mentorEnabled: enabled })}
        envidoScore={playerEnvidoCalc.score}
      />
    </div>
  );
};

