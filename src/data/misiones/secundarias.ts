import type { MisionSecundaria } from '../../types/misiones'

export const MISIONES_SECUNDARIAS: MisionSecundaria[] = [
  {
    id: 'a-grievous-blow-defender',
    nombre: 'A Grievous Blow',
    nombreEs: 'Un Golpe Grave',
    tipo: 'SECUNDARIA · FIJA / TÁCTICA',
    alRobarla: 'Si no hay unidades enemigas con una Fuerza Inicial de 13 o más en el campo de batalla, puedes descartar esta carta y robar una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'FIJA',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Por cada unidad enemiga con una Fuerza Inicial de 13 o más que sea destruida este turno.', pv: 4, porUnidad: true }],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'TÁCTICA',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Una o más unidades enemigas con una Fuerza Inicial de 13 o más fueron destruidas este turno.', pv: 5 }],
      },
    ],
  },
  {
    id: 'a-tempting-target-defender',
    nombre: 'A Tempting Target',
    nombreEs: 'Un Objetivo Tentador',
    alRobarla: "Tu oponente selecciona un objetivo (excluyendo objetivos propios) dentro de la Tierra de Nadie para que sea tu objetivo tentador.",
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas tu objetivo tentador.', pv: 5 }],
      },
    ],
  },
  {
    id: 'assassination-defender',
    nombre: 'Assassination',
    nombreEs: 'Asesinato',
    tipo: 'SECUNDARIA · FIJA / TÁCTICA',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'FIJA',
        disparador: 'Al final de un turno',
        niveles: [
          { texto: 'Por cada modelo PERSONAJE enemigo destruido este turno.', pv: 3, porUnidad: true },
          { texto: 'Por cada uno de esos modelos con una característica de Heridas de 4 o más.', pv: 1, porUnidad: true, acumulable: true },
        ],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'TÁCTICA',
        disparador: 'Al final del turno de cualquier jugador',
        niveles: [
          { texto: 'Uno o más modelos PERSONAJE enemigos fueron destruidos este turno.', pv: 5 },
          { texto: 'Todos los modelos PERSONAJE enemigos han sido destruidos durante la batalla.', pv: 5, disyuntivo: true },
        ],
      },
    ],
  },
  {
    id: 'beacon-defender',
    nombre: 'Beacon',
    nombreEs: 'Baliza',
    alRobarla: 'Elige una unidad amiga en el campo de batalla, o embarcada dentro de un TRANSPORTE en el campo de batalla, para que sea tu unidad baliza.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final del turno de tu oponente o al final de la quinta ronda de batalla (lo que ocurra primero)',
        niveles: [
          { texto: 'Tu unidad baliza está en el campo de batalla y no dentro de tu zona de despliegue.', pv: 3 },
          { texto: 'Tu unidad baliza está en el campo de batalla y no dentro de tu territorio.', pv: 5, disyuntivo: true },
        ],
      },
    ],
  },
  {
    id: 'behind-enemy-lines-defender',
    nombre: 'Behind Enemy Lines',
    nombreEs: 'Tras las Líneas Enemigas',
    alRobarla: 'Durante la primera ronda de batalla, puedes barajar esta carta de vuelta en tu mazo de Misiones Secundarias y luego robar una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'MÁX 5PV',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Por cada unidad amiga (excluyendo AERONAVES y unidades acobardadas) totalmente dentro de la zona de despliegue de tu oponente.', pv: 3, porUnidad: true }],
      },
    ],
  },
  {
    id: 'bring-it-down-defender',
    nombre: 'Bring it Down',
    nombreEs: 'Derríbalo',
    tipo: 'SECUNDARIA · FIJA / TÁCTICA',
    alRobarla: 'Si no hay ningún modelo enemigo en el campo de batalla con una característica de Heridas de 10 o más, puedes descartar esta carta y robar una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'FIJA',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Por cada modelo enemigo con una característica de Heridas de 10 o más que sea destruido este turno.', pv: 4, porUnidad: true }],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'TÁCTICA',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Uno o más modelos enemigos con una característica de Heridas de 10 o más fueron destruidos este turno.', pv: 5 }],
      },
    ],
  },
  {
    id: 'burden-of-trust-defender',
    nombre: 'Burden of Trust',
    nombreEs: 'Carga de la Confianza',
    alRobarla: 'Al robarla / al inicio de tu turno: por cada objetivo, puedes elegir una unidad amiga en el campo de batalla para que custodie ese objetivo. Desde entonces hasta el inicio de tu siguiente turno, ese objetivo cuenta como custodiado por tu ejército mientras la unidad elegida esté dentro de su alcance y tú lo controles.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'MÁX 5PV',
        disparador: 'Al final del turno de tu oponente o al final de la quinta ronda de batalla (lo que ocurra primero)',
        niveles: [{ texto: 'Por cada objetivo custodiado por tu ejército.', pv: 2, porUnidad: true }],
      },
    ],
  },
  {
    id: 'centre-ground-defender',
    nombre: 'Centre Ground',
    nombreEs: 'Terreno Central',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una o más unidades amigas (excluyendo AERONAVES y unidades acobardadas) están a 3" o menos del centro del campo de batalla, y ninguna unidad enemiga está a 3" o menos del centro del campo de batalla.', pv: 3 },
          { texto: 'Una o más unidades amigas (excluyendo AERONAVES y unidades acobardadas) están a 3" o menos del centro del campo de batalla, y ninguna unidad enemiga está a 6" o menos del centro del campo de batalla.', pv: 5, disyuntivo: true },
        ],
      },
    ],
  },
  {
    id: 'cleanse-defender',
    nombre: 'Cleanse',
    nombreEs: 'Purificar',
    alRobarla: 'Si tienes activa la misión secundaria Plunder, puedes barajar esta carta de vuelta en tu mazo de Misiones Secundarias y luego robar una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Un objetivo fue purificado por tu ejército este turno.', pv: 2 },
          { texto: 'Dos o más objetivos fueron purificados por tu ejército este turno.', pv: 5, disyuntivo: true },
        ],
      },
    ],
    accion: {
      titulo: 'CLEANSE — PURIFICAR',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad amiga dentro del alcance de un objetivo (excluyendo tu objetivo propio).' },
        { clave: 'Límite de uso', valor: 'Ilimitado. Cada unidad que inicie esta acción en esta fase debe estar dentro del alcance de un objetivo distinto.' },
        { clave: 'Se completa', valor: 'Al final de tu turno, si esa unidad está controlando ese objetivo.' },
        { clave: 'Efecto', valor: 'Ese objetivo es purificado por tu ejército.' },
      ],
    },
  },
  {
    id: 'defend-stronghold-defender',
    nombre: 'Defend Stronghold',
    nombreEs: 'Defender el Bastión',
    alRobarla: 'Durante la primera ronda de batalla, baraja esta carta de vuelta en tu mazo de Misiones Secundarias y luego roba una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'DESDE LA SEGUNDA RONDA DE BATALLA',
        disparador: 'Al final del turno de tu oponente o al final de la quinta ronda de batalla (lo que ocurra primero)',
        niveles: [
          { texto: 'Controlas tu objetivo propio.', pv: 3 },
          { texto: 'Ninguna unidad enemiga está dentro de tu zona de despliegue.', pv: 2, acumulable: true },
        ],
      },
    ],
  },
  {
    id: 'display-of-might-defender',
    nombre: 'Display of Might',
    nombreEs: 'Demostración de Poder',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Hay más unidades amigas que enemigas (excluyendo AERONAVES y unidades acobardadas) totalmente dentro de la Tierra de Nadie.', pv: 2 }],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final del turno de tu oponente',
        niveles: [{ texto: 'Hay más unidades amigas que enemigas (excluyendo AERONAVES y unidades acobardadas) totalmente dentro de la Tierra de Nadie.', pv: 5 }],
      },
    ],
  },
  {
    id: 'engage-on-all-fronts-defender',
    nombre: 'Engage on All Fronts',
    nombreEs: 'Combatir en Todos los Frentes',
    tipo: 'SECUNDARIA · FIJA / TÁCTICA',
    alRobarla: 'Tienes presencia en un cuadrante de mesa si una o más unidades amigas (excluyendo AERONAVES y unidades acobardadas) están totalmente dentro de ese cuadrante y no a 6" o menos del centro del campo de batalla.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'FIJA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Tienes presencia en tres cuadrantes de mesa.', pv: 2 },
          { texto: 'Tienes presencia en cuatro cuadrantes de mesa.', pv: 4, disyuntivo: true },
        ],
      },
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'TÁCTICA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Tienes presencia en tres cuadrantes de mesa.', pv: 3 },
          { texto: 'Tienes presencia en cuatro cuadrantes de mesa.', pv: 5, disyuntivo: true },
        ],
      },
    ],
  },
  {
    id: 'forward-position-defender',
    nombre: 'Forward Position',
    nombreEs: 'Posición Avanzada',
    alRobarla: 'Durante la primera ronda de batalla, puedes barajar esta carta de vuelta en tu mazo de Misiones Secundarias y luego robar una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas el objetivo propio de tu oponente y/o cada objetivo de expansión.', pv: 5 }],
      },
    ],
  },
  {
    id: 'no-prisoners-defender',
    nombre: 'No Prisoners',
    nombreEs: 'Sin Prisioneros',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'MÁX 5PV',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Por cada unidad enemiga destruida este turno.', pv: 2, porUnidad: true }],
      },
    ],
  },
  {
    id: 'outflank-defender',
    nombre: 'Outflank',
    nombreEs: 'Flanquear',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [
          { texto: 'Una o más unidades amigas (excluyendo AERONAVES y unidades acobardadas) están a 6" o menos de uno o más bordes del campo de batalla y no dentro de tu territorio.', pv: 3 },
          { texto: 'Dos o más unidades amigas (excluyendo AERONAVES y unidades acobardadas) están a 6" o menos de bordes opuestos del campo de batalla, y una o más de esas unidades no está dentro de tu territorio.', pv: 5, disyuntivo: true },
        ],
      },
    ],
    notaDisenador: 'Los bordes opuestos del campo de batalla son los que discurren paralelos entre sí.',
  },
  {
    id: 'overwhelming-force-defender',
    nombre: 'Overwhelming Force',
    nombreEs: 'Fuerza Abrumadora',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        chip: 'MÁX 5PV',
        disparador: 'Al final de un turno',
        niveles: [{ texto: 'Por cada unidad enemiga que empezó el turno dentro del alcance de uno o más objetivos y es destruida.', pv: 3, porUnidad: true }],
      },
    ],
  },
  {
    id: 'plunder-defender',
    nombre: 'Plunder',
    nombreEs: 'Saqueo',
    alRobarla: 'Si tienes activa la misión secundaria Cleanse, puedes barajar esta carta de vuelta en tu mazo de Misiones Secundarias y luego robar una nueva carta de Misión Secundaria.',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Un área de terreno fue saqueada este turno.', pv: 5 }],
      },
    ],
    accion: {
      titulo: 'PLUNDER — SAQUEAR',
      filas: [
        { clave: 'Empieza', valor: 'Tu fase de disparo.' },
        { clave: 'Unidades', valor: 'Una unidad dentro de un área de terreno que no esté dentro de tu territorio.' },
        { clave: 'Límite de uso', valor: 'Una vez por turno.' },
        { clave: 'Se completa', valor: 'Inmediatamente.' },
        { clave: 'Efecto', valor: 'Esa área de terreno queda saqueada.' },
      ],
    },
  },
  {
    id: "secure-no-man's-land-defender",
    nombre: "Secure No Man's Land",
    nombreEs: 'Asegurar la Tierra de Nadie',
    secciones: [
      {
        cuando: 'CUALQUIER RONDA DE BATALLA',
        disparador: 'Al final de tu turno',
        niveles: [{ texto: 'Controlas dos o más objetivos dentro de la Tierra de Nadie (excluyendo tu objetivo propio).', pv: 5 }],
      },
    ],
  },
]

export const MISIONES_SECUNDARIAS_MAP: Record<string, MisionSecundaria> = Object.fromEntries(
  MISIONES_SECUNDARIAS.map(m => [m.id, m])
)
