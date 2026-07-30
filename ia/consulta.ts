import type { InformeTactico } from '../src/types/tablero'
import { esReferenciaSeccion, normalizarSeccion } from './corpus'
import { PROMPT_ARBITRO } from './prompts'

// ─── Modo copiar/pegar ────────────────────────────────────────────────────────
//
// Arma el texto que se pega en Claude cuando no hay un backend conectado. Es la
// misma información que recibiría la API —prompt, corpus, informe, pregunta— pero
// en un solo bloque de texto.
//
// La estructura imita a propósito la de la llamada real: el corpus se pega UNA VEZ
// al abrir la conversación y después solo van las preguntas. Es el equivalente
// manual de la caché de prompt.

/** Instrucción de formato. En la API esto lo garantiza `output_config.format`;
 *  pegando a mano hay que pedirlo explícitamente. */
const FORMATO_RESPUESTA = `Responde ÚNICAMENTE con un objeto JSON, sin texto antes ni después y sin vallas de código:

{
  "veredicto": "permitido" | "prohibido" | "depende",
  "explicacion": "dos o tres frases",
  "reglasAplicadas": ["ids exactos del corpus"],
  "condiciones": ["solo si el veredicto es depende"]
}`

function bloqueInforme(informe?: InformeTactico): string {
  if (!informe) return ''
  return `\n<informe_de_partida>\n${JSON.stringify(informe, null, 1)}\n</informe_de_partida>\n`
}

/**
 * Primer mensaje de la conversación: instrucciones, corpus completo y la primera
 * pregunta. Es el bloque grande, el que se pega una sola vez.
 */
export function consultaCompleta(opciones: {
  corpus: string
  pregunta: string
  informe?: InformeTactico
}): string {
  return `${PROMPT_ARBITRO}

${FORMATO_RESPUESTA}

A continuación va el corpus. Consérvalo para el resto de la conversación: las
siguientes preguntas se apoyarán en él sin volver a incluirlo.

<corpus>
${opciones.corpus}
</corpus>
${bloqueInforme(opciones.informe)}
<pregunta>
${opciones.pregunta}
</pregunta>`
}

/**
 * Preguntas siguientes dentro de la misma conversación, donde el corpus ya está
 * en contexto. Se repite la instrucción de formato porque en conversaciones
 * largas es lo primero que se diluye.
 */
export function consultaBreve(opciones: { pregunta: string; informe?: InformeTactico }): string {
  return `${FORMATO_RESPUESTA}
${bloqueInforme(opciones.informe)}
<pregunta>
${opciones.pregunta}
</pregunta>`
}

// ─── Lectura de la respuesta ──────────────────────────────────────────────────

export interface ResultadoLectura {
  ok: boolean
  /** Motivo del fallo, listo para mostrar al usuario. */
  error?: string
  respuesta?: {
    veredicto: 'permitido' | 'prohibido' | 'depende'
    explicacion: string
    reglasAplicadas: string[]
    condiciones?: string[]
  }
  /** Ids citados que no existen en el corpus. */
  inventadas?: string[]
}

const VEREDICTOS = ['permitido', 'prohibido', 'depende']

/**
 * Interpreta lo que el usuario pegó de vuelta. Tolera las vallas de código y el
 * texto suelto alrededor, porque pegando a mano es lo habitual.
 */
export function leerRespuesta(texto: string, citables: Set<string>): ResultadoLectura {
  const limpio = texto.trim()
  if (!limpio) return { ok: false, error: 'No hay nada que leer.' }

  const inicio = limpio.indexOf('{')
  const fin = limpio.lastIndexOf('}')
  if (inicio === -1 || fin <= inicio) {
    return { ok: false, error: 'No se encontró un objeto JSON en el texto pegado.' }
  }

  let datos: unknown
  try {
    datos = JSON.parse(limpio.slice(inicio, fin + 1))
  } catch {
    return { ok: false, error: 'El JSON está mal formado. Revisa que se copiara entero.' }
  }

  const obj = datos as Record<string, unknown>
  if (typeof obj.veredicto !== 'string' || !VEREDICTOS.includes(obj.veredicto)) {
    return { ok: false, error: `Falta un veredicto válido (${VEREDICTOS.join(', ')}).` }
  }
  if (typeof obj.explicacion !== 'string') {
    return { ok: false, error: 'Falta el campo "explicacion".' }
  }

  const reglas = Array.isArray(obj.reglasAplicadas)
    ? obj.reglasAplicadas.filter((r): r is string => typeof r === 'string')
    : []
  const condiciones = Array.isArray(obj.condiciones)
    ? obj.condiciones.filter((c): c is string => typeof c === 'string')
    : undefined

  return {
    ok: true,
    respuesta: {
      veredicto: obj.veredicto as 'permitido' | 'prohibido' | 'depende',
      explicacion: obj.explicacion,
      reglasAplicadas: reglas,
      condiciones,
    },
    inventadas: reglas.filter(id => !citaValida(id, citables)),
  }
}

/**
 * Una cita vale si es un id conocido o una referencia de sección del reglamento
 * («10.06»). Las secciones se normalizan a dos dígitos por lado para que «9.06»
 * y «09.06» cuenten igual.
 */
export function citaValida(id: string, citables: Set<string>): boolean {
  const limpio = id.trim()
  if (citables.has(limpio)) return true
  if (esReferenciaSeccion(limpio)) return citables.has(normalizarSeccion(limpio))
  return false
}
