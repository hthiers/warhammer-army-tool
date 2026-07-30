import type { PosturaId } from '../../types/misiones'
import type { DisenoId } from '../misiones/layouts'
import { obtenerNumeroLayout } from '../misiones/layouts'
import type {
  ObjetivoMesa,
  Pulgadas,
  Punto,
  Terreno,
  ZonaDespliegue,
} from '../../types/tablero'
import { MESA_ALTO, MESA_ANCHO } from '../../types/tablero'
import type { PiezaTerreno } from '../../types/tablero'
import { piezaEspejo, terrenoDePiezas } from './footprints'

// ─── Layouts de mesa (geometría) ──────────────────────────────────────────────
//
// Complementa src/data/misiones/layouts.ts (que solo resuelve el NÚMERO de layout
// a partir del par de disposiciones) con la geometría real: zonas de despliegue,
// objetivos y terreno.
//
// Hay 15 emparejamientos únicos × 3 diseños = 45 layouts posibles. Se van
// cargando de a poco; los que no están definidos degradan a mesa vacía con las
// líneas de centro y la rejilla.
//
// Convención de coordenadas: 44" de ancho × 60" de alto, origen abajo-izquierda,
// DEFENSOR en el borde inferior y ATACANTE en el superior.

export interface LayoutMesa {
  numero: number
  diseno: DisenoId
  nombre: string
  zonas: ZonaDespliegue[]
  objetivos: ObjetivoMesa[]
  /** Las 16 piezas del set, por footprint + ancla + rotación. */
  piezas: PiezaTerreno[]
  /** Marca los layouts cuyas medidas se leyeron de un diagrama y aún no se han
   *  verificado con cinta métrica sobre la mesa. */
  aproximado?: boolean
}

/** Geometría de terreno del layout, lista para el motor. */
export function terrenoDeLayout(layout: LayoutMesa): Terreno[] {
  return terrenoDePiezas(layout.piezas)
}

// ─── Helpers de forma ─────────────────────────────────────────────────────────

type Borde = 'inferior' | 'superior'

function profundidadA(borde: Borde, profundidad: Pulgadas): Pulgadas {
  return borde === 'inferior' ? profundidad : MESA_ALTO - profundidad
}

/** Banda que cruza los 44" de ancho a una profundidad fija desde su borde. */
export function zonaBanda(borde: Borde, profundidad: Pulgadas): Punto[] {
  const y = profundidadA(borde, profundidad)
  const yBorde = borde === 'inferior' ? 0 : MESA_ALTO
  return [
    { x: 0, y: yBorde },
    { x: MESA_ANCHO, y: yBorde },
    { x: MESA_ANCHO, y },
    { x: 0, y },
  ]
}

/** Un tramo del perfil de una zona: rango horizontal y profundidad desde el borde. */
export interface TramoZona {
  desde: Pulgadas
  hasta: Pulgadas
  profundidad: Pulgadas
}

/**
 * Zona con perfil escalonado arbitrario. Los tramos van de izquierda a derecha y
 * deben ser contiguos. Cubre cualquier forma de despliegue: banda plana (1 tramo),
 * L (2 tramos), meseta central (3 tramos), etc.
 *
 * Traza el borde propio de izquierda a derecha y luego vuelve por el perfil de
 * profundidades de derecha a izquierda, lo que siempre da un polígono simple.
 */
export function zonaEscalones(borde: Borde, tramos: TramoZona[]): Punto[] {
  if (tramos.length === 0) return []
  const yBorde = borde === 'inferior' ? 0 : MESA_ALTO

  const puntos: Punto[] = [
    { x: tramos[0].desde, y: yBorde },
    { x: tramos[tramos.length - 1].hasta, y: yBorde },
  ]

  for (let i = tramos.length - 1; i >= 0; i--) {
    const y = profundidadA(borde, tramos[i].profundidad)
    puntos.push({ x: tramos[i].hasta, y }, { x: tramos[i].desde, y })
  }

  return puntos
}

/** Zona escalonada en L: una mitad del ancho llega más profundo que la otra. */
export function zonaEscalonada(
  borde: Borde,
  profundaEn: 'izquierda' | 'derecha',
  profunda: Pulgadas,
  somera: Pulgadas
): Punto[] {
  const medio = MESA_ANCHO / 2
  const izquierda = profundaEn === 'izquierda' ? profunda : somera
  const derecha = profundaEn === 'izquierda' ? somera : profunda
  return zonaEscalones(borde, [
    { desde: 0, hasta: medio, profundidad: izquierda },
    { desde: medio, hasta: MESA_ANCHO, profundidad: derecha },
  ])
}

/** Rota un polígono 180° alrededor del centro de la mesa. */
export function rotar180(poligono: Punto[]): Punto[] {
  return poligono.map(p => ({ x: MESA_ANCHO - p.x, y: MESA_ALTO - p.y }))
}

/** Punto rotado 180° — útil para definir solo la mitad de un layout espejo. */
export function espejo(p: Punto): Punto {
  return { x: MESA_ANCHO - p.x, y: MESA_ALTO - p.y }
}

// ─── Layouts definidos ────────────────────────────────────────────────────────

/** Objetivo local del atacante; el del defensor es su rotación de 180°. */
const LOCAL_ATACANTE: Punto = { x: 18, y: 48 }
/** Objetivo de expansión del lado del atacante; el otro es su rotación. */
const EXPANSION_ATACANTE: Punto = { x: 37, y: 41 }

