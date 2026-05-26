import type { ReglaFaccion } from '../../types'

export const REGLAS_FACCION: ReglaFaccion[] = [
  {
    id: 'juramentoMomento',
    nombre: 'Juramento del Momento',
    desc: 'Al inicio de tu fase de Mando, selecciona una unidad enemiga visible para tu Señor de la Guerra. Hasta el inicio de tu próxima fase de Mando, los modelos con esta habilidad pueden repetir tiradas para impactar y para herir contra esa unidad.',
    efectos: [
      'Selecciona 1 unidad enemiga visible para tu Señor de la Guerra al inicio de tu fase de Mando.',
      'Hasta tu próximo turno, repite tiradas para impactar y para herir contra el objetivo designado.',
      'El objetivo del Juramento cambia cada turno — elige con cuidado según la amenaza prioritaria.',
    ],
  },
  {
    id: 'noConoceranElMiedo',
    nombre: 'Y No Conocerán el Miedo',
    desc: 'Cada vez que se realice un test de Retirada por Bajas para una unidad con esta habilidad, dicho test se supera automáticamente.',
    efectos: [
      'Los tests de Retirada por Bajas se superan automáticamente — esta unidad nunca huye por bajas.',
    ],
  },
]
