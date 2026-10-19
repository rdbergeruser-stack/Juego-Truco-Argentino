import type { Card, TrickResult, TrucoChantLevel } from '../types/truco';
import { calculateEnvido, hasFlor } from './envido';

export interface MentorAdvice {
  headline: string;
  advice: string;
  recommendedAction?: string;
  badge?: 'info' | 'tip' | 'warning' | 'success';
}

export function getMentorAdvice(params: {
  playerHand: Card[];
  opponentCardOnTable?: Card;
  tricks: TrickResult[];
  currentRound: number;
  isPlayerMano: boolean;
  envidoDone: boolean;
  trucoLevel: TrucoChantLevel;
  pendingCall?: string;
  withFlor: boolean;
}): MentorAdvice {
  const {
    playerHand,
    opponentCardOnTable,
    tricks,
    currentRound,
    isPlayerMano,
    envidoDone,
    trucoLevel,
    pendingCall,
    withFlor,
  } = params;

  if (playerHand.length === 0) {
    return {
      headline: 'Ronda finalizada',
      advice: 'Esperando el cierre de la mano...',
      badge: 'info',
    };
  }

  const envidoInfo = calculateEnvido(playerHand);
  const playerFlor = withFlor && hasFlor(playerHand);
  const maxRank = Math.max(...playerHand.map(c => c.trucoRank), 0);
  const hasBravas = playerHand.some(c => c.isBrava);

  // 1. SI HAY UN CANTO PENDIENTE
  if (pendingCall) {
    if (pendingCall.includes('envido')) {
      if (playerFlor) {
        return {
          headline: '¡Tenés Flor!',
          advice: '¡Atención! Tenés 3 cartas del mismo palo. Al tener Flor, el envido se anula y cantás "¡Flor!" para sumar 3 puntos.',
          recommendedAction: 'Cantar Flor',
          badge: 'success',
        };
      }
      if (envidoInfo.score >= 29) {
        return {
          headline: '¡Gran Envido!',
          advice: `Tenés ${envidoInfo.score} tantos (${envidoInfo.explanation}). ¡Es una mano formidable! Deberías gritar "¡Quiero!" o incluso redoblar si te animás.`,
          recommendedAction: 'Quiero o Real Envido',
          badge: 'success',
        };
      } else if (envidoInfo.score >= (isPlayerMano ? 26 : 28)) {
        return {
          headline: 'Envido parejo',
          advice: `Tenés ${envidoInfo.score} tantos. ${isPlayerMano ? 'Como sos Mano, tenés ventaja si empatan.' : 'Ojo que no sos mano.'} Podés arriesgar con "Quiero".`,
          recommendedAction: 'Quiero',
          badge: 'tip',
        };
      } else {
        return {
          headline: 'Envido bajo',
          advice: `Tenés sólo ${envidoInfo.score} tantos. Lo más prudente es decir "No quiero" y entregar 1 punto antes que perder 2 o más.`,
          recommendedAction: 'No Quiero',
          badge: 'warning',
        };
      }
    }

    if (pendingCall === 'truco') {
      const wonFirst = tricks[0]?.winner === 'player';
      if (wonFirst) {
        return {
          headline: '¡Tenés la primera ganada!',
          advice: 'Al haber ganado la primera mano, tenés toda la ventaja psicológica y táctica. Casi siempre conviene decir "¡Quiero!".',
          recommendedAction: 'Quiero',
          badge: 'success',
        };
      }
      if (maxRank >= 10 || hasBravas) {
        return {
          headline: 'Cartas fuertes en mano',
          advice: `Tenés cartas de jerarquía alta (${playerHand.map(c => c.name).join(', ')}). Vale la pena pelear el truco.`,
          recommendedAction: 'Quiero',
          badge: 'tip',
        };
      }
      if (maxRank <= 6) {
        return {
          headline: 'Mano débil para el truco',
          advice: 'Tus cartas son bajas (sotas o menos). Si no querés arriesgar 2 puntos, podés decir "No quiero" y entregar sólo 1 punto.',
          recommendedAction: 'No Quiero',
          badge: 'warning',
        };
      }
    }

    if (pendingCall === 'retruco' || pendingCall === 'vale_cuatro') {
      return {
        headline: '¡Subió la apuesta!',
        advice: 'El rival redobló la apuesta. Sólo aceptá si tenés cartas decisivas (un 3, un 7 bravo o un As).',
        recommendedAction: maxRank >= 10 ? 'Quiero' : 'No Quiero',
        badge: maxRank >= 10 ? 'success' : 'warning',
      };
    }
  }

  // 2. ENVIDO ANTES DE JUGAR
  if (!envidoDone && currentRound === 1 && trucoLevel === 'none') {
    if (playerFlor) {
      return {
        headline: '¡Tenés Flor!',
        advice: `¡Tenés 3 cartas de ${playerHand[0].suit}! Podés cantar "Flor" antes de tirar tu carta y sumar 3 puntos seguros.`,
        recommendedAction: 'Cantar Flor',
        badge: 'success',
      };
    }
    if (envidoInfo.score >= 29) {
      return {
        headline: '¡Oportunidad de Envido!',
        advice: `Tenés ${envidoInfo.score} de envido (${envidoInfo.explanation}). ¡Es un puntaje muy alto! No tires la carta sin cantar antes.`,
        recommendedAction: 'Cantar Envido',
        badge: 'success',
      };
    }
  }

  // 3. ESTRATEGIA DE CARTAS EN LA MESA
  if (opponentCardOnTable) {
    const winningCards = playerHand.filter(c => c.trucoRank > opponentCardOnTable.trucoRank);
    const tieCards = playerHand.filter(c => c.trucoRank === opponentCardOnTable.trucoRank);

    if (winningCards.length > 0) {
      // Ordenar las ganadoras de menor a mayor para matar justo
      const bestKillCard = [...winningCards].sort((a, b) => a.trucoRank - b.trucoRank)[0];
      return {
        headline: 'Podés ganar esta ronda',
        advice: `El rival tiró ${opponentCardOnTable.name}. Con tu ${bestKillCard.name} lo matás justo sin gastar cartas superiores innecesariamente.`,
        recommendedAction: `Jugar ${bestKillCard.name}`,
        badge: 'tip',
      };
    } else if (tieCards.length > 0 && currentRound === 1) {
      return {
        headline: 'Posibilidad de Empardar',
        advice: `Podés empatar con tu ${tieCards[0].name}. En primera ronda la parda traslada la definición a la segunda mano.`,
        recommendedAction: `Jugar ${tieCards[0].name}`,
        badge: 'info',
      };
    } else {
      const lowestCard = [...playerHand].sort((a, b) => a.trucoRank - b.trucoRank)[0];
      return {
        headline: 'No podés matar la del rival',
        advice: `La carta del rival (${opponentCardOnTable.name}) es superior a lo que tenés. No quemes tus mejores cartas: descartate con la más baja (${lowestCard.name}).`,
        recommendedAction: `Jugar ${lowestCard.name}`,
        badge: 'warning',
      };
    }
  }

  // 4. SI TE TOCA SALIR A VOS PRIMERO
  if (currentRound === 1) {
    return {
      headline: 'Primera mano de la partida',
      advice: isPlayerMano
        ? 'Sos MANO. En el truco la primera mano es clave: quien gana primera tiene ventaja en cualquier parda posterior.'
        : 'Sos PIE (el rival es mano). Observá qué tira para planear tu respuesta.',
      badge: 'info',
    };
  }

  if (currentRound === 2) {
    const r1 = tricks[0]?.winner;
    if (r1 === 'parda') {
      return {
        headline: '¡Definición inmediata!',
        advice: 'Hubo parda en primera. Quien gane ESTA segunda mano se lleva el truco completo. ¡Tirá tu carta más fuerte!',
        badge: 'warning',
      };
    } else if (r1 === 'player') {
      return {
        headline: 'Mano de remate',
        advice: 'Ya ganaste la primera. Si ganás esta mano o empatás (parda en segunda), ganás la mano inmediatamente.',
        badge: 'success',
      };
    } else {
      return {
        headline: 'Mano de supervivencia',
        advice: 'El rival ganó la primera mano. Estás obligado a ganar esta segunda mano para forzar una tercera.',
        badge: 'warning',
      };
    }
  }

  return {
    headline: 'Tercera mano definitoria',
    advice: '¡Mano a mano final! Quien se lleve esta ronda se lleva los puntos del truco.',
    badge: 'tip',
  };
}

