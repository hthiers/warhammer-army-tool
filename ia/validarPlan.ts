import type { EstadoTablero, InformeTactico, Lado, MarcaEstado } from '../src/types/tablero'
import { MESA_ALTO, MESA_ANCHO } from '../src/types/tablero'
import { distanciaEntrePuntos, movimiento } from '../src/engine/geometria'
import { resolverUnidad } from '../src/engine/informe'
import { FACCIONES_MAP } from '../src/data/facciones'
import type { AccionTactica, PlanTactico } from './esquemas'

// ─── Validación del plan ──────────────────────────────────────────────────────
//
// El Táctico propone; esto comprueba que cada acción sea legal antes de que el
// jugador la ejecute sobre la mesa. Las acciones que no pasan NO se descartan: se
// muestran tachadas con el motivo, porque el contraste entre lo propuesto y lo
// legal es información útil.
//
// Ver design/plan-implementacion.md § 4.

/** Margen sobre el movimiento declarado, para no rechazar por redondeo. */
const TOLERANCIA_MOVIMIENTO = 0.5

/** Un avance añade 1D6; el máximo posible es 6. */
const AVANCE_MAXIMO = 6

/**
 * Tirada que hay que hacer antes de poder ejecutar la acción. El avance y la carga
 * son aleatorios: hasta que no se tira, no se sabe si el destino que propuso el
 * Táctico es alcanzable.
 */
export interface TiradaRequerida {
  tipo: '1D6' | '2D6'
  motivo: string
  /** Resultado mínimo para que la acción salga como estaba planeada. */
  minimo: number
  /** Pulgadas que la unidad recorre sin necesidad de tirada. */
  base: number
}

export interface AccionValidada {
  accion: AccionTactica
  valida: boolean
  motivo?: string
  /** Nombre legible de la unidad, para la UI. */
  nombreUnidad: string
  nombreBlanco?: string
  tirada?: TiradaRequerida
  /** Pulgadas de la posición actual al destino. Es lo que hay que medir en la mesa. */
  recorrido?: number
}

export interface PlanValidado {
  plan: PlanTactico
  acciones: AccionValidada[]
  /** Cuántas acciones no pasaron la comprobación. */
  invalidas: number
}

export function validarPlan(
  plan: PlanTactico,
  estado: EstadoTablero,
  informe: InformeTactico,
  ladoTactico: Lado
): PlanValidado {
  const enMesa = new Map(estado.unidades.map(u => [u.instanciaId, u]))
  const nombres = new Map(informe.unidades.map(u => [u.id, u.nombre]))
  const yaMovieron = new Set<string>()

  const acciones = plan.acciones.map(accion => {
    const motivo = motivoInvalidez(accion, {
      estado,
      informe,
      ladoTactico,
      enMesa,
      yaMovieron,
    })
    if (!motivo && esMovimiento(accion.tipo)) yaMovieron.add(accion.unidadId)

    return {
      accion,
      valida: !motivo,
      motivo,
      nombreUnidad: nombres.get(accion.unidadId) ?? accion.unidadId,
      nombreBlanco: accion.blancoId ? nombres.get(accion.blancoId) : undefined,
      tirada: motivo ? undefined : tiradaRequerida(accion, enMesa, informe),
      recorrido: recorridoDe(accion, enMesa),
    }
  })

  return { plan, acciones, invalidas: acciones.filter(a => !a.valida).length }
}

function esMovimiento(tipo: AccionTactica['tipo']): boolean {
  return tipo === 'mover' || tipo === 'avanzar' || tipo === 'retroceder'
}

interface Contexto {
  estado: EstadoTablero
  informe: InformeTactico
  ladoTactico: Lado
  enMesa: Map<string, EstadoTablero['unidades'][number]>
  yaMovieron: Set<string>
}

