import { useState, useEffect, useRef } from 'react';
import { PeerNetworkManager } from '../../game/multiplayer/peerNetwork';
import { MultiplayerGameEngine } from '../../game/multiplayer/multiplayerEngine';
import { RoomLobbyView } from './RoomLobbyView';
import { MultiplayerGameBoard } from './MultiplayerGameBoard';
import { 
  PlusCircle, 
  LogIn, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import type { 
  RoomLobbyState, 
  MultiplayerMode, 
  MultiplayerGameState, 
  NetworkMessage,
  SenaType 
} from '../../types/multiplayer';
import type { Card } from '../../types/truco';

interface MultiplayerViewProps {
  onBackToMenu: () => void;
  onOpenHierarchy: () => void;
}

export function MultiplayerView({ onBackToMenu, onOpenHierarchy }: MultiplayerViewProps) {
  // Estado de conexión
  const [networkManager, setNetworkManager] = useState<PeerNetworkManager | null>(null);
  const [lobbyState, setLobbyState] = useState<RoomLobbyState | null>(null);
  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);
  const [myHand, setMyHand] = useState<Card[]>([]);
  const [incomingSena, setIncomingSena] = useState<{ sena: SenaType; fromName: string } | null>(null);

  // Formularios
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('truco_player_name') || 'Gaucho');
  const [joinCode, setJoinCode] = useState('');
  const [selectedMode, setSelectedMode] = useState<MultiplayerMode>('2v2');
  const [selectedPoints, setSelectedPoints] = useState<15 | 30>(30);
  const [withFlor, setWithFlor] = useState(true);

  // Estados de UI
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Referencia al motor del host
  const engineRef = useRef<MultiplayerGameEngine | null>(null);

  // Detectar si la URL trajo un código de sala (?sala=TRUCO-XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('sala');
    if (roomParam) {
      setJoinCode(roomParam.toUpperCase());
    }
  }, []);

  // Guardar nombre de jugador en localStorage
  const handleNameChange = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('truco_player_name', name);
  };

  /**
   * Crear nueva sala (Anfitrión)
   */
  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setErrorMessage('Por favor ingresá tu nombre o apodo.');
      return;
    }

    setIsConnecting(true);
    setErrorMessage(null);

    const roomCode = PeerNetworkManager.generateRoomCode();
    const manager = new PeerNetworkManager();

    manager.onLobbyUpdate = (lobby) => {
      setLobbyState({ ...lobby });
    };

    manager.onError = (err) => {
      setErrorMessage(err);
      setIsConnecting(false);
    };

    manager.onMessage = (msg, fromPeerId) => {
      handleHostIncomingMessage(manager, msg, fromPeerId);
    };

    try {
      await manager.createRoom(roomCode, playerName, selectedMode, selectedPoints, withFlor);
      setNetworkManager(manager);
      setIsConnecting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo crear la sala. Intentá de nuevo.');
      setIsConnecting(false);
    }
  };

  /**
   * Unirse a una sala existente
   */
  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setErrorMessage('Por favor ingresá tu nombre o apodo.');
      return;
    }
    if (!joinCode.trim()) {
      setErrorMessage('Por favor ingresá el código de la sala.');
      return;
    }

    setIsConnecting(true);
    setErrorMessage(null);

    const manager = new PeerNetworkManager();

    manager.onLobbyUpdate = (lobby) => {
      setLobbyState({ ...lobby });
    };

    manager.onError = (err) => {
      setErrorMessage(err);
      setIsConnecting(false);
    };

    manager.onMessage = (msg) => {
      handleGuestIncomingMessage(msg);
    };

    try {
      await manager.joinRoom(joinCode.trim().toUpperCase(), playerName);
      setNetworkManager(manager);
      setIsConnecting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo conectar a la sala.');
      setIsConnecting(false);
    }
  };

  /**
   * Manejo de mensajes en el HOST (Árbitro de la mesa)
   */
  const handleHostIncomingMessage = (
    manager: PeerNetworkManager,
    msg: NetworkMessage,
    _fromPeerId?: string
  ) => {
    const engine = engineRef.current;

    if (msg.type === 'SENA_RECEIVED') {
      setIncomingSena({ sena: msg.sena, fromName: msg.fromPlayerName });
      return;
    }

    if (!engine) return;

    if (msg.type === 'PLAY_CARD') {
      const ok = engine.playCard(msg.seatIndex, msg.cardId);
      if (ok) broadcastGameState(manager, engine);
      return;
    }

    if (msg.type === 'CALL_CHANT') {
      if (['truco', 'retruco', 'vale_cuatro'].includes(msg.chant)) {
        const ok = engine.callTruco(msg.seatIndex, msg.chant as any);
        if (ok) broadcastGameState(manager, engine);
      } else if (['envido', 'real_envido', 'falta_envido'].includes(msg.chant)) {
        const ok = engine.callEnvido(msg.seatIndex, msg.chant as any);
        if (ok) broadcastGameState(manager, engine);
      }
      return;
    }

    if (msg.type === 'RESPOND_CHANT') {
      if (engine.state.trucoState.waitingResponseFromTeam) {
        const ok = engine.respondTruco(msg.seatIndex, msg.response, msg.raiseChant as any);
        if (ok) broadcastGameState(manager, engine);
      } else if (engine.state.envidoState.waitingResponseFromTeam) {
        const ok = engine.respondEnvido(msg.seatIndex, msg.response, msg.raiseChant as any);
        if (ok) broadcastGameState(manager, engine);
      }
      return;
    }

    if (msg.type === 'FOLD_HAND') {
      const player = engine.state.players.find((p) => p.seatIndex === msg.seatIndex);
      if (player) {
        const otherTeam = player.team === 'nosotros' ? 'ellos' : 'nosotros';
        engine.finishHand(otherTeam, true);
        broadcastGameState(manager, engine);
      }
      return;
    }

    if (msg.type === 'CHAT_MESSAGE') {
      engine.addLog(`${msg.fromName}: ${msg.text}`, 'chat');
      broadcastGameState(manager, engine);
      return;
    }
  };

  /**
   * Manejo de mensajes en los CLIENTES
   */
  const handleGuestIncomingMessage = (msg: NetworkMessage) => {
    if (msg.type === 'GAME_STATE_SYNC') {
      setGameState(msg.state);
      setMyHand(msg.yourHand);
      return;
    }

    if (msg.type === 'SENA_RECEIVED') {
      setIncomingSena({ sena: msg.sena, fromName: msg.fromPlayerName });
      return;
    }
  };

  /**
   * El Anfitrión inicia la partida
   */
  const handleStartGameAsHost = () => {
    if (!networkManager || !lobbyState) return;

    const activePlayers = lobbyState.slots.filter(Boolean) as any[];
    const engine = new MultiplayerGameEngine(
      lobbyState.roomCode,
      lobbyState.mode,
      activePlayers,
      lobbyState.targetPoints,
      lobbyState.withFlor
    );

    engineRef.current = engine;
    broadcastGameState(networkManager, engine);
  };

  /**
   * Difunde el estado completo de la partida sincronizado
   */
  const broadcastGameState = (manager: PeerNetworkManager, engine: MultiplayerGameEngine) => {
    const fullState = { ...engine.state };
    setGameState(fullState);

    // En el host, mi mano es la del asiento 0
    setMyHand(engine.state.handsBySeat[0] || []);

    // Enviar a cada cliente su mano privada y el estado general
    manager.currentLobby?.slots.forEach((slot) => {
      if (slot && !slot.isHost) {
        const clientHand = engine.state.handsBySeat[slot.seatIndex] || [];
        const syncMsg: NetworkMessage = {
          type: 'GAME_STATE_SYNC',
          state: fullState,
          yourHand: clientHand,
        };
        manager.sendToPeer(slot.id, syncMsg);
      }
    });
  };

  /**
   * Desconectarse y salir
   */
  const handleLeave = () => {
    if (networkManager) {
      networkManager.destroy();
      setNetworkManager(null);
    }
    setLobbyState(null);
    setGameState(null);
    engineRef.current = null;
  };

  // Determinar mi índice de asiento
  const mySeatIndex =
    lobbyState?.slots.findIndex((s) => s?.id === networkManager?.myPeerId) ?? 0;

  // 1. SI LA PARTIDA YA COMENZÓ -> MOSTRAR LA MESA MULTIJUGADOR
  if (gameState && networkManager) {
    return (
      <MultiplayerGameBoard
        gameState={gameState}
        mySeatIndex={mySeatIndex >= 0 ? mySeatIndex : 0}
        myHand={myHand}
        isHost={networkManager.isHost}
        onPlayCard={(cardId) => {
          if (networkManager.isHost && engineRef.current) {
            const ok = engineRef.current.playCard(0, cardId);
            if (ok) broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'PLAY_CARD', cardId, seatIndex: mySeatIndex });
          }
        }}
        onCallTruco={(chant) => {
          if (networkManager.isHost && engineRef.current) {
            const ok = engineRef.current.callTruco(0, chant);
            if (ok) broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'CALL_CHANT', chant, seatIndex: mySeatIndex });
          }
        }}
        onRespondTruco={(response, raiseChant) => {
          if (networkManager.isHost && engineRef.current) {
            const ok = engineRef.current.respondTruco(0, response, raiseChant);
            if (ok) broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'RESPOND_CHANT', response, raiseChant, seatIndex: mySeatIndex });
          }
        }}
        onCallEnvido={(chant) => {
          if (networkManager.isHost && engineRef.current) {
            const ok = engineRef.current.callEnvido(0, chant);
            if (ok) broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'CALL_CHANT', chant, seatIndex: mySeatIndex });
          }
        }}
        onRespondEnvido={(response, raiseChant) => {
          if (networkManager.isHost && engineRef.current) {
            const ok = engineRef.current.respondEnvido(0, response, raiseChant);
            if (ok) broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'RESPOND_CHANT', response, raiseChant, seatIndex: mySeatIndex });
          }
        }}
        onSendSena={(sena) => {
          networkManager.sendToHost({ type: 'SEND_SENA', sena, fromSeat: mySeatIndex });
        }}
        onSendChat={(text) => {
          const senderName = playerName || 'Gaucho';
          if (networkManager.isHost && engineRef.current) {
            engineRef.current.addLog(`${senderName}: ${text}`, 'chat');
            broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'CHAT_MESSAGE', text, fromSeat: mySeatIndex, fromName: senderName });
          }
        }}
        onFoldHand={() => {
          if (networkManager.isHost && engineRef.current) {
            engineRef.current.finishHand('ellos', true);
            broadcastGameState(networkManager, engineRef.current);
          } else {
            networkManager.sendToHost({ type: 'FOLD_HAND', seatIndex: mySeatIndex });
          }
        }}
        onLeaveGame={handleLeave}
        incomingSena={incomingSena}
      />
    );
  }

  // 2. SI YA ESTÁ CONECTADO A UNA SALA -> MOSTRAR EL LOBBY DE ESPERA
  if (lobbyState && networkManager) {
    return (
      <RoomLobbyView
        lobby={lobbyState}
        myPeerId={networkManager.myPeerId}
        isHost={networkManager.isHost}
        onSelectSeat={(seatIndex) => {
          if (networkManager.isHost) {
            // El host cambia su asiento
          } else {
            networkManager.sendToHost({ type: 'SEAT_SELECT', seatIndex });
          }
        }}
        onToggleReady={() => {
          if (networkManager.isHost) {
            // Host listo
          } else {
            networkManager.sendToHost({ type: 'TOGGLE_READY' });
          }
        }}
        onChangeMode={(mode) => networkManager.changeMode(mode)}
        onChangeSettings={(targetPoints, withFlor) => networkManager.updateSettings(targetPoints, withFlor)}
        onStartGame={handleStartGameAsHost}
        onLeaveRoom={handleLeave}
      />
    );
  }

  // 3. PANTALLA PRINCIPAL: CREAR O UNIRSE A SALA
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Encabezado */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border-2 border-amber-400/60 flex items-center justify-center text-3xl shadow-xl">
          🧉
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-amber-200 tracking-wide drop-shadow">
          Mesas con Amigos
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/70 font-body max-w-lg">
          Creá tu propia sala de Truco Criollo para 2, 4 o 6 jugadores y pasale el enlace directo a tus amigos para jugar mano a mano, en parejas o en tríos.
        </p>
      </div>

      {/* Alerta de error si ocurrió */}
      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-500 text-rose-200 px-4 py-3 rounded-xl flex items-center gap-3 text-xs sm:text-sm shadow-lg animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Ingreso de Nombre / Apodo */}
      <div className="bg-[#1c100a] border border-amber-800/60 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="text-xs uppercase font-mono font-bold text-amber-400 tracking-wider">
            Tu Nombre en la Mesa
          </label>
          <p className="text-[11px] text-amber-200/60 font-body">
            Como te van a ver tus compañeros y rivales en la pulpería.
          </p>
        </div>
        <input
          type="text"
          value={playerName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ej: Facundo, Fierro, Pampa..."
          maxLength={18}
          className="w-full sm:w-64 bg-[#120803] border-2 border-amber-700/60 focus:border-amber-400 rounded-xl px-3.5 py-2 text-sm text-amber-100 placeholder:text-amber-400/30 font-display font-bold focus:outline-none transition"
        />
      </div>

      {/* Opciones: Crear Mesa vs Unirse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* TARJETA 1: CREAR SALA NUEVA */}
        <div className="bg-gradient-to-b from-[#24130a] to-[#140a05] border-2 border-amber-600/50 hover:border-amber-500 rounded-2xl p-5 shadow-2xl flex flex-col justify-between gap-5 transition">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-amber-200 text-lg">
                  Crear una Mesa
                </h2>
                <span className="text-[10px] text-amber-300/60 font-mono">Genera link de invitación</span>
              </div>
            </div>

            {/* Modalidad de Juego */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] font-display font-bold text-amber-200/80">
                Modalidad de Juego:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#120803] p-1 rounded-xl border border-amber-900/60">
                {(['1v1', '2v2', '3v3'] as MultiplayerMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMode(m)}
                    className={`py-1.5 rounded-lg font-display font-bold text-xs transition ${
                      selectedMode === m
                        ? 'bg-amber-600 text-[#140a05] shadow'
                        : 'text-amber-200/60 hover:text-amber-200'
                    }`}
                  >
                    {m === '1v1' ? '1 vs 1' : m === '2v2' ? '2 vs 2' : '3 vs 3'}
                  </button>
                ))}
              </div>
            </div>

            {/* Puntos y Flor */}
            <div className="flex items-center justify-between gap-2 text-xs text-amber-200/80 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPoints === 30}
                  onChange={(e) => setSelectedPoints(e.target.checked ? 30 : 15)}
                  className="rounded border-amber-600 text-amber-600 focus:ring-0"
                />
                <span>A 30 Puntos</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withFlor}
                  onChange={(e) => setWithFlor(e.target.checked)}
                  className="rounded border-amber-600 text-amber-600 focus:ring-0"
                />
                <span>Con Flor 🌸</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:brightness-110 text-[#140a05] font-display font-black text-sm py-3 rounded-xl border border-amber-300/60 shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Abriendo la mesa...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Crear Mesa y Obtener Link</span>
              </>
            )}
          </button>
        </div>

        {/* TARJETA 2: UNIRSE A UNA MESA */}
        <div className="bg-gradient-to-b from-[#24130a] to-[#140a05] border-2 border-amber-800/40 hover:border-amber-600/70 rounded-2xl p-5 shadow-2xl flex flex-col justify-between gap-5 transition">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-900/40 border border-sky-600/50 flex items-center justify-center text-sky-300">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-amber-200 text-lg">
                  Unirse a una Mesa
                </h2>
                <span className="text-[10px] text-amber-300/60 font-mono">Con código de invitación</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] font-display font-bold text-amber-200/80">
                Código de la Sala:
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Ej: TRUCO-7421"
                className="bg-[#120803] border-2 border-amber-800/60 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-center text-base text-amber-300 font-mono font-black tracking-widest placeholder:text-amber-500/20 focus:outline-none transition uppercase"
              />
              <p className="text-[10px] text-amber-200/50 font-body">
                Si te pasaron un link directo, el código se completa automáticamente.
              </p>
            </div>
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={isConnecting || !joinCode.trim()}
            className="w-full bg-[#3a1f11] hover:bg-[#4d2917] text-amber-100 font-display font-black text-sm py-3 rounded-xl border border-amber-600/50 shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Conectando a la mesa...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar a la Mesa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Botón de volver */}
      <div className="flex items-center justify-between text-xs pt-2">
        <button
          onClick={onBackToMenu}
          className="text-amber-200/60 hover:text-amber-200 hover:underline font-display"
        >
          ← Volver al modo Escuela / vs PC
        </button>
        <button
          onClick={onOpenHierarchy}
          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-display"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ver Jerarquía de Cartas</span>
        </button>
      </div>
    </div>
  );
}
