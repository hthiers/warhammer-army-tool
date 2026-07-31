import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import type { Unidad } from '../../types'
import type {
  EstadoTablero,
  Fase,
  Lado,
  MarcaEstado,
  Punto,
  Densidad,
  PiezaTerreno,
  Rol,
  TipoObjetivo,
  UnidadEnMesa,
} from '../../types/tablero'
import { MARCAS_ESTADO, MESA_ALTO, MESA_ANCHO, NOMBRE_TIPO_OBJETIVO } from '../../types/tablero'
import { FACCIONES, FACCIONES_MAP } from '../../data/facciones'
import {
  aplicarLayout,
  cargarEstadoTablero,
  crearUnidadEnMesa,
  exportarPiezas,
  guardarEstadoTablero,
  parejasAsimetricas,
  radioPorMiniaturas,
  rolDeLado,
  simetrizar,
} from '../../data/tablero/estadoTablero'
import { obtenerLayoutMesa } from '../../data/tablero/layouts'
import {
  FOOTPRINTS,
  TOTAL_PIEZAS,
  terrenoDePiezas,
  validarComposicion,
} from '../../data/tablero/footprints'
import { DISENOS, obtenerNumeroLayout } from '../../data/misiones/layouts'
import type { DisenoId } from '../../data/misiones/layouts'
import { POSTURAS } from '../../data/misiones/disposicionFuerza'
import type { PosturaId } from '../../types/misiones'
import { cargarEstadoDisposicion } from '../../data/misiones/estadoDisposicion'
import { controlObjetivo, distancia, lineaDeVision, movimiento, zonaDe } from '../../engine/geometria'
import { construirInforme, resolverUnidad, resumenSincronizacion } from '../../engine/informe'
import {
  aplicarDano,
  heridasDeLaHerida,
  heridasMaximas,
  heridasTotales,
} from '../../engine/heridas'
import { TacticoPanel } from './TacticoPanel'
import { MARCAS_POR_ACCION } from '../../../ia/validarPlan'
import type { AccionValidada } from '../../../ia/validarPlan'
import styles from './Tablero2D.module.css'

const FASES: Fase[] = ['mando', 'movimiento', 'disparo', 'carga', 'combate', 'final']

/** Verde → ámbar → rojo según cuánta unidad queda en pie. */
function colorHeridas(fraccion: number): string {
  if (fraccion > 0.66) return '#2f6b4f'
  if (fraccion > 0.33) return '#c08a2e'
  return '#a63535'
}

/** Marcas que solo valen durante el turno y se limpian al pasar el mando. */
const MARCAS_DE_TURNO: MarcaEstado[] = ['ha_disparado', 'ha_cargado', 'avanzada', 'retrocedida']

const ICONO_OBJETIVO: Record<TipoObjetivo, string> = {
  local: '⌂',
  central: '✚',
  expansion: '◆',
}

const NOMBRE_MARCA: Record<MarcaEstado, string> = {
  empeñada: 'Empeñada',
  retrocedida: 'Retrocedió',
  avanzada: 'Avanzada',
  ha_disparado: 'Disparó',
  ha_cargado: 'Cargó',
  en_reserva: 'Reserva',
  destruida: 'Destruida',
}

/** SVG crece hacia abajo; la mesa hacia arriba. */
function aSvgY(y: number): number {
  return MESA_ALTO - y
}

/** Abscisas y ordenadas interiores múltiplos de `paso`, sin pisar los bordes. */
function lineasRejilla(paso: number): { verticales: number[]; horizontales: number[] } {
  const verticales: number[] = []
  for (let x = paso; x < MESA_ANCHO; x += paso) verticales.push(x)
  const horizontales: number[] = []
  for (let y = paso; y < MESA_ALTO; y += paso) horizontales.push(y)
  return { verticales, horizontales }
}

/** Rejilla en dos niveles: 1" para medir con precisión, 6" para no perderse. */
const REJILLA_FINA = lineasRejilla(1)
const REJILLA_GRUESA = lineasRejilla(6)

