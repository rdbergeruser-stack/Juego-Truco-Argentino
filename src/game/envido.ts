import type { Card, PlayerRole, Suit } from '../types/truco';

export interface EnvidoResult {
  score: number;
  suit?: Suit;
  cardsUsed: Card[];
  explanation: string;
}

export function calculateEnvido(cards: Card[]): EnvidoResult {
  if (!cards || cards.length === 0) {
    return { score: 0, cardsUsed: [], explanation: 'Sin cartas' };
  }

  // Agrupar por palo
  const suitGroups: Record<Suit, Card[]> = {
    espada: [],
    basto: [],
    oro: [],
    copa: [],
  };

  cards.forEach(card => suitGroups[card.suit].push(card));

  let maxScore = -1;
  let bestSuit: Suit | undefined;
  let bestCards: Card[] = [];
  let explanation = '';

  // Buscar el mayor envido con dos cartas del mismo palo
  for (const s of Object.keys(suitGroups) as Suit[]) {
    const list = suitGroups[s];
    if (list.length >= 2) {
      if (list.length === 2) {
        const val = 20 + list[0].envidoValue + list[1].envidoValue;
        if (val > maxScore) {
          maxScore = val;
          bestSuit = s;
          bestCards = [list[0], list[1]];
          explanation = `${val} de ${s} (${list[0].number} y ${list[1].number})`;
        }
      } else if (list.length === 3) {
        // Flor / 3 del mismo palo: elegir las 2 mejores
        const sorted = [...list].sort((a, b) => b.envidoValue - a.envidoValue);
        const val = 20 + sorted[0].envidoValue + sorted[1].envidoValue;
        if (val > maxScore) {
          maxScore = val;
          bestSuit = s;
          bestCards = [sorted[0], sorted[1]];
          explanation = `${val} de ${s} (3 cartas de ${s}: usando ${sorted[0].number} y ${sorted[1].number})`;
        }
      }
    }
  }

  // Si no hay dos del mismo palo, el envido es el valor de la carta más alta
  if (maxScore === -1) {
    const sorted = [...cards].sort((a, b) => b.envidoValue - a.envidoValue);
    const highestCard = sorted[0];
    maxScore = highestCard.envidoValue;
    bestSuit = highestCard.suit;
    bestCards = [highestCard];
    explanation = `${maxScore} (${highestCard.number} de ${highestCard.suit})`;
  }

  return {
    score: maxScore,
    suit: bestSuit,
    cardsUsed: bestCards,
    explanation,
  };
}

export function hasFlor(cards: Card[]): boolean {
  if (cards.length !== 3) return false;
  return cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
}

export function calculateFlor(cards: Card[]): { score: number; explanation: string } {
  if (!hasFlor(cards)) return { score: 0, explanation: 'No tiene flor' };
  const val = 20 + cards[0].envidoValue + cards[1].envidoValue + cards[2].envidoValue;
  return {
    score: val,
    explanation: `Flor de ${cards[0].suit} (${val} puntos)`,
  };
}

export function resolveEnvidoDuel(
  playerEnvido: number,
  opponentEnvido: number,
  handOwner: PlayerRole // Quien es mano
): { winner: PlayerRole; reason: string } {
  if (playerEnvido > opponentEnvido) {
    return {
      winner: 'player',
      reason: `Ganaste el envido con ${playerEnvido} frente a ${opponentEnvido}.`,
    };
  } else if (opponentEnvido > playerEnvido) {
    return {
      winner: 'opponent',
      reason: `El rival ganó el envido con ${opponentEnvido} frente a tus ${playerEnvido}.`,
    };
  } else {
    // Empate: gana quien sea mano
    const winnerName = handOwner === 'player' ? 'Vos' : 'El rival';
    return {
      winner: handOwner,
      reason: `Empate en ${playerEnvido} tantos. Gana ${winnerName} por ser MANO.`,
    };
  }
}

