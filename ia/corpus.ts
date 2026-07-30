import type {
  ArmaCombate,
  ArmaDistancia,
  DatosFaccion,
  Estratagema,
  Unidad,
} from '../src/types'
import type { MisionPrimaria, MisionSecundaria, SeccionPuntuacion } from '../src/types/misiones'
import { FACCIONES_MAP } from '../src/data/facciones'
import { ALIAS_REGLAS, HABILIDADES_UNIDAD, REGLAS_ESPECIALES } from '../src/data/reglas'
import { ESTRATAGEMAS_UNIVERSALES } from '../src/data/estratagemasUniversales'
import { MISIONES_PRIMARIAS } from '../src/data/misiones/primarias'
import { MISIONES_SECUNDARIAS } from '../src/data/misiones/secundarias'
import { POSTURAS, MATRIZ_DISPOSICION } from '../src/data/misiones/disposicionFuerza'

// ─── Corpus ───────────────────────────────────────────────────────────────────
//
// Serializa el reglamento y los datos de ejército a un único texto: la biblioteca
// de consulta que el asistente recibe en cada llamada. Es la parte ESTÁTICA del
// prompt, la que va detrás del `cache_control`, y no debe contener nada que cambie
// durante una partida (posiciones, heridas, marcador). Eso viaja en el
// InformeTactico, dentro de `messages`.
//
// Ver design/plan-implementacion.md § 4.

/**
 * Las reglas en prosa se pasan como parámetro en vez de leerse del disco: en node
 * se cargan con `fs`, pero un Worker no tiene sistema de ficheros y las recibe como
 * módulos de texto. Misma lógica de composición, cargador distinto.
 */
export interface FuentesCorpus {
  /** Contenido de `rules/*.md`, indexado por nombre de archivo. */
  reglasMd: Record<string, string>
  /**
   * Ids de facción a incluir. Hoy siempre son las dos que existen; el parámetro
   * es la costura para cuando haya una tercera y convenga cargar solo las que
   * están en juego.
   */
  facciones: string[]
}

export function construirCorpus({ reglasMd, facciones }: FuentesCorpus): string {
  const bloques = [
    seccionReglasProsa(reglasMd),
    seccionReglasEspeciales(),
    seccionHabilidadesUnidad(),
    seccionReglasSinDefinir(facciones),
    seccionEstratagemasUniversales(),
    ...facciones.map(id => seccionFaccion(FACCIONES_MAP[id])).filter(Boolean),
    seccionMisiones(),
  ]
  return bloques.filter(Boolean).join('\n\n')
}

// ─── Reglas en prosa ──────────────────────────────────────────────────────────

function seccionReglasProsa(reglasMd: Record<string, string>): string {
  const nombres = Object.keys(reglasMd).sort()
  if (nombres.length === 0) return ''
  const cuerpo = nombres.map(
    n => `<archivo nombre="${n}">\n${degradarTitulos(reglasMd[n].trim())}\n</archivo>`
  )
  return `# REGLAMENTO\n\n${cuerpo.join('\n\n')}`
}

/**
 * Baja dos niveles los títulos markdown del archivo. Sin esto, un `# Movimiento`
 * dentro de un `.md` queda al mismo nivel que las secciones del corpus (`# EJÉRCITO`,
 * `# MISIONES`) y la jerarquía deja de distinguir contenido de estructura.
 */
