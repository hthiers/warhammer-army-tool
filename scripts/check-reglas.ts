import { ALIAS_REGLAS as ALIAS, REGLAS_ESPECIALES } from '../src/data/reglas'
import { FACCIONES } from '../src/data/facciones'

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

if (sinDefinir.length === 0 && sinUsar.length === 0) {
  console.log('\n✓ Reglas y armas coherentes en ambas direcciones')
}

process.exit(sinDefinir.length > 0 ? 1 : 0)
