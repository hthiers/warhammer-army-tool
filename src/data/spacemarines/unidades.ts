import type { Unidad } from '../../types'

export const UNIDADES: Unidad[] = [
  {
    id: 'capitan',
    activo: false,
    nombre: 'Capitán con Armadura Fobos',
    pts: 80,
    color: '#BA7517',
    palabrasClave: ['Infantería', 'Personaje', 'Fobos', 'Imperium', 'Adeptus Astartes'],
    stats: { MOV: '6"', RES: 4, HER: 5, SALV: '2+', INV: '4+', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Pistola bólter', rango: '12"', A: 1, HA: '2+', F: 4, FP: 0, D: 1, especial: 'Pistola' },
      { nombre: 'Carabina bólter instigador', rango: '24"', A: 4, HA: '2+', F: 4, FP: -1, D: 2, especial: 'Precisión' },
    ],
    combate: [
      { nombre: 'Cuchillo de combate', A: 5, HP: '2+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Liderar desde las Sombras',
        desc: 'Mientras este modelo esté dirigiendo una unidad, los modelos de esa unidad tienen la habilidad Sigilo.',
      },
      {
        nombre: 'Capa de Camuflaje',
        desc: 'Los ataques a distancia realizados contra la unidad de este modelo sufren un -1 a la tirada de impactar.',
      },
      {
        nombre: 'Anulación de Prioridad de Objetivo',
        desc: 'Al inicio de la fase de Lucha, selecciona una unidad enemiga a 12". Hasta el final de la fase, los modelos de tu ejército pueden repetir las tiradas de herir contra esa unidad.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'honrarCapitulo', 'granadasHumo'],
  },
  {
    id: 'capitanExterminador',
    nombre: 'Capitán con Armadura Exterminador',
    pts: 100,
    color: '#4A6FA5',
    palabrasClave: ['Infantería', 'Personaje', 'Exterminador', 'Imperium', 'Adeptus Astartes'],
    stats: { MOV: '5"', RES: 5, HER: 6, SALV: '2+', INV: '4+', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Bólter tormenta', rango: '24"', A: 2, HA: '2+', F: 4, FP: 0, D: 1, especial: 'Fuego Rápido 2' },
      { nombre: 'Combiarma', rango: '24"', A: 1, HA: '3+', F: 4, FP: 0, D: 1, especial: 'Antiinfantería 4+, Heridas Devastadoras, Fuego Rápido 1' },
    ],
    combate: [
      { nombre: 'Arma reliquia', A: 6, HP: '2+', F: 5, FP: -2, D: 2 },
      { nombre: 'Garras Relámpago dobles', A: 7, HP: '2+', F: 5, FP: -2, D: 1, especial: 'Acoplada' },
      { nombre: 'Martillo de Trueno', A: 5, HP: '3+', F: 8, FP: -2, D: 2, especial: 'Heridas Devastadoras' },
      { nombre: 'Puño de energía', A: 5, HP: '2+', F: 8, FP: -2, D: 2 },
      { nombre: 'Puño Sierra', A: 5, HP: '3+', F: 8, FP: -2, D: 2, especial: 'Antivehículo 3+' },
    ],
    habilidades: [
      {
        nombre: 'Ritos de batalla',
        desc: 'Una vez por ronda de batalla, 1 unidad de tu ejército con esta habilidad puede ser blanco de una estratagema por 0PM, aunque otra unidad de tu ejército ya haya sido tomada como blanco de esa estratagema en esta fase.',
      },
      {
        nombre: 'La espada del Imperium',
        desc: 'Puedes repetir las tiradas de carga de la unidad de esta miniatura.',
      },
      {
        nombre: 'Lanzagranadas auxiliar',
        desc: 'El portador tiene la clave Granadas.',
      },
      {
        nombre: 'Escudo reliquia',
        desc: 'El portador tiene un atributo Heridas de 7.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'honrarCapitulo', 'armaduraDesden'],
  },
  {
    id: 'intercesores',
    activo: false,
    nombre: 'Escuadra de Intercesores',
    pts: 75,
    color: '#185FA5',
    palabrasClave: ['Infantería', 'Línea de Batalla', 'Primaris', 'Imperium', 'Adeptus Astartes'],
    stats: { MOV: '6"', RES: 4, HER: 2, SALV: '3+', INV: '-', LID: '6+', OC: 2 },
    distancia: [
      { nombre: 'Rifle bólter', rango: '24"', A: 2, HA: '3+', F: 4, FP: -1, D: 1, especial: 'Asalto' },
      { nombre: 'Pistola bólter', rango: '12"', A: 1, HA: '3+', F: 4, FP: 0, D: 1, especial: 'Pistola' },
    ],
    combate: [
      { nombre: 'Arma de combate', A: 2, HP: '3+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Objetivo Asegurado',
        desc: 'Mientras esta unidad esté en el rango de un marcador de objetivo, se considera que controla ese objetivo aunque haya más modelos enemigos que amigos en el rango.',
      },
      {
        nombre: 'Combate de Fuego Rápido',
        desc: 'Cada vez que un modelo de esta unidad realice un ataque con su Rifle bólter, añade 1 a la tirada de impactar si el objetivo está a la mitad del rango.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'honrarCapitulo', 'defensaContraataque', 'armaduraDesden'],
  },
  {
    id: 'tenientePrimaris',
    nombre: 'Teniente Primaris',
    pts: 65,
    color: '#3A5F8A',
    palabrasClave: ['Infantería', 'Personaje', 'Granadas', 'Imperium', 'Tacticus', 'Adeptus Astartes'],
    stats: { MOV: '6"', RES: 4, HER: 4, SALV: '3+', INV: '-', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Pistola bólter', rango: '12"', A: 1, HA: '2+', F: 4, FP: 0, D: 1, especial: 'Pistola' },
      { nombre: 'Rifle bólter artesanal', rango: '24"', A: 2, HA: '2+', F: 4, FP: -1, D: 2 },
      { nombre: 'Pistola bólter pesada', rango: '18"', A: 1, HA: '2+', F: 4, FP: -1, D: 1, especial: 'Pistola', opcional: true },
      { nombre: 'Pistola de plasma — estándar', rango: '12"', A: 1, HA: '2+', F: 7, FP: -2, D: 1, especial: 'Pistola', opcional: true },
      { nombre: 'Pistola de plasma — sobrecarga', rango: '12"', A: 1, HA: '2+', F: 8, FP: -3, D: 2, especial: 'De Riesgo, Pistola', opcional: true, esAlternativa: true },
      { nombre: 'Pistola neovolkite', rango: '12"', A: 1, HA: '2+', F: 5, FP: 0, D: 2, especial: 'Heridas Devastadoras, Pistola', opcional: true },
    ],
    combate: [
      { nombre: 'Arma cuerpo a cuerpo', A: 5, HP: '2+', F: 4, FP: 0, D: 1 },
      { nombre: 'Arma de energía artesanal', A: 5, HP: '2+', F: 5, FP: -2, D: 2, opcional: true },
      { nombre: 'Puño de energía', A: 4, HP: '2+', F: 8, FP: -2, D: 2, opcional: true },
    ],
    habilidades: [
      {
        nombre: 'Precisión táctica',
        desc: 'Mientras esta miniatura lidere una unidad, las armas con las que estén equipadas las miniaturas de esa unidad tienen la habilidad Impactos Letales.',
      },
      {
        nombre: 'Prioridad de blancos',
        desc: 'La unidad de esta miniatura es elegible para disparar y declarar una carga en un turno en el que haya retrocedido.',
      },
      {
        nombre: 'Escudo de Tormenta',
        desc: 'El portador tiene salvación invulnerable 4+.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'honrarCapitulo', 'armaduraDesden'],
  },
  {
    id: 'intercesorAsalto',
    nombre: 'Escuadra de Intercesores de Asalto',
    pts: 75,
    color: '#2E6DA4',
    palabrasClave: ['Infantería', 'Línea de Batalla', 'Granadas', 'Imperium', 'Tacticus', 'Adeptus Astartes'],
    stats: { MOV: '6"', RES: 4, HER: 2, SALV: '3+', INV: '-', LID: '6+', OC: 2 },
    distancia: [
      { nombre: 'Pistola bólter pesada', rango: '18"', A: 1, HA: '3+', F: 4, FP: -1, D: 1, especial: 'Pistola' },
      { nombre: 'Pistola de plasma — estándar', rango: '12"', A: 1, HA: '3+', F: 7, FP: -2, D: 1, especial: 'Pistola', opcional: true },
      { nombre: 'Pistola de plasma — sobrecarga', rango: '12"', A: 1, HA: '3+', F: 8, FP: -3, D: 2, especial: 'De Riesgo, Pistola', opcional: true, esAlternativa: true },
      { nombre: 'Pistola lanzallamas', rango: '12"', A: '1D6', HA: 'N/A', F: 3, FP: 0, D: 1, especial: 'Ignora Cobertura, Pistola, Ráfaga', opcional: true },
    ],
    combate: [
      { nombre: 'Espada sierra Astartes', A: 4, HP: '3+', F: 4, FP: -1, D: 1 },
      { nombre: 'Arma de energía', A: 4, HP: '3+', F: 5, FP: -2, D: 1, opcional: true },
      { nombre: 'Martillo de Trueno', A: 3, HP: '4+', F: 8, FP: -2, D: 2, especial: 'Heridas Devastadoras', opcional: true },
      { nombre: 'Puño de energía', A: 3, HP: '3+', F: 8, FP: -2, D: 2, opcional: true },
    ],
    habilidades: [
      {
        nombre: 'Doctrina Táctica (Tacticus)',
        desc: 'Si esta unidad no ha Avanzado ni ha Retrocedido este turno, es elegible para disparar y declarar una carga en el mismo turno.',
      },
      {
        nombre: 'Asalto de choque',
        desc: 'Cada vez que una miniatura de esta unidad tome como blanco a una unidad enemiga con un ataque de combate, repite las tiradas para herir de 1. Si esa unidad enemiga está dentro del alcance de un marcador de objetivo, en lugar de eso puedes repetir todas las tiradas para herir.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'honrarCapitulo', 'armaduraDesden'],
  },
  {
    id: 'erradicadores',
    nombre: 'Escuadra de Erradicadores',
    pts: 95,
    color: '#1A5C8A',
    palabrasClave: ['Infantería', 'Granadas', 'Imperium', 'Gravis', 'Adeptus Astartes'],
    stats: { MOV: '5"', RES: 6, HER: 3, SALV: '3+', INV: '-', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Rifle de fusión', rango: '18"', A: 1, HA: '3+', F: 9, FP: -4, D: '1D6', especial: 'Pesada, Fusión 2' },
      { nombre: 'Pistola bólter', rango: '12"', A: 1, HA: '3+', F: 4, FP: 0, D: 1, especial: 'Pistola' },
      { nombre: 'Cañón de fusión', rango: '18"', A: 2, HA: '4+', F: 9, FP: -4, D: '1D6', especial: 'Pesada, Fusión 2', opcional: true, esAlternativa: true },
    ],
    combate: [
      { nombre: 'Arma cuerpo a cuerpo', A: 3, HP: '3+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Destrucción total',
        desc: 'Siempre que un ataque a distancia realizado por una miniatura de esta unidad tome como blanco a una miniatura Monstruo o Vehículo, puedes repetir la tirada para impactar, la tirada para herir y la tirada de daño.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'armaduraDesden'],
  },
  {
    id: 'exterminadores',
    nombre: 'Escuadra de Exterminadores',
    pts: 200,
    color: '#2A4A7A',
    palabrasClave: ['Infantería', 'Imperium', 'Exterminador', 'Adeptus Astartes'],
    stats: { MOV: '5"', RES: 5, HER: 3, SALV: '2+', INV: '4+', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Bólter tormenta', rango: '24"', A: 2, HA: '3+', F: 4, FP: 0, D: 1, especial: 'Fuego Rápido 2' },
      { nombre: 'Cañón de asalto', rango: '24"', A: 6, HA: '3+', F: 6, FP: 0, D: 1, especial: 'Heridas Devastadoras', opcional: true },
      { nombre: 'Lanzallamas pesado', rango: '12"', A: '1D6', HA: 'N/A', F: 5, FP: -1, D: 1, especial: 'Ignora Cobertura, Ráfaga', opcional: true },
      { nombre: 'Lanzamisiles Ciclón — frag', rango: '36"', A: '2D6', HA: '3+', F: 4, FP: 0, D: 1, especial: 'Área', opcional: true },
      { nombre: 'Lanzamisiles Ciclón — perforante', rango: '36"', A: 2, HA: '3+', F: 9, FP: -2, D: '1D6', opcional: true, esAlternativa: true },
    ],
    combate: [
      { nombre: 'Arma de energía', A: 4, HP: '3+', F: 5, FP: -2, D: 1 },
      { nombre: 'Puño de energía', A: 3, HP: '3+', F: 8, FP: -2, D: 2 },
      { nombre: 'Puño sierra', A: 3, HP: '4+', F: 8, FP: -2, D: 2, especial: 'Antivehículo 3+', opcional: true },
    ],
    habilidades: [
      {
        nombre: 'Baliza de teletransporte',
        desc: 'Al inicio de la batalla, puedes desplegar 1 ficha de baliza en cualquier punto del campo fuera de tu zona de despliegue. Una vez por batalla, puedes usar la estratagema Inserción rápida por 0PM para desplegar esta unidad a 3" o menos de la baliza y no a 9" o menos de cualquier miniatura enemiga. Retira la ficha después.',
      },
      {
        nombre: 'Furia de la 1.ª Compañía',
        desc: 'Al realizar un ataque, puedes ignorar cualquier modificador a la Habilidad de Armas, Habilidad de Proyectiles o a la tirada de impactar. Además, si el objetivo es la unidad elegida para Juramento y órdenes, suma 1 a la tirada de impactar.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'honrarCapitulo', 'armaduraDesden'],
  },
  {
    id: 'quadInvader',
    nombre: 'Quad Invader',
    pts: 80,
    color: '#4A7A5A',
    palabrasClave: ['Montada', 'Granadas', 'Imperium', 'Adeptus Astartes'],
    stats: { MOV: '12"', RES: 5, HER: 8, SALV: '3+', INV: '-', LID: '6+', OC: 2 },
    distancia: [
      { nombre: 'Cañón gatling de campaña', rango: '24"', A: 8, HA: '3+', F: 5, FP: 0, D: 1, especial: 'Heridas Devastadoras' },
      { nombre: 'Cañón de fusión', rango: '18"', A: 2, HA: '3+', F: 9, FP: -4, D: '1D6', especial: 'Fusión 2', opcional: true },
      { nombre: 'Pistola bólter pesada', rango: '18"', A: 1, HA: '3+', F: 4, FP: -1, D: 1, especial: 'Pistola' },
      { nombre: 'Rifle bólter doble', rango: '24"', A: 2, HA: '3+', F: 4, FP: -1, D: 1, especial: 'Acoplada' },
    ],
    combate: [
      { nombre: 'Arma cuerpo a cuerpo', A: 5, HP: '3+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Escolta de los Batidores',
        desc: 'Una vez por turno, en la fase de disparo enemiga, cuando una unidad Montada Adeptus Astartes amiga a 6" sea elegida como blanco, esta miniatura puede disparar al terminar esa fase de disparo enemiga. Solo puede apuntar a esa unidad enemiga, y solo si es un blanco elegible.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'armaduraDesden'],
  },
  {
    id: 'firestrike',
    nombre: 'Servotorretas Firestrike',
    pts: 65,
    color: '#7A3A2A',
    palabrasClave: ['Artillería', 'Vehículo', 'Imperium', 'Adeptus Astartes'],
    stats: { MOV: '3"', RES: 6, HER: 6, SALV: '2+', INV: '-', LID: '6+', OC: 2 },
    distancia: [
      { nombre: 'Espolón láser doble', rango: '36"', A: 2, HA: '2+', F: 10, FP: -3, D: '1D6', especial: 'Acoplada' },
      { nombre: 'Cañón automático acelerador doble', rango: '48"', A: 3, HA: '2+', F: 10, FP: -1, D: 3, especial: 'Acoplada', opcional: true },
    ],
    combate: [
      { nombre: 'Arma cuerpo a cuerpo', A: 3, HP: '3+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Protocolos de centinela',
        desc: 'Siempre que elijas esta unidad para la estratagema Disparos preventivos, al resolver dicha estratagema los impactos se causan con toda tirada para impactar de 4+ sin modificar.',
      },
    ],
    estratagemasRelacionadas: ['transhuman', 'armaduraDesden'],
  },
  {
    id: 'hellblasters',
    activo: false,
    nombre: 'Escuadra Hellblasters',
    pts: 100,
    color: '#0F6E56',
    palabrasClave: ['Infantería', 'Primaris', 'Imperium', 'Adeptus Astartes'],
    stats: { MOV: '6"', RES: 4, HER: 2, SALV: '3+', INV: '-', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Incinerador de plasma (estándar)', rango: '30"', A: 2, HA: '3+', F: 7, FP: -3, D: 1, especial: '' },
      { nombre: 'Incinerador de plasma (sobrecarga)', rango: '30"', A: 2, HA: '3+', F: 8, FP: -4, D: 2, especial: 'Peligroso' },
    ],
    combate: [
      { nombre: 'Arma de combate', A: 1, HP: '3+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Precisión Letal',
        desc: 'Cada vez que un modelo de esta unidad realice un ataque a distancia con un incinerador de plasma, una tirada de impactar no modificada de 6 consigue un impacto adicional.',
      },
      {
        nombre: 'Devastación de Plasma',
        desc: 'En la Doctrina Devastadora, mejora el FP de los incineradores de plasma en 1.',
      },
    ],
    estratagemasRelacionadas: ['honrarCapitulo', 'fuegoDeSujecion', 'transhuman', 'armaduraDesden'],
  },
]
