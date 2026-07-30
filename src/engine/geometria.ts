import type {
  Lado,
  ObjetivoMesa,
  Pulgadas,
  Punto,
  Rol,
  Terreno,
  UnidadEnMesa,
  ZonaDespliegue,
} from '../types/tablero'

// ─── Motor de geometría ───────────────────────────────────────────────────────
//
// Funciones puras, sin React. Todo lo que el asistente NO debe calcular por su
// cuenta se resuelve acá: distancias, línea de visión, cobertura y control de
// objetivos. Ver design/plan-implementacion.md § 2.

/** Distancia entre centros, sin descontar huellas. */
export function distanciaEntrePuntos(a: Punto, b: Punto): Pulgadas {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

/**
 * Distancia entre unidades: centro a centro menos ambas huellas, con piso en 0.
 * Equivale a medir de peana más cercana a peana más cercana.
 */
export function distancia(a: UnidadEnMesa, b: UnidadEnMesa): Pulgadas {
  const bruta = distanciaEntrePuntos(a.pos, b.pos) - a.radio - b.radio
  return Math.max(0, redondear(bruta))
}

/** Distancia de una unidad a un punto (p. ej. un marcador de objetivo). */
export function distanciaAPunto(u: UnidadEnMesa, p: Punto): Pulgadas {
  return Math.max(0, redondear(distanciaEntrePuntos(u.pos, p) - u.radio))
}

function redondear(n: Pulgadas): Pulgadas {
  return Math.round(n * 10) / 10
}

// ─── Polígonos ────────────────────────────────────────────────────────────────

/** Ray casting horizontal. Los vértices se asumen en orden, cerrando implícitamente. */
export function puntoEnPoligono(p: Punto, poligono: Punto[]): boolean {
  let dentro = false
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const vi = poligono[i]
    const vj = poligono[j]
    const cruza = vi.y > p.y !== vj.y > p.y
    if (cruza && p.x < ((vj.x - vi.x) * (p.y - vi.y)) / (vj.y - vi.y) + vi.x) {
      dentro = !dentro
    }
  }
  return dentro
}

function orientacion(a: Punto, b: Punto, c: Punto): number {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
}

/** Intersección de segmentos, ignorando el caso degenerado de colinealidad. */
function segmentosSeCruzan(p1: Punto, p2: Punto, p3: Punto, p4: Punto): boolean {
  const o1 = orientacion(p1, p2, p3)
  const o2 = orientacion(p1, p2, p4)
  const o3 = orientacion(p3, p4, p1)
  const o4 = orientacion(p3, p4, p2)
  return o1 * o2 < 0 && o3 * o4 < 0
}

function segmentoCruzaPoligono(a: Punto, b: Punto, poligono: Punto[]): boolean {
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    if (segmentosSeCruzan(a, b, poligono[j], poligono[i])) return true
  }
  return false
}

// ─── Línea de visión y cobertura ──────────────────────────────────────────────

/**
 * Hay línea de visión si el segmento centro-centro no cruza ninguna pieza de
 * terreno que bloquee. Excepción: si alguna de las dos unidades está dentro de
 * esa pieza, no se considera bloqueada (se ve hacia dentro y hacia fuera de la
 * ruina que ocupas).
 */
export function lineaDeVision(a: UnidadEnMesa, b: UnidadEnMesa, terreno: Terreno[]): boolean {
  for (const t of terreno) {
    if (!t.bloqueaLdV) continue
    const algunaDentro =
      puntoEnPoligono(a.pos, t.poligono) || puntoEnPoligono(b.pos, t.poligono)
    if (algunaDentro) continue
    if (segmentoCruzaPoligono(a.pos, b.pos, t.poligono)) return false
  }
  return true
}

export function enCobertura(u: UnidadEnMesa, terreno: Terreno[]): boolean {
  return terreno.some(t => t.daCobertura && puntoEnPoligono(u.pos, t.poligono))
}

// ─── Zonas de despliegue ──────────────────────────────────────────────────────

/** Si el centro de la unidad cae dentro de la zona. Aproximación deliberada: no
 *  comprueba que toda la huella esté contenida. */
export function enZonaDespliegue(u: UnidadEnMesa, zona: ZonaDespliegue): boolean {
  return puntoEnPoligono(u.pos, zona.poligono)
}

/** Rol de la zona que contiene a la unidad, o `null` si está en tierra de nadie. */
export function zonaDe(u: UnidadEnMesa, zonas: ZonaDespliegue[]): Rol | null {
  return zonas.find(z => enZonaDespliegue(u, z))?.rol ?? null
}

// ─── Objetivos ────────────────────────────────────────────────────────────────

export const RANGO_OBJETIVO: Pulgadas = 3

export interface ControlObjetivo {
  propio: number
  oponente: number
  controlaA: Lado | null
  unidadesEn3: UnidadEnMesa[]
}

/**
 * Control de objetivo: suma el OC de las unidades a 3" o menos. Controla el bando
 * con más OC; empate a cero o empate entre bandos deja el objetivo sin control.
 */
export function controlObjetivo(
  objetivo: ObjetivoMesa,
  unidades: UnidadEnMesa[],
  ocDe: (u: UnidadEnMesa) => number
): ControlObjetivo {
  const enRango = unidades.filter(
    u => !u.marcas.includes('destruida') && distanciaAPunto(u, objetivo.pos) <= RANGO_OBJETIVO
  )

  let propio = 0
  let oponente = 0
  for (const u of enRango) {
    if (u.bando === 'propio') propio += ocDe(u)
    else oponente += ocDe(u)
  }

  const controlaA: Lado | null =
    propio > oponente ? 'propio' : oponente > propio ? 'oponente' : null

  return { propio, oponente, controlaA, unidadesEn3: enRango }
}

// ─── Parseo de perfiles ───────────────────────────────────────────────────────

/**
 * Convierte un rango de arma (`24"`) o un movimiento (`5"`) a pulgadas.
 * Devuelve `'combate'` para armas cuerpo a cuerpo y `null` si no se reconoce.
 */
export function pulgadasDePerfil(valor: string): Pulgadas | 'combate' | null {
  const limpio = valor.trim()
  if (/combate|melee/i.test(limpio)) return 'combate'
  const m = limpio.match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return null
  return parseFloat(m[1].replace(',', '.'))
}

/** Alcance de un arma a distancia. */
export function alcanceArma(rango: string): Pulgadas | 'combate' | null {
  return pulgadasDePerfil(rango)
}

/** Movimiento de una unidad en pulgadas; 0 si el perfil no es numérico. */
export function movimiento(mov: string): Pulgadas {
  const v = pulgadasDePerfil(mov)
  return typeof v === 'number' ? v : 0
}