function degradarTitulos(md: string): string {
  return md.replace(/^(#{1,4}) /gm, (_, almohadillas: string) => `${almohadillas}## `)
}

// ─── Reglas especiales de arma ────────────────────────────────────────────────

/**
 * `REGLAS_ESPECIALES` mezcla strings con funciones, para reglas paramétricas
 * (Fuego Rápido X, Anti X). Se invocan con el marcador `X` para obtener el texto
 * con el hueco visible. Las que ramifican sobre el valor —el plural de
 * «Ataque/Ataques»— saldrán en singular; es cosmético y no cambia la regla.
 */
function seccionReglasEspeciales(): string {
  const lineas = Object.entries(REGLAS_ESPECIALES)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([nombre, desc]) => {
      const texto = typeof desc === 'function' ? desc('X') : desc
      const otros = ALIAS_REGLAS[nombre]
      const alias = otros ? ` (también aparece como: ${otros.join(', ')})` : ''
      return `- ${nombre}${alias}: ${texto}`
    })

  const preambulo =
    'El id citable de cada regla es el nombre en negrita al inicio de la línea. Cuando el reglamento en prosa o el perfil de un arma use otro nombre para la misma regla, cita el id de aquí.'

  return `# REGLAS ESPECIALES DE ARMA\n\n${preambulo}\n\n${lineas.join('\n')}`
}

/**
 * Habilidades básicas de unidad. Van en la hoja de datos y no en el perfil de un
 * arma, así que no aparecen en `especial` y hay que emitirlas aparte.
 */
function seccionHabilidadesUnidad(): string {
  const lineas = Object.entries(HABILIDADES_UNIDAD)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([nombre, desc]) => `- ${nombre}: ${typeof desc === 'function' ? desc('X') : desc}`)
  return `# HABILIDADES BÁSICAS DE UNIDAD\n\nVan en la hoja de datos de la unidad, sin corchetes, a diferencia de las habilidades de arma.\n\n${lineas.join('\n')}`
}

/**
 * Reglas que algún arma declara en su campo `especial` pero que no están definidas
 * en `REGLAS_ESPECIALES`. Decirlo explícitamente evita que el Árbitro invente su
 * significado a partir del nombre.
 */
function seccionReglasSinDefinir(facciones: string[]): string {
  const definidas = Object.keys(REGLAS_ESPECIALES)
  const conocido = (etiqueta: string) =>
    definidas.some(d => etiqueta === d || etiqueta.startsWith(`${d} `)) ||
    Object.entries(ALIAS_REGLAS).some(([, alias]) =>
      alias.some(a => etiqueta === a || etiqueta.startsWith(`${a} `))
    )

  const sinDefinir = new Set<string>()
  for (const faccionId of facciones) {
    const f = FACCIONES_MAP[faccionId]
    if (!f) continue
    for (const u of f.unidades) {
      for (const arma of [...u.distancia, ...u.combate]) {
        if (!arma.especial) continue
        for (const etiqueta of arma.especial.split(',').map(e => e.trim())) {
          if (etiqueta && !conocido(etiqueta)) sinDefinir.add(etiqueta)
        }
      }
    }
  }

  if (sinDefinir.size === 0) return ''

  const lista = [...sinDefinir].sort().map(e => `- ${e}`).join('\n')
  return `# REGLAS DE ARMA SIN DEFINIR\n\nEstas etiquetas aparecen en perfiles de arma pero su texto NO está en este corpus. Si una pregunta depende de una de ellas, responde con veredicto "depende" y dilo: no deduzcas su efecto a partir del nombre.\n\n${lista}`
}

// ─── Estratagemas ─────────────────────────────────────────────────────────────

function estratagemaATexto(e: Estratagema): string {
  const partes = [
    `### ${e.nombre} (id: ${e.id}) — ${e.pm} PM — ${e.tipo}`,
    `Cuándo: ${e.cuando}`,
    `Objetivo: ${e.blanco}`,
    `Efecto: ${e.efecto}`,
  ]
  if (e.restricciones) partes.push(`Restricciones: ${e.restricciones}`)
  return partes.join('\n')
}

function seccionEstratagemasUniversales(): string {
  const cuerpo = ESTRATAGEMAS_UNIVERSALES.map(estratagemaATexto)
  return `# ESTRATAGEMAS UNIVERSALES\n\nDisponibles para cualquier ejército.\n\n${cuerpo.join('\n\n')}`
}

// ─── Unidades ─────────────────────────────────────────────────────────────────

function armaDistanciaATexto(a: ArmaDistancia): string {
  const flags = [a.opcional && '(opcional)', a.esAlternativa && '(alternativa)']
    .filter(Boolean)
    .join(' ')
  const especial = a.especial ? ` [${a.especial}]` : ''
  return `  - ${a.nombre} ${flags} — ${a.rango} A${a.A} HP${a.HP} F${a.F} FP${a.FP} D${a.D}${especial}`
}