function acotar(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

/** Etiqueta del layout que corresponde a un par de disposiciones, p. ej. "1-A". */
function obtenerNumeroLayoutTexto(a: PosturaId, b: PosturaId, diseno: DisenoId): string {
  return `${obtenerNumeroLayout(a, b)}-${diseno.toUpperCase()}`
}

function clientAMesa(svg: SVGSVGElement, clientX: number, clientY: number): Punto {
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const local = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
  return { x: local.x, y: MESA_ALTO - local.y }
}

/** Desplazamiento en píxeles a partir del cual un toque cuenta como arrastre y no
 *  como selección. Sin este umbral, el temblor del dedo impide seleccionar. */
const UMBRAL_ARRASTRE_PX = 5

interface Arrastre {
  tipo: 'unidad' | 'objetivo' | 'pieza'
  id: string
  clienteInicial: { x: number; y: number }
  movido: boolean
}

interface SeccionColapsableProps {
  id: string
  titulo: ReactNode
  colapsadas: Set<string>
  onToggle: (id: string) => void
  children: ReactNode
}

/** Sección del panel lateral que se puede plegar tocando su cabecera, para
 *  liberar espacio vertical sin perder la mesa de vista. */
function SeccionColapsable({ id, titulo, colapsadas, onToggle, children }: SeccionColapsableProps) {
  const colapsada = colapsadas.has(id)
  return (
    <section className={styles.seccion}>
      <button className={styles.seccionCabecera} onClick={() => onToggle(id)}>
        <h3 className={styles.seccionTitulo}>{titulo}</h3>
        <span className={styles.chevron}>{colapsada ? '▸' : '▾'}</span>
      </button>
      {!colapsada && children}
    </section>
  )
}

export function Tablero2D() {
  const [estado, setEstado] = useState<EstadoTablero>(cargarEstadoTablero)
  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const [faccionAlta, setFaccionAlta] = useState<string>(FACCIONES[0].id)
  const [unidadAlta, setUnidadAlta] = useState<string>(FACCIONES[0].unidades[0].id)
  const [bandoAlta, setBandoAlta] = useState<Lado>('oponente')
  const [piezaSel, setPiezaSel] = useState<string | null>(null)
  const [mostrarResumen, setMostrarResumen] = useState(false)
  const [exportado, setExportado] = useState<string | null>(null)
  const [seccionesColapsadas, setSeccionesColapsadas] = useState<Set<string>>(new Set())
  const svgRef = useRef<SVGSVGElement>(null)
  const arrastreRef = useRef<Arrastre | null>(null)

  // Arranca sincronizado con la disposición ya elegida en DispositionPicker.
  const disposicionGuardada = useMemo(() => cargarEstadoDisposicion(), [])
  const [posturaPropia, setPosturaPropia] = useState<PosturaId>(disposicionGuardada.propia)
  const [posturaOponente, setPosturaOponente] = useState<PosturaId>(disposicionGuardada.oponente)
  const [diseno, setDiseno] = useState<DisenoId>(disposicionGuardada.diseno)

  useEffect(() => {
    guardarEstadoTablero(estado)
  }, [estado])

  const layout = obtenerLayoutMesa(posturaPropia, posturaOponente, diseno)
  const problemasComposicion = layout ? validarComposicion(layout.piezas) : []
  const terreno = useMemo(() => terrenoDePiezas(estado.piezas), [estado.piezas])
  const vivas = estado.unidades.filter(u => !u.marcas.includes('destruida'))
  const unidadSel = estado.unidades.find(u => u.instanciaId === seleccionada) ?? null
  const perfilSel = unidadSel ? resolverUnidad(unidadSel) : undefined

  /** Líneas de medición desde la unidad seleccionada hacia el bando contrario. */
  const mediciones = useMemo(() => {
    if (!unidadSel) return []
    return vivas
      .filter(u => u.bando !== unidadSel.bando)
      .map(u => ({
        id: u.instanciaId,
        pos: u.pos,
        pulgadas: distancia(unidadSel, u),
        ldv: lineaDeVision(unidadSel, u, terreno),
      }))
      .filter(m => m.pulgadas <= 36)
      .sort((a, b) => a.pulgadas - b.pulgadas)
  }, [unidadSel, vivas, terreno])

  const controles = useMemo(
    () =>
      estado.objetivos.map(obj => ({
        obj,
        control: controlObjetivo(obj, vivas, u => resolverUnidad(u)?.stats.OC ?? 0),
      })),
    [estado.objetivos, vivas]
  )

  // ── Arrastre ────────────────────────────────────────────────────────────────

  function iniciarArrastre(e: ReactPointerEvent, tipo: Arrastre['tipo'], id: string) {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    arrastreRef.current = {
      tipo,
      id,
      clienteInicial: { x: e.clientX, y: e.clientY },
      movido: false,
    }
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const arrastre = arrastreRef.current
    if (!arrastre || !svgRef.current) return

    const recorrido = Math.hypot(
      e.clientX - arrastre.clienteInicial.x,
      e.clientY - arrastre.clienteInicial.y
    )
    if (!arrastre.movido && recorrido < UMBRAL_ARRASTRE_PX) return
    arrastre.movido = true

    const p = clientAMesa(svgRef.current, e.clientX, e.clientY)
    const pos = {
      x: Math.round(acotar(p.x, 0, MESA_ANCHO) * 10) / 10,
      y: Math.round(acotar(p.y, 0, MESA_ALTO) * 10) / 10,
    }

    if (arrastre.tipo === 'unidad') {
      setEstado(prev => ({
        ...prev,
        unidades: prev.unidades.map(u => (u.instanciaId === arrastre.id ? { ...u, pos } : u)),
      }))
    } else if (arrastre.tipo === 'objetivo') {
      setEstado(prev => ({
        ...prev,
        objetivos: prev.objetivos.map(o => (o.id === arrastre.id ? { ...o, pos } : o)),
      }))
    } else {
      setEstado(prev => ({
        ...prev,
        piezas: prev.piezas.map(pz => (pz.id === arrastre.id ? { ...pz, ancla: pos } : pz)),
      }))
    }
  }

  function handlePointerUp() {
    const arrastre = arrastreRef.current
    if (arrastre && !arrastre.movido) {
      if (arrastre.tipo === 'unidad') {
        setSeleccionada(arrastre.id)
        setPiezaSel(null)
      } else if (arrastre.tipo === 'pieza') {
        setPiezaSel(arrastre.id)
        setSeleccionada(null)
      }
    }
    arrastreRef.current = null
  }

  // ── Mutaciones ──────────────────────────────────────────────────────────────

  function actualizarUnidad(id: string, cambio: Partial<UnidadEnMesa>) {
    setEstado(prev => ({
      ...prev,
      unidades: prev.unidades.map(u => (u.instanciaId === id ? { ...u, ...cambio } : u)),
    }))
  }

  function handleAgregar() {
    const faccion = FACCIONES_MAP[faccionAlta]
    const unidad = faccion?.unidades.find(u => u.id === unidadAlta)
    if (!unidad) return
    const rol = rolDeLado(bandoAlta, estado.rolPropio)
    const zona = estado.zonas.find(z => z.rol === rol)
    const nueva = crearUnidadEnMesa(unidad, faccionAlta, bandoAlta, zona)
    setEstado(prev => ({ ...prev, unidades: [...prev.unidades, nueva] }))
    setSeleccionada(nueva.instanciaId)
  }

  function handleAplicarLayout() {
    if (!layout) return
    setEstado(prev => aplicarLayout(prev, layout))
  }

  function handleCambiarRolPropio(rol: Rol) {
    setEstado(prev => ({ ...prev, rolPropio: rol }))
  }

  function actualizarPieza(id: string, cambio: Partial<PiezaTerreno>) {
    setEstado(prev => ({
      ...prev,
      piezas: prev.piezas.map(p => (p.id === id ? { ...p, ...cambio } : p)),
    }))
  }

  function handleRotar(delta: number) {
    if (!piezaEditando) return
    const rotacion = (((piezaEditando.rotacion + delta) % 360) + 360) % 360
    actualizarPieza(piezaEditando.id, { rotacion })
  }

  function handleDensidad(densidad: Densidad) {
    if (!piezaEditando) return
    actualizarPieza(piezaEditando.id, { densidad })
  }

  function handleExportar() {
    setExportado(exportarPiezas(estado.piezas))
  }

  function handleSimetrizar() {
    setEstado(prev => ({ ...prev, piezas: simetrizar(prev.piezas) }))
  }

  /** Ajusta el tamaño de la escuadra. Es edición de lista, no daño: mueve también
   *  el tamaño inicial para que el desgaste siga midiéndose contra el correcto. */
  function handleMiniaturas(delta: number) {
    if (!unidadSel) return
    const miniaturas = Math.max(0, unidadSel.miniaturas + delta)
    const marcas =
      miniaturas === 0 && !unidadSel.marcas.includes('destruida')
        ? [...unidadSel.marcas, 'destruida' as MarcaEstado]
        : unidadSel.marcas
    actualizarUnidad(unidadSel.instanciaId, {
      miniaturas,
      miniaturasIniciales: miniaturas,
      radio: radioPorMiniaturas(miniaturas),
      marcas,
    })
  }

  /** Aplica daño (o lo revierte con `delta` negativo) miniatura a miniatura. */
  function handleDano(delta: number) {
    if (!unidadSel || !perfilSel) return
    const { miniaturas, heridasRestantes } = aplicarDano(unidadSel, perfilSel.stats.HER, delta)
    const destruida = miniaturas === 0
    const marcas = destruida
      ? [...new Set<MarcaEstado>([...unidadSel.marcas, 'destruida'])]
      : unidadSel.marcas.filter(m => m !== 'destruida')
    actualizarUnidad(unidadSel.instanciaId, {
      miniaturas,
      heridasRestantes,
      radio: radioPorMiniaturas(miniaturas),
      marcas,
    })
  }

  function handleToggleMarca(marca: MarcaEstado) {
    if (!unidadSel) return
    const marcas = unidadSel.marcas.includes(marca)
      ? unidadSel.marcas.filter(m => m !== marca)
      : [...unidadSel.marcas, marca]
    actualizarUnidad(unidadSel.instanciaId, { marcas })
  }

  function handleEliminar() {
    if (!unidadSel) return
    setEstado(prev => ({
      ...prev,
      unidades: prev.unidades.filter(u => u.instanciaId !== unidadSel.instanciaId),
    }))
    setSeleccionada(null)
  }

  function handleLimpiar() {
    if (!confirm('¿Quitar todas las unidades del tablero?')) return
    setEstado(prev => ({ ...prev, unidades: [] }))
    setSeleccionada(null)
  }

  function toggleSeccion(id: string) {
    setSeccionesColapsadas(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /**
   * Ejecuta una acción del plan sobre el tablero: mueve la ficha al destino y deja
   * la marca de estado que corresponda. La ficha sigue arrastrable, porque sobre la
   * mesa real puede no caber exactamente ahí.
   */
  function handleAplicarAccion(v: AccionValidada, destino?: Punto) {
    const marca = MARCAS_POR_ACCION[v.accion.tipo]
    setEstado(prev => ({
      ...prev,
      unidades: prev.unidades.map(u => {
        if (u.instanciaId !== v.accion.unidadId) return u
        return {
          ...u,
          pos: destino ?? u.pos,
          marcas: marca && !u.marcas.includes(marca) ? [...u.marcas, marca] : u.marcas,
        }
      }),
    }))
    setSeleccionada(v.accion.unidadId)
  }

  /** Cierra el turno en curso y pasa el mando al otro bando, en la fase de mando. */
  function handleTerminarTurno() {
    setEstado(prev => {
      const siguiente: Lado = prev.turnoDe === 'propio' ? 'oponente' : 'propio'
      return {
        ...prev,
        turnoDe: siguiente,
        fase: 'mando',
        ronda: siguiente === 'propio' ? prev.ronda + 1 : prev.ronda,
        unidades: prev.unidades.map(u => ({
          ...u,
          marcas: u.marcas.filter(m => !MARCAS_DE_TURNO.includes(m)),
        })),
      }
    })
  }

  function handleSiguienteFase() {
    setEstado(prev => {
      const i = FASES.indexOf(prev.fase)
      if (i < FASES.length - 1) return { ...prev, fase: FASES[i + 1] }
      const cambiaTurno: Lado = prev.turnoDe === 'propio' ? 'oponente' : 'propio'
      return {
        ...prev,
        fase: FASES[0],
        turnoDe: cambiaTurno,
        ronda: cambiaTurno === 'propio' ? prev.ronda + 1 : prev.ronda,
        unidades: prev.unidades.map(u => ({
          ...u,
          marcas: u.marcas.filter(m => !MARCAS_DE_TURNO.includes(m)),
        })),
      }
    })
  }

  const piezaEditando = estado.piezas.find(p => p.id === piezaSel) ?? null
  const asimetricas = parejasAsimetricas(estado.piezas)
  const unidadesFaccionAlta = FACCIONES_MAP[faccionAlta]?.unidades ?? []
  const informe = mostrarResumen ? construirInforme(estado) : null

  return (
    <div className={styles.wrap}>
      <div className={styles.barra}>
        <span className={styles.dato}>
          Ronda <strong>{estado.ronda}</strong>
        </span>
        <span className={styles.dato}>
          Turno <strong>{estado.turnoDe === 'propio' ? 'propio' : 'oponente'}</strong>
        </span>
        <span className={styles.dato}>
          Fase <strong>{estado.fase}</strong>
        </span>
        <button className={styles.btn} onClick={handleSiguienteFase}>
          Siguiente fase →
        </button>
        <span className={styles.espaciador} />
        <span className={styles.dato}>{vivas.length} unidades en mesa</span>
        <button className={styles.btnSutil} onClick={() => setMostrarResumen(v => !v)}>
          {mostrarResumen ? 'Ocultar' : 'Verificar'} estado
        </button>
      </div>

      <div className={styles.tableroYPanel}>
        <div className={styles.mesaWrap}>
          <svg
            ref={svgRef}
            className={styles.mesa}
            viewBox={`0 0 ${MESA_ANCHO} ${MESA_ALTO}`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerDown={() => {
              setSeleccionada(null)
              setPiezaSel(null)
            }}
          >
            <rect
              x={0}
              y={0}
              width={MESA_ANCHO}
              height={MESA_ALTO}
              className={styles.borde}
              fill="none"
            />

            {/* Rejilla fina de 1" */}
            {REJILLA_FINA.verticales.map(x => (
              <line key={`f-v${x}`} x1={x} y1={0} x2={x} y2={MESA_ALTO} className={styles.rejillaFina} />
            ))}
            {REJILLA_FINA.horizontales.map(y => (
              <line key={`f-h${y}`} x1={0} y1={y} x2={MESA_ANCHO} y2={y} className={styles.rejillaFina} />
            ))}

            {/* Rejilla marcada de 6", encima para que domine visualmente */}
            {REJILLA_GRUESA.verticales.map(x => (
              <line key={`g-v${x}`} x1={x} y1={0} x2={x} y2={MESA_ALTO} className={styles.rejillaGruesa} />
            ))}
            {REJILLA_GRUESA.horizontales.map(y => (
              <line key={`g-h${y}`} x1={0} y1={y} x2={MESA_ANCHO} y2={y} className={styles.rejillaGruesa} />
            ))}

            {/* Zonas de despliegue */}
            {estado.zonas.map(z => (
              <polygon
                key={z.rol}
                points={z.poligono.map(p => `${p.x},${aSvgY(p.y)}`).join(' ')}
                className={
                  z.rol === estado.rolPropio ? styles.zonaPropia : styles.zonaOponente
                }
              />
            ))}

            {/* Líneas de centro */}
            <line
              x1={MESA_ANCHO / 2}
              y1={0}
              x2={MESA_ANCHO / 2}
              y2={MESA_ALTO}
              className={styles.lineaCentro}
            />
            <line
              x1={0}
              y1={aSvgY(MESA_ALTO / 2)}
              x2={MESA_ANCHO}
              y2={aSvgY(MESA_ALTO / 2)}
              className={styles.lineaCentro}
            />

            {/* Terreno: denso (obstruye la LdV) vs ligero */}
            {terreno.map(t => (
              <g
                key={t.id}
                className={styles.piezaGrupo}
                onPointerDown={e => iniciarArrastre(e, 'pieza', t.id)}
              >
                <polygon
                  points={t.poligono.map(p => `${p.x},${aSvgY(p.y)}`).join(' ')}
                  className={`${t.bloqueaLdV ? styles.terrenoDenso : styles.terrenoLigero} ${
                    t.id === piezaSel ? styles.piezaSel : ''
                  }`}
                />
                <text
                  x={t.poligono.reduce((s, p) => s + p.x, 0) / t.poligono.length}
                  y={aSvgY(t.poligono.reduce((s, p) => s + p.y, 0) / t.poligono.length) + 0.5}
                  className={styles.terrenoEtiqueta}
                >
                  {t.id}
                </text>
              </g>
            ))}

            {/* Objetivos con su anillo de control de 3" */}
            {controles.map(({ obj, control }) => (
              <g key={obj.id}>
                <circle
                  cx={obj.pos.x}
                  cy={aSvgY(obj.pos.y)}
                  r={3}
                  className={
                    control.controlaA === 'propio'
                      ? styles.anilloPropio
                      : control.controlaA === 'oponente'
                      ? styles.anilloOponente
                      : styles.anilloNeutro
                  }
                />
                <circle
                  cx={obj.pos.x}
                  cy={aSvgY(obj.pos.y)}
                  r={1.4}
                  className={styles.objetivo}
                  onPointerDown={e => iniciarArrastre(e, 'objetivo', obj.id)}
                />
                <text x={obj.pos.x} y={aSvgY(obj.pos.y) + 0.55} className={styles.objetivoIcono}>
                  {ICONO_OBJETIVO[obj.tipo]}
                </text>
              </g>
            ))}

            {/* Alcance de movimiento de la unidad seleccionada */}
            {unidadSel && perfilSel && (
              <circle
                cx={unidadSel.pos.x}
                cy={aSvgY(unidadSel.pos.y)}
                r={movimiento(perfilSel.stats.MOV) + unidadSel.radio}
                className={styles.anilloMovimiento}
              />
            )}

            {/* Regla virtual hacia el bando contrario */}
            {unidadSel &&
              mediciones.map(m => (
                <g key={m.id}>
                  <line
                    x1={unidadSel.pos.x}
                    y1={aSvgY(unidadSel.pos.y)}
                    x2={m.pos.x}
                    y2={aSvgY(m.pos.y)}
                    className={m.ldv ? styles.medicionLdv : styles.medicionSinLdv}
                  />
                  <text
                    x={(unidadSel.pos.x + m.pos.x) / 2}
                    y={aSvgY((unidadSel.pos.y + m.pos.y) / 2)}
                    className={styles.etiquetaMedicion}
                  >
                    {m.pulgadas}&quot;
                  </text>
                </g>
              ))}

            {/* Unidades */}
            {estado.unidades.map(u => {
              const perfil = resolverUnidad(u)
              const destruida = u.marcas.includes('destruida')
              // Anillo de heridas: solo aparece si la unidad está tocada, para no
              // ensuciar el mapa con aros llenos en unidades intactas.
              const her = perfil?.stats.HER ?? 1
              const max = heridasMaximas(u, her)
              const fraccion = max > 0 ? heridasTotales(u, her) / max : 1
              const radioAnillo = u.radio + 0.5
              const perimetro = 2 * Math.PI * radioAnillo
              return (
                <g
                  key={u.instanciaId}
                  className={destruida ? styles.fichaDestruida : styles.ficha}
                  onPointerDown={e => iniciarArrastre(e, 'unidad', u.instanciaId)}
                >
                  <circle
                    cx={u.pos.x}
                    cy={aSvgY(u.pos.y)}
                    r={u.radio}
                    fill={perfil?.color ?? '#888'}
                    className={
                      u.instanciaId === seleccionada
                        ? styles.fichaCirculoSel
                        : u.bando === 'propio'
                        ? styles.fichaCirculoPropio
                        : styles.fichaCirculoOponente
                    }
                  />
                  {!destruida && fraccion < 1 && (
                    <circle
                      cx={u.pos.x}
                      cy={aSvgY(u.pos.y)}
                      r={radioAnillo}
                      fill="none"
                      stroke={colorHeridas(fraccion)}
                      strokeWidth={0.5}
                      strokeLinecap="round"
                      strokeDasharray={`${fraccion * perimetro} ${perimetro}`}
                      transform={`rotate(-90 ${u.pos.x} ${aSvgY(u.pos.y)})`}
                      className={styles.anilloHeridas}
                    />
                  )}
                  <text x={u.pos.x} y={aSvgY(u.pos.y) + 0.6} className={styles.fichaTexto}>
                    {u.miniaturas}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className={styles.ayuda}>
            Arrastra las fichas y los objetivos. Toca una ficha para seleccionarla y ver su
            movimiento, distancias y línea de visión. La rejilla fina es de 1&quot; y la marcada
            de 6&quot;.
          </p>
        </div>

        <aside className={styles.panel}>
          <SeccionColapsable
            id="layout"
            titulo="Layout de mesa"
            colapsadas={seccionesColapsadas}
            onToggle={toggleSeccion}
          >
            <label className={styles.etiqueta}>Tu disposición</label>
            <select
              className={styles.select}
              value={posturaPropia}
              onChange={e => setPosturaPropia(e.target.value as PosturaId)}
            >
              {POSTURAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombreEs}
                </option>
              ))}
            </select>
            <label className={styles.etiqueta}>Disposición del oponente</label>
            <select
              className={styles.select}
              value={posturaOponente}
              onChange={e => setPosturaOponente(e.target.value as PosturaId)}
            >
              {POSTURAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombreEs}
                </option>
              ))}
            </select>
            <div className={styles.grupoBotones}>
              {DISENOS.map(d => (
                <button
                  key={d}
                  className={`${styles.btnBando} ${diseno === d ? styles.btnBandoActivo : ''}`}
                  onClick={() => setDiseno(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>

            {layout ? (
              <>
                <p className={styles.meta}>
                  {layout.nombre}
                  {layout.aproximado && (
                    <>
                      {' '}
                      <span className={styles.avisoAprox}>medidas por verificar</span>
                    </>
                  )}
                </p>
                <p className={styles.metaTenue}>
                  {layout.piezas.length} / {TOTAL_PIEZAS} piezas de terreno
                </p>
                {problemasComposicion.length > 0 && (
                  <ul className={styles.listaProblemas}>
                    {problemasComposicion.map(p => (
                      <li key={p.footprint}>
                        {FOOTPRINTS[p.footprint].nombre}: {p.encontradas} de {p.esperadas}
                      </li>
                    ))}
                  </ul>
                )}
                <button className={styles.btn} onClick={handleAplicarLayout}>
                  Aplicar layout
                </button>
              </>
            ) : (
              <p className={styles.metaTenue}>
                Layout {obtenerNumeroLayoutTexto(posturaPropia, posturaOponente, diseno)} sin datos
                cargados. La mesa muestra zonas genéricas de 12&quot;.
              </p>
            )}

            <label className={styles.etiqueta}>Tu rol</label>
            <div className={styles.grupoBotones}>
              <button
                className={`${styles.btnBando} ${
                  estado.rolPropio === 'atacante' ? styles.btnBandoActivo : ''
                }`}
                onClick={() => handleCambiarRolPropio('atacante')}
              >
                Atacante
              </button>
              <button
                className={`${styles.btnBando} ${
                  estado.rolPropio === 'defensor' ? styles.btnBandoActivo : ''
                }`}
                onClick={() => handleCambiarRolPropio('defensor')}
              >
                Defensor
              </button>
            </div>
            <p className={styles.metaTenue}>
              El atacante despliega en el borde superior; el defensor en el inferior.
            </p>
          </SeccionColapsable>

          <SeccionColapsable
            id="agregar"
            titulo="Añadir unidad"
            colapsadas={seccionesColapsadas}
            onToggle={toggleSeccion}
          >
            <select
              className={styles.select}
              value={faccionAlta}
              onChange={e => {
                setFaccionAlta(e.target.value)
                const primera = FACCIONES_MAP[e.target.value]?.unidades[0]
                if (primera) setUnidadAlta(primera.id)
              }}
            >
              {FACCIONES.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={unidadAlta}
              onChange={e => setUnidadAlta(e.target.value)}
            >
              {unidadesFaccionAlta.map((u: Unidad) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.pts} pts)
                </option>
              ))}
            </select>
            <div className={styles.grupoBotones}>
              <button
                className={`${styles.btnBando} ${bandoAlta === 'propio' ? styles.btnBandoActivo : ''}`}
                onClick={() => setBandoAlta('propio')}
              >
                Propio
              </button>
              <button
                className={`${styles.btnBando} ${bandoAlta === 'oponente' ? styles.btnBandoActivo : ''}`}
                onClick={() => setBandoAlta('oponente')}
              >
                Oponente
              </button>
            </div>
            <button className={styles.btn} onClick={handleAgregar}>
              + Añadir al tablero
            </button>
          </SeccionColapsable>

          {unidadSel && perfilSel ? (
            <SeccionColapsable
              id="unidad"
              titulo={perfilSel.nombre}
              colapsadas={seccionesColapsadas}
              onToggle={toggleSeccion}
            >
              <p className={styles.meta}>
                {unidadSel.bando === 'propio' ? 'Propio' : 'Oponente'} · MOV{' '}
                {perfilSel.stats.MOV} · OC {perfilSel.stats.OC}
                {perfilSel.rolIA ? ` · ${perfilSel.rolIA}` : ''}
              </p>
              <p className={styles.metaTenue}>
                {(() => {
                  const zona = zonaDe(unidadSel, estado.zonas)
                  const suyo = rolDeLado(unidadSel.bando, estado.rolPropio)
                  if (!zona) return 'En tierra de nadie'
                  return zona === suyo
                    ? 'En su zona de despliegue'
                    : `En la zona del ${zona}`
                })()}
              </p>

              <div className={styles.contador}>
                <span>Miniaturas</span>
                <button className={styles.btnMini} onClick={() => handleMiniaturas(-1)}>
                  −
                </button>
                <strong>{unidadSel.miniaturas}</strong>
                <button className={styles.btnMini} onClick={() => handleMiniaturas(1)}>
                  +
                </button>
              </div>

              {(() => {
                const her = perfilSel.stats.HER
                const total = heridasTotales(unidadSel, her)
                const max = heridasMaximas(unidadSel, her)
                const enPie = heridasDeLaHerida(unidadSel, her)
                return (
                  <div className={styles.heridas}>
                    <div className={styles.contador}>
                      <span>Heridas</span>
                      <button className={styles.btnMini} onClick={() => handleDano(1)}>
                        −
                      </button>
                      <strong>
                        {total}
                        <span className={styles.heridasMax}>/{max}</span>
                      </strong>
                      <button
                        className={styles.btnMini}
                        onClick={() => handleDano(-1)}
                        disabled={total >= max}
                      >
                        +
                      </button>
                    </div>
                    <div className={styles.barraHeridas}>
                      <div
                        className={styles.barraHeridasLlena}
                        style={{ width: `${max > 0 ? (total / max) * 100 : 0}%` }}
                      />
                    </div>
                    {her > 1 && unidadSel.miniaturas > 0 && (
                      <p className={styles.metaTenue}>
                        La miniatura que recibe el daño va con {enPie}/{her}.
                      </p>
                    )}
                  </div>
                )
              })()}

              <div className={styles.marcas}>
                {MARCAS_ESTADO.map(m => (
                  <button
                    key={m}
                    className={`${styles.marca} ${
                      unidadSel.marcas.includes(m) ? styles.marcaActiva : ''
                    }`}
                    onClick={() => handleToggleMarca(m)}
                  >
                    {NOMBRE_MARCA[m]}
                  </button>
                ))}
              </div>

              {mediciones.length > 0 && (
                <div className={styles.listaDistancias}>
                  <div className={styles.seccionSub}>Distancias</div>
                  {mediciones.slice(0, 6).map(m => {
                    const u = estado.unidades.find(x => x.instanciaId === m.id)
                    return (
                      <div key={m.id} className={styles.filaDistancia}>
                        <span>{u ? resolverUnidad(u)?.nombre ?? u.unidadId : m.id}</span>
                        <span className={m.ldv ? styles.conLdv : styles.sinLdv}>
                          {m.pulgadas}&quot; {m.ldv ? '· LdV' : '· sin LdV'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              <button className={styles.btnPeligro} onClick={handleEliminar}>
                Quitar del tablero
              </button>
            </SeccionColapsable>
          ) : (
            <section className={styles.seccion}>
              <p className={styles.vacio}>Selecciona una ficha para editarla.</p>
            </section>
          )}

          {piezaEditando && (
            <SeccionColapsable
              id="pieza"
              titulo={
                <>
                  Pieza {piezaEditando.id} · {FOOTPRINTS[piezaEditando.footprint].nombre}
                </>
              }
              colapsadas={seccionesColapsadas}
              onToggle={toggleSeccion}
            >
              <p className={styles.metaTenue}>
                {FOOTPRINTS[piezaEditando.footprint].ancho}&quot; ×{' '}
                {FOOTPRINTS[piezaEditando.footprint].alto}&quot; · ancla{' '}
                {piezaEditando.ancla.x}, {piezaEditando.ancla.y} · área {piezaEditando.areaId}
              </p>

              <div className={styles.contador}>
                <span>Rotación</span>
                <button className={styles.btnMini} onClick={() => handleRotar(-15)}>
                  ↺
                </button>
                <strong>{piezaEditando.rotacion}°</strong>
                <button className={styles.btnMini} onClick={() => handleRotar(15)}>
                  ↻
                </button>
                <button className={styles.btnMini} onClick={() => handleRotar(90)} title="Girar 90°">
                  90
                </button>
              </div>

              <div className={styles.grupoBotones}>
                <button
                  className={`${styles.btnBando} ${
                    piezaEditando.densidad === 'denso' ? styles.btnBandoActivo : ''
                  }`}
                  onClick={() => handleDensidad('denso')}
                >
                  Denso
                </button>
                <button
                  className={`${styles.btnBando} ${
                    piezaEditando.densidad === 'ligero' ? styles.btnBandoActivo : ''
                  }`}
                  onClick={() => handleDensidad('ligero')}
                >
                  Ligero
                </button>
              </div>
              <p className={styles.metaTenue}>
                El denso obstruye la línea de visión; el ligero no.
              </p>

              {piezaEditando.footprint === 'triangulo-grande' && (
                <button
                  className={styles.btnSutil}
                  onClick={() =>
                    actualizarPieza(piezaEditando.id, { reflejada: !piezaEditando.reflejada })
                  }
                >
                  {piezaEditando.reflejada ? 'Quitar reflejo' : 'Reflejar'}
                </button>
              )}
            </SeccionColapsable>
          )}

          <SeccionColapsable
            id="objetivos"
            titulo="Objetivos"
            colapsadas={seccionesColapsadas}
            onToggle={toggleSeccion}
          >
            {controles.map(({ obj, control }) => (
              <div key={obj.id} className={styles.filaObjetivo}>
                <span title={NOMBRE_TIPO_OBJETIVO[obj.tipo]}>
                  {ICONO_OBJETIVO[obj.tipo]} {obj.id}
                </span>
                <span className={styles.ocs}>
                  {control.propio} / {control.oponente}
                </span>
                <span
                  className={
                    control.controlaA === 'propio'
                      ? styles.badgePropio
                      : control.controlaA === 'oponente'
                      ? styles.badgeOponente
                      : styles.badgeNeutro
                  }
                >
                  {control.controlaA ?? 'neutro'}
                </span>
              </div>
            ))}
          </SeccionColapsable>

          {estado.piezas.length > 0 && (
            <SeccionColapsable
              id="simetria"
              titulo="Simetría"
              colapsadas={seccionesColapsadas}
              onToggle={toggleSeccion}
            >
              {asimetricas.length === 0 ? (
                <p className={styles.metaTenue}>
                  Las 8 parejas son rotación de 180° una de la otra.
                </p>
              ) : (
                <>
                  <p className={styles.metaTenue}>
                    Sin espejo exacto: <strong>{asimetricas.join(', ')}</strong>
                  </p>
                  <button className={styles.btnSutil} onClick={handleSimetrizar}>
                    Simetrizar ({asimetricas.length})
                  </button>
                </>
              )}
            </SeccionColapsable>
          )}

          <button className={styles.btnSutil} onClick={handleExportar}>
            Exportar layout
          </button>
          <button className={styles.btnSutil} onClick={handleLimpiar}>
            Limpiar tablero
          </button>
        </aside>
      </div>

      {exportado && (
        <section className={styles.resumen}>
          <h3 className={styles.seccionTitulo}>
            Layout exportado — pégalo en src/data/tablero/layouts.ts
          </h3>
          <textarea className={styles.exportArea} readOnly rows={12} value={exportado} />
          <div className={styles.grupoBotones}>
            <button
              className={styles.btnSutil}
              onClick={() => navigator.clipboard?.writeText(exportado)}
            >
              Copiar
            </button>
            <button className={styles.btnSutil} onClick={() => setExportado(null)}>
              Cerrar
            </button>
          </div>
        </section>
      )}

      <TacticoPanel
        estado={estado}
        onAplicar={handleAplicarAccion}
        onTerminarTurno={handleTerminarTurno}
        onFase={fase => setEstado(prev => ({ ...prev, fase }))}
      />

      {mostrarResumen && informe && (
        <section className={styles.resumen}>
          <h3 className={styles.seccionTitulo}>Verificación mesa ↔ app</h3>
          <ul className={styles.listaResumen}>
            {resumenSincronizacion(estado).map((linea, i) => (
              <li key={i}>{linea}</li>
            ))}
          </ul>
          <p className={styles.meta}>
            Informe táctico: {informe.unidades.length} unidades · {informe.distancias.length} pares
            medidos · {informe.amenazas.length} amenazas ·{' '}
            {informe.amenazas.filter(a => a.enRango).length} ya en rango
          </p>
        </section>
      )}
    </div>
  )
}
