import type { Card, PlayerRole, TrickResult, TrucoChantLevel } from '../types/truco';

export interface TrickWinnerEvaluation {
  winner: PlayerRole | 'parda';
  cardA: Card; // player card
  cardB: Card; // opponent card
  reason: string;
}

export function evaluateTrick(playerCard: Card, opponentCard: Card): TrickWinnerEvaluation {
  if (playerCard.trucoRank > opponentCard.trucoRank) {
    return {
      winner: 'player',
      cardA: playerCard,
      cardB: opponentCard,
      reason: `${playerCard.name} mata a ${opponentCard.name}.`,
    };
  } else if (opponentCard.trucoRank > playerCard.trucoRank) {
    return {
      winner: 'opponent',
      cardA: playerCard,
      cardB: opponentCard,
      reason: `${opponentCard.name} mata a ${playerCard.name}.`,
    };
  } else {
    return {
      winner: 'parda',
      cardA: playerCard,
      cardB: opponentCard,
      reason: `Parda (empate) entre ${playerCard.name} y ${opponentCard.name}.`,
    };
  }
}

export interface HandOutcome {
  finished: boolean;
  winner?: PlayerRole;
  reason?: string;
}

export function checkHandWinner(
  tricks: TrickResult[],
  manoPlayer: PlayerRole
): HandOutcome {
  if (tricks.length === 0) return { finished: false };

  const r1 = tricks[0]?.winner;
  const r2 = tricks[1]?.winner;
  const r3 = tricks[2]?.winner;

  // Si alguien ganó 2 rondas directamente:
  const playerWins = tricks.filter(t => t.winner === 'player').length;
  const opponentWins = tricks.filter(t => t.winner === 'opponent').length;

  if (playerWins >= 2) {
    return { finished: true, winner: 'player', reason: 'Ganaste 2 rondas de 3.' };
  }
  if (opponentWins >= 2) {
    return { finished: true, winner: 'opponent', reason: 'El rival ganó 2 rondas de 3.' };
  }

  // Si se jugó 1 sola ronda
  if (tricks.length === 1) {
    return { finished: false };
  }

  // Si se jugaron 2 rondas
  if (tricks.length === 2) {
    // Caso 1: Parda en primera
    if (r1 === 'parda') {
      if (r2 === 'player') {
        return { finished: true, winner: 'player', reason: 'Al haber parda en primera, ganaste la segunda mano y te llevás el truco.' };
      }
      if (r2 === 'opponent') {
        return { finished: true, winner: 'opponent', reason: 'Al haber parda en primera, el rival ganó la segunda mano y se lleva el truco.' };
      }
      // Si también hubo parda en 2da, hay que jugar la 3ra
      return { finished: false };
    }

    // Caso 2: Parda en segunda
    if (r2 === 'parda') {
      // El que ganó primera gana la mano
      if (r1 === 'player') {
        return { finished: true, winner: 'player', reason: 'Ganaste la primera mano y hubo parda en la segunda. ¡Primera gana!' };
      }
      if (r1 === 'opponent') {
        return { finished: true, winner: 'opponent', reason: 'El rival ganó primera mano y hubo parda en la segunda. Primera gana.' };
      }
    }

    // Si cada uno ganó una mano (1-1), se juega la 3ra
    return { finished: false };
  }

  // Si se jugaron 3 rondas
  if (tricks.length === 3) {
    // Si la tercera mano tiene un ganador definido
    if (r3 === 'player') {
      return { finished: true, winner: 'player', reason: 'Ganaste la tercera mano decisiva.' };
    }
    if (r3 === 'opponent') {
      return { finished: true, winner: 'opponent', reason: 'El rival ganó la tercera mano decisiva.' };
    }

    // Si la 3ra mano fue parda:
    if (r3 === 'parda') {
      // Si la primera la ganó alguien, ese alguien gana
      if (r1 === 'player') {
        return { finished: true, winner: 'player', reason: 'Parda en tercera mano: gana quien ganó la primera.' };
      }
      if (r1 === 'opponent') {
        return { finished: true, winner: 'opponent', reason: 'Parda en tercera mano: gana el rival por haber ganado la primera.' };
      }

      // Si hubo parda en las 3 manos (triple parda)
      if (r1 === 'parda' && r2 === 'parda') {
        return {
          finished: true,
          winner: manoPlayer,
          reason: `¡Triple parda! Las tres manos empatadas. Gana ${manoPlayer === 'player' ? 'el jugador' : 'el rival'} por ser MANO.`,
        };
      }
    }
  }

  return { finished: false };
}

export function getTrucoPoints(level: TrucoChantLevel): number {
  switch (level) {
    case 'truco': return 2;
    case 'retruco': return 3;
    case 'vale_cuatro': return 4;
    default: return 1;
  }
}

export function getTrucoRefusedPoints(level: TrucoChantLevel): number {
  switch (level) {
    case 'truco': return 1;
    case 'retruco': return 2;
    case 'vale_cuatro': return 3;
    default: return 1;
  }
}

export function calculateFaltaEnvidoPoints(
  playerScore: number,
  opponentScore: number,
  targetScore: 15 | 30
): number {
  const leaderScore = Math.max(playerScore, opponentScore);

  // Regla estándar: si ambos están en las malas (menos de 15), se juega por lo que le falta al puntero para entrar a las buenas (o el chico),
  // pero la regla más jugada en truco moderno es: lo que le falta al que va ganando para ganar el partido entero.
  const needed = targetScore - leaderScore;
  return Math.max(needed, 1);
}

