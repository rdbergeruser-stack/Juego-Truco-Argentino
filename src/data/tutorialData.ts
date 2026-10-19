import type { Card } from '../types/truco';

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  options: string[];
  correctOptionIndex: number;
  cardsShown?: Card[];
}

export interface TutorialModule {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  theory: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
    alert?: {
      type: 'tip' | 'warning' | 'important';
      text: string;
    };
  }[];
  interactiveChallenge: {
    type: 'card-compare' | 'envido-calc' | 'parda-quiz' | 'truco-decision';
    title: string;
    instructions: string;
    quizzes: QuizQuestion[];
  };
}

export const TUTORIAL_MODULES: TutorialModule[] = [
  {
    id: 'jerarquia',
    title: '1. Baraja y Jerarquía de Cartas',
    shortDesc: 'Conocé las 40 cartas y cuáles son las cartas más fuertes que deciden el partido.',
    icon: '👑',
    theory: [
      {
        heading: 'El Mazo de Truco (40 cartas)',
        paragraphs: [
          'El Truco Argentino se juega con la baraja española de 40 naipes: Espadas, Bastos, Oros y Copas. No se usan los 8 ni los 9.',
          'Cada carta tiene un rango de poder fijo del 14 (la más fuerte) al 1 (la más baja). La carta más alta SIEMPRE mata a la de menor jerarquía.',
        ],
      },
      {
        heading: 'Las 4 Cartas Bravas (Las que mandan)',
        paragraphs: [
          'En el Truco, no todos los Ases ni todos los Sietes valen lo mismo. Hay 4 cartas legendarias que están en la cima absoluta:',
        ],
        bulletPoints: [
          '🥇 1 de Espadas (Ancho de Espada o Macho): La carta más poderosa del juego. No hay ninguna que le gane.',
          '🥈 1 de Bastos (Ancho de Basto o Hembra): La segunda más poderosa.',
          '🥉 7 de Espadas (Siete Bravo o Espadilla): La tercera en rango.',
          '🏅 7 de Oro (El Velo o Siete de Oro): La cuarta carta brava.',
        ],
        alert: {
          type: 'important',
          text: '¡Cuidado con los falsos! El 1 de Copa y el 1 de Oro (Ases falsos) y el 7 de Copa y 7 de Basto (Sietes falsos) tienen mucho menos valor que los bravos.',
        },
      },
      {
        heading: 'La Escala Completa de Mayor a Menor',
        paragraphs: [
          '1° Ancho de Espada > 2° Ancho de Basto > 3° 7 de Espada > 4° 7 de Oro > 5° Los 3 > 6° Los 2 > 7° 1 de Copa/Oro > 8° Los 12 (Reyes) > 9° Los 11 (Caballos) > 10° Los 10 (Sotas) > 11° 7 de Copa/Basto > 12° Los 6 > 13° Los 5 > 14° Los 4 (la carta más baja).',
        ],
      },
    ],
    interactiveChallenge: {
      type: 'card-compare',
      title: 'Desafío de Jerarquía',
      instructions: 'Poné a prueba tu conocimiento de qué carta mata a cuál en el mano a mano.',
      quizzes: [
        {
          id: 'j-1',
          question: '¿Cuál de estas cartas gana el punto en la mesa?',
          explanation: 'El 3 (puesto 5 en la jerarquía) mata al Rey de Espadas (los 12 están en el puesto 8).',
          options: ['3 de Copa', '12 de Espadas (Rey)', 'Empatan'],
          correctOptionIndex: 0,
        },
        {
          id: 'j-2',
          question: '¿Qué carta es superior en Truco?',
          explanation: 'El 1 de Basto es la 2da carta más fuerte de todo el juego. El 1 de Oro es un "As falso" y está muy por debajo.',
          options: ['1 de Oro (As de Oro)', '1 de Basto (Ancho de Basto)', 'Valen lo mismo por ser 1'],
          correctOptionIndex: 1,
        },
        {
          id: 'j-3',
          question: 'Si se enfrentan el 7 de Espadas y el 7 de Bastos, ¿quién gana?',
          explanation: 'El 7 de Espadas es "bravo" (3ra carta más alta). El 7 de Bastos es un 7 "falso" que sólo le gana al 6, 5 y 4.',
          options: ['7 de Espadas', '7 de Bastos', 'Empatan por ser ambos 7'],
          correctOptionIndex: 0,
        },
      ],
    },
  },
  {
    id: 'envido',
    title: '2. El Envido y el Tanteo',
    shortDesc: 'Aprendé a calcular los tantos, el valor de las figuras y cómo ganar la apuesta inicial.',
    icon: '🔥',
    theory: [
      {
        heading: '¿Cómo se calcula el Envido?',
        paragraphs: [
          'El envido se juega comparando los "tantos" de las cartas que tenés en mano.',
          'Si tenés 2 o 3 cartas del MISMO PALO: sumás sus valores más 20 puntos de bonificación.',
          'Las figuras (10, 11 y 12) valen 0 puntos para el envido. Las cartas del 1 al 7 valen su número.',
        ],
        bulletPoints: [
          'Ejemplo 1: 7 de Espadas y 6 de Espadas = 7 + 6 + 20 = ¡33 tantos! (el máximo posible en Truco tradicional).',
          'Ejemplo 2: 5 de Copa y 11 de Copa = 5 + 0 + 20 = 25 tantos.',
          'Ejemplo 3: 1 de Oro, 12 de Oro y 6 de Oro = tomás las 2 mejores (6 y 1) + 20 = 27 tantos.',
        ],
      },
      {
        heading: '¿Y si son todas de distinto palo?',
        paragraphs: [
          'Si no tenés ninguna del mismo palo, tu envido es simplemente el valor de tu carta individual más alta (figuras valen 0).',
          'Por ejemplo, con 4 de Espadas, 12 de Copas y 2 de Oro, tu envido es 4.',
        ],
      },
      {
        heading: 'Escala de Cantos y la Regla de Oro',
        paragraphs: [
          'El envido se canta en la primera mano antes de jugar la segunda carta o antes de cantar el Truco.',
          'Cantos: Envido (2 pts), Real Envido (+3 pts), Falta Envido (los puntos necesarios para ganar el partido).',
        ],
        alert: {
          type: 'tip',
          text: 'REGLA DE ORO: ¡En caso de empate en tantos, SIEMPRE GANA EL JUGADOR QUE ES MANO! Tener 31 siendo pie puede perder contra 31 de la mano.',
        },
      },
    ],
    interactiveChallenge: {
      type: 'envido-calc',
      title: 'Taller de Cálculo de Tantos',
      instructions: 'Calculá correctamente los tantos de cada mano.',
      quizzes: [
        {
          id: 'e-1',
          question: 'Tenés: 6 de Espadas, 7 de Espadas y 10 de Oro. ¿Cuántos tantos de envido tenés?',
          explanation: 'Tenés dos de Espadas: 6 + 7 = 13 + 20 = 33 tantos. ¡Puntaje máximo!',
          options: ['23 tantos', '33 tantos', '13 tantos', '20 tantos'],
          correctOptionIndex: 1,
        },
        {
          id: 'e-2',
          question: 'Tenés: 11 de Basto (Caballo), 12 de Basto (Rey) y 5 de Copa. ¿Cuántos tantos tenés?',
          explanation: 'Tenés dos de Basto: 11 y 12 valen 0. Entonces: 0 + 0 + 20 = 20 tantos.',
          options: ['0 tantos', '5 tantos', '20 tantos', '23 tantos'],
          correctOptionIndex: 2,
        },
        {
          id: 'e-3',
          question: 'Ambos jugadores tienen 30 de envido. Vos sos PIE y la computadora es MANO. ¿Quién gana el envido?',
          explanation: 'En empate de tantos, la regla absoluta del truco es que siempre gana quien sea MANO.',
          options: ['Vos por haber cantado primero', 'La computadora por ser MANO', 'Se dividen los puntos'],
          correctOptionIndex: 1,
        },
      ],
    },
  },
  {
    id: 'pardas',
    title: '3. Desarrollo de la Mano y Pardas',
    shortDesc: 'Las 3 rondas del truco, la importancia de la primera mano y cómo resolver empates.',
    icon: '⚔️',
    theory: [
      {
        heading: 'Las Tres Manos',
        paragraphs: [
          'Una mano de Truco consta de hasta 3 rondas (primera, segunda y tercera).',
          'Cada jugador tira 1 carta por ronda. Quien tira la carta más alta gana esa ronda.',
          'El jugador que gana 2 de las 3 rondas se lleva los puntos del truco.',
        ],
      },
      {
        heading: 'La Ley de las Pardas (Empates)',
        paragraphs: [
          'Cuando dos cartas de igual jerarquía se enfrentan (por ejemplo un 3 contra otro 3), la ronda se declara PARDA (empatada).',
        ],
        bulletPoints: [
          'Parda en Primera: Se define todo en la segunda mano. ¡Quien gane la 2da gana la mano completa!',
          'Parda en Segunda: Si ganaste la primera mano y en la segunda hay empate, ¡ganás automáticamente vos! ("Primera gana").',
          'Parda en Tercera: Si cada uno ganó una ronda y en la tercera empatan, gana quien haya ganado la primera ronda.',
          'Triple Parda: Si las 3 rondas empatan, gana el jugador que es MANO.',
        ],
        alert: {
          type: 'important',
          text: 'Por eso se dice que "Primera gana": asegurar la primera mano te da casi garantizada la victoria en cualquier empate posterior.',
        },
      },
    ],
    interactiveChallenge: {
      type: 'parda-quiz',
      title: 'Desafío de Escenarios y Pardas',
      instructions: 'Determiná quién gana según lo ocurrido en las rondas.',
      quizzes: [
        {
          id: 'p-1',
          question: 'En la 1ra ronda empatan (parda con dos 3). En la 2da ronda vos tirás un 2 y el rival un 1 falso. ¿Quién gana el truco?',
          explanation: 'Al haber parda en primera, la 2da mano decide todo. Tu 2 mata al 1 falso del rival, por lo que ganás la mano completa.',
          options: ['Ganás vos la mano completa', 'Se debe jugar la tercera ronda', 'Gana el que sea mano'],
          correctOptionIndex: 0,
        },
        {
          id: 'p-2',
          question: 'Vos ganás la primera ronda. En la segunda ronda ambos tiran un Rey (12) y empatan. ¿Qué ocurre?',
          explanation: 'Parda en segunda mano: el jugador que ganó la primera mano gana automáticamente el truco. No hace falta jugar la tercera.',
          options: ['Se juega la 3ra mano', 'Ganás vos inmediatamente', 'Gana el rival'],
          correctOptionIndex: 1,
        },
      ],
    },
  },
  {
    id: 'truco',
    title: '4. El Canto del Truco y la Mentira',
    shortDesc: 'Truco, Re-truco, Vale Cuatro, el arte de engañar y cuándo conviene irse al mazo.',
    icon: '🎭',
    theory: [
      {
        heading: 'La Escalera del Truco',
        paragraphs: [
          'El truco es la apuesta principal por las 3 rondas de cartas. Se puede cantar en cualquier momento de tu turno:',
        ],
        bulletPoints: [
          'TRUCO: Vale 2 puntos si se acepta. Si el rival dice "No quiero", ganás 1 punto.',
          'RE-TRUCO: Sube a 3 puntos si se acepta. Si el rival dice "No quiero", ganás 2 puntos.',
          'VALE CUATRO: Sube a 4 puntos. Si no quieren, ganás 3 puntos.',
        ],
      },
      {
        heading: 'El Arte del Engaño (El "Bluff")',
        paragraphs: [
          'No siempre tenés cartas buenas. En el truco argentino, fingir seguridad y cantar Truco con cartas malas puede hacer que tu rival se asuste y diga "No quiero".',
          'Sin embargo, si tu rival te canta truco y tus cartas son pésimas, decir "No quiero" o "Irse al mazo" es la jugada inteligente para no regalar puntos de más.',
        ],
        alert: {
          type: 'tip',
          text: 'Regla criolla: Si vas perdiendo feo en la mano y te cantan truco, no arriesgues 2 puntos por orgullo. Aceptá el no quiero y esperá un reparto mejor.',
        },
      },
    ],
    interactiveChallenge: {
      type: 'truco-decision',
      title: 'Decisiones Tácticas de Truco',
      instructions: 'Elegí la mejor decisión estratégica.',
      quizzes: [
        {
          id: 't-1',
          question: 'Ganaste la primera ronda con un 3. Te queda un Ancho de Basto en la mano. El rival te canta "¡TRUCO!". ¿Qué hacés?',
          explanation: '¡Tenés la primera ganada y el 1 de Basto (imbatible salvo por la espada)! Debés decir "¡Quiero y RETRUCO!" para maximizar tus puntos.',
          options: ['Decir "No quiero"', 'Decir "Quiero"', 'Decir "¡Quiero y RETRUCO!"'],
          correctOptionIndex: 2,
        },
        {
          id: 't-2',
          question: 'Perdiste la 1ra mano. Te queda un 4 y un 5. El rival te canta Truco. ¿Cuál es la jugada más inteligente?',
          explanation: 'Tus cartas son las más bajas de la baraja y perdiste la primera. Si decís Quiero vas a perder 2 puntos casi seguro. Al decir "No quiero" sólo perdés 1 punto.',
          options: ['Decir "No quiero"', 'Decir "Quiero" a ver si se equivoca', 'Cantar Vale Cuatro'],
          correctOptionIndex: 0,
        },
      ],
    },
  },
  {
    id: 'flor',
    title: '5. La Flor (Regla Tradicional)',
    shortDesc: 'Descubrí la combinación de 3 cartas del mismo palo, su canto y su valor de 3 puntos.',
    icon: '🌸',
    theory: [
      {
        heading: '¿Qué es tener Flor?',
        paragraphs: [
          'Se tiene FLOR cuando las 3 cartas que te tocaron en el reparto inicial son del MISMO PALO (por ejemplo, 3 de Oro, 7 de Oro y 12 de Oro).',
          'En el truco argentino tradicional, tener Flor es un regalo de la suerte que suma 3 puntos directos.',
        ],
      },
      {
        heading: 'Reglas de la Flor',
        paragraphs: [
          '1. La Flor ANULA el Envido. Si tenés flor, no se puede jugar al envido.',
          '2. Se debe cantar antes de jugar tu primera carta o en respuesta al canto de envido del rival diciendo "¡FLOR!".',
          '3. Si ambos tienen flor, se compara el valor (suma de las 3 cartas + 20) mediante el canto de "Contra Flor" (6 pts) o "Contra Flor al Resto".',
        ],
        alert: {
          type: 'important',
          text: 'Muchos jugadores prefieren jugar "Sin Flor" para que haya más emoción en el envido. En este juego podés activar o desactivar la Flor desde los ajustes.',
        },
      },
    ],
    interactiveChallenge: {
      type: 'parda-quiz',
      title: 'Desafío de la Flor',
      instructions: 'Demostrá que sabés cuándo hay flor y qué implica.',
      quizzes: [
        {
          id: 'f-1',
          question: 'Tenés: 1 de Espada, 7 de Espada y 4 de Basto. ¿Tenés Flor?',
          explanation: 'No, porque una de las 3 cartas es de Basto. Para tener Flor, las TRES cartas deben ser obligatoriamente del mismo palo.',
          options: ['Sí, porque tengo dos cartas bravas', 'No, porque una carta es de distinto palo', 'Depende de quién sea mano'],
          correctOptionIndex: 1,
        },
      ],
    },
  },
];

