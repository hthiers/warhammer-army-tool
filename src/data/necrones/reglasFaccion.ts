import type { ReglaFaccion } from '../../types'

export const REGLAS_FACCION: ReglaFaccion[] = [
  {
    id: 'protocolosReanimacion',
    nombre: 'Protocolos de Reanimación',
    desc: 'Al final de cada turno de jugador, cada unidad Necrones que no esté destruida puede intentar reanimarse. Tira 1D6 por cada herida perdida; por cada resultado igual o superior a la característica Liderazgo de esa unidad, recupera 1 herida perdida. Si la unidad no tiene heridas perdidas pero tiene modelos destruidos, en su lugar reanima 1 modelo destruido con 1 herida restante.',
    efectos: [
      'Se activa al final de cada turno de jugador (el tuyo y el del rival).',
      'Tira 1D6 por herida perdida — recupera 1 herida por cada resultado ≥ LID de la unidad.',
      'Si no hay heridas perdidas: reanima 1 modelo destruido con 1 herida restante (si el resultado lo permite).',
      'Habilidades de aliados como el Reanimador Canóptico añaden 1D3 heridas adicionales al activarse.',
    ],
  },
  {
    id: 'metalVivo',
    nombre: 'Metal Vivo',
    desc: 'Al inicio de cada uno de tus turnos, cada unidad con esta habilidad recupera 1 herida perdida.',
    efectos: [
      'Recuperación pasiva de 1 herida al inicio de tu turno, sin tiradas.',
      'Se aplica solo a unidades con la palabra clave Metal Vivo — principalmente Vehículos y Monstruos Necrones.',
    ],
  },
]
