import type { Card, DifficultyLevel, PlayerRole, TrickResult, TrucoChantLevel } from '../types/truco';
import { calculateEnvido, hasFlor } from './envido';

export interface AIDecision {
  action: 'play_card' | 'chant_envido' | 'chant_real_envido' | 'chant_falta_envido' | 'chant_truco' | 'chant_retruco' | 'chant_vale_cuatro' | 'quiero' | 'no_quiero' | 'irse_al_mazo' | 'cantar_flor';
  cardToPlay?: Card;
  voiceLine?: string;
}

export interface AIContext {
  aiHand: Card[];
  playerHandCount: number;
  tableCardsPlayer: Card[];
  tableCardsAI: Card[];
  tricks: TrickResult[];
  currentRound: number;
  isAIMano: boolean;
  difficulty: DifficultyLevel;
  envidoDone: boolean;
  trucoLevel: TrucoChantLevel;
  trucoChantedBy?: PlayerRole;
  currentTurn: PlayerRole;
  pendingCall?: string; // e.g. 'envido', 'truco', 'retruco'
  aiScore: number;
  playerScore: number;
  targetPoints: 15 | 30;
  withFlor: boolean;
}

const EASY_TAUNTS = [
  'A ver qué tenés...',
  'Juego esta que no me convence mucho.',
  '¡Bien jugado che!',
  'Me parece que me la mandé...',
];

const MEDIUM_TAUNTS = [
  '¡En el truco el que duda pierde!',
  'Mire compadre, le tiro esta sobre la mesa.',
  '¡Hay que saber aguantar los trapos!',
  '¡Dele nomás, que la partida está caliente!',
];

const HARD_TAUNTS = [
  '¡Te estoy leyendo las cartas en la mirada!',
  'Ni Mandinga te salva de esta mano.',
  '¡Para mentir hay que tener agallas, aparcero!',
  'Esta mano tiene dueño y soy yo.',
];

function getRandomTaunt(difficulty: DifficultyLevel): string {
  const list = difficulty === 'easy' ? EASY_TAUNTS : difficulty === 'medium' ? MEDIUM_TAUNTS : HARD_TAUNTS;
  return list[Math.floor(Math.random() * list.length)];
}

