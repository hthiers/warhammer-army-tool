import type { PosturaId } from '../../types/misiones'
import type { DisenoId } from './layouts'

export const STORAGE_KEY_DISPOSICION = 'wh40k-disposicion-actual'

export interface EstadoDisposicion {
  propia: PosturaId
  oponente: PosturaId
  diseno: DisenoId
}

export const DISPOSICION_INICIAL: EstadoDisposicion = { propia: 'hold', oponente: 'hold', diseno: 'a' }

export function cargarEstadoDisposicion(): EstadoDisposicion {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY_DISPOSICION)
    if (guardado) return { ...DISPOSICION_INICIAL, ...JSON.parse(guardado) }
  } catch {
    // ignorar errores de parseo
  }
  return DISPOSICION_INICIAL
}
