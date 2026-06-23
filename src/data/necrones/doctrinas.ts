import type { Destacamento, ReglaDestacamento, Mejora } from '../../types'

export const DESTACAMENTOS: Destacamento[] = [
  { id: 'manoDinastia', nombre: 'Mano de la Dinastía', dp: 1 },
  { id: 'puntaLanza', nombre: 'Punta de Lanza del Sudario Celestial', dp: 1 },
  { id: 'armeriaFaeron', nombre: 'Armería del Faerón', dp: 1 },
  { id: 'arsenalParteestrellas', nombre: 'Arsenal Parteestrellas', dp: 3 },
  { id: 'conclaveCriptecnologos', nombre: 'Cónclave de Criptecnólogos', dp: 2 },
  { id: 'legionMaldita', nombre: 'Legión Maldita', dp: 2 },
  { id: 'panteonAfliccion', nombre: 'Panteón de la Aflicción', dp: 2 },
]

export const REGLAS_DESTACAMENTO: Record<string, ReglaDestacamento> = {
  manoDinastia: {
    nombre: 'Protocolos de Hipermotricidad',
    efectos: [
      'Los ataques a distancia de las unidades INMORTALES/GUERREROS NECRONES amigas tienen [ASALTO].',
      'Cuando una unidad INMORTALES/GUERREROS NECRONES amiga se elija para hacer un movimiento de avanzar, esto no le impide ser apta para iniciar acciones.',
      'Este destacamento tiene la etiqueta DINASTÍA y no puede incluirse junto a otro destacamento DINASTÍA.',
    ],
  },
  puntaLanza: {
    nombre: 'Despliegue Transdimensional',
    efectos: [
      'Las unidades CUCHILLAS DE LA NECRÓPOLIS amigas tienen Despliegue rápido.',
      'Cuando una unidad CUCHILLAS DE LA NECRÓPOLIS amiga se elija para disparar, si esa unidad hizo un movimiento de inserción en este turno, los ataques a distancia de esa unidad tienen +1 a las tiradas para impactar.',
    ],
  },
  armeriaFaeron: {
    nombre: 'Ingenios Potenciados',
    efectos: [
      'Las unidades VOLAR TITÁNICA NECRONES amigas tienen +6" a M.',
      'Este destacamento tiene la etiqueta HIPERCRIPTA y no puede incluirse junto a otro destacamento HIPERCRIPTA.',
    ],
  },
  arsenalParteestrellas: {
    nombre: 'Asalto Implacable',
    efectos: [
      'Siempre que una miniatura NECRONES de tu ejército (salvo miniaturas MONSTRUO) realice un ataque que tome como blanco una unidad dentro del alcance de algún marcador de objetivo, suma 1 a las tiradas para impactar.',
      'Las armas a distancia equipadas a miniaturas VEHÍCULO NECRONES y miniaturas MONTADA NECRONES (salvo TITÁNICA) de tu ejército tienen la habilidad [ASALTO].',
    ],
  },
  conclaveCriptecnologos: {
    nombre: 'Mejoras Tecnoarcanas',
    efectos: [
      'Las armas a distancia equipadas a miniaturas CRIPTECNÓLOGO de tu ejército tienen la habilidad [ASALTO].',
      'En tu fase de disparo, siempre que se elija para disparar una unidad CRIPTECNÓLOGO de tu ejército, elige 1 de las siguientes habilidades: [ANTIINFANTERÍA 3+], [ANTIMONTADA 4+], [ASALTO], [PESADA], [IGNORA COBERTURA]. Las armas a distancia equipadas a las miniaturas de esa unidad tienen esa habilidad hasta el final de la fase.',
    ],
  },
  legionMaldita: {
    nombre: 'Frío Fervor',
    efectos: [
      'Suma 2 al atributo Fuerza de las armas equipadas a miniaturas CULTO DESTRUCTOR de tu ejército.',
      'La primera vez en cada turno que una unidad CULTO DESTRUCTOR de tu ejército realice ataques que eliminen una unidad o hagan que pase a estar bajo mitad de efectivos, después de que esa unidad termine de realizar sus ataques, hasta el final del turno, suma 2 al atributo Fuerza de las armas equipadas a miniaturas NECRONES amigas (salvo miniaturas CULTO DESTRUCTOR, MONSTRUO y TITÁNICA).',
    ],
  },
  panteonAfliccion: {
    nombre: 'Distorsión Cósmica',
    efectos: [
      'Las unidades MONSTRUO NECRONES de tu ejército tienen esta habilidad — Campos de distorsión (Aura): Mientras una unidad enemiga esté a 6" o menos de esta unidad, está descorporeizándose. Mientras una unidad esté descorporeizándose, siempre que un ataque la tome como blanco, mejora en 1 el atributo Factor de penetración de ese ataque.',
      'Al inicio de cada fase, esta unidad sufre 3 heridas mortales por cada unidad MONSTRUO NECRONES de tu ejército. Si lo hace, hasta el final de la fase, el alcance de la habilidad de aura Campos de distorsión aumenta a 9".',
    ],
  },
}

