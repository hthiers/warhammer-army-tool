import type { PosturaId } from '../../types/misiones'

// ─── Layouts de mesa (compendio de eventos) ───────────────────────────────────
//
// Cada dupla de Disposiciones de la Fuerza (sin importar el orden) corresponde
// a un número de layout fijo, según el índice del PDF. Con 5 posturas hay
// 15 duplas únicas. El orden de enumeración es: Ocupar y Mantener, Purgar al
// Enemigo, Disrupción, Reconocimiento, Activos Prioritarios (mismo orden que
// POSTURAS en disposicionFuerza.ts).
//
// Cada layout tiene hasta 3 diseños de mesa (A, B, C). LAYOUTS_CON_IMAGEN
// indica qué números ya tienen las 3 imágenes cargadas en
// public/images/layouts/layout_<n>_design_<a|b|c>.png — hay que sumar el
// número acá a medida que se agreguen más layouts del compendio.

export const DISENOS = ['a', 'b', 'c'] as const
export type DisenoId = typeof DISENOS[number]

const ORDEN_POSTURAS: PosturaId[] = ['hold', 'purge', 'disruption', 'recon', 'priority']

const NUMERO_LAYOUT: Record<string, number> = {}
let contador = 1
for (let i = 0; i < ORDEN_POSTURAS.length; i++) {
  for (let j = i; j < ORDEN_POSTURAS.length; j++) {
    const clave = `${ORDEN_POSTURAS[i]}|${ORDEN_POSTURAS[j]}`
    NUMERO_LAYOUT[clave] = contador
    contador++
  }
}

export function obtenerNumeroLayout(posturaA: PosturaId, posturaB: PosturaId): number {
  const [a, b] = [posturaA, posturaB].sort()
  return NUMERO_LAYOUT[`${a}|${b}`]
}

export const LAYOUTS_CON_IMAGEN: number[] = [1, 2]

export function rutaImagenLayout(numeroLayout: number, diseno: DisenoId): string {
  return `/images/layouts/layout_${numeroLayout}_design_${diseno}.png`
}
