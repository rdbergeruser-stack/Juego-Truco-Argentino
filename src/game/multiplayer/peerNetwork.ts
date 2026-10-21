import { Peer, type DataConnection } from 'peerjs';
import type { 
  NetworkMessage, 
  RoomLobbyState, 
  MultiplayerMode, 
  PlayerSlot 
} from '../../types/multiplayer';

export class PeerNetworkManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConnection: DataConnection | null = null;
  public myPeerId: string = '';
  public isHost: boolean = false;
  public roomCode: string = '';

  // Callbacks para la UI
  public onConnectionOpen?: () => void;
  public onLobbyUpdate?: (lobby: RoomLobbyState) => void;
  public onMessage?: (msg: NetworkMessage, fromPeerId?: string) => void;
  public onPlayerDisconnected?: (peerId: string) => void;
  public onError?: (err: string) => void;

  // Estado del lobby si es anfitrión
  public currentLobby: RoomLobbyState | null = null;

  constructor() {}

  /**
   * Genera un código de sala aleatorio tipo 'TRUCO-4921'
   */
  public static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TRUCO-${code}`;
  }

  /**
   * Obtiene el Peer ID que usamos en el broker de PeerJS
   */
  private static getPeerIdForRoom(roomCode: string): string {
    return `truco-arg-${roomCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  }

  /**
   * Inicia como Anfitrión (creador de la sala)
   */
  public async createRoom(
    roomCode: string, 
    hostName: string, 
    mode: MultiplayerMode = '2v2',
    targetPoints: 15 | 30 = 30,
    withFlor: boolean = true
  ): Promise<string> {
    this.isHost = true;
    this.roomCode = roomCode;
    const peerId = PeerNetworkManager.getPeerIdForRoom(roomCode);

    return new Promise((resolve, reject) => {
      try {
        // Inicializamos PeerJS en el servidor de señalización gratuito oficial
        this.peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          this.myPeerId = id;
          
          // Inicializar estado del lobby
          const totalSlots = mode === '1v1' ? 2 : mode === '2v2' ? 4 : 6;
          const slots: (PlayerSlot | null)[] = new Array(totalSlots).fill(null);
          
          slots[0] = {
            id,
            name: hostName || 'Anfitrión',
            avatar: '🧉',
            seatIndex: 0,
            team: 'nosotros',
            isHost: true,
            isReady: true,
            isConnected: true,
          };

          this.currentLobby = {
            roomCode,
            mode,
            targetPoints,
            withFlor,
            hostId: id,
            slots,
            gameStarted: false,
          };

          if (this.onConnectionOpen) this.onConnectionOpen();
          if (this.onLobbyUpdate) this.onLobbyUpdate(this.currentLobby);
          resolve(id);
        });

        this.peer.on('connection', (conn) => {
          this.handleIncomingConnection(conn);
        });

        this.peer.on('error', (err: any) => {
          console.error('[PeerHost] Error:', err);
          if (err.type === 'unavailable-id') {
            const msg = 'Ese código de sala ya está en uso. Intentá con otro o unite a la partida.';
            if (this.onError) this.onError(msg);
            reject(new Error(msg));
          } else {
            if (this.onError) this.onError(err.message || 'Error de conexión');
            reject(err);
          }
        });
      } catch (err: any) {
        reject(err);
      }
    });
  }

  /**
   * Se une como invitado a una sala existente
   */
  public async joinRoom(roomCode: string, playerName: string): Promise<void> {
    this.isHost = false;
    this.roomCode = roomCode;
    const hostPeerId = PeerNetworkManager.getPeerIdForRoom(roomCode);

    return new Promise((resolve, reject) => {
      try {
        // Conexión anónima del cliente
        this.peer = new Peer({
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (myId) => {
          this.myPeerId = myId;
          if (!this.peer) return;

          // Conectar con el host
          const conn = this.peer.connect(hostPeerId, { reliable: true });
          this.hostConnection = conn;

          conn.on('open', () => {
            if (this.onConnectionOpen) this.onConnectionOpen();

            // Enviar solicitud de ingreso
            const joinMsg: NetworkMessage = {
              type: 'JOIN_REQUEST',
              playerName: playerName || 'Truquero',
            };
            conn.send(joinMsg);
            resolve();
          });

          conn.on('data', (data: any) => {
            this.handleDataFromHost(data);
          });

          conn.on('close', () => {
            if (this.onError) this.onError('Se perdió la conexión con el anfitrión de la mesa.');
          });

          conn.on('error', (err) => {
            console.error('[GuestConn] Error:', err);
            if (this.onError) this.onError('Error al conectar con la sala. Verificá el código.');
          });
        });

        this.peer.on('error', (err: any) => {
          console.error('[PeerGuest] Error:', err);
          if (err.type === 'peer-unavailable') {
            const msg = `No se encontró la sala "${roomCode}". Verificá que el anfitrión siga conectado.`;
            if (this.onError) this.onError(msg);
            reject(new Error(msg));
          } else {
            if (this.onError) this.onError(err.message || 'Error de conexión');
            reject(err);
          }
        });
      } catch (err: any) {
        reject(err);
      }
    });
  }

  /**
   * Manejo de conexiones entrantes en el HOST
   */
  private handleIncomingConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data: any) => {
      const msg = data as NetworkMessage;
      this.handleMessageFromGuest(conn.peer, msg);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.handleGuestDisconnect(conn.peer);
    });

    conn.on('error', (err) => {
      console.warn(`[Host] Conexión error con ${conn.peer}:`, err);
      this.connections.delete(conn.peer);
    });
  }

  /**
   * Procesa mensajes recibidos de invitados en el HOST
   */
  private handleMessageFromGuest(peerId: string, msg: NetworkMessage) {
    if (!this.currentLobby) return;

    if (msg.type === 'JOIN_REQUEST') {
      // Buscar primer asiento libre
      const availableSeat = this.currentLobby.slots.findIndex(slot => slot === null);
      if (availableSeat === -1) {
        // Sala llena
        const conn = this.connections.get(peerId);
        if (conn) {
          conn.send({
            type: 'CHAT_MESSAGE',
            text: 'La sala está completa. Esperá a la próxima partida.',
            fromSeat: -1,
            fromName: 'Mesa',
          } as NetworkMessage);
        }
        return;
      }

      const team = availableSeat % 2 === 0 ? 'nosotros' : 'ellos';
      this.currentLobby.slots[availableSeat] = {
        id: peerId,
        name: msg.playerName || `Jugador ${availableSeat + 1}`,
        avatar: availableSeat % 2 === 0 ? '🤠' : '🐎',
        seatIndex: availableSeat,
        team,
        isHost: false,
        isReady: false,
        isConnected: true,
      };

      this.broadcastLobbyState();
      return;
    }

    if (msg.type === 'SEAT_SELECT') {
      const targetSeat = msg.seatIndex;
      if (targetSeat >= 0 && targetSeat < this.currentLobby.slots.length) {
        // Encontrar asiento actual de este peer
        const currentSeat = this.currentLobby.slots.findIndex(s => s?.id === peerId);
        if (currentSeat !== -1 && this.currentLobby.slots[targetSeat] === null) {
          const player = this.currentLobby.slots[currentSeat]!;
          this.currentLobby.slots[currentSeat] = null;
          player.seatIndex = targetSeat;
          player.team = targetSeat % 2 === 0 ? 'nosotros' : 'ellos';
          this.currentLobby.slots[targetSeat] = player;
          this.broadcastLobbyState();
        }
      }
      return;
    }

    if (msg.type === 'TOGGLE_READY') {
      const slot = this.currentLobby.slots.find(s => s?.id === peerId);
      if (slot) {
        slot.isReady = !slot.isReady;
        this.broadcastLobbyState();
      }
      return;
    }

    // Si es una seña secreta: reenviarla SOLAMENTE al compañero de equipo
    if (msg.type === 'SEND_SENA') {
      this.forwardSenaToTeammates(peerId, msg.sena);
      return;
    }

    // Para el resto de los mensajes (jugadas de carta, cantos, etc.), avisar al motor de juego
    if (this.onMessage) {
      this.onMessage(msg, peerId);
    }
  }

  /**
   * Reenvía una seña criolla en secreto ÚNICAMENTE al compañero
   */
  private forwardSenaToTeammates(senderPeerId: string, sena: any) {
    if (!this.currentLobby) return;
    const sender = this.currentLobby.slots.find(s => s?.id === senderPeerId);
    if (!sender) return;

    const senaMsg: NetworkMessage = {
      type: 'SENA_RECEIVED',
      sena,
      fromPlayerName: sender.name,
      fromSeat: sender.seatIndex,
    };

    // Enviar a todos los jugadores del mismo equipo excepto a quien la envió
    this.currentLobby.slots.forEach(slot => {
      if (slot && slot.team === sender.team && slot.id !== senderPeerId) {
        if (slot.isHost) {
          // El host es compañero
          if (this.onMessage) this.onMessage(senaMsg, senderPeerId);
        } else {
          const conn = this.connections.get(slot.id);
          if (conn && conn.open) {
            conn.send(senaMsg);
          }
        }
      }
    });
  }

  /**
   * Procesa mensajes recibidos desde el HOST en los CLIENTES
   */
  private handleDataFromHost(data: any) {
    const msg = data as NetworkMessage;

    if (msg.type === 'LOBBY_STATE_UPDATE') {
      this.currentLobby = msg.state;
      if (this.onLobbyUpdate) this.onLobbyUpdate(msg.state);
      return;
    }

    if (this.onMessage) {
      this.onMessage(msg);
    }
  }

  /**
   * Cuando un invitado se desconecta
   */
  private handleGuestDisconnect(peerId: string) {
    if (!this.currentLobby) return;
    const seatIdx = this.currentLobby.slots.findIndex(s => s?.id === peerId);
    if (seatIdx !== -1) {
      this.currentLobby.slots[seatIdx] = null;
      this.broadcastLobbyState();
      if (this.onPlayerDisconnected) this.onPlayerDisconnected(peerId);
    }
  }

  /**
   * Difunde el estado actual del lobby a todos los conectados
   */
  public broadcastLobbyState() {
    if (!this.isHost || !this.currentLobby) return;
    const updateMsg: NetworkMessage = {
      type: 'LOBBY_STATE_UPDATE',
      state: this.currentLobby,
    };
    this.broadcast(updateMsg);
    if (this.onLobbyUpdate) this.onLobbyUpdate(this.currentLobby);
  }

  /**
   * Envía un mensaje a todos los clientes conectados
   */
  public broadcast(msg: NetworkMessage) {
    if (!this.isHost) return;
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(msg);
      }
    });
  }

  /**
   * Envía un mensaje al anfitrión (usado por los invitados)
   */
  public sendToHost(msg: NetworkMessage) {
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(msg);
    }
  }

  /**
   * Cambiar modo de juego (1v1, 2v2, 3v3) en el lobby (solo host)
   */
  public changeMode(mode: MultiplayerMode) {
    if (!this.isHost || !this.currentLobby) return;
    const totalSlots = mode === '1v1' ? 2 : mode === '2v2' ? 4 : 6;
    const newSlots: (PlayerSlot | null)[] = new Array(totalSlots).fill(null);

    // Mantener jugadores actuales hasta el límite
    this.currentLobby.slots.forEach((slot, idx) => {
      if (slot && idx < totalSlots) {
        slot.seatIndex = idx;
        slot.team = idx % 2 === 0 ? 'nosotros' : 'ellos';
        newSlots[idx] = slot;
      }
    });

    this.currentLobby.mode = mode;
    this.currentLobby.slots = newSlots;
    this.broadcastLobbyState();
  }

  /**
   * Cambiar puntos objetivo o flor (solo host)
   */
  public updateSettings(targetPoints: 15 | 30, withFlor: boolean) {
    if (!this.isHost || !this.currentLobby) return;
    this.currentLobby.targetPoints = targetPoints;
    this.currentLobby.withFlor = withFlor;
    this.broadcastLobbyState();
  }

  /**
   * Cierra todas las conexiones y destruye el Peer
   */
  public destroy() {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    if (this.hostConnection) {
      this.hostConnection.close();
      this.hostConnection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}
