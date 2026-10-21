import { createDeck, shuffleDeck } from '../deck';
import { calculateEnvido } from '../envido';
import type { Card } from '../../types/truco';
import type {
  MultiplayerGameState,
  MultiplayerMode,
  PlayerSlot,
  TeamId,
  PlayedTableCard,
  MultiplayerTrickResult,
} from '../../types/multiplayer';

export class MultiplayerGameEngine {
  public state: MultiplayerGameState;

  constructor(
    roomCode: string,
    mode: MultiplayerMode,
    players: PlayerSlot[],
    targetPoints: 15 | 30 = 30,
    withFlor: boolean = true
  ) {
    this.state = {
      roomCode,
      mode,
      targetPoints,
      withFlor,
      players,
      pointsNosotros: 0,
      pointsEllos: 0,
      handNumber: 1,
      handStarterSeat: 0,
      currentTurnSeat: 0,
      handsBySeat: {},
      playedCards: [],
      tricks: [],
      trucoState: {
        level: 'none',
        pointsWon: 1,
        accepted: false,
      },
      envidoState: {
        history: [],
        accepted: false,
        resolved: false,
        pointsWon: 0,
        envidoValuesReported: {},
      },
      logs: [
        {
          id: 'log-start',
          text: `¡Comenzó la partida en la pulpería a ${targetPoints} puntos! Mano inicial: ${players[0]?.name || 'Jugador 1'}.`,
          type: 'info',
          timestamp: Date.now(),
        },
      ],
    };

    this.startNewHand();
  }

  /**
   * Reparte cartas e inicia una nueva mano
   */
  public startNewHand() {
    const deck = shuffleDeck(createDeck());
    const hands: Record<number, Card[]> = {};

    this.state.players.forEach((player, idx) => {
      hands[player.seatIndex] = deck.slice(idx * 3, (idx + 1) * 3);
    });

    this.state.handsBySeat = hands;
    this.state.playedCards = [];
    this.state.tricks = [];
    this.state.currentTurnSeat = this.state.handStarterSeat;

    this.state.trucoState = {
      level: 'none',
      pointsWon: 1,
      accepted: false,
    };

    this.state.envidoState = {
      history: [],
      accepted: false,
      resolved: false,
      pointsWon: 0,
      envidoValuesReported: {},
    };

    this.addLog(`Mano #${this.state.handNumber}: Repartidas las cartas. Le toca salir a ${this.getPlayerName(this.state.handStarterSeat)}.`, 'info');
  }

  /**
   * Jugar una carta de la mano
   */
  public playCard(seatIndex: number, cardId: string): boolean {
    if (this.state.currentTurnSeat !== seatIndex) return false;

    // Verificar si hay un canto de truco o envido pendiente de respuesta
    if (this.state.trucoState.waitingResponseFromTeam || this.state.envidoState.waitingResponseFromTeam) {
      return false; // Debe responderse primero el canto
    }

    const hand = this.state.handsBySeat[seatIndex];
    if (!hand) return false;

    const cardIndex = hand.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return false;

    const [card] = hand.splice(cardIndex, 1);
    const player = this.state.players.find((p) => p.seatIndex === seatIndex);
    if (!player) return false;

    const currentRound = this.state.tricks.length + 1;
    const playedCard: PlayedTableCard = {
      card,
      playedBySeat: seatIndex,
      playerName: player.name,
      team: player.team,
      round: currentRound,
    };

    this.state.playedCards.push(playedCard);
    this.addLog(`${player.name} jugó el ${card.name}`, 'play', player.name, player.team);

    // Verificar si todos los jugadores jugaron su carta en esta ronda
    const totalPlayers = this.state.players.length;
    const cardsInCurrentRound = this.state.playedCards.filter((c) => c.round === currentRound);

    if (cardsInCurrentRound.length === totalPlayers) {
      // Ronda completa: resolver ganador de la baza
      this.resolveTrick(currentRound, cardsInCurrentRound);
    } else {
      // Siguiente turno en sentido horario/antihorario
      this.advanceTurn();
    }

    return true;
  }

