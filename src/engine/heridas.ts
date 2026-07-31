import type { UnidadEnMesa } from '../types/tablero'

// ─── Heridas ──────────────────────────────────────────────────────────────────
//
// Una unidad no tiene "una barra de vida": tiene N miniaturas de HER heridas cada
// una, y el daño se asigna miniatura a miniatura. Por eso el estado se lleva en
// dos números —cuántas quedan en pie y cuántas heridas le restan a la que está
// recibiendo el daño— y el total se deriva. Guardar solo un total perdería la
// información que de verdad importa en la mesa: cuántos modelos quitas.

/** Heridas que le quedan a la miniatura que está recibiendo el daño. */
export function heridasDeLaHerida(u: UnidadEnMesa, her: number): number {
  return u.heridasRestantes ?? her
}

/** Heridas que aguantaba la unidad al desplegar, para medir el desgaste. */
export function heridasMaximas(u: UnidadEnMesa, her: number): number {
  return (u.miniaturasIniciales ?? u.miniaturas) * her
}

/** Heridas que le quedan a la unidad entera. */
export function heridasTotales(u: UnidadEnMesa, her: number): number {
  if (u.miniaturas <= 0) return 0
  return (u.miniaturas - 1) * her + heridasDeLaHerida(u, her)
}

/** Cambio de estado tras aplicar (o curar) daño. */
export interface EstadoHeridas {
  miniaturas: number
  heridasRestantes: number
}

/**
 * Aplica `dano` heridas, quitando miniaturas a medida que se agotan. Un `dano`
 * negativo cura, sin pasar del máximo ni resucitar miniaturas ya retiradas: se
 * recupera solo la que está herida.
 */
export function aplicarDano(u: UnidadEnMesa, her: number, dano: number): EstadoHeridas {
  const actual = heridasDeLaHerida(u, her)

  if (dano <= 0) {
    return { miniaturas: u.miniaturas, heridasRestantes: Math.min(her, actual - dano) }
  }

  let restante = dano
  let miniaturas = u.miniaturas
  let heridas = actual

  while (restante > 0 && miniaturas > 0) {
    const absorbe = Math.min(restante, heridas)
    heridas -= absorbe
    restante -= absorbe
    if (heridas === 0) {
      miniaturas -= 1
      heridas = her
    }
  }

  // Si cayó la última miniatura, `heridas` volvió a HER por el bucle: la unidad
  // está destruida, no a plena salud.
  return miniaturas <= 0
    ? { miniaturas: 0, heridasRestantes: 0 }
    : { miniaturas, heridasRestantes: heridas }
}
