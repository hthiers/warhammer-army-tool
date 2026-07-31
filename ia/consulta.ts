import type { InformeTactico } from '../src/types/tablero'
import { esReferenciaSeccion, normalizarSeccion } from './corpus'
import { PROMPT_ARBITRO } from './prompts'
import { TIPOS_ACCION } from './esquemas'
import type { AccionTactica, PlanTactico } from './esquemas'

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

/**
 * El informe va como texto tabulado, no como JSON. Con una decena de unidades el
 * JSON son decenas de miles de caracteres de llaves y comillas repetidas; esto
 * dice lo mismo en una fracción, y se lee mejor.
 */
export function informeATexto(informe: InformeTactico): string {
  const nombre = new Map(informe.unidades.map(u => [u.id, u.nombre]))
  const partes: string[] = []

  partes.push(
    `RONDA ${informe.ronda} · fase de ${informe.fase} · turno del bando "${informe.turnoDe}"`,
    `Marcador: propio ${informe.marcador.pv.propio} PV / oponente ${informe.marcador.pv.oponente} PV` +
      ` · PM propio ${informe.marcador.pm.propio} / oponente ${informe.marcador.pm.oponente}`
  )

  partes.push(
    '\nUNIDADES EN MESA',
    ...informe.unidades.map(u => {
      const herida =
        u.heridasRestantes != null && u.heridasRestantes < u.stats.HER
          ? `, la que recibe daño con ${u.heridasRestantes}/${u.stats.HER}`
          : ''
      const extras = [
        u.marcas.length > 0 ? `marcas: ${u.marcas.join(', ')}` : null,
        u.enCobertura ? 'en cobertura' : null,
        `heridas ${u.heridasTotales}/${u.heridasMaximas}${herida}`,
        u.rolIA ? `rol ${u.rolIA}` : null,
      ].filter(Boolean)
      return (
        `[${u.id}] ${u.nombre} (${u.bando}) — ${u.miniaturas} min · MOV ${u.stats.MOV} ` +
        `RES ${u.stats.RES} SALV ${u.stats.SALV} OC ${u.stats.OC} · pos ${u.pos.x},${u.pos.y}` +
        (extras.length > 0 ? ` · ${extras.join(' · ')}` : '')
      )
    })
  )

  partes.push(
    '\nOBJETIVOS',
    ...informe.objetivos.map(
      o =>
        `[${o.id}] pos ${o.pos.x},${o.pos.y} — OC propio ${o.ocPropio} / oponente ${o.ocOponente}` +
        ` → ${o.controlaA ? `controla ${o.controlaA}` : 'neutro'}` +
        (o.unidadesEn3.length > 0 ? ` · a 3": ${o.unidadesEn3.join(', ')}` : '')
    )
  )

  if (informe.distancias.length > 0) {
    partes.push(
      '\nDISTANCIAS (pares a 36" o menos)',
      ...informe.distancias.map(
        d => `${d.a} ↔ ${d.b}  ${d.pulgadas}"  ${d.ldv ? 'con LdV' : 'SIN LdV'}`
      )
    )
  }

  if (informe.amenazas.length > 0) {
    partes.push(
      '\nALCANCES (qué arma llega a qué blanco; "EN RANGO" = ya alcanza sin mover)',
      ...informe.amenazas.map(a => {
        const marcas = [
          a.enRango ? 'EN RANGO' : `alcance ${a.alcance}"`,
          a.puedeCargar ? 'puede cargar' : null,
        ].filter(Boolean)
        return `${a.atacante} · ${a.arma} → ${a.blanco} (${nombre.get(a.blanco) ?? '?'})  a ${a.distancia}"  ${marcas.join(' · ')}`
      })
    )
  }

  if (informe.bitacora.length > 0) {
    partes.push('\nRONDAS ANTERIORES', ...informe.bitacora.map(b => `- ${b}`))
  }

  return partes.join('\n')
}