function armaCombateATexto(a: ArmaCombate): string {
  const flags = [a.opcional && '(opcional)', a.esAlternativa && '(alternativa)']
    .filter(Boolean)
    .join(' ')
  const especial = a.especial ? ` [${a.especial}]` : ''
  return `  - ${a.nombre} ${flags} — A${a.A} HA${a.HA} F${a.F} FP${a.FP} D${a.D}${especial}`
}

function unidadATexto(u: Unidad): string {
  const s = u.stats
  const partes = [
    `## ${u.nombre} (id: ${u.id}) — ${u.pts} pts`,
    `Palabras clave: ${u.palabrasClave.join(', ')}`,
    `MOV ${s.MOV} | RES ${s.RES} | HER ${s.HER} | SALV ${s.SALV} | INV ${s.INV} | LID ${s.LID} | OC ${s.OC}`,
  ]

  if (u.distancia.length > 0) {
    partes.push(`Armas a distancia:\n${u.distancia.map(armaDistanciaATexto).join('\n')}`)
  }
  if (u.combate.length > 0) {
    partes.push(`Armas de combate:\n${u.combate.map(armaCombateATexto).join('\n')}`)
  }
  if (u.habilidades.length > 0) {
    partes.push(
      `Habilidades:\n${u.habilidades.map(h => `  - ${h.nombre}: ${h.desc}`).join('\n')}`
    )
  }
  if (u.adjunta) {
    partes.push(`Se adjunta como ${u.adjunta.rol} a: ${u.adjunta.unidades.join(', ')}`)
  }
  if (u.rolIA) partes.push(`Rol táctico: ${u.rolIA}`)

  return partes.join('\n')
}

// ─── Facción ──────────────────────────────────────────────────────────────────

function seccionFaccion(faccion: DatosFaccion | undefined): string {
  if (!faccion) return ''

  const secciones: string[] = [`# EJÉRCITO: ${faccion.nombre} (id: ${faccion.id})`]

  if (faccion.reglasFaccion.length > 0) {
    const cuerpo = faccion.reglasFaccion.map(r => {
      const efectos = r.efectos?.length ? `\n${r.efectos.map(e => `  - ${e}`).join('\n')}` : ''
      return `## ${r.nombre} (id: ${r.id})\n${r.desc}${efectos}`
    })
    secciones.push(`## Reglas de facción\n\n${cuerpo.join('\n\n')}`)
  }

  secciones.push(`## Unidades\n\n${faccion.unidades.map(unidadATexto).join('\n\n')}`)

  for (const dest of faccion.destacamentos) {
    const partes = [`## Destacamento: ${dest.nombre} (id: ${dest.id}) — ${dest.dp} DP`]

    const regla = faccion.reglas[dest.id]
    if (regla) {
      partes.push(`Regla «${regla.nombre}»:\n${regla.efectos.map(e => `  - ${e}`).join('\n')}`)
    }

    const mejoras = faccion.mejoras[dest.id] ?? []
    if (mejoras.length > 0) {
      partes.push(
        `Mejoras:\n${mejoras
          .map(m => `  - ${m.nombre} (id: ${m.id}) [${m.restriccion}]: ${m.desc}`)
          .join('\n')}`
      )
    }

    // Las universales ya se emitieron una vez; `conUniversales` las inyecta en
    // cada destacamento, así que aquí se filtran para no repetirlas N veces.
    const propias = (faccion.estratagemas[dest.id] ?? []).filter(e => e.etiqueta !== 'Universal')
    if (propias.length > 0) {
      partes.push(`Estratagemas propias:\n\n${propias.map(estratagemaATexto).join('\n\n')}`)
    }

    secciones.push(partes.join('\n'))
  }

  return secciones.join('\n\n')
}

// ─── Misiones ─────────────────────────────────────────────────────────────────