export const GLOSSARY_ITEMS: { term: string; definition: string; example: string }[] = [
  { term: 'Mano', definition: 'El jugador que tiene el turno inicial en la ronda y ventaja definitoria en caso de empates.', example: 'Si empatamos en 29 de envido, gana la Mano.' },
  { term: 'Pie', definition: 'El jugador que juega segundo o último en la ronda.', example: 'Al ser Pie, jugás después de ver qué tira tu rival.' },
  { term: 'Parda / Empardar', definition: 'Empate de cartas de idéntico rango en una ronda de cartas.', example: 'Tiré un 3 y me tiraste otro 3: ¡Parda!' },
  { term: 'Primera gana', definition: 'Regla fundamental: quien gana la 1ra mano tiene ventaja en caso de empates en 2da o 3ra.', example: 'Empatamos la segunda pero yo gané la primera, me llevo la mano.' },
  { term: 'Irse al mazo', definition: 'Rendirse en la mano actual para no regalar puntos adicionales.', example: 'Tengo cartas muy bajas, me voy al mazo y entrego solo 1 punto.' },
  { term: 'Malas y Buenas', definition: 'En partidas a 30 puntos: los primeros 15 puntos son "las malas" y los siguientes 15 son "las buenas".', example: 'Vamos 12 a 8, todavía estamos en las malas.' },
  { term: 'Cartas Bravas', definition: 'Las 4 cartas más poderosas del truco: 1 de Espada, 1 de Basto, 7 de Espada y 7 de Oro.', example: 'Me tocaron dos bravas en el reparto.' },
  { term: 'Matar', definition: 'Jugar una carta de rango superior a la que tiró el adversario en la mesa.', example: 'Tiró un 10 y lo maté con un 2.' },
  { term: 'Tantos', definition: 'Los puntos calculados para la apuesta del Envido.', example: 'Tengo 31 tantos de Basto.' },
];

