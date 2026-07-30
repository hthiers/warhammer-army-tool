import type {
  EstadoTablero,
  Lado,
  ObjetivoMesa,
  Pulgadas,
  PiezaTerreno,
  Punto,
  Rol,
  UnidadEnMesa,
  ZonaDespliegue,
} from '../../types/tablero'
import { MESA_ALTO, MESA_ANCHO } from '../../types/tablero'
import type { Unidad } from '../../types'
import { puntoEnPoligono } from '../../engine/geometria'
import { piezaEspejo } from './footprints'
import type { LayoutMesa } from './layouts'
import { ZONAS_GENERICAS, espejo } from './layouts'

export const STORAGE_KEY_TABLERO = 'wh40k-tablero'

/**
 * Objetivos por defecto cuando no hay layout cargado: los 5 habituales — uno al
 * centro y dos pares simétricos a 180°. Se arrastran para calzar con la mesa real.
 */
const LOCAL_GENERICO = { x: 22, y: 48 }
const EXPANSION_GENERICO = { x: 10, y: 36 }

export const OBJETIVOS_GENERICOS: ObjetivoMesa[] = [
  { id: 'central', pos: { x: MESA_ANCHO / 2, y: MESA_ALTO / 2 }, tipo: 'central' },
  { id: 'local-atacante', pos: LOCAL_GENERICO, tipo: 'local', deRol: 'atacante' },
  { id: 'local-defensor', pos: espejo(LOCAL_GENERICO), tipo: 'local', deRol: 'defensor' },
  { id: 'expansion-atacante', pos: EXPANSION_GENERICO, tipo: 'expansion' },
  { id: 'expansion-defensor', pos: espejo(EXPANSION_GENERICO), tipo: 'expansion' },
]

export const ESTADO_TABLERO_INICIAL: EstadoTablero = {
  ronda: 1,
  fase: 'movimiento',
  turnoDe: 'propio',
  rolPropio: 'defensor',
  unidades: [],
  objetivos: OBJETIVOS_GENERICOS,
  zonas: ZONAS_GENERICAS,
  piezas: [],
  pm: { propio: 0, oponente: 0 },
  pv: { propio: 0, oponente: 0 },
  secundariasActivas: { propio: [], oponente: [] },
  bitacora: [],
}

/** Rol del bando contrario al tuyo. */
export function rolDeLado(lado: Lado, rolPropio: Rol): Rol {
  if (lado === 'propio') return rolPropio
  return rolPropio === 'atacante' ? 'defensor' : 'atacante'
}

/** Sustituye zonas, objetivos y terreno por los del layout, conservando las
 *  unidades ya desplegadas y el marcador. */
export function aplicarLayout(estado: EstadoTablero, layout: LayoutMesa): EstadoTablero {
  return {
    ...estado,
    zonas: layout.zonas,
    objetivos: layout.objetivos,
    piezas: layout.piezas,
  }
}

/**
 * Serializa las piezas actuales como TypeScript pegable en `layouts.ts`. Cierra
 * el bucle del editor: se corrige el terreno arrastrando sobre el tablero y el
 * resultado vuelve al código como dato, sin transcribir coordenadas a mano.
 *
 * Emite solo la mitad de las piezas cuando detecta simetría de 180°, para que el
 * resultado se pegue como `expandirPares([...])`.
 */
export function exportarPiezas(piezas: PiezaTerreno[]): string {
  const mitad = mitadSiEsSimetrico(piezas)
  const lista = mitad ?? piezas
  const cuerpo = lista.map(linea).join('\n')

  return mitad
    ? `piezas: expandirPares([\n${cuerpo}\n]),`
    : `piezas: [\n${cuerpo}\n],`
}

/**
 * Literal de cadena para el código emitido. Los ids de las piezas espejo llevan
 * apóstrofo (`AB'`), que rompería un literal con comillas simples.
 */
function cadena(valor: string): string {
  return valor.includes("'") ? JSON.stringify(valor) : `'${valor}'`
}

function linea(p: PiezaTerreno): string {
  const campos = [
    `id: ${cadena(p.id)}`,
    `footprint: '${p.footprint}'`,
    `ancla: { x: ${p.ancla.x}, y: ${p.ancla.y} }`,
    `rotacion: ${p.rotacion}`,
    ...(p.reflejada ? ['reflejada: true'] : []),
    `densidad: '${p.densidad}'`,
    `areaId: ${cadena(p.areaId)}`,
  ]
  return `  { ${campos.join(', ')} },`
}

/**
 * Tolerancia al comparar anclas. El arrastre redondea a décimas de pulgada, así
 * que exigir igualdad exacta marcaría como asimétrico un layout que sí lo es.
 */
const TOLERANCIA_SIMETRIA = 0.4

function esEspejoDe(q: PiezaTerreno, esperada: PiezaTerreno): boolean {
  return (
    q.footprint === esperada.footprint &&
    q.densidad === esperada.densidad &&
    q.rotacion === esperada.rotacion &&
    Math.abs(q.ancla.x - esperada.ancla.x) <= TOLERANCIA_SIMETRIA &&
    Math.abs(q.ancla.y - esperada.ancla.y) <= TOLERANCIA_SIMETRIA
  )
}

/** Devuelve la mitad "original" si cada pieza tiene su rotada 180°, o null. */
function mitadSiEsSimetrico(piezas: PiezaTerreno[]): PiezaTerreno[] | null {
  if (piezas.length === 0 || piezas.length % 2 !== 0) return null

  const pendientes = [...piezas]
  const mitad: PiezaTerreno[] = []

  while (pendientes.length > 0) {
    const p = pendientes.shift()!
    const i = pendientes.findIndex(q => esEspejoDe(q, piezaEspejo(p, q.id, q.areaId)))
    if (i === -1) return null
    pendientes.splice(i, 1)
    mitad.push(p)
  }

  return mitad
}

