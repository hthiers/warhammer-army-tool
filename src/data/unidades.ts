import type { Unidad } from '../types'

export const UNIDADES: Unidad[] = [
  {
    id: 'capitan',
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
    id: 'intercesores',
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
    id: 'hellblasters',
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
