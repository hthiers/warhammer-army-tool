import { construirCorpus, idsCitables } from '../../ia/corpus'
import { FACCIONES } from '../data/facciones'

// ─── Corpus en el navegador ───────────────────────────────────────────────────
//
// El script de node lee `rules/*.md` con `fs`; aquí no hay sistema de ficheros,
// así que Vite los inlina como texto en el bundle. Es el mismo `construirCorpus()`
// con otro cargador — la razón por la que recibe las reglas como parámetro.
//
// Este módulo se importa de forma diferida desde el Árbitro: son ~200 KB de texto
// que no tiene sentido cargar al abrir la aplicación.

const ARCHIVOS_MD = import.meta.glob('../../rules/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Nombres relativos a `rules/`, como los produce el script de node. */
function reglasMd(): Record<string, string> {
  const salida: Record<string, string> = {}
  for (const [ruta, contenido] of Object.entries(ARCHIVOS_MD)) {
    salida[ruta.replace('../../rules/', '')] = contenido
  }
  return salida
}

/** Ids de las facciones cargadas. Hoy son todas; ver la nota en `FuentesCorpus`. */
const FACCIONES_EN_JUEGO = FACCIONES.map(f => f.id)

let cache: { corpus: string; citables: Set<string> } | null = null

export function obtenerCorpus(): { corpus: string; citables: Set<string> } {
  if (!cache) {
    const fuentes = { reglasMd: reglasMd(), facciones: FACCIONES_EN_JUEGO }
    cache = { corpus: construirCorpus(fuentes), citables: idsCitables(fuentes) }
  }
  return cache
}
