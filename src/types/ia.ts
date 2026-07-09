import type { RolIA } from './index'

// ─── IA de oponente (modo solitario) ──────────────────────────────────────────

export interface ExcepcionDirectiva {
  rol: RolIA | 'nota'
  etiqueta: string
  entonces: string
  sino?: string
}

export interface DirectivaMovimiento {
  roll: number
  nombre: string
  reglaGeneral: string
  reglaGeneralSino?: string
  excepciones: ExcepcionDirectiva[]
}

export interface PrioridadBlanco {
  roll: number
  nombre: string
  descripcion: string
  desempate?: string
}

export interface RangoActivacionEstratagema {
  min: number
  max: number
  descripcion: string
}

export interface EstratagemaIA {
  roll: number
  nombre: string
  cuando: string
  descripcion: string
}
