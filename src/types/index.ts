// ─── Armas ───────────────────────────────────────────────────────────────────

export interface ArmaDistancia {
  nombre: string
  rango: string
  A: number | string
  HA: string
  F: number
  FP: number
  D: number | string
  especial?: string
  opcional?: boolean
  esAlternativa?: boolean
}

export interface ArmaCombate {
  nombre: string
  A: number | string
  HP: string
  F: number
  FP: number
  D: number | string
  especial?: string
  opcional?: boolean
  esAlternativa?: boolean
}

// ─── Unidad ──────────────────────────────────────────────────────────────────

export interface Stats {
  MOV: string
  RES: number
  HER: number
  SALV: string
  INV: string
  LID: string
  OC: number
}

export interface Habilidad {
  nombre: string
  desc: string
}

export interface Unidad {
  id: string
  nombre: string
  pts: number
  color: string
  activo?: boolean
  palabrasClave: string[]
  stats: Stats
  distancia: ArmaDistancia[]
  combate: ArmaCombate[]
  habilidades: Habilidad[]
  estratagemasRelacionadas: string[]
}

// ─── Doctrina ─────────────────────────────────────────────────────────────────

export interface Doctrina {
  id: string
  nombre: string
  ronda: string
  rondaColor: string
  rondaTexto: string
  desc: string
  efectos: string[]
}

// ─── Estratagema ──────────────────────────────────────────────────────────────

export interface Estratagema {
  id: string
  nombre: string
  pc: number
  fase: string
  desc: string
  efecto: string
  restriccion?: string
  unidades: string[]
  etiqueta?: string
}

// ─── Destacamento ─────────────────────────────────────────────────────────────

export interface Destacamento {
  id: string
  nombre: string
}

// ─── Facción ──────────────────────────────────────────────────────────────────

export interface ReglaFaccion {
  id: string
  nombre: string
  desc: string
  efectos?: string[]
}

export interface DatosFaccion {
  id: string
  nombre: string
  color: string
  unidades: Unidad[]
  destacamentos: Destacamento[]
  doctrinas: Record<string, Doctrina[]>
  estratagemas: Record<string, Estratagema[]>
  reglasFaccion: ReglaFaccion[]
}

// ─── Estado de la app ────────────────────────────────────────────────────────

export type Pestana = 'ficha' | 'doctrinas' | 'estratagemas' | 'faccion'
