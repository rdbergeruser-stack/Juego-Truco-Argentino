import type { Card } from './truco';

export type MultiplayerMode = '1v1' | '2v2' | '3v3';

export type TeamId = 'nosotros' | 'ellos'; // Equipo A (Nosotros - pares) vs Equipo B (Ellos - impares)

export interface PlayerSlot {
  id: string; // Peer ID
  name: string;
  avatar: string;
  seatIndex: number; // 0..1 (1v1), 0..3 (2v2), 0..5 (3v3)
  team: TeamId;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

export interface RoomLobbyState {
  roomCode: string;
  mode: MultiplayerMode;
  targetPoints: 15 | 30;
  withFlor: boolean;
  hostId: string;
  slots: (PlayerSlot | null)[];
  gameStarted: boolean;
  picaPicaEnabled?: boolean; // Para partidas de 6
}

export type SenaType = 
  | 'as_espadas'     // Guiño de ojo 😉
  | 'as_bastos'      // Levantar cejas 🤨
  | 'siete_espadas'  // Mueca lateral 😏
  | 'siete_oro'      // Beso al aire 😗
  | 'treses'         // Morder labio inferior 😬
  | 'doses'          // Trompa / abrir boca levemente 😮
  | 'ciego';         // Cerrar ambos ojos / no tener nada 😌

export interface SenaInfo {
  type: SenaType;
  label: string;
  icon: string;
  meaning: string;
  faceEmoji: string;
}

export const TRUCO_SENAS: SenaInfo[] = [
  { type: 'as_espadas', label: 'As de Espadas', icon: '⚔️', meaning: 'El Macho (#1)', faceEmoji: '😉' },
  { type: 'as_bastos', label: 'As de Bastos', icon: '🪵', meaning: 'La Hembra (#2)', faceEmoji: '🤨' },
  { type: 'siete_espadas', label: 'Siete de Espadas', icon: '🗡️', meaning: 'Siete Bravo (#3)', faceEmoji: '😏' },
  { type: 'siete_oro', label: 'Siete de Oros', icon: '🪙', meaning: 'El Velo (#4)', faceEmoji: '😗' },
  { type: 'treses', label: 'Treses', icon: '⚡', meaning: 'Cualquier Tres (#5)', faceEmoji: '😬' },
  { type: 'doses', label: 'Doses', icon: '✌️', meaning: 'Cualquier Dos (#6)', faceEmoji: '😮' },
  { type: 'ciego', label: 'Ciego / Mazo', icon: '🙈', meaning: 'No tengo nada / Cartas bajas', faceEmoji: '😌' },
];

export interface PlayedTableCard {
  card: Card;
  playedBySeat: number;
  playerName: string;
  team: TeamId;
  round: number; // 1, 2, 3
}

export interface MultiplayerTrickResult {
  round: number;
  cards: PlayedTableCard[];
  winnerTeam: TeamId | 'parda';
  winningSeat?: number;
}

export interface MultiplayerGameState {
  roomCode: string;
  mode: MultiplayerMode;
  targetPoints: 15 | 30;
  withFlor: boolean;
  players: PlayerSlot[];
  
  // Puntos globales
  pointsNosotros: number;
  pointsEllos: number;
  
  // Estado de la mano
  handNumber: number;
  handStarterSeat: number; // Mano (quien sale)
  currentTurnSeat: number; // A quién le toca jugar o responder
  
  // Cartas de cada jugador (en el host se conocen todas, cada cliente solo ve las suyas)
  handsBySeat: Record<number, Card[]>;
  playedCards: PlayedTableCard[];
  tricks: MultiplayerTrickResult[];
  
  // Estado de cantos de Truco
  trucoState: {
    level: 'none' | 'truco' | 'retruco' | 'vale_cuatro';
    lastChanterSeat?: number;
    lastChanterTeam?: TeamId;
    waitingResponseFromTeam?: TeamId;
    pointsWon: number;
    accepted: boolean;
    trucoWinnerTeam?: TeamId;
  };
  
  // Estado de cantos de Envido
  envidoState: {
    history: ('envido' | 'real_envido' | 'falta_envido')[];
    lastChanterSeat?: number;
    lastChanterTeam?: TeamId;
    waitingResponseFromTeam?: TeamId;
    accepted: boolean;
    resolved: boolean;
    pointsWon: number;
    envidoValuesReported: Record<number, number>; // seatIndex -> value
    envidoWinnerTeam?: TeamId;
  };
  
  // Flor si está habilitada
  florState?: {
    history: string[];
    claimedSeats: number[];
    resolved: boolean;
    pointsWon: number;
  };
  
  // Registro de eventos y charla de pulpería
  logs: {
    id: string;
    text: string;
    senderName?: string;
    team?: TeamId;
    type: 'chant' | 'play' | 'info' | 'chat';
    timestamp: number;
  }[];
  
  winnerMatchTeam?: TeamId;
}

export type NetworkMessage =
  | { type: 'JOIN_REQUEST'; playerName: string; avatar?: string; requestedSeat?: number }
  | { type: 'LOBBY_STATE_UPDATE'; state: RoomLobbyState }
  | { type: 'SEAT_SELECT'; seatIndex: number }
  | { type: 'TOGGLE_READY' }
  | { type: 'CHANGE_ROOM_SETTINGS'; mode?: MultiplayerMode; targetPoints?: 15 | 30; withFlor?: boolean }
  | { type: 'START_GAME' }
  | { type: 'GAME_STATE_SYNC'; state: MultiplayerGameState; yourHand: Card[] }
  | { type: 'PLAY_CARD'; cardId: string; seatIndex: number }
  | { type: 'CALL_CHANT'; chant: string; seatIndex: number }
  | { type: 'RESPOND_CHANT'; response: 'quiero' | 'no_quiero' | 'subir'; raiseChant?: string; seatIndex: number }
  | { type: 'DECLARE_ENVIDO'; value: number; seatIndex: number }
  | { type: 'FOLD_HAND'; seatIndex: number } // Irse al mazo
  | { type: 'SEND_SENA'; sena: SenaType; fromSeat: number }
  | { type: 'SENA_RECEIVED'; sena: SenaType; fromPlayerName: string; fromSeat: number }
  | { type: 'CHAT_MESSAGE'; text: string; fromSeat: number; fromName: string; isTeamOnly?: boolean }
  | { type: 'KICK_PLAYER'; seatIndex: number };