export const MEJORAS: Record<string, Mejora[]> = {
  manoDinastia: [
    {
      id: 'centinelasReanimados',
      nombre: 'Centinelas Reanimados',
      restriccion: 'Solo unidad GUERREROS NECRONES.',
      desc: 'Esta unidad tiene Avanzadilla 5".',
    },
    {
      id: 'herramientasDominacion',
      nombre: 'Herramientas de la Dominación',
      restriccion: 'Solo unidad INMORTALES.',
      desc: 'Los ataques a distancia de esta unidad tienen [FUEGO RÁPIDO 1].',
    },
  ],
  puntaLanza: [
    {
      id: 'reanimacionRecursiva',
      nombre: 'Reanimación Recursiva',
      restriccion: 'Solo unidad CUCHILLAS DE LA NECRÓPOLIS.',
      desc: 'Cuando esta unidad activa sus Protocolos de reanimación, suma +1 a la tirada.',
    },
    {
      id: 'locuraMuyProfunda',
      nombre: 'Locura Muy Profunda',
      restriccion: 'Solo unidad MONTADA CULTO DESTRUCTOR.',
      desc: 'Los ataques a distancia de esta unidad tienen [ASALTO].',
    },
  ],
  armeriaFaeron: [
    {
      id: 'optimizadorPrelocalizador',
      nombre: 'Optimizador Prelocalizador',
      restriccion: 'Solo miniatura NECRONES.',
      desc: 'Cuando esta miniatura se elija para disparar, si esta unidad se desplegó mediante la habilidad Puerta de la eternidad de un Monolito en este turno, sus ataques a distancia tienen [IMPACTOS LETALES] y O: [GOLPES SOSTENIDOS 1].',
    },
    {
      id: 'mortajaLetal',
      nombre: 'Mortaja Letal (Aura)',
      restriccion: 'Solo unidad OBELISCO.',
      desc: 'En el paso de acobardamiento del oponente, toda unidad enemiga a 8" o menos de esta unidad que esté bajo efectivos iniciales debe hacer una tirada de acobardamiento.',
    },
  ],
  arsenalParteestrellas: [
    {
      id: 'majestadTemible',
      nombre: 'Majestad Temible (Aura)',
      restriccion: 'Solo miniatura SEÑOR SUPREMO o PLATAFORMA DE MANDO CATACUMBA.',
      desc: 'Mientras una unidad NECRONES amiga (salvo MONSTRUO y TITÁNICA) esté a 6" o menos del portador, siempre que una miniatura de esa unidad ataque, repite las tiradas de impactar de 1 y las de herir de 1.',
    },
    {
      id: 'nebuloscopioMiniatura',
      nombre: 'Nebuloscopio en Miniatura',
      restriccion: 'Solo miniatura NECRONES.',
      desc: 'Las armas a distancia equipadas a miniaturas de la unidad del portador tienen la habilidad [IGNORA COBERTURA].',
    },
    {
      id: 'liderExigente',
      nombre: 'Líder Exigente',
      restriccion: 'Solo miniatura NECRONES.',
      desc: 'En tu fase de mando, elige 1 unidad VEHÍCULO NECRONES o MONTADA NECRONES amiga (salvo TITÁNICA) a 6" o menos del portador. Hasta el inicio de tu siguiente fase de mando, esa unidad puede elegirse para disparar en un turno en que retrocedió.',
    },
    {
      id: 'camposCronoimpedancia',
      nombre: 'Campos de Cronoimpedancia',
      restriccion: 'Solo miniatura NECRONES.',
      desc: 'En tu fase de mando, elige 1 unidad VEHÍCULO NECRONES o MONTADA NECRONES amiga (salvo TITÁNICA) a 6" o menos del portador. Hasta el inicio de tu siguiente fase de mando, siempre que se asigne un ataque a una miniatura en esa unidad, resta 1 al atributo Daño de ese ataque.',
    },
  ],
  conclaveCriptecnologos: [
    {
      id: 'abacoCuantico',
      nombre: 'Ábaco Cuántico',
      restriccion: 'Solo miniaturas NECRONES.',
      desc: 'Siempre que elijas la unidad del portador como blanco de una estratagema, tira 1D6 sumando 1 al resultado si está dentro del alcance de algún objetivo: con 4+, ganas 1PM.',
    },
    {
      id: 'desintegradoresAtomicos',
      nombre: 'Desintegradores Atómicos',
      restriccion: 'Solo miniaturas CRIPTECNÓLOGOS.',
      desc: 'En tu fase de disparo, siempre que se elija la unidad del portador para disparar, al elegir una habilidad para la regla de destacamento Mejoras tecnoarcanas, también puedes elegir una de estas habilidades: [ANTIMONSTRUO 5+], [ANTIVEHÍCULO 5+].',
    },
    {
      id: 'guanteleteCompresion',
      nombre: 'Guantelete de Compresión',
      restriccion: 'Solo miniaturas NECRONES.',
      desc: 'Suma 6" al atributo Alcance de las armas a distancia equipadas a miniaturas de la unidad del portador.',
    },
    {
      id: 'boleadorasGravitatorias',
      nombre: 'Boleadoras Gravitatorias',
      restriccion: 'Solo miniatura CRIPTECNÓLOGO.',
      desc: 'En tu fase de disparo, después de que el portador haya disparado, elige 1 unidad enemiga en la que haya impactado alguno de esos ataques (salvo unidades TITÁNICA). Hasta el inicio de tu siguiente turno, dicha unidad enemiga está bloqueada. Mientras una unidad esté bloqueada, resta 2 a su atributo Movimiento y a sus tiradas de carga.',
    },
  ],
  legionMaldita: [
    {
      id: 'ankhDestructor',
      nombre: 'Ankh de Destructor',
      restriccion: 'Solo miniaturas PLATAFORMA DE MANDO CATACUMBA o SEÑOR SUPREMO.',
      desc: 'El portador tiene la clave CULTO DESTRUCTOR. Suma 2" al atributo Movimiento de las miniaturas de la unidad del portador y 2 al atributo Ataques de las armas de combate del portador.',
    },
    {
      id: 'menteHomicida',
      nombre: 'Mente Homicida',
      restriccion: 'Solo miniaturas CRIPTECNÓLOGO.',
      desc: 'El portador tiene la clave CULTO DESTRUCTOR y, durante el paso de declarar formaciones de batalla, puede adjuntarse a una unidad CULTO DESTRUCTOR (salvo unidades PERSONAJE). Si lo hace, la unidad del portador solo puede incluir miniaturas que tengan la clave CULTO DESTRUCTOR. Además, suma 3" al atributo Movimiento del portador.',
    },
    {
      id: 'marcaNekrosor',
      nombre: 'La Marca del Nekrosor',
      restriccion: 'Solo miniatura CULTO DESTRUCTOR.',
      desc: 'Siempre que una miniatura de la unidad del portador ataque a distancia, suma 1 a las tiradas para impactar.',
    },
    {
      id: 'tiaraMaldita',
      nombre: 'Tiara Maldita',
      restriccion: 'Solo miniaturas CULTO DESTRUCTOR.',
      desc: 'Siempre que se elija una unidad enemiga para disparar, después de que esa unidad dispare, si alguna miniatura de la unidad del portador resultó eliminada como resultado de esos ataques, la unidad del portador puede realizar un movimiento súbito. Para ello, tira 1D6: la unidad del portador puede mover una cantidad de pulgadas igual al resultado, pero debe terminar ese movimiento lo más cerca posible de la unidad enemiga más cercana (salvo AERONAVES). Al hacerlo, esas miniaturas pueden moverse por la zona de amenaza de esa unidad enemiga. Una unidad no puede realizar un movimiento súbito mientras está en acobardada.',
    },
  ],
  panteonAfliccion: [
    {
      id: 'matrizSingularidad',
      nombre: 'Matriz de Singularidad',
      restriccion: 'Solo miniatura FRAGMENTO DE C\'TAN DEL EMBAUCADOR.',
      desc: 'Esta miniatura tiene esta habilidad — Señor del engaño (Aura): Siempre que tu oponente tome una unidad de su ejército como blanco de una estratagema, si esa unidad está a 12" o menos de esta miniatura, aumenta en 1PM el coste de usar esa estratagema.',
    },
    {
      id: 'grabadoCuantico',
      nombre: 'Grabado Cuántico',
      restriccion: 'Solo miniatura FRAGMENTO DE C\'TAN DEL PORTADOR DE LA NOCHE.',
      desc: 'Se puede elegir esta miniatura para declarar cargas en un turno en que avanzó.',
    },
    {
      id: 'aturdidorAnimus',
      nombre: 'Aturdidor del Ánimus',
      restriccion: 'Solo miniatura FRAGMENTO DE C\'TAN DEL DRAGÓN DE VACÍO.',
      desc: 'Una vez por turno, al inicio de la fase de disparo del oponente, elige 1 unidad enemiga VEHÍCULO visible para el portador. Esa unidad debe hacer un chequeo de Liderazgo. Hasta el final de la fase, siempre que una miniatura de esa unidad ataque, resta 1 a las tiradas para impactar, y si falló ese chequeo de Liderazgo, resta 1 a las tiradas para herir también.',
    },
    {
      id: 'anclajeReletavico',
      nombre: 'Anclaje Reletávico',
      restriccion: 'Solo miniatura C\'TAN TRANSCENDENTE.',
      desc: 'En tu turno, siempre que esta miniatura se despliegue en el campo de batalla mediante las habilidades Despliegue rápido o Desplazamiento transdimensional, puede desplegarse en cualquier punto del campo de batalla a más de 6" en horizontal de toda unidad enemiga. Al hacerlo, si se despliega esta miniatura a 9" o menos de alguna unidad enemiga, hasta el final del turno, no se la puede elegir para declarar cargas.',
    },
  ],
}
