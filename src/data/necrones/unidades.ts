import type { Unidad } from '../../types'

export const UNIDADES: Unidad[] = [
  {
    id: 'guerreros',
    nombre: 'Guerreros Necrones',
    pts: 90,
    color: '#1A6B3A',
    palabrasClave: ['Infantería', 'Línea de Batalla', 'Guerreros Necrones', 'Necrones'],
    stats: { MOV: '5"', RES: 4, HER: 1, SALV: '4+', INV: '-', LID: '7+', OC: 2 },
    distancia: [
      { nombre: 'Rifle gauss', rango: '24"', A: 1, HP: '4+', F: 4, FP: 0, D: 1, especial: 'Impactos Letales, Fuego Rápido 1' },
      { nombre: 'Segador gauss', rango: '12"', A: 2, HP: '4+', F: 5, FP: -1, D: 1, especial: 'Impactos Letales', opcional: true, esAlternativa: true },
    ],
    combate: [
      { nombre: 'Arma cuerpo a cuerpo', A: 1, HA: '4+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Su número es legión',
        desc: 'Siempre que se activen los Protocolos de reanimación de esta unidad, se reanimarán 1D6 heridas en lugar de 1D3, salvo si esta unidad se encuentra dentro del alcance de un marcador de objetivo que controle, en cuyo caso se reanimarán 1D3+3 heridas en su lugar.',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'descargaGauss', 'protocoloInmortal'],
  },
  {
    id: 'skorpekh',
    nombre: 'Destructores Skorpekh',
    pts: 95,
    color: '#4A9B5F',
    palabrasClave: ['Infantería', 'Skorpekh', 'Necrones'],
    stats: { MOV: '8"', RES: 5, HER: 3, SALV: '3+', INV: '-', LID: '7+', OC: 1 },
    distancia: [],
    combate: [
      { nombre: 'Guadaña Skorpekh (hoja demoledora)', A: 3, HA: '3+', F: 7, FP: -2, D: 2 },
      { nombre: 'Guadaña Skorpekh (hoja rebanadora)', A: 4, HA: '3+', F: 5, FP: -2, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Impulso Cinético',
        desc: 'Esta unidad puede cargar en el mismo turno en que haya Avanzado.',
      },
      {
        nombre: 'Aniquiladores de Forma',
        desc: 'Cada vez que esta unidad termina una carga, hasta el final del turno, las armas de combate de sus modelos ganan la regla especial Heridas Devastadoras.',
      },
    ],
    estratagemasRelacionadas: ['cicleMuerte', 'golpeImplacable', 'protocoloInmortal'],
  },
  {
    id: 'plasmante',
    nombre: 'Plasmante',
    pts: 60,
    color: '#6A2A8A',
    palabrasClave: ['Infantería', 'Personaje', 'Criptecnólogo', 'Plasmante', 'Necrones'],
    stats: { MOV: '5"', RES: 4, HER: 4, SALV: '4+', INV: '-', LID: '6+', OC: 1 },
    distancia: [
      { nombre: 'Lanza plásmica', rango: '18"', A: 3, HP: '4+', F: 7, FP: -3, D: 2 },
    ],
    combate: [
      { nombre: 'Lanza plásmica', A: 2, HA: '4+', F: 7, FP: -3, D: 2 },
    ],
    habilidades: [
      {
        nombre: 'Portador de destrucción',
        desc: 'Mientras esta miniatura lidere una unidad, siempre que una miniatura de esa unidad realice un ataque a distancia, toda tirada para impactar exitosa de 5+ sin modificar causa un impacto crítico.',
      },
      {
        nombre: 'Relámpago viviente',
        desc: 'En tu fase de disparo, elige 1 unidad enemiga visible para esta miniatura y a 18" o menos de ella (salvo unidades con la habilidad Agente solitario que no formen parte de una unidad adjunta y estén a más de 12" de esta miniatura) y tira cuatro D6: esa unidad enemiga sufre 1 herida mortal por cada 4+.',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'protocoloInmortal'],
  },
  {
    id: 'criptosiervos',
    nombre: 'Criptosiervos',
    pts: 35,
    color: '#2A8A6A',
    palabrasClave: ['Infantería', 'Criptosiervos', 'Necrones'],
    stats: { MOV: '5"', RES: 4, HER: 2, SALV: '3+', INV: '-', LID: '8+', OC: 1 },
    distancia: [
      { nombre: 'Ojo escudriñador', rango: '6"', A: 2, HP: '4+', F: 5, FP: -1, D: 1 },
    ],
    combate: [
      { nombre: 'Miembros guadaña', A: 4, HA: '4+', F: 5, FP: -1, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Creación vinculada',
        desc: 'Mientras esta unidad se encuentre en la misma unidad que una miniatura Criptecnólogo, esa miniatura Criptecnólogo tiene la habilidad No hay dolor 4+.',
      },
      {
        nombre: 'Vigor sistemático',
        desc: 'Siempre que una miniatura de esta unidad sea eliminada por un ataque de combate, si esa miniatura no ha combatido en esta fase, tira 1D6: con 3+, no la retires del juego. La miniatura puede combatir después de que la unidad atacante termine sus ataques, y después es retirada.',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'protocoloInmortal', 'guardiaInviolable'],
  },
  {
    id: 'pretorianos',
    nombre: 'Pretorianos de la Triarca',
    pts: 85,
    color: '#4A7A5A',
    palabrasClave: ['Infantería', 'Volar', 'Pretorianos de la Triarca', 'Necrones'],
    stats: { MOV: '9"', RES: 5, HER: 2, SALV: '3+', INV: '-', LID: '7+', OC: 1 },
    distancia: [
      { nombre: 'Vara del pacto', rango: '12"', A: 1, HP: '3+', F: 5, FP: -2, D: 2 },
      { nombre: 'Lanzapartículas', rango: '12"', A: 3, HP: '2+', F: 5, FP: 0, D: 1, especial: 'Heridas Devastadoras, Pistola', opcional: true, esAlternativa: true },
    ],
    combate: [
      { nombre: 'Vara del pacto', A: 3, HA: '3+', F: 5, FP: -2, D: 2 },
      { nombre: 'Cuchilla de vacío', A: 4, HA: '3+', F: 5, FP: -2, D: 1, opcional: true, esAlternativa: true },
    ],
    habilidades: [
      {
        nombre: 'Despliegue rápido',
        desc: 'Durante la fase de despliegue puedes configurar esta unidad en Reservas en lugar de desplegarla. Si lo haces, en la Ronda 1 o posterior, al final de cualquier fase de Movimiento tuya, puedes desplegar esta unidad a 9" o menos de un borde del tablero y a más de 9" de cualquier miniatura enemiga.',
      },
      {
        nombre: 'Combatientes implacables',
        desc: 'Puedes repetir las tiradas de carga de esta unidad, y esta unidad es elegible para declarar una carga en un turno en el que haya retrocedido.',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'protocoloInmortal'],
  },
  {
    id: 'reanimadorCanoptico',
    nombre: 'Reanimador Canóptico',
    pts: 75,
    color: '#2A7A5A',
    palabrasClave: ['Vehículo', 'Bípode', 'Canóptico', 'Reanimador', 'Necrones'],
    stats: { MOV: '7"', RES: 6, HER: 6, SALV: '3+', INV: '-', LID: '7+', OC: 3 },
    distancia: [
      { nombre: 'Rayo atomizador', rango: '12"', A: 3, HP: '4+', F: 6, FP: -2, D: 1 },
    ],
    combate: [
      { nombre: 'Garras de reanimador', A: 4, HA: '4+', F: 5, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'No hay dolor 4+',
        desc: 'Cada vez que esta unidad sufre una herida mortal, tira 1D6: con un 4+, esa herida mortal queda ignorada.',
      },
      {
        nombre: 'Rayo de reanimación de nanoescarabajos (Aura)',
        desc: 'Mientras una unidad Necrones amiga se encuentre a 12" o menos de esta miniatura, siempre que se activen sus Protocolos de reanimación esa unidad reanimará 1D3 heridas adicionales.',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'protocoloInmortal'],
  },
  {
    id: 'lokhustPesados',
    nombre: 'Destructores Lokhust Pesados',
    pts: 65,
    color: '#1A6B3A',
    palabrasClave: ['Montada', 'Volar', 'Destructores Lokhust Pesados', 'Necrones'],
    stats: { MOV: '7"', RES: 6, HER: 4, SALV: '3+', INV: '-', LID: '7+', OC: 2 },
    distancia: [
      { nombre: 'Destructor gauss', rango: '48"', A: 1, HP: '3+', F: 14, FP: -4, D: 6, especial: 'Pesada, Impactos Letales' },
      { nombre: 'Exterminador emítico', rango: '36"', A: 6, HP: '3+', F: 6, FP: -1, D: 1, especial: 'Fuego Rápido 6, Golpes Sostenidos 1, Pesada', opcional: true, esAlternativa: true },
    ],
    combate: [
      { nombre: 'Arma cuerpo a cuerpo', A: 2, HA: '3+', F: 4, FP: 0, D: 1 },
    ],
    habilidades: [
      {
        nombre: 'Optimizados para la matanza',
        desc: 'Siempre que una miniatura de esta unidad realice un ataque con un exterminador emítico contra una unidad Infantería, repite las tiradas para herir de 1. Siempre que una miniatura realice un ataque con un destructor gauss contra una unidad Monstruo o Vehículo, repite las tiradas para herir de 1.',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'protocoloInmortal'],
  },
  {
    id: 'enjambreEscarabeo',
    nombre: 'Enjambres Canópticos Escarabeo',
    pts: 50,
    color: '#3A7A3A',
    palabrasClave: ['Enjambre', 'Volar', 'Canóptico', 'Enjambres escarabeo', 'Necrones'],
    stats: { MOV: '9"', RES: 2, HER: 4, SALV: '6+', INV: '-', LID: '8+', OC: 0 },
    distancia: [],
    combate: [
      { nombre: 'Mandíbulas devoradoras', A: 6, HA: '5+', F: 2, FP: 0, D: 1, especial: 'Impactos Letales' },
    ],
    habilidades: [
      {
        nombre: 'Final violento 1',
        desc: 'Cuando esta unidad es destruida, tira 1D6 antes de retirarla: con un 6, cada unidad enemiga a 3" o menos sufre 1 herida mortal.',
      },
      {
        nombre: 'Autodestrucción',
        desc: 'Al inicio de la fase de combate, si esta unidad se encuentra en la zona de amenaza de una o más unidades enemigas, puedes elegir una miniatura de esta unidad y eliminarla. Si lo haces, elige 1 unidad enemiga en la zona de amenaza de esa miniatura y tira 1D6, sumando 1 si esa unidad es un Vehículo. Con 2-5: 1D3 heridas mortales; con 6+: 1D3+3 heridas mortales.',
      },
      {
        nombre: 'Enjambre',
        desc: 'Mientras una unidad enemiga se encuentre en la zona de amenaza de esta unidad, resta 1 al atributo Control de Objetivo de las miniaturas de esa unidad enemiga (mínimo 1).',
      },
    ],
    estratagemasRelacionadas: ['reanudacionMejorada', 'protocoloInmortal'],
  },
  {
    id: 'guardiaReal',
    nombre: 'Guardia Real',
    pts: 85,
    color: '#8B6914',
    palabrasClave: ['Infantería', 'Guardia Real', 'Necrones'],
    stats: { MOV: '5"', RES: 5, HER: 3, SALV: '2+', INV: '4+', LID: '7+', OC: 2 },
    distancia: [
      { nombre: 'Escudo de dispersión', rango: '12"', A: 1, HP: '2+', F: 5, FP: -2, D: 2, especial: 'Pistola' },
    ],
    combate: [
      { nombre: 'Espada hiper-fase', A: 3, HA: '2+', F: 6, FP: -3, D: 2 },
      { nombre: 'Guadaña hiper-fase', A: 3, HA: '2+', F: 7, FP: -3, D: 2 },
    ],
    habilidades: [
      {
        nombre: 'Guardia Inviolable',
        desc: 'Mientras este modelo acompañe a un Personaje Necrón, ese Personaje puede ignorar las reglas de Guardia y añadir 1 a sus tiradas de salvación de invulnerabilidad.',
      },
      {
        nombre: 'Sirvientes de la Dinastía',
        desc: 'Al inicio de la fase de Lucha, si esta unidad está en radio de contacto con unidades enemigas, puede seleccionar una de ellas: hasta el final de la fase, los ataques de esta unidad contra esa unidad repiten tiradas de 1 para herir.',
      },
    ],
    estratagemasRelacionadas: ['guardiaInviolable', 'protocoloInmortal', 'descargaGauss'],
  },
]
