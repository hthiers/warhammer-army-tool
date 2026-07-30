import type { Unidad } from '../types'
import type {
  Amenaza,
  EstadoTablero,
  InformeTactico,
  ObjetivoInforme,
  MarcaEstado,
  ParDistancia,
  UnidadEnMesa,
  Terreno,
  UnidadInforme,
} from '../types/tablero'
import { terrenoDePiezas } from '../data/tablero/footprints'
import { FACCIONES_MAP } from '../data/facciones'
import {
  alcanceArma,
  controlObjetivo,
  distancia,
  enCobertura,
  lineaDeVision,
  movimiento,
} from './geometria'

// ─── Informe táctico ──────────────────────────────────────────────────────────
//
// Traduce el estado del tablero a los hechos derivados que necesita el asistente.
// Todo lo geométrico se resuelve acá: el modelo decide, nunca mide.
// Ver design/plan-implementacion.md § 3.

/** Solo se reportan pares hasta esta distancia; más allá no hay decisión que tomar. */
const CORTE_DISTANCIA = 36

/** Alcance máximo de una carga (2D6). */
const CARGA_MAXIMA = 12

/**
 * Marcas que impiden declarar una carga, según la aptitud del reglamento: una
 * unidad no es apta si está trabada, o si avanzó o retrocedió en este turno.
 */
const IMPIDEN_CARGAR: MarcaEstado[] = ['empeñada', 'avanzada', 'retrocedida']

function puedeDeclararCarga(u: UnidadEnMesa, distanciaAlBlanco: number): boolean {
  if (distanciaAlBlanco > CARGA_MAXIMA) return false
  return !u.marcas.some(m => IMPIDEN_CARGAR.includes(m))
}

export function resolverUnidad(u: UnidadEnMesa): Unidad | undefined {
  return FACCIONES_MAP[u.faccionId]?.unidades.find(x => x.id === u.unidadId)
}

function nombreDe(u: UnidadEnMesa): string {
  return resolverUnidad(u)?.nombre ?? u.unidadId
}

export function construirInforme(estado: EstadoTablero): InformeTactico {
  const vivas = estado.unidades.filter(u => !u.marcas.includes('destruida'))
  const terreno = terrenoDePiezas(estado.piezas)

  const perfiles = new Map<string, Unidad>()
  for (const u of vivas) {
    const perfil = resolverUnidad(u)
    if (perfil) perfiles.set(u.instanciaId, perfil)
  }

  const unidades: UnidadInforme[] = vivas.flatMap(u => {
    const perfil = perfiles.get(u.instanciaId)
    if (!perfil) return []
    return [
      {
        id: u.instanciaId,
        nombre: perfil.nombre,
        bando: u.bando,
        pts: perfil.pts,
        stats: perfil.stats,
        rolIA: perfil.rolIA,
        palabrasClave: perfil.palabrasClave,
        miniaturas: u.miniaturas,
        heridasRestantes: u.heridasRestantes,
        pos: u.pos,
        marcas: u.marcas,
        enCobertura: enCobertura(u, terreno),
      },
    ]
  })

  const objetivos: ObjetivoInforme[] = estado.objetivos.map(obj => {
    const control = controlObjetivo(obj, vivas, u => perfiles.get(u.instanciaId)?.stats.OC ?? 0)
    return {
      id: obj.id,
      pos: obj.pos,
      ocPropio: control.propio,
      ocOponente: control.oponente,
      controlaA: control.controlaA,
      unidadesEn3: control.unidadesEn3.map(u => u.instanciaId),
    }
  })

  const distancias: ParDistancia[] = []
  for (let i = 0; i < vivas.length; i++) {
    for (let j = i + 1; j < vivas.length; j++) {
      const a = vivas[i]
      const b = vivas[j]
      const d = distancia(a, b)
      if (d > CORTE_DISTANCIA) continue
      distancias.push({
        a: a.instanciaId,
        b: b.instanciaId,
        pulgadas: d,
        ldv: lineaDeVision(a, b, terreno),
      })
    }
  }

  return {
    ronda: estado.ronda,
    fase: estado.fase,
    turnoDe: estado.turnoDe,
    marcador: { pv: estado.pv, pm: estado.pm },
    secundarias: estado.secundariasActivas,
    unidades,
    objetivos,
    distancias,
    amenazas: construirAmenazas(vivas, perfiles, terreno),
    bitacora: estado.bitacora.slice(-3).map(e => `R${e.ronda} (${e.lado}): ${e.resumen}`),
  }
}

/**
 * Tabla de "quién puede alcanzar a quién con qué". Es el cálculo que el modelo no
 * puede hacer y más necesita: convierte una pregunta geométrica en una táctica.
 *
 * Se limita a lo accionable en el turno: un arma entra si el blanco ya está a
 * rango o si lo estaría tras mover. Sin ese filtro la tabla crece a N² × armas y
 * se llena de pares irrelevantes.
 */
function construirAmenazas(
  vivas: UnidadEnMesa[],
  perfiles: Map<string, Unidad>,
  terreno: Terreno[]
): Amenaza[] {
  const amenazas: Amenaza[] = []

  for (const atacante of vivas) {
    const perfil = perfiles.get(atacante.instanciaId)
    if (!perfil) continue

    const mov = movimiento(perfil.stats.MOV)
    const enemigos = vivas.filter(v => v.bando !== atacante.bando)

    for (const blanco of enemigos) {
      const d = distancia(atacante, blanco)
      const ldv = lineaDeVision(atacante, blanco, terreno)
      const puedeCargar = puedeDeclararCarga(atacante, d)

      for (const arma of perfil.distancia) {
        const alcance = alcanceArma(arma.rango)
        if (typeof alcance !== 'number') continue
        if (d > alcance + mov) continue

        amenazas.push({
          atacante: atacante.instanciaId,
          arma: arma.nombre,
          blanco: blanco.instanciaId,
          alcance,
          distancia: d,
          enRango: d <= alcance && ldv,
          puedeCargar,
        })
      }

      if (perfil.combate.length > 0 && puedeCargar) {
        amenazas.push({
          atacante: atacante.instanciaId,
          arma: perfil.combate[0].nombre,
          blanco: blanco.instanciaId,
          alcance: 0,
          distancia: d,
          enRango: d === 0,
          puedeCargar,
        })
      }
    }
  }

  return amenazas
}

/** Resumen legible del estado, para revisar de un vistazo que la app y la mesa
 *  no se hayan desincronizado. */
export function resumenSincronizacion(estado: EstadoTablero): string[] {
  return estado.unidades
    .filter(u => !u.marcas.includes('destruida'))
    .map(u => {
      const sector = `${u.pos.x < 20 ? 'izq' : u.pos.x > 40 ? 'der' : 'centro'}-${
        u.pos.y < 15 ? 'inf' : u.pos.y > 29 ? 'sup' : 'med'
      }`
      return `${nombreDe(u)}: ${u.miniaturas} min, ${sector}`
    })
}