/** Sufijo que `expandirPares` añade al id de la pieza espejo. */
const SUFIJO_ESPEJO = "'"

/**
 * Fuerza la simetría de 180°: cada pieza `X'` se reemplaza por el espejo exacto
 * de `X`, conservando su id y su área. Corrige la deriva del arrastre sin tener
 * que reposicionar a mano las 8 parejas.
 */
export function simetrizar(piezas: PiezaTerreno[]): PiezaTerreno[] {
  return piezas.map(p => {
    if (!p.id.endsWith(SUFIJO_ESPEJO)) return p
    const base = piezas.find(o => o.id === p.id.slice(0, -SUFIJO_ESPEJO.length))
    return base ? piezaEspejo(base, p.id, p.areaId) : p
  })
}

/** Parejas cuyo espejo no calza; vacío si el layout es simétrico. */
export function parejasAsimetricas(piezas: PiezaTerreno[]): string[] {
  const rotas: string[] = []
  for (const p of piezas) {
    if (!p.id.endsWith(SUFIJO_ESPEJO)) continue
    const base = piezas.find(o => o.id === p.id.slice(0, -SUFIJO_ESPEJO.length))
    if (!base) continue
    if (!esEspejoDe(p, piezaEspejo(base, p.id, p.areaId))) rotas.push(base.id)
  }
  return rotas
}

/**
 * Versión del formato guardado. Súbela cuando un cambio de modelo invalide el
 * estado anterior — el guardado viejo se descarta en vez de cargarse a medias.
 * v2: mesa rotada a 44×60, objetivos con tipo, zonas de despliegue y rolPropio.
 * v3: 5 objetivos (uno al centro + dos pares simétricos) en vez de 6.
 * v4: tipos de objetivo con nomenclatura oficial (local/central/expansion).
 * v5: el terreno se guarda como PiezaTerreno[] (footprint + ancla + rotación).
 * v6: marca 'replegada' renombrada a 'retrocedida' (terminología de 11ª).
 */
const VERSION_TABLERO = 6

interface EstadoGuardado extends EstadoTablero {
  version?: number
}

export function cargarEstadoTablero(): EstadoTablero {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY_TABLERO)
    if (guardado) {
      const parsed: EstadoGuardado = JSON.parse(guardado)
      if (parsed.version === VERSION_TABLERO) {
        const { version: _version, ...estado } = parsed
        return { ...ESTADO_TABLERO_INICIAL, ...estado }
      }
    }
  } catch {
    // ignorar errores de parseo
  }
  return ESTADO_TABLERO_INICIAL
}

export function guardarEstadoTablero(estado: EstadoTablero): void {
  try {
    const conVersion: EstadoGuardado = { ...estado, version: VERSION_TABLERO }
    localStorage.setItem(STORAGE_KEY_TABLERO, JSON.stringify(conVersion))
  } catch {
    // ignorar cuota excedida
  }
}

/**
 * Huella aproximada del pelotón. Es la misma aproximación que hace un jugador al
 * medir desde la peana más cercana: no busca precisión de milímetro, busca no
 * contradecir a la cinta métrica sobre la mesa.
 */
export function radioPorMiniaturas(miniaturas: number): Pulgadas {
  if (miniaturas <= 1) return 1
  if (miniaturas <= 3) return 1.5
  if (miniaturas <= 5) return 2
  if (miniaturas <= 10) return 3
  return 4
}

function nuevoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** Miniaturas por defecto: los perfiles no llevan tamaño de escuadra, así que
 *  arranca en 1 para personajes/vehículos y en 5 para el resto. Es editable. */
function miniaturasPorDefecto(unidad: Unidad): number {
  const esIndividuo = unidad.palabrasClave.some(
    k => k === 'Personaje' || k === 'Vehículo' || k === 'Monstruo'
  )
  return esIndividuo ? 1 : 5
}

export function crearUnidadEnMesa(
  unidad: Unidad,
  faccionId: string,
  bando: Lado,
  zona?: ZonaDespliegue
): UnidadEnMesa {
  const miniaturas = miniaturasPorDefecto(unidad)
  return {
    instanciaId: nuevoId(),
    unidadId: unidad.id,
    faccionId,
    bando,
    pos: posicionDespliegue(zona),
    radio: radioPorMiniaturas(miniaturas),
    miniaturas,
    heridasRestantes: miniaturas === 1 ? unidad.stats.HER : undefined,
    marcas: [],
  }
}

/**
 * Punto de entrada dentro de la zona de despliegue, con dispersión leve para que
 * dos unidades añadidas seguidas no queden exactamente encima. Prueba abscisas al
 * azar hasta dar con una que caiga dentro del polígono, porque las zonas
 * escalonadas no cubren todo el ancho a la misma profundidad.
 */
function posicionDespliegue(zona?: ZonaDespliegue): Punto {
  const y = zona?.rol === 'atacante' ? MESA_ALTO - 4 : 4

  for (let i = 0; i < 24; i++) {
    const p = { x: redondear(3 + Math.random() * (MESA_ANCHO - 6)), y }
    if (!zona || puntoEnPoligono(p, zona.poligono)) return p
  }
  return { x: MESA_ANCHO / 2, y }
}

function redondear(n: number): number {
  return Math.round(n * 10) / 10
}