  /**
   * Resolver ganador de la baza (ronda 1, 2 o 3)
   */
  private resolveTrick(round: number, cards: PlayedTableCard[]) {
    let highestRank = -1;
    let winningTeam: TeamId | 'parda' = 'parda';
    let winningSeat = cards[0].playedBySeat;

    cards.forEach((pc) => {
      if (pc.card.trucoRank > highestRank) {
        highestRank = pc.card.trucoRank;
        winningTeam = pc.team;
        winningSeat = pc.playedBySeat;
      } else if (pc.card.trucoRank === highestRank) {
        if (pc.team !== winningTeam) {
          winningTeam = 'parda';
        }
      }
    });

    const trickResult: MultiplayerTrickResult = {
      round,
      cards,
      winnerTeam: winningTeam,
      winningSeat: winningTeam !== 'parda' ? winningSeat : undefined,
    };

    this.state.tricks.push(trickResult);

    if (winningTeam === 'parda') {
      this.addLog(`¡Baza ${round} PARDA (empate)!`, 'info');
      // En caso de parda, sale el mano de la baza anterior o el mano de la mano
      this.state.currentTurnSeat = this.state.handStarterSeat;
    } else {
      const winnerPlayer = this.state.players.find((p) => p.seatIndex === winningSeat);
      this.addLog(`Baza ${round} ganada por ${winnerPlayer?.name} (Equipo ${winningTeam === 'nosotros' ? 'Nosotros' : 'Ellos'})`, 'info', winnerPlayer?.name, winningTeam);
      this.state.currentTurnSeat = winningSeat; // Quien gana la baza sale en la siguiente
    }

    // Verificar si ya se definió el ganador del truco en la mano
    this.checkHandWinner();
  }

  /**
   * Evalúa si una mano ya tiene ganador según las bazas
   */
  private checkHandWinner() {
    const tricks = this.state.tricks;
    let nosotrosWins = 0;
    let ellosWins = 0;

    tricks.forEach((t) => {
      if (t.winnerTeam === 'nosotros') nosotrosWins++;
      if (t.winnerTeam === 'ellos') ellosWins++;
    });

    let handWinnerTeam: TeamId | null = null;

    if (nosotrosWins >= 2) handWinnerTeam = 'nosotros';
    else if (ellosWins >= 2) handWinnerTeam = 'ellos';
    else if (tricks.length === 3) {
      // 3 bazas jugadas
      if (nosotrosWins > ellosWins) handWinnerTeam = 'nosotros';
      else if (ellosWins > nosotrosWins) handWinnerTeam = 'ellos';
      else {
        // Empate en 3ra baza: gana quien ganó 1ra, o si todas pardas, gana el mano
        const first = tricks[0].winnerTeam;
        if (first !== 'parda') handWinnerTeam = first;
        else handWinnerTeam = this.getPlayerTeam(this.state.handStarterSeat);
      }
    } else if (tricks.length === 2 && tricks[0].winnerTeam === 'parda' && tricks[1].winnerTeam !== 'parda') {
      // Parda en 1ra, quien gana 2da gana el truco
      handWinnerTeam = tricks[1].winnerTeam;
    }

    if (handWinnerTeam) {
      this.finishHand(handWinnerTeam);
    }
  }

  /**
   * Finaliza la mano y suma los puntos
   */
  public finishHand(handWinnerTeam: TeamId, bySurrender: boolean = false) {
    // Resolver envido si no se cantó pero se jugó
    this.resolveEnvidoIfNeeded();

    const trucoPoints = this.state.trucoState.pointsWon || 1;
    if (handWinnerTeam === 'nosotros') {
      this.state.pointsNosotros += trucoPoints;
    } else {
      this.state.pointsEllos += trucoPoints;
    }

    this.addLog(
      `¡Mano finalizada! Equipo ${handWinnerTeam === 'nosotros' ? 'Nosotros' : 'Ellos'} se lleva ${trucoPoints} pts de Truco${bySurrender ? ' (por no querer / mazo)' : ''}.`,
      'info'
    );

    // Verificar si alguien ganó la partida
    if (this.state.pointsNosotros >= this.state.targetPoints) {
      this.state.winnerMatchTeam = 'nosotros';
      this.addLog('🏆 ¡VICTORIA FINAL! ¡Equipo Nosotros ha ganado la partida de Truco!', 'info');
      return;
    }
    if (this.state.pointsEllos >= this.state.targetPoints) {
      this.state.winnerMatchTeam = 'ellos';
      this.addLog('🏆 ¡VICTORIA FINAL! ¡Equipo Ellos ha ganado la partida de Truco!', 'info');
      return;
    }

    // Rotar la mano al siguiente jugador en la mesa
    const totalPlayers = this.state.players.length;
    this.state.handStarterSeat = (this.state.handStarterSeat + 1) % totalPlayers;
    this.state.handNumber += 1;

    // Iniciar siguiente mano tras breve pausa
    this.startNewHand();
  }

