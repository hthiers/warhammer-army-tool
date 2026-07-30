import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { construirCorpus, idsCitables } from '../ia/corpus'
import { PROMPT_ARBITRO } from '../ia/prompts'
import { ESQUEMA_ARBITRO, type RespuestaArbitro } from '../ia/esquemas'

// ─── Borrador de la fase 4 ────────────────────────────────────────────────────
//
// No es el Worker: es lo mínimo para responder las tres incógnitas caras de la
// fase antes de desplegar nada.
//
//   1. Cuántos tokens pesa el corpus de verdad (count_tokens, no estimación).
//   2. Si la caché de prompt pega (cache_read_input_tokens > 0 en la 2ª llamada).
//   3. Si el Árbitro responde bien y cita ids que existen.
//
// Ejecutar con:  npm run spike:arbitro
// Ver design/plan-implementacion.md § 4.

const MODELO = 'claude-sonnet-5'
const FACCIONES = ['spacemarines', 'necrones']

/** Precio por millón de tokens de Sonnet 5, tarifa introductoria. */
const PRECIO = { entrada: 2, salida: 10 }
const FACTOR_ESCRITURA_1H = 2
const FACTOR_LECTURA = 0.1

const PREGUNTAS = [
  '¿Puede disparar una unidad que Avanzó en la fase de movimiento?',
  'Mis Intercesores están trabados en combate. ¿Pueden disparar sus bólters a la unidad con la que están trabados?',
  '¿Cómo funciona exactamente la regla Gauss de los Necrones?',
  'Una unidad mía retrocedió este turno. ¿Puede cargar después?',
  '¿Cuántos PV da controlar tres objetivos en la carta Battlefield Dominance?',
]

// ─── Carga de las reglas en prosa ─────────────────────────────────────────────

function leerReglasMd(dir: string, base = dir): Record<string, string> {
  const salida: Record<string, string> = {}
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name)
    if (entrada.isDirectory()) Object.assign(salida, leerReglasMd(ruta, base))
    else if (entrada.name.endsWith('.md')) salida[relative(base, ruta)] = readFileSync(ruta, 'utf8')
  }
  return salida
}

// ─── Utilidades de salida ─────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('es-CL')
const dinero = (n: number) => `$${n.toFixed(4)}`

function costoLlamada(u: Anthropic.Usage): number {
  const escritura = (u.cache_creation_input_tokens ?? 0) * FACTOR_ESCRITURA_1H
  const lectura = (u.cache_read_input_tokens ?? 0) * FACTOR_LECTURA
  const entrada = ((u.input_tokens ?? 0) + escritura + lectura) * (PRECIO.entrada / 1_000_000)
  const salida = (u.output_tokens ?? 0) * (PRECIO.salida / 1_000_000)
  return entrada + salida
}

function lineaUso(u: Anthropic.Usage): string {
  return [
    `sin cachear ${fmt(u.input_tokens ?? 0)}`,
    `escritos ${fmt(u.cache_creation_input_tokens ?? 0)}`,
    `leídos ${fmt(u.cache_read_input_tokens ?? 0)}`,
    `salida ${fmt(u.output_tokens ?? 0)}`,
    dinero(costoLlamada(u)),
  ].join(' | ')
}

// ─── Programa ─────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Falta ANTHROPIC_API_KEY. Ponla en .env o expórtala en el entorno.')
    process.exit(1)
  }

  const fuentes = { reglasMd: leerReglasMd('rules'), facciones: FACCIONES }
  const corpus = construirCorpus(fuentes)
  const citables = idsCitables(fuentes)

  console.log('─── Corpus ───')
  console.log(`Archivos de reglas: ${Object.keys(fuentes.reglasMd).length}`)
  console.log(`Caracteres:         ${fmt(corpus.length)}`)
  console.log(`Ids citables:       ${fmt(citables.size)}`)

  const client = new Anthropic()

  // Bloques de `system` reutilizados tal cual en cada llamada: cualquier byte que
  // cambie aquí invalidaría la caché.
  const system: Anthropic.TextBlockParam[] = [
    { type: 'text', text: PROMPT_ARBITRO },
    { type: 'text', text: corpus, cache_control: { type: 'ephemeral', ttl: '1h' } },
  ]

  const cuenta = await client.messages.countTokens({
    model: MODELO,
    system,
    messages: [{ role: 'user', content: PREGUNTAS[0] }],
  })
  console.log(`Tokens (count_tokens): ${fmt(cuenta.input_tokens)}`)

  const escrituraEstimada =
    cuenta.input_tokens * FACTOR_ESCRITURA_1H * (PRECIO.entrada / 1_000_000)
  const lecturaEstimada = cuenta.input_tokens * FACTOR_LECTURA * (PRECIO.entrada / 1_000_000)
  console.log(
    `Escritura de caché ${dinero(escrituraEstimada)} una vez · lectura ${dinero(lecturaEstimada)} por llamada`
  )

  console.log('\n─── Consultas ───')
  let total = 0
  let citasInvalidas = 0

  for (const [i, pregunta] of PREGUNTAS.entries()) {
    const respuesta = await client.messages.create({
      model: MODELO,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: ESQUEMA_ARBITRO },
      },
      system,
      messages: [{ role: 'user', content: pregunta }],
    })

    console.log(`\n${i + 1}. ${pregunta}`)

    if (respuesta.stop_reason === 'refusal') {
      console.log('   ⚠️  rechazado por los clasificadores de seguridad')
      continue
    }

    const bloque = respuesta.content.find(b => b.type === 'text')
    if (!bloque || bloque.type !== 'text') {
      console.log(`   ⚠️  sin bloque de texto (stop_reason: ${respuesta.stop_reason})`)
      continue
    }

    const plan: RespuestaArbitro = JSON.parse(bloque.text)

    // Lo importante del borrador: comprobar que cada id citado existe de verdad.
    const invalidas = plan.reglasAplicadas.filter(id => !citables.has(id))
    citasInvalidas += invalidas.length

    console.log(`   veredicto:  ${plan.veredicto}`)
    console.log(`   reglas:     ${plan.reglasAplicadas.join(', ') || '(ninguna)'}`)
    if (invalidas.length > 0) console.log(`   ✗ INVENTADAS: ${invalidas.join(', ')}`)
    if (plan.condiciones?.length) console.log(`   condiciones: ${plan.condiciones.join(' / ')}`)
    console.log(`   ${plan.explicacion}`)
    console.log(`   uso: ${lineaUso(respuesta.usage)}`)

    total += costoLlamada(respuesta.usage)

    if (i === 0 && (respuesta.usage.cache_creation_input_tokens ?? 0) === 0) {
      console.log('   ⚠️  la primera llamada no escribió caché')
    }
    if (i === 1 && (respuesta.usage.cache_read_input_tokens ?? 0) === 0) {
      console.log('   ⚠️  LA CACHÉ NO PEGÓ — algo volátil se coló en el prefijo')
    }
  }

  console.log('\n─── Resumen ───')
  console.log(`Costo de las ${PREGUNTAS.length} consultas: ${dinero(total)}`)
  console.log(`Proyección a 30 consultas por partida: ${dinero((total / PREGUNTAS.length) * 30)}`)
  console.log(
    citasInvalidas === 0
      ? 'Citas: todas los ids existen en el corpus ✓'
      : `Citas: ${citasInvalidas} id(s) inventado(s) ✗`
  )
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