export function makeAIDecision(ctx: AIContext): AIDecision {
  const {
    aiHand,
    tableCardsPlayer,
    tricks,
    currentRound,
    isAIMano,
    difficulty,
    envidoDone,
    trucoLevel,
    pendingCall,
    withFlor,
  } = ctx;

  const envidoInfo = calculateEnvido(aiHand);
  const aiHasFlor = withFlor && hasFlor(aiHand);

  // 1. RESPONDER A CANTOS PENDIENTES
  if (pendingCall) {
    if (pendingCall === 'flor') {
      if (aiHasFlor) {
        return { action: 'cantar_flor', voiceLine: '¡Flor de un gaucho de palabra!' };
      }
      return { action: 'quiero', voiceLine: 'Linda flor compadre.' };
    }

    if (pendingCall.includes('envido')) {
      const score = envidoInfo.score;
      if (difficulty === 'easy') {
        if (score >= 28) return { action: 'quiero', voiceLine: '¡Quiero con ganas!' };
        return { action: 'no_quiero', voiceLine: 'Paso, no tengo nada.' };
      } else if (difficulty === 'medium') {
        if (pendingCall === 'envido') {
          if (score >= 31) return { action: 'chant_real_envido', voiceLine: '¡Real Envido a ver qué tenés!' };
          if (score >= (isAIMano ? 25 : 27)) return { action: 'quiero', voiceLine: '¡Quiero ver esos tantos!' };
          return { action: 'no_quiero', voiceLine: 'Paso che, son buenas.' };
        } else if (pendingCall === 'real_envido') {
          if (score >= 29) return { action: 'quiero', voiceLine: '¡Se quiere ese Real Envido!' };
          return { action: 'no_quiero', voiceLine: 'No quiero, son muchos puntos.' };
        } else if (pendingCall === 'falta_envido') {
          if (score >= 31) return { action: 'quiero', voiceLine: '¡Se juega el partido acá, quiero!' };
          return { action: 'no_quiero', voiceLine: 'No me juego el resto, no quiero.' };
        }
      } else {
        // Hard
        if (pendingCall === 'envido') {
          if (score >= 32) return { action: 'chant_falta_envido', voiceLine: '¡Falta Envido grita el zorro!' };
          if (score >= 30) return { action: 'chant_real_envido', voiceLine: '¡Real Envido!' };
          if (score >= (isAIMano ? 24 : 26)) return { action: 'quiero', voiceLine: '¡Quiero!' };
          // Pequeño bluff de aceptación
          if (Math.random() < 0.15 && score >= 23) return { action: 'quiero', voiceLine: '¡Quiero ver tus cartas!' };
          return { action: 'no_quiero', voiceLine: 'Son buenas.' };
        } else if (pendingCall === 'real_envido') {
          if (score >= 29) return { action: 'quiero', voiceLine: '¡Quiero!' };
          return { action: 'no_quiero', voiceLine: 'No quiero.' };
        } else if (pendingCall === 'falta_envido') {
          if (score >= 30 || (isAIMano && score >= 29)) return { action: 'quiero', voiceLine: '¡Se quiere hasta el hueso!' };
          return { action: 'no_quiero', voiceLine: 'Paso aparcero.' };
        }
      }
      return { action: 'no_quiero', voiceLine: 'No quiero.' };
    }

    if (pendingCall === 'truco' || pendingCall === 'retruco' || pendingCall === 'vale_cuatro') {
      const maxRank = Math.max(...aiHand.map(c => c.trucoRank), 0);
      const totalStrength = aiHand.reduce((acc, c) => acc + c.trucoRank, 0);

      if (pendingCall === 'truco') {
        // Con cartas altas queremos
        if (maxRank >= 10 || totalStrength >= 18) {
          // Si tiene cartas demoledoras (ej: Ancho de espada o de basto) y estamos en hard/medium
          if (difficulty !== 'easy' && maxRank >= 13 && Math.random() > 0.4) {
            return { action: 'chant_retruco', voiceLine: '¡Quiero y RETRUCO carajo!' };
          }
          return { action: 'quiero', voiceLine: '¡Quiero ver cómo la peleás!' };
        }
        if (difficulty === 'hard' && (tricks[0]?.winner === 'opponent' || Math.random() < 0.3)) {
          // Si el AI ya ganó la primera, acepta aunque tenga poco
          return { action: 'quiero', voiceLine: '¡Quiero!' };
        }
        if (difficulty === 'easy' && maxRank < 8) {
          return { action: 'no_quiero', voiceLine: 'No quiero, me voy manso.' };
        }
        if (maxRank >= 8) {
          return { action: 'quiero', voiceLine: '¡Quiero!' };
        }
        return { action: 'no_quiero', voiceLine: 'No quiero.' };
      }

      if (pendingCall === 'retruco') {
        if (maxRank >= 12 || (maxRank >= 10 && tricks[0]?.winner === 'opponent')) {
          if (difficulty === 'hard' && maxRank === 14) {
            return { action: 'chant_vale_cuatro', voiceLine: '¡QUIERO VALE CUATRO!' };
          }
          return { action: 'quiero', voiceLine: '¡Quiero el retruco!' };
        }
        return { action: 'no_quiero', voiceLine: 'No quiero arriesgar tanto.' };
      }

      if (pendingCall === 'vale_cuatro') {
        if (maxRank >= 13) {
          return { action: 'quiero', voiceLine: '¡QUIERO LAS CUATRO!' };
        }
        return { action: 'no_quiero', voiceLine: 'Ahí te la dejo, no quiero.' };
      }
    }
  }

  // 2. INICIAR CANTOS (Si le toca cantar)
  // Cantar Flor si la tiene y está habilitada
  if (withFlor && aiHasFlor && currentRound === 1 && !envidoDone) {
    return { action: 'cantar_flor', voiceLine: '¡FLOR DEL PAGO!' };
  }

  // Cantar Envido en primera ronda
  if (!envidoDone && currentRound === 1 && trucoLevel === 'none') {
    const score = envidoInfo.score;
    if (difficulty === 'easy' && score >= 29) {
      return { action: 'chant_envido', voiceLine: '¡Envido!' };
    }
    if (difficulty === 'medium') {
      if (score >= 32) return { action: 'chant_real_envido', voiceLine: '¡Real Envido de entrada!' };
      if (score >= (isAIMano ? 26 : 28)) return { action: 'chant_envido', voiceLine: '¡Envido!' };
    }
    if (difficulty === 'hard') {
      if (score >= 32) return { action: 'chant_real_envido', voiceLine: '¡Real Envido para medir el cuero!' };
      if (score >= (isAIMano ? 25 : 27)) return { action: 'chant_envido', voiceLine: '¡Envido!' };
      // Pequeño bluff de envido del zorro si no tiene nada pero quiere robar el tanto
      if (Math.random() < 0.12 && isAIMano) return { action: 'chant_envido', voiceLine: '¡Envido!' };
    }
  }

  // Cantar Truco
  if (trucoLevel === 'none') {
    const maxRank = Math.max(...aiHand.map(c => c.trucoRank), 0);
    // Si ganó primera y tiene con qué cerrar
    const wonFirst = tricks[0]?.winner === 'opponent';
    if (wonFirst && currentRound === 2 && maxRank >= 8) {
      return { action: 'chant_truco', voiceLine: '¡TRUCO grita el gaucho!' };
    }
    // Si tiene cartas bravas
    if (maxRank >= 12 && (currentRound >= 2 || Math.random() < 0.3)) {
      return { action: 'chant_truco', voiceLine: '¡TRUCO!' };
    }
    // Si es hard y quiere meter bluff en 3ra mano
    if (difficulty === 'hard' && currentRound === 3 && Math.random() < 0.25) {
      return { action: 'chant_truco', voiceLine: '¡TRUCO carancho!' };
    }
  }

  // 3. JUGAR CARTA
  if (aiHand.length === 0) {
    return { action: 'irse_al_mazo', voiceLine: 'Me quedé sin naipes.' };
  }

  // Ordenar cartas de AI por rango
  const sortedHand = [...aiHand].sort((a, b) => a.trucoRank - b.trucoRank); // menor a mayor
  const lastPlayerCard = tableCardsPlayer[tableCardsPlayer.length - 1];

  let chosenCard: Card;

  if (!lastPlayerCard || tableCardsPlayer.length < ctx.tableCardsAI.length + 1) {
    // La IA juega PRIMERA en esta ronda (es mano o ganó la ronda anterior)
    if (difficulty === 'easy') {
      // Juega al azar o la del medio
      chosenCard = sortedHand[Math.floor(Math.random() * sortedHand.length)];
    } else if (difficulty === 'medium') {
      // Si es primera ronda, suele tirar una carta media o la más baja
      if (currentRound === 1) {
        chosenCard = sortedHand.length >= 2 ? sortedHand[1] : sortedHand[0];
      } else {
        // En rondas avanzadas tira la más fuerte para definir
        chosenCard = sortedHand[sortedHand.length - 1];
      }
    } else {
      // Hard: Estrategia de zorro
      if (currentRound === 1) {
        // Si tiene un 3 o 2, suele tirarlo para asegurar la primera
        const cardToSecure = sortedHand.find(c => c.trucoRank >= 9 && c.trucoRank <= 10);
        chosenCard = cardToSecure || sortedHand[0];
      } else {
        chosenCard = sortedHand[sortedHand.length - 1];
      }
    }
  } else {
    // El jugador ya tiró su carta en esta ronda; la IA responde
    const targetRank = lastPlayerCard.trucoRank;

    // Buscar la carta más baja que MATE a la del jugador
    const winningCards = sortedHand.filter(c => c.trucoRank > targetRank);
    // Cartas que empatan (parda)
    const tieCards = sortedHand.filter(c => c.trucoRank === targetRank);

    if (winningCards.length > 0) {
      if (difficulty === 'easy') {
        // A veces quema la mejor innecesariamente
        chosenCard = Math.random() > 0.5 ? winningCards[winningCards.length - 1] : winningCards[0];
      } else {
        // Mata justo con la menor que le gane (técnica óptima)
        chosenCard = winningCards[0];
      }
    } else if (tieCards.length > 0 && currentRound === 1 && !isAIMano) {
      // Empardar en primera si le conviene
      chosenCard = tieCards[0];
    } else {
      // No le puede ganar: descarta la carta más baja (descarte)
      chosenCard = sortedHand[0];
    }
  }

  return {
    action: 'play_card',
    cardToPlay: chosenCard,
    voiceLine: getRandomTaunt(difficulty),
  };
}

