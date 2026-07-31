import type { EstadoTablero, InformeTactico, Lado } from '../src/types/tablero'
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

export interface AccionValidada {
  accion: AccionTactica
  valida: boolean
  motivo?: string
  /** Nombre legible de la unidad, para la UI. */
  nombreUnidad: string
  nombreBlanco?: string
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
