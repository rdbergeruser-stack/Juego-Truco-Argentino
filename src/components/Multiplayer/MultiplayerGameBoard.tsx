import { useState, useEffect } from 'react';
import { CardView } from '../CardView';
import { SenasPanel } from './SenasPanel';
import { 
  Eye, 
  Flag, 
  Send 
} from 'lucide-react';
import type { Card } from '../../types/truco';
import type { 
  MultiplayerGameState, 
  SenaType,
  TeamId 
} from '../../types/multiplayer';
import { TRUCO_SENAS } from '../../types/multiplayer';

interface MultiplayerGameBoardProps {
  gameState: MultiplayerGameState;
  mySeatIndex: number;
  myHand: Card[];
  isHost?: boolean;
  onPlayCard: (cardId: string) => void;
  onCallTruco: (chant: 'truco' | 'retruco' | 'vale_cuatro') => void;
  onRespondTruco: (response: 'quiero' | 'no_quiero' | 'subir', raiseChant?: 'retruco' | 'vale_cuatro') => void;
  onCallEnvido: (chant: 'envido' | 'real_envido' | 'falta_envido') => void;
  onRespondEnvido: (response: 'quiero' | 'no_quiero' | 'subir', raiseChant?: 'envido' | 'real_envido' | 'falta_envido') => void;
  onSendSena: (sena: SenaType) => void;
  onSendChat: (text: string, isTeamOnly?: boolean) => void;
  onFoldHand: () => void;
  onLeaveGame: () => void;
  incomingSena?: { sena: SenaType; fromName: string } | null;
}