  /**
   * Cantos de Truco: Truco, Retruco, Vale Cuatro
   */
  public callTruco(seatIndex: number, chant: 'truco' | 'retruco' | 'vale_cuatro'): boolean {
    const player = this.state.players.find((p) => p.seatIndex === seatIndex);
    if (!player) return false;

    const opposingTeam: TeamId = player.team === 'nosotros' ? 'ellos' : 'nosotros';
    let pts = 2;
    if (chant === 'retruco') pts = 3;
    if (chant === 'vale_cuatro') pts = 4;

    this.state.trucoState.level = chant;
    this.state.trucoState.lastChanterSeat = seatIndex;
    this.state.trucoState.lastChanterTeam = player.team;
    this.state.trucoState.waitingResponseFromTeam = opposingTeam;
    this.state.trucoState.pointsWon = pts;

    const chantLabels: Record<string, string> = {
      truco: '¡¡TRUCO!!',
      retruco: '¡¡QUIERO RETRUCO!!',
      vale_cuatro: '¡¡VALE CUATRO, CARAJO!!',
    };

    this.addLog(`${player.name}: ${chantLabels[chant]}`, 'chant', player.name, player.team);
    return true;
  }

  /**
   * Responder a un canto de Truco (Quiero, No Quiero, o Subir la apuesta)
   */
  public respondTruco(seatIndex: number, response: 'quiero' | 'no_quiero' | 'subir', raiseChant?: 'retruco' | 'vale_cuatro'): boolean {
    const player = this.state.players.find((p) => p.seatIndex === seatIndex);
    if (!player || player.team !== this.state.trucoState.waitingResponseFromTeam) return false;

    if (response === 'quiero') {
      this.state.trucoState.accepted = true;
      this.state.trucoState.waitingResponseFromTeam = undefined;
      this.addLog(`${player.name}: ¡¡QUIERO!!`, 'chant', player.name, player.team);
      return true;
    }

    if (response === 'no_quiero') {
      // El equipo que cantó gana los puntos acumulados hasta antes del rechazo
      const winningTeam = this.state.trucoState.lastChanterTeam!;
      const currentLevel = this.state.trucoState.level;
      let pointsAwarded = 1;
      if (currentLevel === 'retruco') pointsAwarded = 2;
      if (currentLevel === 'vale_cuatro') pointsAwarded = 3;

      this.state.trucoState.pointsWon = pointsAwarded;
      this.addLog(`${player.name}: ¡No quiero!`, 'chant', player.name, player.team);
      this.finishHand(winningTeam, true);
      return true;
    }

    if (response === 'subir' && raiseChant) {
      return this.callTruco(seatIndex, raiseChant);
    }

    return false;
  }

  /**
   * Cantos de Envido: envido, real_envido, falta_envido
   */
  public callEnvido(seatIndex: number, chant: 'envido' | 'real_envido' | 'falta_envido'): boolean {
    const player = this.state.players.find((p) => p.seatIndex === seatIndex);
    if (!player) return false;

    const opposingTeam: TeamId = player.team === 'nosotros' ? 'ellos' : 'nosotros';
    this.state.envidoState.history.push(chant);
    this.state.envidoState.lastChanterSeat = seatIndex;
    this.state.envidoState.lastChanterTeam = player.team;
    this.state.envidoState.waitingResponseFromTeam = opposingTeam;

    const labels: Record<string, string> = {
      envido: '¡Envido!',
      real_envido: '¡Real Envido!',
      falta_envido: '¡Falta Envido!',
    };

    this.addLog(`${player.name}: ${labels[chant]}`, 'chant', player.name, player.team);
    return true;
  }

  /**
   * Responder a un canto de Envido
   */
  public respondEnvido(seatIndex: number, response: 'quiero' | 'no_quiero' | 'subir', raiseChant?: 'envido' | 'real_envido' | 'falta_envido'): boolean {
    const player = this.state.players.find((p) => p.seatIndex === seatIndex);
    if (!player || player.team !== this.state.envidoState.waitingResponseFromTeam) return false;

    if (response === 'quiero') {
      this.state.envidoState.accepted = true;
      this.state.envidoState.waitingResponseFromTeam = undefined;
      this.addLog(`${player.name}: ¡Quiero el envido!`, 'chant', player.name, player.team);
      this.resolveAcceptedEnvido();
      return true;
    }

    if (response === 'no_quiero') {
      const winningTeam = this.state.envidoState.lastChanterTeam!;
      const points = Math.max(1, this.calculateEnvidoRefusedPoints());
      if (winningTeam === 'nosotros') this.state.pointsNosotros += points;
      else this.state.pointsEllos += points;

      this.state.envidoState.resolved = true;
      this.state.envidoState.waitingResponseFromTeam = undefined;
      this.addLog(`${player.name}: ¡No quiero el envido! (+${points} pts para Equipo ${winningTeam === 'nosotros' ? 'Nosotros' : 'Ellos'})`, 'chant', player.name, player.team);
      return true;
    }

    if (response === 'subir' && raiseChant) {
      return this.callEnvido(seatIndex, raiseChant);
    }

    return false;
  }

