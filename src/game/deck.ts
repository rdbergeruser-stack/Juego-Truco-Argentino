import type { Card, CardNumber, Suit } from '../types/truco';

export const SUITS: { suit: Suit; label: string; icon: string; color: string }[] = [
  { suit: 'espada', label: 'Espadas', icon: '⚔️', color: '#3b82f6' },
  { suit: 'basto', label: 'Bastos', icon: '🪵', color: '#10b981' },
  { suit: 'oro', label: 'Oros', icon: '🟡', color: '#eab308' },
  { suit: 'copa', label: 'Copas', icon: '🍷', color: '#ef4444' },
];

const NUMBERS: CardNumber[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

function getTrucoRank(number: CardNumber, suit: Suit): number {
  if (number === 1 && suit === 'espada') return 14; // Ancho de Espada (Macho)
  if (number === 1 && suit === 'basto') return 13;  // Ancho de Basto (Hembra)
  if (number === 7 && suit === 'espada') return 12; // Siete Bravo (Espadilla)
  if (number === 7 && suit === 'oro') return 11;    // Siete de Oro (El Velo)
  if (number === 3) return 10;                     // Todos los 3
  if (number === 2) return 9;                      // Todos los 2
  if (number === 1 && (suit === 'copa' || suit === 'oro')) return 8; // 1 Falsos
  if (number === 12) return 7;                     // Todos los 12 (Rey)
  if (number === 11) return 6;                     // Todos los 11 (Caballo)
  if (number === 10) return 5;                     // Todos los 10 (Sota)
  if (number === 7 && (suit === 'copa' || suit === 'basto')) return 4; // 7 Falsos
  if (number === 6) return 3;                      // Todos los 6
  if (number === 5) return 2;                      // Todos los 5
  if (number === 4) return 1;                      // Todos los 4 (la peor)
  return 0;
}

function getEnvidoValue(number: CardNumber): number {
  if (number >= 10) return 0;
  return number;
}

function getCardName(number: CardNumber, suit: Suit): string {
  if (number === 1 && suit === 'espada') return '1 de Espadas (Ancho de Espada)';
  if (number === 1 && suit === 'basto') return '1 de Bastos (Ancho de Basto)';
  if (number === 7 && suit === 'espada') return '7 de Espadas (Siete Bravo)';
  if (number === 7 && suit === 'oro') return '7 de Oro (Siete de Oro)';
  if (number === 1 && suit === 'oro') return '1 de Oro (As falso)';
  if (number === 1 && suit === 'copa') return '1 de Copa (As falso)';
  if (number === 7 && (suit === 'copa' || suit === 'basto')) {
    const suitName = suit === 'copa' ? 'Copa' : 'Basto';
    return `7 de ${suitName} (7 falso)`;
  }
  
  const suitCapitalized = suit.charAt(0).toUpperCase() + suit.slice(1);
  return `${number} de ${suitCapitalized}`;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits: Suit[] = ['espada', 'basto', 'oro', 'copa'];

  for (const suit of suits) {
    for (const number of NUMBERS) {
      const rank = getTrucoRank(number, suit);
      const isBrava = rank >= 11; // 1E, 1B, 7E, 7O
      deck.push({
        id: `${number}-${suit}`,
        number,
        suit,
        name: getCardName(number, suit),
        trucoRank: rank,
        envidoValue: getEnvidoValue(number),
        isBrava,
      });
    }
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[]): { playerHand: Card[]; opponentHand: Card[]; remaining: Card[] } {
  const shuffled = shuffleDeck(deck);
  return {
    playerHand: shuffled.slice(0, 3),
    opponentHand: shuffled.slice(3, 6),
    remaining: shuffled.slice(6),
  };
}

export const HIERARCHY_LIST: { rank: number; name: string; description: string; cards: string[] }[] = [
  { rank: 14, name: 'Ancho de Espada', description: 'La carta más fuerte de todo el juego.', cards: ['1-espada'] },
  { rank: 13, name: 'Ancho de Basto', description: 'La segunda más fuerte. Imbatible excepto por la espada.', cards: ['1-basto'] },
  { rank: 12, name: 'Siete de Espadas', description: 'El Siete Bravo o Espadilla.', cards: ['7-espada'] },
  { rank: 11, name: 'Siete de Oro', description: 'El Siete de Oro o El Velo.', cards: ['7-oro'] },
  { rank: 10, name: 'Los Tres (3)', description: 'Mata a los dos y a todas las cartas bajas y figuras.', cards: ['3-espada', '3-basto', '3-oro', '3-copa'] },
  { rank: 9, name: 'Los Dos (2)', description: 'Gana a los 1 falsos y a todas las figuras.', cards: ['2-espada', '2-basto', '2-oro', '2-copa'] },
  { rank: 8, name: 'Ases Falsos (1 de Oro y 1 de Copa)', description: 'Buenos para ganar primeras manos frente a figuras.', cards: ['1-oro', '1-copa'] },
  { rank: 7, name: 'Los Doce / Reyes (12)', description: 'Figuras altas. Matan caballos, sotas y cartas bajas.', cards: ['12-espada', '12-basto', '12-oro', '12-copa'] },
  { rank: 6, name: 'Los Once / Caballos (11)', description: 'Matan a las sotas y números bajos.', cards: ['11-espada', '11-basto', '11-oro', '11-copa'] },
  { rank: 5, name: 'Los Diez / Sotas (10)', description: 'La figura más baja. Matan 7 falsos, 6, 5 y 4.', cards: ['10-espada', '10-basto', '10-oro', '10-copa'] },
  { rank: 4, name: 'Sietes Falsos (7 de Copa y 7 de Basto)', description: 'No confundir con los bravos. Sólo matan 6, 5 y 4.', cards: ['7-copa', '7-basto'] },
  { rank: 3, name: 'Los Seis (6)', description: 'Gana sólo a los 5 y a los 4.', cards: ['6-espada', '6-basto', '6-oro', '6-copa'] },
  { rank: 2, name: 'Los Cinco (5)', description: 'Gana únicamente a los 4.', cards: ['5-espada', '5-basto', '5-oro', '5-copa'] },
  { rank: 1, name: 'Los Cuatro (4)', description: 'La carta más baja de la baraja.', cards: ['4-espada', '4-basto', '4-oro', '4-copa'] },
];

