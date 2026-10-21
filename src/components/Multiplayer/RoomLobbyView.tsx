import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Share2, 
  Play, 
  Settings2, 
  Crown, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import type { RoomLobbyState, MultiplayerMode, PlayerSlot } from '../../types/multiplayer';

interface RoomLobbyViewProps {
  lobby: RoomLobbyState;
  myPeerId: string;
  isHost: boolean;
  onSelectSeat: (seatIndex: number) => void;
  onToggleReady: () => void;
  onChangeMode: (mode: MultiplayerMode) => void;
  onChangeSettings: (targetPoints: 15 | 30, withFlor: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export function RoomLobbyView({
  lobby,
  myPeerId,
  isHost,
  onSelectSeat,
  onToggleReady,
  onChangeMode,
  onChangeSettings,
  onStartGame,
  onLeaveRoom,
}: RoomLobbyViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.')
  );

  // Generar enlace completo para compartir
  const shareUrl = `${window.location.origin}${window.location.pathname}?sala=${lobby.roomCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyCodeOnly = () => {
    navigator.clipboard.writeText(lobby.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const text = `¡Vení a jugar un Truco Criollo conmigo! Entrá con el código ${lobby.roomCode} o abrí este enlace: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const mySlot = lobby.slots.find((s) => s?.id === myPeerId);
  const totalSlots = lobby.slots.length;
  const occupiedCount = lobby.slots.filter(Boolean).length;
  const allOccupied = occupiedCount === totalSlots;
  const allReady = lobby.slots.every((s) => !s || s.isReady);
  const canStart = isHost && occupiedCount >= 2 && allReady;

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:py-6 flex flex-col gap-5">
      {/* Encabezado de la Sala y Enlace de Invitación */}
      <div className="bg-gradient-to-br from-[#24130a] to-[#170a04] border-2 border-amber-600/50 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/40">
                Sala de Amigos
              </span>
              <span className="text-xs text-amber-200/60">
                {lobby.mode === '1v1' ? 'Mano a Mano (2 jug.)' : lobby.mode === '2v2' ? 'En Parejas (4 jug.)' : 'En Tríos (6 jug.)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-amber-200 tracking-wide mt-1 drop-shadow">
              Código: <span className="text-amber-400 font-mono select-all">{lobby.roomCode}</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/70 font-body mt-0.5">
              Compartí el enlace con tus amigos para que se sienten a la mesa desde el celular o la computadora.
            </p>
          </div>

          {/* Botones de Compartir */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#3a1f11] hover:bg-[#4d2917] text-amber-200 font-display font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-amber-600/50 shadow-md transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
            </button>
            <button
              onClick={copyCodeOnly}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#251208] hover:bg-[#351a0c] text-amber-300 font-display font-bold text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-amber-700/50 shadow-md transition active:scale-95"
              title="Copiar únicamente el código de sala"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Código copiado' : 'Copiar código'}</span>
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-display font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-emerald-500/50 shadow-md transition active:scale-95"
              title="Compartir por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden xs:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Aviso amigable si se está probando en localhost con celular */}
        {isLocalhost && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/40 text-[11px] text-amber-200/80 font-body flex items-start gap-2">
            <span className="text-sm">💡</span>
            <p>
              <strong>¿Jugás con alguien en otra red o celular con datos (4G/5G)?</strong> Pasale el código <span className="text-amber-400 font-mono font-bold">{lobby.roomCode}</span> para que entre desde la web pública en producción (Vercel) o compartile el link directo. ¡El servidor de enlace TURN ahora conecta celulares y PCs sin importar la red!
            </p>
          </div>
        )}

        {/* Ajustes de Partida para el Host */}
        {isHost && (
          <div className="mt-4 pt-4 border-t border-amber-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-amber-400" />
              <span className="font-display font-bold text-amber-200">Ajustes del Anfitrión:</span>
            </div>

            {/* Selector de Modalidad */}
            <div className="flex items-center gap-1 bg-[#120803] p-1 rounded-xl border border-amber-900/60">
              {(['1v1', '2v2', '3v3'] as MultiplayerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onChangeMode(m)}
                  className={`px-3 py-1 rounded-lg font-display font-bold transition text-xs ${
                    lobby.mode === m
                      ? 'bg-amber-600 text-[#140a05] shadow'
                      : 'text-amber-200/60 hover:text-amber-200'
                  }`}
                >
                  {m === '1v1' ? '1 vs 1' : m === '2v2' ? '2 vs 2 (Parejas)' : '3 vs 3 (Tríos)'}
                </button>
              ))}
            </div>

            {/* Puntos y Flor */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-200">
                <input
                  type="checkbox"
                  checked={lobby.targetPoints === 30}
                  onChange={(e) => onChangeSettings(e.target.checked ? 30 : 15, lobby.withFlor)}
                  className="rounded border-amber-600 text-amber-600 focus:ring-0"
                />
                <span>A 30 Puntos (Buenas)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-200">
                <input
                  type="checkbox"
                  checked={lobby.withFlor}
                  onChange={(e) => onChangeSettings(lobby.targetPoints, e.target.checked)}
                  className="rounded border-amber-600 text-amber-600 focus:ring-0"
                />
                <span>Con Flor 🌸</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Disposición de la Mesa y Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Equipo Nosotros (Azul Celeste Criollo) */}
        <div className="bg-[#1c100a]/90 border-2 border-sky-600/40 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-800/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <h2 className="font-display font-black text-sky-200 text-lg tracking-wider">
                EQUIPO NOSOTROS
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/40">
              Asientos Pares
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {lobby.slots
              .map((slot, idx) => ({ slot, idx }))
              .filter(({ idx }) => idx % 2 === 0)
              .map(({ slot, idx }) => renderSeatCard(slot, idx, myPeerId, onSelectSeat))}
          </div>
        </div>

        {/* Equipo Ellos (Rojo Punzó Criollo) */}
        <div className="bg-[#1c100a]/90 border-2 border-rose-600/40 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-800/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <h2 className="font-display font-black text-rose-200 text-lg tracking-wider">
                EQUIPO ELLOS
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/40">
              Asientos Impares
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {lobby.slots
              .map((slot, idx) => ({ slot, idx }))
              .filter(({ idx }) => idx % 2 !== 0)
              .map(({ slot, idx }) => renderSeatCard(slot, idx, myPeerId, onSelectSeat))}
          </div>
        </div>
      </div>

      {/* Regla de Asientos del Truco */}
      <div className="bg-[#170a04]/80 border border-amber-900/50 rounded-xl p-3 text-xs text-amber-200/70 font-body flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong>Lógica tradicional de la mesa:</strong> Los jugadores se sientan intercalados (un rival a la izquierda y tu compañero enfrente). Hacé clic en cualquier asiento vacío para cambiarte de lugar o de equipo.
        </p>
      </div>

      {/* Barra de Acciones del Jugador */}
      <div className="bg-[#1c100a] border border-amber-700/50 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            className="text-xs font-display font-bold text-rose-300 hover:text-rose-100 hover:underline px-2 py-1"
          >
            Salir de la sala
          </button>
          <button
            onClick={onToggleReady}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border transition active:scale-95 ${
              mySlot?.isReady
                ? 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border-emerald-500'
                : 'bg-amber-900/40 hover:bg-amber-900/70 text-amber-200 border-amber-600/50'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{mySlot?.isReady ? '¡Estoy Listo!' : 'Marcarme como Listo'}</span>
          </button>
        </div>

        {/* Botón de Inicio para el Anfitrión */}
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-black text-sm tracking-wide shadow-xl transition active:scale-95 ${
              canStart
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-[#140a05] hover:brightness-110 shadow-amber-900/50 cursor-pointer border border-amber-300/60'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{allOccupied ? '¡REPARTIR Y JUGAR!' : `Faltan jugadores (${occupiedCount}/${totalSlots})`}</span>
          </button>
        ) : (
          <div className="text-xs text-amber-200/70 font-body italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Esperando que el anfitrión comience la partida...
          </div>
        )}
      </div>
    </div>
  );
}

function renderSeatCard(
  slot: PlayerSlot | null,
  seatIndex: number,
  myPeerId: string,
  onSelectSeat: (seatIndex: number) => void
) {
  const isMe = slot?.id === myPeerId;
  const isEven = seatIndex % 2 === 0;

  if (!slot) {
    return (
      <div
        key={seatIndex}
        onClick={() => onSelectSeat(seatIndex)}
        className="group border border-dashed border-amber-800/50 hover:border-amber-500/80 bg-[#140803]/40 hover:bg-[#251207]/70 rounded-xl p-3 flex items-center justify-between cursor-pointer transition select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-500/60 group-hover:text-amber-300 transition text-sm font-mono font-bold">
            #{seatIndex + 1}
          </div>
          <div>
            <span className="text-xs font-display font-semibold text-amber-200/50 group-hover:text-amber-200 transition">
              Asiento Vacío
            </span>
            <p className="text-[10px] text-amber-200/40">Hacé clic para sentarte acá</p>
          </div>
        </div>
        <ArrowRightLeft className="w-4 h-4 text-amber-500/40 group-hover:text-amber-400 transition" />
      </div>
    );
  }

  return (
    <div
      key={seatIndex}
      className={`border rounded-xl p-3 flex items-center justify-between shadow-md transition ${
        isMe
          ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/30'
          : isEven
          ? 'bg-sky-950/40 border-sky-800/50'
          : 'bg-rose-950/40 border-rose-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-600/40 flex items-center justify-center text-xl shadow">
          {slot.avatar || '🤠'}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-amber-100 text-sm">
              {slot.name}
            </span>
            {isMe && (
              <span className="text-[9px] bg-amber-500 text-[#140a05] font-black px-1.5 py-0.2 rounded font-mono">
                VOS
              </span>
            )}
            {slot.isHost && (
              <span className="text-[9px] bg-amber-900 text-amber-200 border border-amber-600/50 px-1.5 py-0.2 rounded font-mono flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 text-amber-400" /> Host
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-200/60 font-mono">
            Asiento #{seatIndex + 1} ({isEven ? 'Nosotros' : 'Ellos'})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full border ${
            slot.isReady
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600/60'
              : 'bg-amber-950/60 text-amber-400/70 border-amber-800/40'
          }`}
        >
          {slot.isReady ? 'Listo' : 'Esperando'}
        </span>
      </div>
    </div>
  );
}
