export type Suit = 'espada' | 'basto' | 'oro' | 'copa';

export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12;

export interface Card {
  id: string; // e.g., '1-espada'
  suit: Suit;
  number: CardNumber;
  name: string;
  trucoRank: number; // 14 (Ancho de Espada) down to 1 (Cuatros)
  envidoValue: number; // 0 for 10,11,12; face value for 1-7
  isBrava?: boolean;
}

export type PlayerRole = 'player' | 'opponent';

export type TrucoChantLevel = 'none' | 'truco' | 'retruco' | 'vale_cuatro';

export type EnvidoChant = 'envido' | 'real_envido' | 'falta_envido';

export type FlorChant = 'flor' | 'contra_flor' | 'contra_flor_al_resto';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface PlayedCard {
  card: Card;
  playedBy: PlayerRole;
}

export interface TrickResult {
  round: number; // 1, 2, 3
  playerCards: PlayedCard[];
  winner: PlayerRole | 'parda';
}

export interface GameSettings {
  targetPoints: 15 | 30;
  withFlor: boolean;
  difficulty: DifficultyLevel;
  mentorEnabled: boolean;
  soundEnabled: boolean;
}

export interface HandScoreState {
  playerEnvidoReported?: number;
  opponentEnvidoReported?: number;
  envidoWinner?: PlayerRole;
  envidoPointsWon?: number;
  
  trucoWinner?: PlayerRole;
  trucoPointsWon?: number;

  florWinner?: PlayerRole;
  florPointsWon?: number;
}

export interface GameMessage {
  id: string;
  sender: PlayerRole | 'system';
  text: string;
  type: 'chant' | 'info' | 'taunt';
  timestamp: number;
}