  /**
   * Resuelve el Envido aceptado comparando los valores más altos de cada equipo
   */
  private resolveAcceptedEnvido() {
    let bestNosotros = -1;
    let bestNosotrosPlayer = '';
    let bestEllos = -1;
    let bestEllosPlayer = '';

    this.state.players.forEach((p) => {
      const hand = this.state.handsBySeat[p.seatIndex] || [];
      const score = calculateEnvido(hand).score;
      if (p.team === 'nosotros') {
        if (score > bestNosotros) {
          bestNosotros = score;
          bestNosotrosPlayer = p.name;
        }
      } else {
        if (score > bestEllos) {
          bestEllos = score;
          bestEllosPlayer = p.name;
        }
      }
    });

    let winningTeam: TeamId = 'nosotros';
    let winningPlayer = bestNosotrosPlayer;
    let winningScore = bestNosotros;

    if (bestNosotros > bestEllos) {
      winningTeam = 'nosotros';
      winningPlayer = bestNosotrosPlayer;
      winningScore = bestNosotros;
    } else if (bestEllos > bestNosotros) {
      winningTeam = 'ellos';
      winningPlayer = bestEllosPlayer;
      winningScore = bestEllos;
    } else {
      // Empate: gana el equipo que tiene al mano
      const handStarterTeam = this.getPlayerTeam(this.state.handStarterSeat);
      winningTeam = handStarterTeam;
      winningPlayer = handStarterTeam === 'nosotros' ? bestNosotrosPlayer : bestEllosPlayer;
      winningScore = bestNosotros;
    }

    const envidoPoints = this.calculateAcceptedEnvidoPoints();
    if (winningTeam === 'nosotros') this.state.pointsNosotros += envidoPoints;
    else this.state.pointsEllos += envidoPoints;

    this.state.envidoState.resolved = true;
    this.addLog(
      `Envido: ${bestNosotrosPlayer} cantó ${bestNosotros} vs ${bestEllosPlayer} con ${bestEllos}. Gana ${winningPlayer} con ${winningScore} (+${envidoPoints} pts para ${winningTeam === 'nosotros' ? 'Nosotros' : 'Ellos'}).`,
      'info'
    );
  }

  private calculateAcceptedEnvidoPoints(): number {
    const hist = this.state.envidoState.history;
    if (hist.includes('falta_envido')) {
      const target = this.state.targetPoints;
      const leading = Math.max(this.state.pointsNosotros, this.state.pointsEllos);
      return Math.max(1, target - leading);
    }
    let pts = 0;
    hist.forEach((ch) => {
      if (ch === 'envido') pts += 2;
      if (ch === 'real_envido') pts += 3;
    });
    return Math.max(2, pts);
  }

  private calculateEnvidoRefusedPoints(): number {
    const hist = this.state.envidoState.history;
    if (hist.length <= 1) return 1;
    let pts = 0;
    for (let i = 0; i < hist.length - 1; i++) {
      if (hist[i] === 'envido') pts += 2;
      if (hist[i] === 'real_envido') pts += 3;
    }
    return Math.max(1, pts);
  }

  private resolveEnvidoIfNeeded() {
    // Si no fue cantado, queda cerrado
    if (!this.state.envidoState.resolved) {
      this.state.envidoState.resolved = true;
    }
  }

  private advanceTurn() {
    const totalPlayers = this.state.players.length;
    this.state.currentTurnSeat = (this.state.currentTurnSeat + 1) % totalPlayers;
  }

  private getPlayerName(seatIndex: number): string {
    const p = this.state.players.find((pl) => pl.seatIndex === seatIndex);
    return p?.name || `Jugador ${seatIndex + 1}`;
  }

  private getPlayerTeam(seatIndex: number): TeamId {
    const p = this.state.players.find((pl) => pl.seatIndex === seatIndex);
    return p?.team || (seatIndex % 2 === 0 ? 'nosotros' : 'ellos');
  }

  public addLog(text: string, type: 'chant' | 'play' | 'info' | 'chat', senderName?: string, team?: TeamId) {
    this.state.logs.push({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text,
      senderName,
      team,
      type,
      timestamp: Date.now(),
    });
    if (this.state.logs.length > 50) {
      this.state.logs.shift();
    }
  }
}
