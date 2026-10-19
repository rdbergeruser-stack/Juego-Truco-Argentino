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

  // Ordenar cartas de la mano de menor a mayor
  const sortedHand = [...playerHand].sort((a, b) => a.trucoRank - b.trucoRank);
  const lowestCard = sortedHand[0];
  const highestCard = sortedHand[sortedHand.length - 1];

  const envidoInfo = calculateEnvido(playerHand);
  const playerFlor = withFlor && hasFlor(playerHand);
  const maxRank = highestCard.trucoRank;
  const hasBravas = playerHand.some(c => c.isBrava);

  // =========================================================================
  // 1. SI HAY UN CANTO PENDIENTE DEL RIVAL (Responder a la propuesta)
  // =========================================================================
  if (pendingCall) {
    if (pendingCall.includes('envido')) {
      if (playerFlor) {
        return {
          headline: '¡Tenés Flor!',
          advice: '¡Tenés 3 cartas del mismo palo! La Flor anula el envido. Cantá "¡Flor!" para cobrar 3 puntos directos.',
          recommendedAction: 'Cantar Flor',
          badge: 'success',
        };
      }
      if (envidoInfo.score >= 29) {
        return {
          headline: '¡Gran Envido!',
          advice: `Tenés ${envidoInfo.score} tantos (${envidoInfo.explanation}). ¡Puntaje muy alto! Respondé "¡Quiero!" con total confianza.`,
          recommendedAction: 'Quiero',
          badge: 'success',
        };
      } else if (envidoInfo.score >= (isPlayerMano ? 25 : 27)) {
        return {
          headline: 'Envido parejo',
          advice: `Tenés ${envidoInfo.score} tantos. ${isPlayerMano ? 'Como sos MANO, ganás cualquier empate.' : 'No sos mano, pero tenés chances.'} Conviene decir "Quiero".`,
          recommendedAction: 'Quiero',
          badge: 'tip',
        };
      } else {
        return {
          headline: 'Envido bajo',
          advice: `Tenés sólo ${envidoInfo.score} tantos (${envidoInfo.explanation}). Lo más inteligente es decir "No quiero" y entregar 1 punto antes que regalar 2 o más.`,
          recommendedAction: 'No Quiero',
          badge: 'warning',
        };
      }
    }

    if (pendingCall === 'truco') {
      const wonFirst = tricks[0]?.winner === 'player';
      if (wonFirst) {
        return {
          headline: '¡Primera ganada!',
          advice: `Ya ganaste la primera mano y te queda ${highestCard.name}. Tenés toda la ventaja táctica. ¡Decí "Quiero"!`,
          recommendedAction: 'Quiero',
          badge: 'success',
        };
      }
      if (maxRank >= 10 || hasBravas) {
        return {
          headline: 'Cartas fuertes',
          advice: `Tenés ${highestCard.name}. Es una carta poderosa para pelear el truco. Te sugiero aceptar diciendo "Quiero".`,
          recommendedAction: 'Quiero',
          badge: 'tip',
        };
      }
      if (maxRank <= 6) {
        return {
          headline: 'Mano floja',
          advice: `Tus cartas más altas son bajas (${playerHand.map(c => c.name).join(', ')}). Si no querés perder 2 puntos, decí "No quiero" y entregás sólo 1.`,
          recommendedAction: 'No Quiero',
          badge: 'warning',
        };
      }
      return {
        headline: 'Duelo parejo',
        advice: `Tenés ${highestCard.name}. Podés aceptar el Truco para pelearlo hasta el final.`,
        recommendedAction: 'Quiero',
        badge: 'tip',
      };
    }

    if (pendingCall === 'retruco' || pendingCall === 'vale_cuatro') {
      return {
        headline: '¡Subió la apuesta!',
        advice: `El rival redobló. Aceptá únicamente si tenés un As bravo o un 3 (${highestCard.name}). Si no, decí "No quiero".`,
        recommendedAction: maxRank >= 10 ? 'Quiero' : 'No Quiero',
        badge: maxRank >= 10 ? 'success' : 'warning',
      };
    }
  }

  // =========================================================================
  // 2. ENVIDO ANTES DE TIRAR CARTA EN PRIMERA RONDA
  // =========================================================================
  if (!envidoDone && currentRound === 1 && trucoLevel === 'none') {
    if (playerFlor) {
      return {
        headline: '¡Tenés Flor!',
        advice: `¡Tenés 3 cartas de ${playerHand[0].suit}! Cantá "Flor" antes de tirar tu carta para asegurar 3 puntos.`,
        recommendedAction: 'Cantar Flor',
        badge: 'success',
      };
    }
    if (envidoInfo.score >= 28) {
      return {
        headline: '¡Cantá Envido antes de tirar!',
        advice: `¡Tenés ${envidoInfo.score} de envido (${envidoInfo.explanation})! Si tirás tu carta antes de cantar, perdés el derecho al envido. ¡Cantá ahora!`,
        recommendedAction: 'Cantar Envido',
        badge: 'success',
      };
    }
  }

  // =========================================================================
  // 3. EL RIVAL YA JUGÓ SU CARTA EN ESTA RONDA (¿Qué carta tiramos?)
  // =========================================================================
  if (opponentCardOnTable) {
    const winningCards = sortedHand.filter(c => c.trucoRank > opponentCardOnTable.trucoRank);
    const tieCards = sortedHand.filter(c => c.trucoRank === opponentCardOnTable.trucoRank);

    if (winningCards.length > 0) {
      // Matar justo con la MENOR carta ganadora para no desperdiciar cartas superiores
      const killCard = winningCards[0];
      return {
        headline: `Matá con tu ${killCard.name}`,
        advice: `El rival tiró ${opponentCardOnTable.name}. Con tu ${killCard.name} lo matás justo sin malgastar cartas más fuertes (${highestCard.name}).`,
        recommendedAction: `Jugar ${killCard.name}`,
        badge: 'success',
      };
    } else if (tieCards.length > 0 && currentRound === 1) {
      const tieCard = tieCards[0];
      return {
        headline: `Empardá con tu ${tieCard.name}`,
        advice: `Podés empatar la mano tirando tu ${tieCard.name}. Al haber parda en primera, quien gane la segunda mano se lleva todo.`,
        recommendedAction: `Jugar ${tieCard.name}`,
        badge: 'tip',
      };
    } else {
      // No le podemos ganar a la del rival: descartarse con la más baja
      return {
        headline: `Descartá tu ${lowestCard.name}`,
        advice: `La carta del rival (${opponentCardOnTable.name}) es superior a lo que tenés. No quemes tus mejores cartas: entregá tu carta más baja (${lowestCard.name}).`,
        recommendedAction: `Jugar ${lowestCard.name}`,
        badge: 'warning',
      };
    }
  }

  // =========================================================================
  // 4. NOS TOCA SALIR A NOSOTROS PRIMERO EN ESTA RONDA (¿Qué carta jugamos?)
  // =========================================================================

  // --- RONDA 1: SALIR EN PRIMERA MANO ---
  if (currentRound === 1) {
    // Si tenemos una carta media o alta (como un 3, un 2 o un 1 falso, rangos 8 a 10)
    const secureCard = sortedHand.find(c => c.trucoRank >= 8 && c.trucoRank <= 10);

    if (secureCard && hasBravas) {
      // Tenés una brava y un 3/2: tirá el 3/2 para asegurar primera y guardate la brava
      return {
        headline: `Salí con tu ${secureCard.name}`,
        advice: `Tirá tu ${secureCard.name} para asegurar la primera mano. Guardate tu carta brava (${highestCard.name}) para definir en segunda o tercera.`,
        recommendedAction: `Jugar ${secureCard.name}`,
        badge: 'success',
      };
    } else if (secureCard) {
      return {
        headline: `Salí con tu ${secureCard.name}`,
        advice: `Tirá tu ${secureCard.name}. En el truco quien gana la primera mano tiene casi la partida asegurada.`,
        recommendedAction: `Jugar ${secureCard.name}`,
        badge: 'tip',
      };
    } else if (hasBravas && sortedHand.length === 3) {
      // Tenés una brava pero las otras dos son bajas (ej: 4 y 5):
      // Tirar una baja de señuelo o salir con la brava si querés imponer respeto
      const baitCard = lowestCard;
      return {
        headline: `Tirá tu ${baitCard.name}`,
        advice: `Salí con tu ${baitCard.name} de señuelo para ver qué gasta el rival, y guardate tu ${highestCard.name} para ganar la 2da y 3ra.`,
        recommendedAction: `Jugar ${baitCard.name}`,
        badge: 'tip',
      };
    } else {
      // Mano pareja o baja: salir con la carta media
      const midCard = sortedHand.length >= 2 ? sortedHand[1] : lowestCard;
      return {
        headline: `Salí con tu ${midCard.name}`,
        advice: `Te conviene salir con tu ${midCard.name} para tantear qué tiene el rival y guardarte tu ${highestCard.name} para responder después.`,
        recommendedAction: `Jugar ${midCard.name}`,
        badge: 'info',
      };
    }
  }

  // --- RONDA 2: SALIR EN SEGUNDA MANO ---
  if (currentRound === 2) {
    const r1 = tricks[0]?.winner;

    if (r1 === 'parda') {
      // Parda en primera: esta mano define todo el truco inmediatamente
      return {
        headline: `¡Tirá tu ${highestCard.name}!`,
        advice: `Hubo parda en primera mano. Quien gane ESTA segunda mano se lleva el truco completo. ¡Tirá tu carta más fuerte (${highestCard.name})!`,
        recommendedAction: `Jugar ${highestCard.name}`,
        badge: 'warning',
      };
    } else if (r1 === 'player') {
      // Ganamos la primera mano: si ganamos o empatamos acá, ganamos el truco
      return {
        headline: `Rematá con tu ${highestCard.name}`,
        advice: `Ya ganaste la primera. Si tirás tu ${highestCard.name} y ganás o empatás, ¡ganás el truco inmediatamente!`,
        recommendedAction: `Jugar ${highestCard.name}`,
        badge: 'success',
      };
    } else {
      // Perdimos la primera mano: obligados a ganar la segunda
      return {
        headline: `Jugate con tu ${highestCard.name}`,
        advice: `El rival ganó la primera. Estás obligado a ganar esta segunda mano para forzar una tercera. Tirá tu carta más alta (${highestCard.name}).`,
        recommendedAction: `Jugar ${highestCard.name}`,
        badge: 'warning',
      };
    }
  }

  // --- RONDA 3: TERCERA MANO DEFINITORIA ---
  if (currentRound === 3) {
    const finalCard = playerHand[0];
    return {
      headline: `Tirá tu ${finalCard.name}`,
      advice: `¡Es la mano definitiva mano a mano! Jugá tu última carta (${finalCard.name}) para definir el punto.`,
      recommendedAction: `Jugar ${finalCard.name}`,
      badge: 'tip',
    };
  }

  return {
    headline: `Jugá tu ${highestCard.name}`,
    advice: `Te recomiendo jugar tu ${highestCard.name} para mantener la iniciativa en la mesa.`,
    recommendedAction: `Jugar ${highestCard.name}`,
    badge: 'tip',
  };
}
