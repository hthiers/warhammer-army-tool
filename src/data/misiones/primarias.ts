import type { MisionPrimaria } from '../../types/misiones'

export const MISIONES_PRIMARIAS: MisionPrimaria[] = [
  // ── Take and Hold ──────────────────────────────────────────────────────────
  {
    id: 'battlefield-dominance',
    mazo: 'take-and-hold',
    nombre: 'Battlefield Dominance',
    nombreEs: 'Dominio del Campo de Batalla',
    secciones: [
      {
        cuando: 'PRIMERA Y SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas más objetivos que tu oponente.', pv: 2 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Por cada objetivo que controlas.', pv: 3, porUnidad: true },
          { texto: 'Por cada uno de esos objetivos (excluyendo tu objetivo propio) si controlas tu objetivo propio.', pv: 2, porUnidad: true, acumulable: true },
        ],
      },
    ],
  },
  {
    id: 'determined-acquisition',
    mazo: 'take-and-hold',
    nombre: 'Determined Acquisition',
    nombreEs: 'Adquisición Decidida',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada objetivo que controlas y que no controlabas al inicio del turno (excluyendo tu objetivo propio).', pv: 2, porUnidad: true }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Por cada objetivo que controlas.', pv: 3, porUnidad: true },
          { texto: 'Por cada uno de esos objetivos que esté dentro del territorio de tu oponente.', pv: 3, porUnidad: true, acumulable: true },
        ],
      },
    ],
  },
  {
    id: 'immovable-object',
    mazo: 'take-and-hold',
    nombre: 'Immovable Object',
    nombreEs: 'Objeto Inamovible',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas uno o más objetivos centrales.', pv: 3 }],
      },
      {
        cuando: 'DE LA SEGUNDA A LA CUARTA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 5, porUnidad: true }],
      },
      {
        cuando: 'QUINTA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 5, porUnidad: true }],
      },
    ],
  },
  {
    id: 'inescapable-dominion',
    mazo: 'take-and-hold',
    nombre: 'Inescapable Dominion',
    nombreEs: 'Dominio Ineludible',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas tres o más objetivos.', pv: 4 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas dos o más objetivos.', pv: 5 },
          { texto: 'Controlas más objetivos que tu oponente.', pv: 4 },
        ],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Controlas el objetivo propio de tu oponente.', pv: 5 }],
      },
    ],
  },
  {
    id: 'purge-and-secure',
    mazo: 'take-and-hold',
    nombre: 'Purge and Secure',
    nombreEs: 'Purgar y Asegurar',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una o más unidades enemigas fueron destruidas este turno por una unidad amiga que estaba dentro del alcance de uno o más objetivos.', pv: 3 },
          { texto: 'Una o más unidades enemigas que empezaron el turno dentro del alcance de uno o más objetivos fueron destruidas este turno.', pv: 3, disyuntivo: true },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 4, porUnidad: true }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas uno o más objetivos que no controlabas al inicio del turno (excluyendo tu objetivo propio).', pv: 3 }],
      },
    ],
  },

  // ── Purge the Foe ───────────────────────────────────────────────────────────
  {
    id: 'consecrate',
    mazo: 'purge-the-foe',
    nombre: 'Consecrate',
    nombreEs: 'Consagrar',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Uno o dos objetivos están consagrados.', pv: 3 },
          { texto: 'Tres o más objetivos están consagrados.', pv: 6, disyuntivo: true },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 },
          { texto: 'Controlas más objetivos que tu oponente.', pv: 4 },
        ],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'El objetivo propio enemigo ha sido consagrado.', pv: 5 }],
      },
    ],
  },
  {
    id: 'destroyers-wrath',
    mazo: 'purge-the-foe',
    nombre: "Destroyer's Wrath",
    nombreEs: 'Ira del Destructor',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Una o más unidades enemigas fueron destruidas este turno.', pv: 3 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 },
          { texto: 'Controlas más objetivos que tu oponente.', pv: 6 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Se destruyeron más unidades enemigas este turno que unidades amigas destruidas en el turno anterior.', pv: 4 }],
      },
    ],
  },
  {
    id: 'meatgrinder',
    mazo: 'purge-the-foe',
    nombre: 'Meatgrinder',
    nombreEs: 'Picadora de Carne',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Una o más unidades enemigas fueron destruidas este turno.', pv: 3 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Se destruyeron más unidades enemigas este turno que unidades amigas destruidas en el turno anterior.', pv: 5 },
          { texto: 'Controlas el objetivo propio de tu oponente.', pv: 5 },
        ],
      },
    ],
  },
  {
    id: 'punishment',
    mazo: 'purge-the-foe',
    nombre: 'Punishment',
    nombreEs: 'Castigo',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Una o más unidades enemigas condenadas abandonaron el campo de batalla este turno.', pv: 5 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 },
          { texto: 'Controlas más objetivos que tu oponente.', pv: 5 },
        ],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Controlas el objetivo propio de tu oponente.', pv: 8 }],
      },
    ],
  },
  {
    id: 'unstoppable-force',
    mazo: 'purge-the-foe',
    nombre: 'Unstoppable Force',
    nombreEs: 'Fuerza Imparable',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Una o más unidades enemigas fueron destruidas este turno.', pv: 3 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 4, porUnidad: true }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas uno o más objetivos que no controlabas al inicio del turno (excluyendo tu objetivo propio).', pv: 3 }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Controlas uno o más objetivos centrales.', pv: 5 }],
      },
    ],
  },

  // ── Reconnaissance ──────────────────────────────────────────────────────────
  {
    id: 'gather-intel',
    mazo: 'reconnaissance',
    nombre: 'Gather Intel',
    nombreEs: 'Recabar Información',
    secciones: [
      {
        cuando: 'PRIMERA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas uno o más objetivos centrales.', pv: 6 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada unidad amiga que obtuvo información este turno (ver el reverso).', pv: 7, porUnidad: true }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [
          { texto: 'Tres o más de tus marcadores de operación están en el campo de batalla.', pv: 5 },
          { texto: 'Uno de tus marcadores de operación está dentro del alcance del objetivo propio de tu oponente.', pv: 5 },
        ],
      },
    ],
    accion: {
      titulo: 'Obtener Información',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo, desde la segunda ronda de batalla en adelante.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo (excluyendo tu objetivo propio) que no tenga ninguno de tus marcadores de operación dentro de su alcance.' },
        { clave: 'Límite de uso', valor: 'Ilimitado. Cada unidad que inicie esta acción en esta fase debe estar dentro del alcance de un objetivo distinto.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Tu unidad obtiene información — coloca uno de tus marcadores de operación dentro del alcance de ese objetivo.' },
      ],
    },
  },
  {
    id: 'reconnaissance-sweep',
    mazo: 'reconnaissance',
    nombre: 'Reconnaissance Sweep',
    nombreEs: 'Barrido de Reconocimiento',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Tres o más unidades amigas están totalmente dentro de tres cuadrantes de mesa distintos y no a 6" o menos del centro del campo de batalla.', pv: 3 },
          { texto: 'Cuatro o más unidades amigas están totalmente dentro de cuatro cuadrantes de mesa distintos y no a 6" o menos del centro del campo de batalla.', pv: 6, disyuntivo: true },
        ],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada unidad enemiga destruida este turno.', pv: 1, porUnidad: true }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 3 }],
      },
    ],
  },
  {
    id: 'search-and-scour',
    mazo: 'reconnaissance',
    nombre: 'Search and Scour',
    nombreEs: 'Buscar y Rastrear',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Controlas uno o más objetivos centrales.', pv: 3 },
          { texto: 'Una o más unidades enemigas que empezaron el turno dentro de un área de terreno son destruidas.', pv: 2 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 4, porUnidad: true }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Ninguna unidad enemiga está totalmente dentro de tu territorio.', pv: 5 }],
      },
    ],
  },
  {
    id: 'surveil-the-foe',
    mazo: 'reconnaissance',
    nombre: 'Surveil the Foe',
    nombreEs: 'Vigilar al Enemigo',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Una o más unidades enemigas fueron vigiladas este turno (ver el reverso), a menos que cada una de esas unidades esté dentro del alcance de uno o más objetivos que tengan uno o más marcadores de operación dentro de su alcance.', pv: 4 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 },
          { texto: 'Controlas más objetivos que tu oponente.', pv: 4 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'No hay marcadores de operación enemigos en el campo de batalla.', pv: 5 }],
      },
    ],
    accion: {
      titulo: 'Vigilar al Enemigo',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga.' },
        { clave: 'Límite de uso', valor: 'Ilimitado.' },
        { clave: 'Se completa', valor: 'Inmediatamente.' },
        { clave: 'Efecto', valor: 'Selecciona una unidad enemiga a 18" o menos de tu unidad, que sea visible para ella y que no haya sido vigilada todavía este turno. Hasta el final del turno, esa unidad enemiga queda vigilada.' },
      ],
    },
  },
  {
    id: 'triangulation',
    mazo: 'reconnaissance',
    nombre: 'Triangulation',
    nombreEs: 'Triangulación',
    secciones: [
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Un objetivo está triangulado (ver el reverso).', pv: 3 },
          { texto: 'Dos objetivos están triangulados.', pv: 6, disyuntivo: true },
          { texto: 'Tres o más objetivos están triangulados.', pv: 10, disyuntivo: true },
        ],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Controlas cuatro o más objetivos.', pv: 10 }],
      },
    ],
    accion: {
      titulo: 'Triangular',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo, desde la segunda ronda de batalla en adelante.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo (excluyendo tu objetivo propio).' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Ese objetivo queda triangulado — coloca uno de tus marcadores de operación dentro del alcance de ese objetivo.' },
      ],
    },
  },

  // ── Priority Assets ─────────────────────────────────────────────────────────
  {
    id: 'extract-relic',
    mazo: 'priority-assets',
    nombre: 'Extract Relic',
    nombreEs: 'Extraer la Reliquia',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una unidad amiga realizó un barrido de sensores este turno (ver el reverso).', pv: 4 },
          { texto: 'Una o más unidades enemigas que empezaron el turno dentro del alcance de uno o más objetivos son destruidas.', pv: 3 },
          { texto: 'Solo queda un marcador de operación de tu oponente en el campo de batalla, si una o más de tus unidades están dentro de la misma área de terreno que ese marcador de operación, y no hay unidades enemigas dentro de esa área de terreno.', pv: 4 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Solo queda un marcador de operación de tu oponente en el campo de batalla, si una o más de tus unidades están dentro de la misma área de terreno que ese marcador de operación, y no hay unidades enemigas dentro de esa área de terreno.', pv: 5 }],
      },
    ],
    accion: {
      titulo: 'Barrido de Sensores',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo central.' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Tu unidad realiza un barrido de sensores — retira un marcador de operación del campo de batalla.' },
        { clave: 'Restricciones', valor: 'Una unidad no puede iniciar esta acción si solo queda un marcador de operación en el campo de batalla.' },
      ],
    },
  },
  {
    id: 'sabotage',
    mazo: 'priority-assets',
    nombre: 'Sabotage',
    nombreEs: 'Sabotaje',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Por cada unidad amiga que cometió sabotaje este turno (ver el reverso).', pv: 3, porUnidad: true },
          { texto: 'Por cada una de esas unidades que esté dentro del alcance de uno o más objetivos en el territorio de tu oponente.', pv: 2, porUnidad: true, acumulable: true },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
    ],
    accion: {
      titulo: 'Sabotage — Sabotaje',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad dentro del alcance de un objetivo (excluyendo tu objetivo propio).' },
        { clave: 'Límite de uso', valor: 'Ilimitado. Cada unidad que inicie esta acción en esta fase debe estar dentro del alcance de un objetivo distinto.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si esa unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Tu unidad comete sabotaje.' },
      ],
    },
  },
  {
    id: 'secure-asset',
    mazo: 'priority-assets',
    nombre: 'Secure Asset',
    nombreEs: 'Asegurar el Activo',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una unidad amiga aseguró el activo este turno (ver el reverso).', pv: 4 },
          { texto: 'Una o más unidades enemigas que empezaron el turno dentro del alcance de uno o más objetivos centrales son destruidas.', pv: 2 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 },
          { texto: 'Controlas tres o más objetivos.', pv: 4 },
        ],
      },
    ],
    accion: {
      titulo: 'Secure Asset — Asegurar el Activo',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo (excluyendo tu objetivo propio).' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Tu unidad asegura el activo.' },
      ],
    },
  },
  {
    id: 'vanguard-operation',
    mazo: 'priority-assets',
    nombre: 'Vanguard Operation',
    nombreEs: 'Operación de Vanguardia',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una unidad amiga realizó una operación de vanguardia este turno (ver el reverso).', pv: 4 },
          { texto: 'Una o más unidades enemigas fueron destruidas este turno.', pv: 2 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Controlas el objetivo propio de tu oponente.', pv: 10 }],
      },
    ],
    accion: {
      titulo: 'Vanguard Operation — Operación de Vanguardia',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro de un área de terreno ubicada en territorio enemigo.' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, siempre que no haya unidades enemigas dentro de esa área de terreno.' },
        { clave: 'Efecto', valor: 'Tu unidad realiza una operación de vanguardia.' },
      ],
    },
  },
  {
    id: 'vital-link',
    mazo: 'priority-assets',
    nombre: 'Vital Link',
    nombreEs: 'Enlace Vital',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Controlas uno o más objetivos centrales.', pv: 2 },
          { texto: 'Por cada uno de tus marcadores de operación dentro del alcance de uno de esos objetivos (ver el reverso).', pv: 1, porUnidad: true, acumulable: true },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [
          { texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 },
          { texto: 'Uno o más de esos objetivos es un objetivo central.', pv: 4, acumulable: true },
        ],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Controlas el objetivo propio de tu oponente.', pv: 10 }],
      },
    ],
    accion: {
      titulo: 'Mantener el Control',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo central.' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Coloca uno de tus marcadores de operación dentro del alcance de ese objetivo.' },
      ],
    },
  },

  // ── Disruption ──────────────────────────────────────────────────────────────
  {
    id: 'death-trap',
    mazo: 'disruption',
    nombre: 'Death Trap',
    nombreEs: 'Trampa Mortal',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Por cada área de terreno minada este turno (ver el reverso).', pv: 2, porUnidad: true },
          { texto: 'Por cada una de esas áreas de terreno que sea un objetivo.', pv: 3, porUnidad: true, acumulable: true },
        ],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Una o más unidades enemigas que empezaron el turno dentro de un área de terreno fueron destruidas, si esa área de terreno está minada.', pv: 3 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
    ],
    accion: {
      titulo: 'Trampa Explosiva',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo (excluyendo tu objetivo propio), o dentro de un área de terreno fuera de tu zona de despliegue que todavía no esté minada.' },
        { clave: 'Límite de uso', valor: 'Ilimitado. Cada unidad que inicie esta acción en esta fase debe estar dentro de un área de terreno distinta.' },
        { clave: 'Se completa', valor: 'Inmediatamente.' },
        { clave: 'Efecto', valor: 'Esa área de terreno queda minada — coloca uno de tus marcadores de operación dentro de esa área de terreno.' },
      ],
    },
  },
  {
    id: 'delaying-action',
    mazo: 'disruption',
    nombre: 'Delaying Action',
    nombreEs: 'Acción de Contención',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada unidad enemiga destruida este turno.', pv: 2, porUnidad: true }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo objetivos propios).', pv: 4 }],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas uno o más objetivos centrales y uno o más objetivos de expansión.', pv: 3 }],
      },
    ],
  },
  {
    id: 'locate-and-deny',
    mazo: 'disruption',
    nombre: 'Locate and Deny',
    nombreEs: 'Localizar y Denegar',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una o más unidades enemigas que empezaron el turno dentro del alcance de uno o más objetivos son destruidas.', pv: 4 },
          { texto: 'Solo queda uno de tus marcadores de operación (ver el reverso), con una unidad tuya en esa área de terreno y ninguna unidad enemiga allí.', pv: 4 },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Solo queda uno de tus marcadores de operación, con una unidad tuya en esa área de terreno y ninguna unidad enemiga allí.', pv: 5 }],
      },
    ],
    accion: {
      titulo: 'Barrido de Sensores',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo central.' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Tu unidad realiza un barrido de sensores — retira un marcador de operación del campo de batalla.' },
        { clave: 'Restricción', valor: 'Una unidad no puede iniciar esta acción si solo queda un marcador de operación en el campo de batalla.' },
      ],
    },
  },
  {
    id: 'outmanoeuvre',
    mazo: 'disruption',
    nombre: 'Outmanoeuvre',
    nombreEs: 'Maniobra Superior',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas el objetivo propio enemigo.', pv: 10 }],
      },
      {
        cuando: 'PRIMERA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 4, porUnidad: true }],
      },
      {
        cuando: 'SEGUNDA Y TERCERA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 5, porUnidad: true }],
      },
      {
        cuando: 'DESDE LA CUARTA RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada objetivo que controlas (excluyendo tu objetivo propio).', pv: 6, porUnidad: true }],
      },
    ],
  },
  {
    id: 'smoke-and-mirrors',
    mazo: 'disruption',
    nombre: 'Smoke and Mirrors',
    nombreEs: 'Humo y Espejos',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Por cada objetivo que esté señuelizado (ver el reverso).', pv: 2, porUnidad: true },
          { texto: 'Por cada uno de esos objetivos que esté dentro del territorio de tu oponente.', pv: 2, porUnidad: true, acumulable: true },
        ],
      },
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final de tu fase de mando (o al final de tu turno en la quinta ronda de batalla)',
        niveles: [{ texto: 'Controlas uno o más objetivos (excluyendo tu objetivo propio).', pv: 4 }],
      },
      {
        cuando: 'FIN DE LA BATALLA',
        niveles: [{ texto: 'Cuatro o más objetivos están señuelizados.', pv: 10 }],
      },
    ],
    accion: {
      titulo: 'Señuelo',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo (excluyendo tu objetivo propio) que no sea un señuelo.' },
        { clave: 'Límite de uso', valor: 'Ilimitado. Cada unidad que inicie esta acción en esta fase debe estar dentro del alcance de un objetivo distinto.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si tu unidad controla ese objetivo.' },
        { clave: 'Efecto', valor: 'Ese objetivo se convierte en un señuelo — coloca uno de tus marcadores de operación dentro del alcance de ese objetivo.' },
      ],
    },
  },
]

export const MISIONES_PRIMARIAS_MAP: Record<string, MisionPrimaria> = Object.fromEntries(
  MISIONES_PRIMARIAS.map(m => [m.id, m])
)