function seccionPuntuacionATexto(s: SeccionPuntuacion): string {
  const cabecera = [s.cuando, s.disparador, s.chip].filter(Boolean).join(' · ')
  const niveles = s.niveles.map(n => {
    const marcas = [
      n.porUnidad && 'por unidad',
      n.acumulable && 'acumulable',
      n.cap != null && `máx ${n.cap}`,
      n.disyuntivo && 'alternativa',
    ]
      .filter(Boolean)
      .join(', ')
    return `    - ${n.texto} → ${n.pv} PV${marcas ? ` (${marcas})` : ''}`
  })
  return `  ${cabecera}\n${niveles.join('\n')}`
}

function misionATexto(m: MisionPrimaria | MisionSecundaria): string {
  // Las secundarias no llevan `mazo`: se roban de un mazo táctico común.
  const mazo = 'mazo' in m ? m.mazo : 'táctica'
  const partes = [`## ${m.nombreEs} / ${m.nombre} (id: ${m.id}) — mazo ${mazo}`]

  if ('tipo' in m && m.tipo) partes.push(`Tipo: ${m.tipo}`)
  if ('alRobarla' in m && m.alRobarla) partes.push(`Al robarla: ${m.alRobarla}`)

  partes.push(m.secciones.map(seccionPuntuacionATexto).join('\n'))

  if (m.accion) {
    const filas = m.accion.filas.map(f => `    - ${f.clave}: ${f.valor}`).join('\n')
    partes.push(`  Acción «${m.accion.titulo}»:\n${filas}`)
  }

  return partes.join('\n')
}

function seccionMisiones(): string {
  const posturas = POSTURAS.map(p => `- ${p.nombreEs} / ${p.nombre} (id: ${p.id})`).join('\n')

  const matriz = Object.entries(MATRIZ_DISPOSICION)
    .map(([propia, contra]) => {
      const filas = Object.entries(contra)
        .map(([oponente, carta]) => `  vs ${oponente}: ${carta}`)
        .join('\n')
      return `${propia}:\n${filas}`
    })
    .join('\n')

  return [
    '# MISIONES',
    `## Disposiciones de la fuerza\n\n${posturas}`,
    `## Matriz de disposición\n\nCon tu postura como fila y la del oponente como columna, la celda indica qué carta primaria juegas de tu propio mazo. No es simétrico.\n\n${matriz}`,
    `## Cartas de misión primaria\n\n${MISIONES_PRIMARIAS.map(misionATexto).join('\n\n')}`,
    `## Cartas de misión secundaria\n\n${MISIONES_SECUNDARIAS.map(misionATexto).join('\n\n')}`,
  ].join('\n\n')
}

// ─── Verificación de citas ────────────────────────────────────────────────────

/**
 * Todos los ids citables que existen de verdad. El Árbitro devuelve
 * `reglasAplicadas` y el cliente comprueba contra este conjunto: si cita algo que
 * no está, se ve al instante en vez de pasar por bueno.
 */
export function idsCitables(facciones: string[]): Set<string> {
  const ids = new Set<string>()

  for (const nombre of Object.keys(REGLAS_ESPECIALES)) ids.add(nombre)
  for (const nombre of Object.keys(HABILIDADES_UNIDAD)) ids.add(nombre)
  for (const e of ESTRATAGEMAS_UNIVERSALES) ids.add(e.id)
  for (const m of MISIONES_PRIMARIAS) ids.add(m.id)
  for (const m of MISIONES_SECUNDARIAS) ids.add(m.id)
  for (const p of POSTURAS) ids.add(p.id)

  for (const faccionId of facciones) {
    const f = FACCIONES_MAP[faccionId]
    if (!f) continue
    for (const u of f.unidades) ids.add(u.id)
    for (const r of f.reglasFaccion) ids.add(r.id)
    for (const d of f.destacamentos) ids.add(d.id)
    for (const lista of Object.values(f.estratagemas)) for (const e of lista) ids.add(e.id)
    for (const lista of Object.values(f.mejoras)) for (const m of lista) ids.add(m.id)
  }

  return ids
}
