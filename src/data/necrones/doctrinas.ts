import type { Destacamento, ReglaDestacamento, Mejora } from '../../types'

export const DESTACAMENTOS: Destacamento[] = [
  { id: 'dinasta', nombre: 'Dinasta Despertada' },
  { id: 'canoptek', nombre: 'Guardia Canoptek' },
]

export const REGLAS_DESTACAMENTO: Record<string, ReglaDestacamento> = {
  dinasta: {
    nombre: 'Regla de la Dinasta Despertada',
    efectos: ['Pendiente de migración a 11ª edición.'],
  },
  canoptek: {
    nombre: 'Regla de la Guardia Canoptek',
    efectos: ['Pendiente de migración a 11ª edición.'],
  },
}

export const MEJORAS: Record<string, Mejora[]> = {
  dinasta: [],
  canoptek: [],
}
