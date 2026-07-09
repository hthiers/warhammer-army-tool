// ─── Misiones (11ª edición) ──────────────────────────────────────────────────

export interface NivelPuntuacion {
  texto: string
  pv: number
  porUnidad?: boolean
  acumulable?: boolean
  cap?: number
  disyuntivo?: boolean // se muestra como alternativa ("o") al nivel anterior
}

export interface SeccionPuntuacion {
  cuando: string
  disparador?: string
  chip?: string
  niveles: NivelPuntuacion[]
}

export interface AccionObjetivo {
  titulo: string
  filas: { clave: string; valor: string }[]
}

export interface MisionPrimaria {
  id: string
  mazo: string
  nombre: string
  nombreEs: string
  secciones: SeccionPuntuacion[]
  accion?: AccionObjetivo
}

export interface MisionSecundaria {
  id: string
  nombre: string
  nombreEs: string
  tipo?: string
  alRobarla?: string
  secciones: SeccionPuntuacion[]
  accion?: AccionObjetivo
  notaDisenador?: string
}

export type PosturaId = 'hold' | 'purge' | 'disruption' | 'recon' | 'priority'

export interface Postura {
  id: PosturaId
  mazo: string
  nombre: string
  nombreEs: string
  color: string
}
