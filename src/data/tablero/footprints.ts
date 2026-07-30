import type {
  FootprintId,
  PiezaTerreno,
  Pulgadas,
  Punto,
  Terreno,
} from '../../types/tablero'
import { MESA_ALTO, MESA_ANCHO } from '../../types/tablero'

// ─── Catálogo de footprints (11ª edición) ─────────────────────────────────────
//
// El terreno de 11ª no son polígonos libres: es un set fijo de 5 formas, y cada
// layout coloca las mismas 16 piezas en distinta posición y rotación. Los
// componentes corresponden al set «Campos de batalla: Armageddon», y las letras
// del diagrama (AB, CD, EF, GH…) son sus marcas.
//
// Cada footprint se define con el origen en una ESQUINA, no en su centro, porque
// las cotas de los diagramas oficiales van de esquina de footprint a borde de
// mesa. Así la transcripción es directa, sin convertir a centros.

export interface DefFootprint {
  nombre: string
  /** Cuántas piezas de esta forma trae el set. */
  cantidad: number
  ancho: Pulgadas
  alto: Pulgadas
  /** Vértices en coordenadas locales, con el origen en la esquina de anclaje. */
  vertices: Punto[]
}

function rectangulo(ancho: Pulgadas, alto: Pulgadas): Punto[] {
  return [
    { x: 0, y: 0 },
    { x: ancho, y: 0 },
    { x: ancho, y: alto },
    { x: 0, y: alto },
  ]
}

export const FOOTPRINTS: Record<FootprintId, DefFootprint> = {
  'rect-grande': {
    nombre: 'Rectángulo grande',
    cantidad: 4,
    ancho: 7,
    alto: 11.5,
    vertices: rectangulo(7, 11.5),
  },
  'triangulo-grande': {
    nombre: 'Triángulo rectángulo grande',
    cantidad: 2,
    ancho: 8,
    alto: 11.5,
    // Ángulo recto en el origen. Dos de estos unidos por la hipotenusa forman
    // un rectángulo de 8" × 11,5" — así van en el objetivo central.
    vertices: [
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 0, y: 11.5 },
    ],
  },
  'rect-mediano': {
    nombre: 'Rectángulo mediano',
    cantidad: 4,
    ancho: 6,
    alto: 4,
    vertices: rectangulo(6, 4),
  },
  'linea-larga': {
    nombre: 'Línea larga',
    cantidad: 2,
    ancho: 10,
    alto: 2.5,
    vertices: rectangulo(10, 2.5),
  },
  'linea-corta': {
    nombre: 'Línea corta',
    cantidad: 4,
    ancho: 6,
    alto: 2,
    vertices: rectangulo(6, 2),
  },
}

/** Composición esperada de todo layout: 4 + 2 + 4 + 2 + 4 = 16 piezas. */
export const TOTAL_PIEZAS = Object.values(FOOTPRINTS).reduce((n, f) => n + f.cantidad, 0)

// ─── Colocación ───────────────────────────────────────────────────────────────

function gradosARadianes(grados: number): number {
  return (grados * Math.PI) / 180
}

/** Polígono de la pieza sobre la mesa: refleja, rota y traslada al ancla. */
export function poligonoDePieza(pieza: PiezaTerreno): Punto[] {
  const { vertices } = FOOTPRINTS[pieza.footprint]
  const rad = gradosARadianes(pieza.rotacion)
  const cos = Math.cos(rad)
  const sen = Math.sin(rad)

  return vertices.map(v => {
    const x = pieza.reflejada ? -v.x : v.x
    return {
      x: redondear(pieza.ancla.x + x * cos - v.y * sen),
      y: redondear(pieza.ancla.y + x * sen + v.y * cos),
    }
  })
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Rota una pieza 180° alrededor del centro de la mesa. En los layouts espejo se
 * define solo media mesa (8 piezas) y el resto sale de acá, lo que garantiza la
 * simetría en vez de confiar en que dos listas de números coincidan.
 */
export function piezaEspejo(pieza: PiezaTerreno, id: string, areaId: string): PiezaTerreno {
  return {
    ...pieza,
    id,
    areaId,
    ancla: { x: MESA_ANCHO - pieza.ancla.x, y: MESA_ALTO - pieza.ancla.y },
    rotacion: (pieza.rotacion + 180) % 360,
  }
}

/**
 * Traduce las piezas del layout a la geometría que consume el motor. El denso
 * obstruye la línea de visión; ambos dan cobertura.
 */
export function terrenoDePiezas(piezas: PiezaTerreno[]): Terreno[] {
  return piezas.map(p => ({
    id: p.id,
    poligono: poligonoDePieza(p),
    bloqueaLdV: p.densidad === 'denso',
    daCobertura: true,
    areaId: p.areaId,
  }))
}

// ─── Validación de composición ────────────────────────────────────────────────

export interface ProblemaComposicion {
  footprint: FootprintId
  esperadas: number
  encontradas: number
}

/**
 * Comprueba que un layout use exactamente el set: 4 rectángulos grandes,
 * 2 triángulos, 4 rectángulos medianos, 2 líneas largas y 4 líneas cortas.
 * Devuelve la lista de desajustes — vacía si la composición es correcta.
 */
export function validarComposicion(piezas: PiezaTerreno[]): ProblemaComposicion[] {
  const problemas: ProblemaComposicion[] = []

  for (const [id, def] of Object.entries(FOOTPRINTS) as [FootprintId, DefFootprint][]) {
    const encontradas = piezas.filter(p => p.footprint === id).length
    if (encontradas !== def.cantidad) {
      problemas.push({ footprint: id, esperadas: def.cantidad, encontradas })
    }
  }

  return problemas
}