/**
 * Un layout simétrico se define como 8 pares: se coloca la pieza del lado del
 * atacante y la del defensor sale de rotar 180°. La composición cuadra exacto
 * (2 + 1 + 2 + 1 + 2 pares = 4/2/4/2/4 piezas).
 */
export function expandirPares(pares: PiezaTerreno[]): PiezaTerreno[] {
  return pares.flatMap(p => [p, piezaEspejo(p, `${p.id}'`, `${p.areaId}'`)])
}

/**
 * Las 8 piezas del lado del atacante; los espejos los genera `expandirPares`.
 * Anclas ajustadas a mano sobre el tablero y exportadas desde el editor.
 *
 * Verificado contra el diagrama oficial: el par EF/EF′ del objetivo central forma
 * un rectángulo horizontal de 11,5" × 8" centrado en la mesa — 16,25" a cada borde
 * lateral (44 − 11,5, mitad por lado) y 26" arriba y abajo (60 − 8, idem).
 *
 * Pendiente de cotejar: los `areaId` compartidos (AB+KL forman un área única)
 * están puestos a ojo, sin comparar con los iconos de ojo del diagrama.
 */
const PARES_TAKE_HOLD_A: PiezaTerreno[] = [
  // Rectángulos grandes: objetivo local y objetivo de expansión.
  { id: 'AB', footprint: 'rect-grande', ancla: { x: 14.5, y: 42.5 }, rotacion: 0, densidad: 'denso', areaId: 'local' },
  { id: 'CD', footprint: 'rect-grande', ancla: { x: 33, y: 36 }, rotacion: 0, densidad: 'denso', areaId: 'expansion' },
  // Triángulo del objetivo central.
  { id: 'EF', footprint: 'triangulo-grande', ancla: { x: 27.75, y: 26 }, rotacion: 90, densidad: 'denso', areaId: 'central' },
  // Rectángulos medianos de relleno.
  { id: 'GH', footprint: 'rect-mediano', ancla: { x: 26.9, y: 47 }, rotacion: 0, densidad: 'denso', areaId: 'relleno-1' },
  { id: 'IJ', footprint: 'rect-mediano', ancla: { x: 11.9, y: 32.1 }, rotacion: 90, densidad: 'denso', areaId: 'relleno-2' },
  // Línea larga, adyacente al footprint de la zona de inserción.
  { id: 'KL', footprint: 'linea-larga', ancla: { x: 1.9, y: 43.1 }, rotacion: 0, densidad: 'ligero', areaId: 'local' },
  // Líneas cortas de relleno.
  { id: 'MN', footprint: 'linea-corta', ancla: { x: 21, y: 40.4 }, rotacion: 0, densidad: 'ligero', areaId: 'relleno-3' },
  { id: 'OP', footprint: 'linea-corta', ancla: { x: 34.1, y: 28.2 }, rotacion: 0, densidad: 'ligero', areaId: 'relleno-4' },
]

const TAKE_HOLD_MIRROR_A: LayoutMesa = {
  numero: obtenerNumeroLayout('hold', 'hold'),
  diseno: 'a',
  nombre: 'Take & Hold Mirror · 1',
  aproximado: true,
  zonas: [
    // Escalón en la línea de centro vertical: 20" en un lado, 12" en el otro.
    // Las dos zonas son rotación de 180° una de la otra.
    { rol: 'atacante', poligono: zonaEscalonada('superior', 'izquierda', 20, 12) },
    { rol: 'defensor', poligono: zonaEscalonada('inferior', 'derecha', 20, 12) },
  ],
  // 5 objetivos: uno al centro exacto y dos pares simétricos a 180°. Solo se
  // define un miembro de cada par; el otro sale de espejo(). Las posiciones de
  // los pares se leyeron del diagrama (±1"): ajustables arrastrando en el tablero.
  objetivos: [
    { id: 'central', pos: { x: MESA_ANCHO / 2, y: MESA_ALTO / 2 }, tipo: 'central' },
    { id: 'local-atacante', pos: LOCAL_ATACANTE, tipo: 'local', deRol: 'atacante' },
    { id: 'local-defensor', pos: espejo(LOCAL_ATACANTE), tipo: 'local', deRol: 'defensor' },
    { id: 'expansion-atacante', pos: EXPANSION_ATACANTE, tipo: 'expansion' },
    { id: 'expansion-defensor', pos: espejo(EXPANSION_ATACANTE), tipo: 'expansion' },
  ],
  piezas: expandirPares(PARES_TAKE_HOLD_A),
}

const LAYOUTS: LayoutMesa[] = [TAKE_HOLD_MIRROR_A]

function clave(numero: number, diseno: DisenoId): string {
  return `${numero}-${diseno}`
}

const LAYOUTS_MAP = new Map(LAYOUTS.map(l => [clave(l.numero, l.diseno), l]))

/** Devuelve la geometría del layout que corresponde al par de disposiciones y al
 *  diseño elegido, o `null` si todavía no está cargada. */
export function obtenerLayoutMesa(
  posturaPropia: PosturaId,
  posturaOponente: PosturaId,
  diseno: DisenoId
): LayoutMesa | null {
  const numero = obtenerNumeroLayout(posturaPropia, posturaOponente)
  return LAYOUTS_MAP.get(clave(numero, diseno)) ?? null
}

/** Zonas por defecto cuando no hay layout cargado: bandas simétricas de 12". */
export const ZONAS_GENERICAS: ZonaDespliegue[] = [
  { rol: 'atacante', poligono: zonaBanda('superior', 12) },
  { rol: 'defensor', poligono: zonaBanda('inferior', 12) },
]
