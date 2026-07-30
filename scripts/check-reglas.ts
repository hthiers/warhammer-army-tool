import { readFileSync } from 'node:fs'
import {
  ALIAS_REGLAS as ALIAS,
  HABILIDADES_UNIDAD,
  REGLAS_ESPECIALES,
} from '../src/data/reglas'
import { FACCIONES } from '../src/data/facciones'

const RUTA_MD = 'rules/05-habilidades.md'

// ─── Coherencia entre reglas y armas ──────────────────────────────────────────
//
// Comprueba las dos direcciones del desajuste que encontró el borrador del Árbitro:
// reglas definidas que ninguna arma usa (ruido que se paga por token en el corpus)
// y reglas que las armas declaran sin que exista su texto (huecos que dejan al
// asistente adivinando).
//
// Ejecutar con:  npm run check:reglas

interface Uso {
  etiqueta: string
  donde: string[]
}

function etiquetasEnArmas(): Map<string, Uso> {
  const usos = new Map<string, Uso>()
  for (const f of FACCIONES) {
    for (const u of f.unidades) {
      for (const arma of [...u.distancia, ...u.combate]) {
        if (!arma.especial) continue
        for (const bruta of arma.especial.split(',')) {
          const etiqueta = bruta.trim()
          if (!etiqueta) continue
          const uso = usos.get(etiqueta) ?? { etiqueta, donde: [] }
          uso.donde.push(`${f.nombre} · ${u.nombre} · ${arma.nombre}`)
          usos.set(etiqueta, uso)
        }
      }
    }
  }
  return usos
}

/** Nombre canónico bajo el que está definida una etiqueta, o null. */
function resolver(etiqueta: string, definidas: string[]): string | null {
  const coincide = (nombre: string) => etiqueta === nombre || etiqueta.startsWith(`${nombre} `)
  const directa = definidas.find(coincide)
  if (directa) return directa
  for (const [canonico, alias] of Object.entries(ALIAS)) {
    if (alias.some(coincide)) return canonico
  }
  return null
}

const definidas = Object.keys(REGLAS_ESPECIALES)
const usos = etiquetasEnArmas()

const sinDefinir: Uso[] = []
const canonicasUsadas = new Set<string>()

for (const uso of usos.values()) {
  const canonico = resolver(uso.etiqueta, definidas)
  if (canonico) canonicasUsadas.add(canonico)
  else sinDefinir.push(uso)
}

const sinUsar = definidas.filter(d => !canonicasUsadas.has(d))

console.log(`Reglas definidas: ${definidas.length} · etiquetas distintas en armas: ${usos.size}`)

if (sinDefinir.length > 0) {
  console.log(`\n✗ USADAS POR ARMAS PERO SIN DEFINIR (${sinDefinir.length})`)
  console.log('  El Árbitro no puede explicarlas. Añádelas a src/data/reglas.ts')
  console.log('  o registra su equivalencia en ALIAS_REGLAS de ia/corpus.ts.\n')
  for (const uso of sinDefinir.sort((a, b) => a.etiqueta.localeCompare(b.etiqueta))) {
    console.log(`  - ${uso.etiqueta}`)
    for (const donde of uso.donde.slice(0, 3)) console.log(`      ${donde}`)
    if (uso.donde.length > 3) console.log(`      … y ${uso.donde.length - 3} más`)
  }
}

if (sinUsar.length > 0) {
  console.log(`\n· DEFINIDAS PERO SIN USAR (${sinUsar.length})`)
  console.log('  Ninguna arma de tus ejércitos las lleva. No es un error: el catálogo')
  console.log('  de la sección 24 del reglamento es más amplio que tu colección.')
  console.log('  Solo revísalas si sospechas que sobran de una edición anterior.\n')
  for (const d of sinUsar) console.log(`  - ${d}`)
}

// ─── Coherencia con rules/05-habilidades.md ───────────────────────────────────
//
// El .md es la autoridad —lo que lee el Árbitro— y reglas.ts es el texto corto de
// la UI más el índice de nombres citables. Si divergen, el asistente citaría un
// nombre que la biblioteca de reglas no documenta, o al revés.

const md = readFileSync(RUTA_MD, 'utf8')

/** Nombre de la habilidad en un título del .md, sin corchetes ni parámetro. */
function nombresEnMd(): Set<string> {
  const nombres = new Set<string>()
  for (const m of md.matchAll(/^## (.+?)\s*\(\d{2}\.\d{2}\)\s*$/gm)) {
    nombres.add(
      m[1]
        .replace(/[[\]]/g, '')
        // Quita los marcadores de parámetro del final: «ANTI X Y+», «Avanzadilla X"».
        .replace(/(\s+[A-Z]"?\+?)+$/, '')
        .trim()
        .toLowerCase()
    )
  }
  return nombres
}

const enMd = nombresEnMd()
const enCodigo = [...Object.keys(REGLAS_ESPECIALES), ...Object.keys(HABILIDADES_UNIDAD)]
const sinDocumentar = enCodigo.filter(n => !enMd.has(n.toLowerCase()))

if (sinDocumentar.length > 0) {
  console.log(`\n✗ EN reglas.ts PERO NO EN ${RUTA_MD} (${sinDocumentar.length})`)
  console.log('  El Árbitro las tiene como citables pero no puede leer su texto.\n')
  for (const n of sinDocumentar) console.log(`  - ${n}`)
}

const hayProblemas = sinDefinir.length > 0 || sinDocumentar.length > 0
if (!hayProblemas && sinUsar.length === 0) {
  console.log('\n✓ Reglas, armas y biblioteca coherentes')
} else if (!hayProblemas) {
  console.log(`\n✓ Sin huecos: las ${enCodigo.length} habilidades están documentadas en ${RUTA_MD}`)
}

process.exit(hayProblemas ? 1 : 0)