function bloqueInforme(informe?: InformeTactico): string {
  if (!informe) return ''
  return `\n<informe_de_partida>\n${informeATexto(informe)}\n</informe_de_partida>\n`
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

// ─── Consultas del Táctico ────────────────────────────────────────────────────

const FORMATO_PLAN = `Responde ÚNICAMENTE con un objeto JSON, sin texto antes ni después y sin vallas de código:

{
  "intencion": "objetivo del turno en una frase",
  "acciones": [
    {
      "unidadId": "id exacto del informe",
      "tipo": "mover" | "avanzar" | "retroceder" | "mantener" | "disparar" | "cargar" | "combatir" | "estratagema" | "accion",
      "destino": { "x": 0, "y": 0 },
      "blancoId": "id de la unidad enemiga",
      "estratagemaId": "id del corpus",
      "descripcion": "qué hace y por qué, una frase",
      "reglasAplicadas": ["ids del corpus, si alguno es decisivo"]
    }
  ],
  "justificacion": "dos o tres frases sobre el plan en conjunto",
  "dadosRequeridos": [{ "motivo": "carga de X", "tipo": "2D6" }]
}

Incluye "destino" solo en mover, avanzar y retroceder; "blancoId" solo en disparar,
cargar y combatir; "estratagemaId" solo en estratagema.`

/** Primera consulta táctica de la conversación: incluye el corpus. */
export function consultaTacticaCompleta(opciones: {
  corpus: string
  prompt: string
  etapa: string
  informe: InformeTactico
}): string {
  return `${opciones.prompt}

${opciones.etapa}

${FORMATO_PLAN}

A continuación va el corpus. Consérvalo para el resto de la conversación: las
siguientes consultas se apoyarán en él sin volver a incluirlo.

<corpus>
${opciones.corpus}
</corpus>
${bloqueInforme(opciones.informe)}`
}

/** Consultas siguientes, con el corpus ya en contexto. */
export function consultaTacticaBreve(opciones: { etapa: string; informe: InformeTactico }): string {
  return `${opciones.etapa}

${FORMATO_PLAN}
${bloqueInforme(opciones.informe)}`
}

// ─── Lectura del plan ─────────────────────────────────────────────────────────

export interface LecturaPlan {
  ok: boolean
  error?: string
  plan?: PlanTactico
}

export function leerPlan(texto: string): LecturaPlan {
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
  if (typeof obj.intencion !== 'string') return { ok: false, error: 'Falta "intencion".' }
  if (!Array.isArray(obj.acciones)) return { ok: false, error: 'Falta la lista "acciones".' }

  const acciones = (obj.acciones as Record<string, unknown>[]).flatMap(a => {
    if (typeof a?.unidadId !== 'string' || typeof a?.tipo !== 'string') return []
    if (!(TIPOS_ACCION as readonly string[]).includes(a.tipo)) return []
    return [
      {
        unidadId: a.unidadId,
        tipo: a.tipo as AccionTactica['tipo'],
        destino:
          a.destino && typeof a.destino === 'object'
            ? {
                x: Number((a.destino as Record<string, unknown>).x),
                y: Number((a.destino as Record<string, unknown>).y),
              }
            : undefined,
        blancoId: typeof a.blancoId === 'string' ? a.blancoId : undefined,
        estratagemaId: typeof a.estratagemaId === 'string' ? a.estratagemaId : undefined,
        descripcion: typeof a.descripcion === 'string' ? a.descripcion : '',
        reglasAplicadas: Array.isArray(a.reglasAplicadas)
          ? a.reglasAplicadas.filter((r): r is string => typeof r === 'string')
          : undefined,
      } satisfies AccionTactica,
    ]
  })

  if (acciones.length === 0) {
    return { ok: false, error: 'El plan no trae ninguna acción reconocible.' }
  }

  return {
    ok: true,
    plan: {
      intencion: obj.intencion,
      acciones,
      justificacion: typeof obj.justificacion === 'string' ? obj.justificacion : '',
      dadosRequeridos: Array.isArray(obj.dadosRequeridos)
        ? (obj.dadosRequeridos as Record<string, unknown>[])
            .filter(d => typeof d?.motivo === 'string' && typeof d?.tipo === 'string')
            .map(d => ({ motivo: d.motivo as string, tipo: d.tipo as string }))
        : undefined,
    },
  }
}