export function MultiplayerGameBoard({
  gameState,
  mySeatIndex,
  myHand,
  isHost: _isHost,
  onPlayCard,
  onCallTruco,
  onRespondTruco,
  onCallEnvido,
  onRespondEnvido,
  onSendSena,
  onSendChat,
  onFoldHand,
  onLeaveGame,
  incomingSena,
}: MultiplayerGameBoardProps) {
  const [isSenasOpen, setIsSenasOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showIncomingSena, setShowIncomingSena] = useState<typeof incomingSena>(null);

  // Alertas cuando entra una seña del compañero
  useEffect(() => {
    if (incomingSena) {
      setShowIncomingSena(incomingSena);
      const timer = setTimeout(() => setShowIncomingSena(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [incomingSena]);

  const myPlayer = gameState.players.find((p) => p.seatIndex === mySeatIndex);
  const myTeam: TeamId = myPlayer?.team || 'nosotros';
  const isMyTurn = gameState.currentTurnSeat === mySeatIndex;

  // Encontrar compañero de equipo (en 2v2 o 3v3)
  const myTeammates = gameState.players.filter(
    (p) => p.team === myTeam && p.seatIndex !== mySeatIndex
  );
  const partnerName = myTeammates[0]?.name || 'compañero';

  // Verificar si mi equipo debe responder al Truco
  const isTrucoWaitingMyTeam = gameState.trucoState.waitingResponseFromTeam === myTeam;
  // Verificar si mi equipo debe responder al Envido
  const isEnvidoWaitingMyTeam = gameState.envidoState.waitingResponseFromTeam === myTeam;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="flex flex-col gap-3 max-w-6xl mx-auto px-2 sm:px-4 py-3 select-none">
      {/* Notificación Flotante de Seña Secreta Recibida */}
      {showIncomingSena && (
        <div className="fixed top-16 right-4 z-50 bg-gradient-to-r from-amber-600 to-amber-700 border-2 border-amber-300 text-[#140a05] px-4 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-3">
          <span className="text-3xl">
            {TRUCO_SENAS.find((s) => s.type === showIncomingSena.sena)?.faceEmoji || '🤫'}
          </span>
          <div>
            <div className="text-[10px] uppercase font-mono font-black text-amber-950">
              SEÑA SECRETA DE {showIncomingSena.fromName}
            </div>
            <div className="font-display font-black text-sm">
              {TRUCO_SENAS.find((s) => s.type === showIncomingSena.sena)?.label} ({TRUCO_SENAS.find((s) => s.type === showIncomingSena.sena)?.meaning})
            </div>
          </div>
        </div>
      )}

      {/* Barra Superior de Estado y Marcador */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-[#170a04]/90 border border-amber-800/50 rounded-2xl p-3 shadow-xl">
        {/* Info de la Sala */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/40">
            {gameState.roomCode}
          </span>
          <span className="text-xs text-amber-200/70 font-display">
            Mano #{gameState.handNumber} • A {gameState.targetPoints} Pts
          </span>
        </div>

        {/* Marcador de Puntos (Nosotros vs Ellos) */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-display font-bold text-sky-300 tracking-wider">
              NOSOTROS {myTeam === 'nosotros' ? '(Vos)' : ''}
            </span>
            <span className="font-display font-black text-2xl text-sky-200 drop-shadow">
              {gameState.pointsNosotros}
            </span>
          </div>
          <div className="text-amber-500 font-display font-black text-lg">VS</div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-display font-bold text-rose-300 tracking-wider">
              ELLOS {myTeam === 'ellos' ? '(Vos)' : ''}
            </span>
            <span className="font-display font-black text-2xl text-rose-200 drop-shadow">
              {gameState.pointsEllos}
            </span>
          </div>
        </div>

        {/* Botones Rápidos (Señas y Salir) */}
        <div className="flex items-center justify-end gap-2">
          {myTeammates.length > 0 && (
            <button
              onClick={() => setIsSenasOpen(true)}
              className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 text-[#140a05] font-display font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-400/60 shadow transition active:scale-95"
              title="Tirar seña secreta a tu compañero"
            >
              <Eye className="w-4 h-4" />
              <span>Señas 🤫</span>
            </button>
          )}
          <button
            onClick={onLeaveGame}
            className="text-[11px] font-display font-semibold text-rose-400 hover:text-rose-200 px-2 py-1 rounded hover:bg-rose-950/50 transition"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Mesa de Paño Verde de la Pulpería */}
      <div className="relative min-h-[420px] sm:min-h-[480px] bg-gradient-to-b from-[#14532d] via-[#166534] to-[#14532d] rounded-3xl border-8 border-[#3b1d11] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.9)] p-4 flex flex-col justify-between overflow-hidden">
        {/* Adorno Central de Cuero y Letras Criollas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
          <span className="font-display font-black text-7xl sm:text-9xl tracking-widest text-[#fbf3df]">
            TRUCO
          </span>
        </div>

        {/* JUGADORES OPONENTES / COMPAÑEROS SUPERIORES */}
        <div className="flex justify-around items-center z-10">
          {gameState.players
            .filter((p) => p.seatIndex !== mySeatIndex)
            .map((player) => {
              const isPartner = player.team === myTeam;
              const isTurn = gameState.currentTurnSeat === player.seatIndex;
              return (
                <div
                  key={player.seatIndex}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition ${
                    isTurn
                      ? 'bg-amber-400/20 ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse'
                      : 'bg-[#100803]/60 border border-amber-900/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-500/50 flex items-center justify-center text-lg shadow">
                    {player.avatar || '🤠'}
                  </div>
                  <div className="text-center">
                    <span className="font-display font-bold text-xs text-amber-100 flex items-center justify-center gap-1">
                      {player.name}
                      {isPartner && <span className="text-[9px] text-sky-300 font-mono">(Socio)</span>}
                    </span>
                    <span className={`text-[9px] font-mono px-1 rounded ${
                      player.team === 'nosotros' ? 'text-sky-300 bg-sky-950/80' : 'text-rose-300 bg-rose-950/80'
                    }`}>
                      Equipo {player.team === 'nosotros' ? 'Nosotros' : 'Ellos'}
                    </span>
                  </div>
                  {/* Cartas boca abajo del rival */}
                  <div className="flex gap-1 mt-0.5">
                    {[1, 2, 3].slice(0, gameState.handsBySeat[player.seatIndex]?.length || 0).map((i) => (
                      <div
                        key={i}
                        className="w-5 h-7 rounded bg-[#2b1810] border border-amber-800 shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* CENTRO DE LA MESA: CARTAS JUGADAS */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-auto z-10 min-h-[140px]">
          {gameState.playedCards.length === 0 ? (
            <div className="text-xs font-body italic text-emerald-200/50 text-center">
              Las cartas jugadas en la mano aparecerán acá en el centro del paño.
            </div>
          ) : (
            gameState.playedCards.map((pc, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 animate-in zoom-in-95 duration-200">
                <span className="text-[10px] font-display font-bold text-amber-200 bg-black/60 px-2 py-0.5 rounded-full border border-amber-700/40">
                  {pc.playerName}
                </span>
                <div className="w-20 sm:w-24">
                  <CardView card={pc.card} size="sm" animatePlay />
                </div>
              </div>
            ))
          )}
        </div>

        {/* ZONA INFERIOR: TUS CARTAS Y TUS ACCIONES */}
        <div className="flex flex-col items-center gap-2 z-10">
          {/* Turno actual */}
          <div className="text-xs font-display font-bold text-amber-200 bg-black/70 px-3 py-1 rounded-full border border-amber-500/50 shadow flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isMyTurn ? 'bg-emerald-400 animate-ping' : 'bg-amber-500'}`} />
            <span>
              {isMyTurn ? '¡ES TU TURNO DE JUGAR O CANTAR!' : `Esperando jugada de ${gameState.players.find((p) => p.seatIndex === gameState.currentTurnSeat)?.name || 'otro jugador'}...`}
            </span>
          </div>

          {/* Tus cartas en mano */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {myHand.map((card) => {
              const canPlay = isMyTurn && !isTrucoWaitingMyTeam && !isEnvidoWaitingMyTeam;
              return (
                <div
                  key={card.id}
                  onClick={() => {
                    if (canPlay) {
                      onPlayCard(card.id);
                    }
                  }}
                  className={`w-24 sm:w-28 transition-transform ${
                    canPlay
                      ? 'hover:-translate-y-3 cursor-pointer hover:shadow-2xl active:scale-95'
                      : 'opacity-90 cursor-not-allowed'
                  }`}
                >
                  <CardView card={card} disabled={!canPlay} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PANEL DE CANTOS Y RESPUESTAS */}
      <div className="bg-[#1c100a] border-2 border-amber-700/60 rounded-2xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* RESPUESTA A CANTOS PENDIENTES */}
        {isTrucoWaitingMyTeam ? (
          <div className="w-full bg-rose-950/80 border border-rose-500 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
            <div className="text-xs font-display font-black text-rose-200">
              ¡EL RIVAL CANTÓ {gameState.trucoState.level.toUpperCase()}! ¿Qué responde tu equipo?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRespondTruco('quiero')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
              >
                ¡QUIERO!
              </button>
              <button
                onClick={() => onRespondTruco('no_quiero')}
                className="bg-rose-700 hover:bg-rose-600 text-white font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
              >
                NO QUIERO
              </button>
              {gameState.trucoState.level === 'truco' && (
                <button
                  onClick={() => onRespondTruco('subir', 'retruco')}
                  className="bg-amber-600 hover:bg-amber-500 text-[#140a05] font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
                >
                  ¡QUIERO RETRUCO!
                </button>
              )}
              {gameState.trucoState.level === 'retruco' && (
                <button
                  onClick={() => onRespondTruco('subir', 'vale_cuatro')}
                  className="bg-amber-600 hover:bg-amber-500 text-[#140a05] font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
                >
                  ¡VALE CUATRO!
                </button>
              )}
            </div>
          </div>
        ) : isEnvidoWaitingMyTeam ? (
          <div className="w-full bg-amber-950/80 border border-amber-500 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
            <div className="text-xs font-display font-black text-amber-200">
              ¡CANTARON ENVIDO! ¿Aceptan el envido?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRespondEnvido('quiero')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
              >
                ¡QUIERO!
              </button>
              <button
                onClick={() => onRespondEnvido('no_quiero')}
                className="bg-rose-700 hover:bg-rose-600 text-white font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
              >
                NO QUIERO
              </button>
              <button
                onClick={() => onRespondEnvido('subir', 'real_envido')}
                className="bg-amber-600 hover:bg-amber-500 text-[#140a05] font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
              >
                ¡REAL ENVIDO!
              </button>
              <button
                onClick={() => onRespondEnvido('subir', 'falta_envido')}
                className="bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-xs px-4 py-1.5 rounded-lg shadow active:scale-95"
              >
                ¡FALTA ENVIDO!
              </button>
            </div>
          </div>
        ) : (
          /* BOTONES NORMALES PARA CANTAR */
          <div className="flex flex-wrap items-center gap-2">
            {/* Cantos de Envido */}
            {!gameState.envidoState.resolved && gameState.tricks.length === 0 && (
              <div className="flex items-center gap-1.5 bg-[#140803] p-1 rounded-xl border border-amber-900/60">
                <button
                  onClick={() => onCallEnvido('envido')}
                  disabled={!isMyTurn}
                  className="px-3 py-1.5 rounded-lg font-display font-bold text-xs bg-amber-800/60 hover:bg-amber-700 text-amber-200 disabled:opacity-40 transition active:scale-95"
                >
                  Envido
                </button>
                <button
                  onClick={() => onCallEnvido('real_envido')}
                  disabled={!isMyTurn}
                  className="px-3 py-1.5 rounded-lg font-display font-bold text-xs bg-amber-800/60 hover:bg-amber-700 text-amber-200 disabled:opacity-40 transition active:scale-95"
                >
                  Real Envido
                </button>
                <button
                  onClick={() => onCallEnvido('falta_envido')}
                  disabled={!isMyTurn}
                  className="px-3 py-1.5 rounded-lg font-display font-bold text-xs bg-rose-900/60 hover:bg-rose-800 text-rose-200 disabled:opacity-40 transition active:scale-95"
                >
                  Falta Envido
                </button>
              </div>
            )}

            {/* Cantos de Truco */}
            <div className="flex items-center gap-1.5 bg-[#140803] p-1 rounded-xl border border-amber-900/60">
              {gameState.trucoState.level === 'none' && (
                <button
                  onClick={() => onCallTruco('truco')}
                  disabled={!isMyTurn}
                  className="px-4 py-1.5 rounded-lg font-display font-black text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#140a05] shadow disabled:opacity-40 transition active:scale-95"
                >
                  ¡¡TRUCO!!
                </button>
              )}
              {gameState.trucoState.level === 'truco' && gameState.trucoState.lastChanterTeam !== myTeam && (
                <button
                  onClick={() => onCallTruco('retruco')}
                  disabled={!isMyTurn}
                  className="px-4 py-1.5 rounded-lg font-display font-black text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#140a05] shadow disabled:opacity-40 transition active:scale-95"
                >
                  ¡¡RETRUCO!!
                </button>
              )}
              {gameState.trucoState.level === 'retruco' && gameState.trucoState.lastChanterTeam !== myTeam && (
                <button
                  onClick={() => onCallTruco('vale_cuatro')}
                  disabled={!isMyTurn}
                  className="px-4 py-1.5 rounded-lg font-display font-black text-xs bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow disabled:opacity-40 transition active:scale-95"
                >
                  ¡¡VALE CUATRO!!
                </button>
              )}
            </div>

            {/* Irse al Mazo */}
            <button
              onClick={onFoldHand}
              disabled={!isMyTurn}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-display font-semibold text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 border border-rose-900/50 disabled:opacity-40 transition active:scale-95"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Mazo</span>
            </button>
          </div>
        )}

        {/* Chat / Charla de Pulpería */}
        <form onSubmit={handleSendChat} className="flex items-center gap-1.5 flex-1 max-w-sm">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Mensaje para la mesa..."
            className="flex-1 bg-[#120803] border border-amber-900/60 rounded-xl px-3 py-1.5 text-xs text-amber-100 placeholder:text-amber-300/40 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="p-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-[#140a05] transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* REGISTRO DE LA PULPERÍA (LOGS DE LA PARTIDA) */}
      <div className="bg-[#120803]/80 border border-amber-900/40 rounded-xl p-2.5 max-h-24 overflow-y-auto flex flex-col-reverse gap-1 text-[11px] font-mono">
        {gameState.logs.slice().reverse().map((log) => (
          <div key={log.id} className="text-amber-200/80">
            <span className="text-amber-400 font-bold">{log.senderName ? `${log.senderName}: ` : '• '}</span>
            <span>{log.text}</span>
          </div>
        ))}
      </div>

      {/* Modal de Señas Criollas */}
      <SenasPanel
        isOpen={isSenasOpen}
        onClose={() => setIsSenasOpen(false)}
        onSendSena={onSendSena}
        teammateName={partnerName}
      />
    </div>
  );
}
