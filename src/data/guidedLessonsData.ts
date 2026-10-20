import type { Card } from '../types/truco';

export interface GuidedStepOption {
  id: string;
  label: string;
  card?: Card;
  actionType: 'play_card' | 'chant_envido' | 'chant_truco' | 'fold' | 'quiero' | 'no_quiero';
  isOptimal: boolean;
  donFacundoFeedback: {
    headline: string;
    explanation: string;
    badge: 'success' | 'warning' | 'tip';
  };
}

export interface GuidedScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  conceptBadge: string;
  roundInfo: {
    round: number; // 1, 2, 3
    isPlayerMano: boolean;
    tricksHistory?: {
      round: number;
      winner: 'player' | 'opponent' | 'parda';
      description: string;
    }[];
  };
  tableContext: {
    opponentCard?: Card;
    opponentActionText?: string;
  };
  playerCards: Card[];
  introDialogue: {
    facundoComment: string;
    question: string;
  };
  options: GuidedStepOption[];
  takeawayMessage: string;
}

export const GUIDED_SCENARIOS: GuidedScenario[] = [
  {
    id: 'matar-justo',
    title: '1. El Arte de Matar Justo',
    subtitle: 'Aprender a no malgastar cartas bravas cuando una carta media alcanza',
    icon: '🎯',
    conceptBadge: 'Economía de Cartas',
    roundInfo: {
      round: 1,
      isPlayerMano: false,
    },
    tableContext: {
      opponentCard: {
        id: '2-oro',
        number: 2,
        suit: 'oro',
        name: '2 de Oro',
        trucoRank: 9,
        envidoValue: 2,
      },
      opponentActionText: 'El rival abrió la primera ronda tirando el 2 de Oro.',
    },
    playerCards: [
      {
        id: '1-espada',
        number: 1,
        suit: 'espada',
        name: '1 de Espadas (Ancho de Espada)',
        trucoRank: 14,
        envidoValue: 1,
        isBrava: true,
      },
      {
        id: '3-copa',
        number: 3,
        suit: 'copa',
        name: '3 de Copa',
        trucoRank: 10,
        envidoValue: 3,
      },
      {
        id: '4-basto',
        number: 4,
        suit: 'basto',
        name: '4 de Basto',
        trucoRank: 1,
        envidoValue: 4,
      },
    ],
    introDialogue: {
      facundoComment: '¡Atención aparcero! El rival jugó primero y tiró un 2 de Oro sobre el paño. Mirá tus tres naipes: tenés la carta más poderosa de todo el juego (el Ancho de Espada), un 3 de Copa y una carta baja (4 de Basto).',
      question: '¿Qué carta te conviene jugar en esta primera mano?',
    },
    options: [
      {
        id: 'opt-3-copa',
        label: 'Jugar 3 de Copa',
        card: {
          id: '3-copa',
          number: 3,
          suit: 'copa',
          name: '3 de Copa',
          trucoRank: 10,
          envidoValue: 3,
        },
        actionType: 'play_card',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Jugada Maestra, compadre!',
          explanation: 'El 3 mata al 2 justo con lo necesario. Al ganar esta primera mano con tu 3, te guardás el Ancho de Espada (imbatible) intacto para definir la segunda o tercera mano con total tranquilidad.',
          badge: 'success',
        },
      },
      {
        id: 'opt-1-espada',
        label: 'Jugar 1 de Espadas',
        card: {
          id: '1-espada',
          number: 1,
          suit: 'espada',
          name: '1 de Espadas (Ancho de Espada)',
          trucoRank: 14,
          envidoValue: 1,
          isBrava: true,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: '¡No queme la brava, aparcero!',
          explanation: 'Si bien el Ancho de Espada mata al 2, es la carta más valiosa de toda la baraja. Gastarla contra un 2 es desperdiciarla por completo, cuando tu 3 de Copa ya alcanzaba de sobra. Si quemás la espada acá, en las próximas rondas te quedás sin poder de fuego.',
          badge: 'warning',
        },
      },
      {
        id: 'opt-4-basto',
        label: 'Jugar 4 de Basto',
        card: {
          id: '4-basto',
          number: 4,
          suit: 'basto',
          name: '4 de Basto',
          trucoRank: 1,
          envidoValue: 4,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: 'Regalo innecesario',
          explanation: 'El 4 de Basto es la peor carta y pierde contra el 2. En el truco la primera mano es fundamental: regalársela al rival teniendo un 3 en la mano es darle toda la ventaja táctica de gusto.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: Siempre matá con la carta más baja que sea suficiente. Guardá tus cartas bravas para las rondas definitorias.',
  },

  {
    id: 'descarte-salvador',
    title: '2. El Descarte Inteligente',
    subtitle: 'Qué hacer cuando el rival tira una carta invencible para tu mano',
    icon: '🛡️',
    conceptBadge: 'Gestión de Derrota',
    roundInfo: {
      round: 1,
      isPlayerMano: false,
    },
    tableContext: {
      opponentCard: {
        id: '1-basto',
        number: 1,
        suit: 'basto',
        name: '1 de Bastos (Ancho de Basto)',
        trucoRank: 13,
        envidoValue: 1,
        isBrava: true,
      },
      opponentActionText: 'El rival abrió tirando con fuerza el Ancho de Basto (2da mejor carta del juego).',
    },
    playerCards: [
      {
        id: '7-copa',
        number: 7,
        suit: 'copa',
        name: '7 de Copa (7 Falso)',
        trucoRank: 4,
        envidoValue: 7,
      },
      {
        id: '11-espada',
        number: 11,
        suit: 'espada',
        name: '11 de Espadas (Caballo)',
        trucoRank: 6,
        envidoValue: 0,
      },
      {
        id: '4-oro',
        number: 4,
        suit: 'oro',
        name: '4 de Oro',
        trucoRank: 1,
        envidoValue: 4,
      },
    ],
    introDialogue: {
      facundoComment: '¡Mandinga! El rival abrió con el Ancho de Basto. Mirá tus naipes: no tenés el Ancho de Espada para matarlo. Ninguna de tus cartas puede superar a ese As.',
      question: 'Sabiendo que esta primera mano está perdida, ¿qué naipe debés tirar?',
    },
    options: [
      {
        id: 'opt-4-oro',
        label: 'Tirar 4 de Oro (Descarte)',
        card: {
          id: '4-oro',
          number: 4,
          suit: 'oro',
          name: '4 de Oro',
          trucoRank: 1,
          envidoValue: 4,
        },
        actionType: 'play_card',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Excelente lectura criolla!',
          explanation: 'Como la mano está perdida sí o sí, te deshacés de tu carta más insignificante (el 4). Así conservás tu Caballo (11) y tu 7 para pelear la segunda y tercera mano, obligando al rival a ganarte con naipes superiores.',
          badge: 'success',
        },
      },
      {
        id: 'opt-11-espada',
        label: 'Tirar 11 de Espadas',
        card: {
          id: '11-espada',
          number: 11,
          suit: 'espada',
          name: '11 de Espadas (Caballo)',
          trucoRank: 6,
          envidoValue: 0,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: '¡No tire su mejor naipe a la basura!',
          explanation: 'El 11 de Espadas no le gana al Ancho de Basto. Si tirás el 11 acá, perdés la primera mano y encima te quedás sin tu carta más alta para las manos siguientes.',
          badge: 'warning',
        },
      },
      {
        id: 'opt-7-copa',
        label: 'Tirar 7 de Copa',
        card: {
          id: '7-copa',
          number: 7,
          suit: 'copa',
          name: '7 de Copa (7 Falso)',
          trucoRank: 4,
          envidoValue: 7,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: 'Descarte subóptimo',
          explanation: 'Aunque es un 7 falso, sigue teniendo más valor que el 4 de Oro. Entre dos cartas perdedoras, siempre descartá la de menor valor absoluto (el 4).',
          badge: 'tip',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: Si una mano está matemáticamente perdida, jamás quemes cartas medianas. Descartate siempre con tu peor carta.',
  },

  {
    id: 'parda-primera',
    title: '3. Parda en Primera y Definición en Segunda',
    subtitle: 'Qué hacer cuando empatan la primera ronda',
    icon: '⚡',
    conceptBadge: 'Ley de Pardas',
    roundInfo: {
      round: 2,
      isPlayerMano: true,
      tricksHistory: [
        {
          round: 1,
          winner: 'parda',
          description: '1ra Mano: Vos tiraste un 3 de Basto y el rival tiró un 3 de Copa. ¡PARDA!',
        },
      ],
    },
    tableContext: {
      opponentActionText: 'Hubo PARDA en la primera mano (3 contra 3). Te toca salir a vos en la segunda mano.',
    },
    playerCards: [
      {
        id: '7-espada',
        number: 7,
        suit: 'espada',
        name: '7 de Espadas (Siete Bravo)',
        trucoRank: 12,
        envidoValue: 7,
        isBrava: true,
      },
      {
        id: '5-copa',
        number: 5,
        suit: 'copa',
        name: '5 de Copa',
        trucoRank: 2,
        envidoValue: 5,
      },
    ],
    introDialogue: {
      facundoComment: '¡Oído al charango! En la primera mano tiraron dos 3 y hubo PARDA. La regla sagrada del truco dice: "Parda en primera, quien gana la segunda gana todo el truco". Te toca salir a vos.',
      question: '¿Con qué carta salís en esta segunda mano definitoria?',
    },
    options: [
      {
        id: 'opt-7-espada',
        label: 'Tirar 7 de Espadas (Bravo)',
        card: {
          id: '7-espada',
          number: 7,
          suit: 'espada',
          name: '7 de Espadas (Siete Bravo)',
          trucoRank: 12,
          envidoValue: 7,
          isBrava: true,
        },
        actionType: 'play_card',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Golpe certero a la mesa!',
          explanation: '¡Exacto! Al haber parda en primera, no va a haber tercera mano si alguien gana esta. Tirar el 7 Bravo (3ra carta más fuerte de todo el juego) liquida el partido en el acto. ¡Te llevás el truco!',
          badge: 'success',
        },
      },
      {
        id: 'opt-5-copa',
        label: 'Tirar 5 de Copa',
        card: {
          id: '5-copa',
          number: 5,
          suit: 'copa',
          name: '5 de Copa',
          trucoRank: 2,
          envidoValue: 5,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: '¡Pecado mortal en el truco!',
          explanation: 'Guardarse el 7 en parda en primera es un suicidio. Si tirás el 5, el rival te tira cualquier figura o carta media, gana la segunda y te gana el truco completo en la cara sin que hayas podido usar tu 7.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: Si hubo parda en primera, la segunda mano es la FINAL. Poné toda la carne al asador.',
  },

  {
    id: 'envido-antes-de-tirar',
    title: '4. El Secreto del Envido (El Momento Justo)',
    subtitle: 'Por qué nunca debés tirar carta sin antes cantar tus tantos',
    icon: '🔥',
    conceptBadge: 'Reglamento y Oportunidad',
    roundInfo: {
      round: 1,
      isPlayerMano: true,
    },
    tableContext: {
      opponentActionText: 'Recién empieza la partida. Vos sos MANO. El paño está limpio.',
    },
    playerCards: [
      {
        id: '7-espada',
        number: 7,
        suit: 'espada',
        name: '7 de Espadas',
        trucoRank: 12,
        envidoValue: 7,
        isBrava: true,
      },
      {
        id: '6-espada',
        number: 6,
        suit: 'espada',
        name: '6 de Espadas',
        trucoRank: 3,
        envidoValue: 6,
      },
      {
        id: '2-oro',
        number: 2,
        suit: 'oro',
        name: '2 de Oro',
        trucoRank: 9,
        envidoValue: 2,
      },
    ],
    introDialogue: {
      facundoComment: '¡Mire esas cartas, aparcero! Tiene el 7 y el 6 del mismo palo (Espadas). ¡7 + 6 + 20 = 33 tantos de envido! Es el puntaje más alto posible en el truco tradicional.',
      question: 'Sos MANO: ¿Qué es lo PRIMERO que debés hacer?',
    },
    options: [
      {
        id: 'opt-cantar-envido',
        label: 'Cantar "¡Envido!" o "¡Real Envido!"',
        actionType: 'chant_envido',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Así se juega al truco!',
          explanation: '¡Correcto! El envido se debe cantar OBLIGATORIAMENTE antes de jugar la carta. Con 33 puntos ganás contra cualquier combinación del rival (incluso si él tiene 33, ganás vos por ser MANO). ¡Puntos seguros!',
          badge: 'success',
        },
      },
      {
        id: 'opt-tirar-carta-directo',
        label: 'Tirar el 2 de Oro directamente',
        card: {
          id: '2-oro',
          number: 2,
          suit: 'oro',
          name: '2 de Oro',
          trucoRank: 9,
          envidoValue: 2,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: '¡Error garrafal! Perdiste los 33 tantos',
          explanation: 'Si tirás tu carta antes de cantar el envido, ¡se considera jugada y perdés el derecho de cantar envido! Tirar la carta sin cantar es regalarle 2 o 3 puntos al rival por distracción.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: El envido se canta siempre ANTES de jugar carta en primera mano. Si tirás la carta, el envido se pierde.',
  },

  {
    id: 'salir-de-mano-primera',
    title: '5. Salir de Mano: La Carta de Apertura',
    subtitle: 'Cómo empezar cuando tenés cartas bravas y cartas medias',
    icon: '🤠',
    conceptBadge: 'Estrategia de Apertura',
    roundInfo: {
      round: 1,
      isPlayerMano: true,
    },
    tableContext: {
      opponentActionText: 'Sos MANO en primera ronda. Tenés que iniciar el juego.',
    },
    playerCards: [
      {
        id: '1-basto',
        number: 1,
        suit: 'basto',
        name: '1 de Bastos (Ancho de Basto)',
        trucoRank: 13,
        envidoValue: 1,
        isBrava: true,
      },
      {
        id: '2-oro',
        number: 2,
        suit: 'oro',
        name: '2 de Oro',
        trucoRank: 9,
        envidoValue: 2,
      },
      {
        id: '5-copa',
        number: 5,
        suit: 'copa',
        name: '5 de Copa',
        trucoRank: 2,
        envidoValue: 5,
      },
    ],
    introDialogue: {
      facundoComment: 'Sos Mano. Tenés una carta brava tremenda (1 de Basto), una carta media-alta muy buena (2 de Oro) y una baja (5 de Copa). No hay envido.',
      question: '¿Con qué carta abrís el juego en primera mano?',
    },
    options: [
      {
        id: 'opt-2-oro',
        label: 'Salir con el 2 de Oro',
        card: {
          id: '2-oro',
          number: 2,
          suit: 'oro',
          name: '2 de Oro',
          trucoRank: 9,
          envidoValue: 2,
        },
        actionType: 'play_card',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Apertura perfecta!',
          explanation: 'El 2 de Oro es ideal: si el rival tiene cartas bajas o figuras (10, 11, 12), le ganás la primera con el 2 sin gastar tu As. Y si el rival quiere ganarte la primera, se ve OBLIGADO a quemar un 3 o una brava. En cualquiera de los dos casos, tu 1 de Basto queda de guardián para rematar.',
          badge: 'success',
        },
      },
      {
        id: 'opt-1-basto',
        label: 'Salir de entrada con el 1 de Bastos',
        card: {
          id: '1-basto',
          number: 1,
          suit: 'basto',
          name: '1 de Bastos (Ancho de Basto)',
          trucoRank: 13,
          envidoValue: 1,
          isBrava: true,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: 'Demasiado previsible',
          explanation: 'Tirar el As de primera muestra tus cartas al instante. El rival simplemente te entregará un 4 y guardará sus cartas para matarte tu 2 y tu 5 después. La sorpresa vale oro en el truco.',
          badge: 'tip',
        },
      },
      {
        id: 'opt-5-copa',
        label: 'Salir con el 5 de Copa',
        card: {
          id: '5-copa',
          number: 5,
          suit: 'copa',
          name: '5 de Copa',
          trucoRank: 2,
          envidoValue: 5,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: 'Regalo innecesario',
          explanation: 'Tirar el 5 le permite al rival ganar la primera mano con cualquier figura barata o un 6. Habiendo un 2 en la mano, no conviene ceder la iniciativa.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: Las cartas medias (2 y 3) son excelentes para abrir: fuerzan al rival a quemar una brava o te aseguran la primera mano.',
  },

  {
    id: 'el-bluff-truco',
    title: '6. El Arte de la Mentira (El Bluff Criollo)',
    subtitle: 'Cómo ganar puntos cantando Truco cuando no te queda nada',
    icon: '🎭',
    conceptBadge: 'Psicología y Picardía',
    roundInfo: {
      round: 3,
      isPlayerMano: false,
      tricksHistory: [
        { round: 1, winner: 'player', description: '1ra Mano: Vos ganaste con un 3.' },
        { round: 2, winner: 'opponent', description: '2da Mano: El rival ganó con un Rey (12).' },
      ],
    },
    tableContext: {
      opponentActionText: 'Ronda 3 definitoria. Están 1 a 1. El rival está dudando.',
    },
    playerCards: [
      {
        id: '4-copa',
        number: 4,
        suit: 'copa',
        name: '4 de Copa',
        trucoRank: 1,
        envidoValue: 4,
      },
    ],
    introDialogue: {
      facundoComment: '¡Momento culminante! Ganaste la 1ra mano y el rival la 2da. Te queda UNA sola carta en la mano: ¡el 4 de Copa (la peor de todas)! Si tirás el 4 manso a la mesa, perdés contra cualquier carta del rival.',
      question: '¿Qué hacés antes de tirar ese pobre 4?',
    },
    options: [
      {
        id: 'opt-cantar-truco-bluff',
        label: 'Gritar fuerte: "¡¡TRUCO!!" 💥',
        actionType: 'chant_truco',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Viva la picardía criolla!',
          explanation: '¡Brillante! Como vos ganaste la 1ra mano, el rival piensa que tenés un As o un 7 bravo escondido para definir. Al gritarle TRUCO con firmeza, lo ponés entre la espada y la pared: si tiene una carta dudosa, dirá "No quiero" y ¡te llevás el punto sin tener nada!',
          badge: 'success',
        },
      },
      {
        id: 'opt-tirar-cuatro-manso',
        label: 'Tirar el 4 de Copa sin cantar nada',
        card: {
          id: '4-copa',
          number: 4,
          suit: 'copa',
          name: '4 de Copa',
          trucoRank: 1,
          envidoValue: 4,
        },
        actionType: 'play_card',
        isOptimal: false,
        donFacundoFeedback: {
          headline: 'Derrota asegurada',
          explanation: 'Si tirás el 4 sin cantar, el rival hasta con un 5 o un 6 te gana la mano y se lleva el truco. En el truco el que no arriesga, muere manso.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: Si perdiste la ventaja de cartas pero ganaste la primera mano, mentir el Truco puede robarte una mano que estaba perdida.',
  },

  {
    id: 'irse-al-mazo-criterio',
    title: '7. Cuándo Irse al Mazo con Dignidad',
    subtitle: 'El arte de perder 1 punto en vez de regalar 2 o 3',
    icon: '🏳️',
    conceptBadge: 'Control de Daños',
    roundInfo: {
      round: 2,
      isPlayerMano: false,
      tricksHistory: [
        { round: 1, winner: 'opponent', description: '1ra Mano: El rival te ganó con un 2 frente a tu 5.' },
      ],
    },
    tableContext: {
      opponentActionText: 'El rival ganó la primera mano y te canta: "¡¡TRUCO!!" con una sonrisa sobradora.',
    },
    playerCards: [
      {
        id: '4-espada',
        number: 4,
        suit: 'espada',
        name: '4 de Espada',
        trucoRank: 1,
        envidoValue: 4,
      },
      {
        id: '5-basto',
        number: 5,
        suit: 'basto',
        name: '5 de Basto',
        trucoRank: 2,
        envidoValue: 5,
      },
    ],
    introDialogue: {
      facundoComment: 'Perdiste la 1ra mano. Tus únicas dos cartas restantes son un 4 y un 5 (las más bajas de la baraja). El rival huele sangre y te canta "¡TRUCO!".',
      question: '¿Qué respondés ante este canto de Truco?',
    },
    options: [
      {
        id: 'opt-no-quiero-mazo',
        label: 'Decir "No quiero" (Irse al mazo)',
        actionType: 'no_quiero',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Cabeza fría y oficio!',
          explanation: '¡Muy bien! Tus cartas son paupérrimas y ya perdiste la primera. Si decís "Quiero", le regalás 2 puntos al rival en bandeja. Diciendo "No quiero" entregás solo 1 punto y guardás la cabeza para la próxima mano.',
          badge: 'success',
        },
      },
      {
        id: 'opt-quiero-por-orgullo',
        label: 'Decir "¡Quiero!" a ver qué pasa',
        actionType: 'quiero',
        isOptimal: false,
        donFacundoFeedback: {
          headline: '¡No sea terco, aparcero!',
          explanation: 'Tus cartas son un 4 y un 5 y el rival ya ganó primera. ¿Con qué pensabas ganarle? El truco no es juego de orgullo: regalar 2 puntos cuando podías perder 1 solo es una pésima jugada.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: Saber retirarse a tiempo con "No quiero" es lo que separa a los buenos jugadores de los que pierden partidos rápido.',
  },

  {
    id: 'empate-tanteo-mano',
    title: '8. El Poder de la Mano en el Envido',
    subtitle: 'Por qué tener 29 siendo Mano es mejor que tener 31 siendo Pie',
    icon: '⚖️',
    conceptBadge: 'Ventaja de Posición',
    roundInfo: {
      round: 1,
      isPlayerMano: true,
    },
    tableContext: {
      opponentActionText: 'El rival te cantó "¡Envido!". Vos sos MANO.',
    },
    playerCards: [
      {
        id: '6-oro',
        number: 6,
        suit: 'oro',
        name: '6 de Oro',
        trucoRank: 3,
        envidoValue: 6,
      },
      {
        id: '3-oro',
        number: 3,
        suit: 'oro',
        name: '3 de Oro',
        trucoRank: 10,
        envidoValue: 3,
      },
      {
        id: '1-copa',
        number: 1,
        suit: 'copa',
        name: '1 de Copa',
        trucoRank: 8,
        envidoValue: 1,
      },
    ],
    introDialogue: {
      facundoComment: 'Tenés 29 tantos de Oro (6 + 3 + 20). El rival te canta "¡Envido!". Recordá un detalle crucial: ¡VOS SOS LA MANO!',
      question: '¿Aceptás el envido con 29 siendo mano?',
    },
    options: [
      {
        id: 'opt-quiero-envido-mano',
        label: '¡Quiero!',
        actionType: 'quiero',
        isOptimal: true,
        donFacundoFeedback: {
          headline: '¡Firme como rulo de estatua!',
          explanation: '¡Exacto! 29 es un muy buen envido, pero si encima sos MANO, tenés ventaja absoluta: si el rival también tiene 29, ¡GANÁS VOS automáticamente! No hay dudas: se dice Quiero.',
          badge: 'success',
        },
      },
      {
        id: 'opt-no-quiero-envido',
        label: 'No quiero',
        actionType: 'no_quiero',
        isOptimal: false,
        donFacundoFeedback: {
          headline: 'Demasiado timorato',
          explanation: 'Con 29 y siendo mano no podés achicarte. En el truco 29 de mano gana más del 75% de los duelos de envido. Entregar el punto acá es regalar el tanto.',
          badge: 'warning',
        },
      },
    ],
    takeawayMessage: 'REGLA DE ORO: En el envido, "Mano canta y Mano gana". En empate de tantos, la Mano se lleva todos los puntos.',
  },
];