/** Devuelve el motivo por el que la acción es ilegal, o `undefined` si es válida. */
function motivoInvalidez(accion: AccionTactica, ctx: Contexto): string | undefined {
  const unidad = ctx.enMesa.get(accion.unidadId)
  if (!unidad) return `La unidad ${accion.unidadId} no está en la mesa.`
  if (unidad.marcas.includes('destruida')) return 'La unidad está destruida.'
  if (unidad.bando !== ctx.ladoTactico) {
    return 'Esa unidad no es del bando que juega el Táctico.'
  }

  const perfil = resolverUnidad(unidad)
  if (!perfil) return 'No se encuentra el perfil de la unidad.'

  if (esMovimiento(accion.tipo)) {
    if (ctx.yaMovieron.has(accion.unidadId)) return 'La unidad ya tiene un movimiento asignado.'
    if (!accion.destino) return 'Falta el destino del movimiento.'

    const { x, y } = accion.destino
    if (!Number.isFinite(x) || !Number.isFinite(y)) return 'El destino no es un punto válido.'
    if (x < 0 || x > MESA_ANCHO || y < 0 || y > MESA_ALTO) {
      return `El destino (${x}, ${y}) cae fuera de la mesa de ${MESA_ANCHO}×${MESA_ALTO}".`
    }

    const recorrido = distanciaEntrePuntos(unidad.pos, accion.destino)
    const mov = movimiento(perfil.stats.MOV)
    const maximo = mov + (accion.tipo === 'avanzar' ? AVANCE_MAXIMO : 0) + TOLERANCIA_MOVIMIENTO
    if (recorrido > maximo) {
      return `Son ${recorrido.toFixed(1)}" y su movimiento máximo es ${maximo.toFixed(1)}".`
    }
    if (accion.tipo !== 'retroceder' && unidad.marcas.includes('empeñada')) {
      return 'Está trabada: solo puede retroceder.'
    }
    return undefined
  }

  if (accion.tipo === 'disparar' || accion.tipo === 'combatir') {
    if (!accion.blancoId) return 'Falta el blanco.'
    const blanco = ctx.enMesa.get(accion.blancoId)
    if (!blanco) return `El blanco ${accion.blancoId} no está en la mesa.`
    if (blanco.bando === ctx.ladoTactico) return 'El blanco es una unidad propia.'

    const alcanza = ctx.informe.amenazas.some(
      a => a.atacante === accion.unidadId && a.blanco === accion.blancoId && a.enRango
    )
    if (!alcanza) return 'Ninguna de sus armas alcanzaba ese blanco según el informe.'
    return undefined
  }

  if (accion.tipo === 'cargar') {
    if (!accion.blancoId) return 'Falta el blanco de la carga.'
    const puede = ctx.informe.amenazas.some(
      a => a.atacante === accion.unidadId && a.blanco === accion.blancoId && a.puedeCargar
    )
    if (!puede) {
      return 'No era apta para declarar carga: trabada, o avanzó o retrocedió este turno.'
    }
    return undefined
  }

  if (accion.tipo === 'estratagema') {
    if (!accion.estratagemaId) return 'Falta el id de la estratagema.'
    const faccion = FACCIONES_MAP[unidad.faccionId]
    const estratagema = Object.values(faccion?.estratagemas ?? {})
      .flat()
      .find(e => e.id === accion.estratagemaId)
    if (!estratagema) return `La estratagema ${accion.estratagemaId} no existe en su facción.`

    const disponibles = ctx.estado.pm[ctx.ladoTactico]
    if (estratagema.pm > disponibles) {
      return `Cuesta ${estratagema.pm} PM y solo hay ${disponibles}.`
    }
    return undefined
  }

  // 'mantener' y 'accion' no tienen precondiciones que podamos comprobar aquí.
  return undefined
}

/** Marca de estado que deja cada tipo de acción al ejecutarse. */
export const MARCAS_POR_ACCION: Partial<Record<AccionTactica['tipo'], MarcaEstado>> = {
  avanzar: 'avanzada',
  retroceder: 'retrocedida',
  disparar: 'ha_disparado',
  cargar: 'ha_cargado',
}

/** Distancia del movimiento propuesto, o `undefined` si la acción no mueve. */
export function recorridoDe(
  accion: AccionTactica,
  enMesa: Map<string, EstadoTablero['unidades'][number]>
): number | undefined {
  if (!esMovimiento(accion.tipo) || !accion.destino) return undefined
  const unidad = enMesa.get(accion.unidadId)
  if (!unidad) return undefined
  return Math.round(distanciaEntrePuntos(unidad.pos, accion.destino) * 10) / 10
}

// ─── Tiradas ──────────────────────────────────────────────────────────────────

/**
 * Qué hay que tirar antes de ejecutar la acción, si es que hay que tirar algo.
 * El avance suma 1D6 al movimiento y la carga se resuelve con 2D6, así que el
 * destino que propone el Táctico es una intención, no un hecho.
 */
export function tiradaRequerida(
  accion: AccionTactica,
  enMesa: Map<string, EstadoTablero['unidades'][number]>,
  informe: InformeTactico
): TiradaRequerida | undefined {
  const unidad = enMesa.get(accion.unidadId)
  if (!unidad) return undefined

  if (accion.tipo === 'avanzar' && accion.destino) {
    const perfil = resolverUnidad(unidad)
    if (!perfil) return undefined
    const base = movimiento(perfil.stats.MOV)
    const recorrido = distanciaEntrePuntos(unidad.pos, accion.destino)
    const falta = recorrido - base
    if (falta <= 0) return undefined
    return {
      tipo: '1D6',
      motivo: `Avance de ${recorrido.toFixed(1)}" con MOV ${base}"`,
      minimo: Math.ceil(falta),
      base,
    }
  }

  if (accion.tipo === 'cargar' && accion.blancoId) {
    const par = informe.amenazas.find(
      a => a.atacante === accion.unidadId && a.blanco === accion.blancoId
    )
    if (!par) return undefined
    return {
      tipo: '2D6',
      motivo: `Carga a ${par.distancia}"`,
      minimo: Math.ceil(par.distancia),
      base: 0,
    }
  }

  return undefined
}

export interface ResultadoTirada {
  valor: number
  exito: boolean
  /** Alcance total conseguido, en pulgadas. */
  alcance: number
}

export function resolverTirada(tirada: TiradaRequerida, valor: number): ResultadoTirada {
  return {
    valor,
    exito: valor >= tirada.minimo,
    alcance: tirada.base + valor,
  }
}

/**
 * Punto más lejano hacia el destino que la unidad alcanza de verdad. Si el avance
 * se queda corto, la unidad no se queda quieta: mueve lo que pueda en esa
 * dirección.
 */
export function recortarDestino(
  origen: { x: number; y: number },
  destino: { x: number; y: number },
  alcance: number
): { x: number; y: number } {
  const recorrido = distanciaEntrePuntos(origen, destino)
  if (recorrido <= alcance || recorrido === 0) return destino
  const fraccion = alcance / recorrido
  return {
    x: Math.round((origen.x + (destino.x - origen.x) * fraccion) * 10) / 10,
    y: Math.round((origen.y + (destino.y - origen.y) * fraccion) * 10) / 10,
  }
}

/** Tira N dados de seis caras y devuelve la suma. */
export function tirarDados(cantidad: number): number {
  let total = 0
  for (let i = 0; i < cantidad; i++) total += 1 + Math.floor(Math.random() * 6)
  return total
}
