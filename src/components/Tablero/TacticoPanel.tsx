import { useEffect, useMemo, useState } from 'react'
import type { EstadoTablero, Fase, Lado } from '../../types/tablero'
import { construirInforme } from '../../engine/informe'
import { obtenerCorpus } from '../../ia/corpusNavegador'
import { consultaTacticaBreve, consultaTacticaCompleta, leerPlan } from '../../../ia/consulta'
import { ETAPA_ATAQUE, ETAPA_MOVIMIENTO, promptTactico } from '../../../ia/prompts'
import type { EtapaTactica } from '../../../ia/esquemas'
import {
  recortarDestino,
  resolverTirada,
  tirarDados,
  validarPlan,
} from '../../../ia/validarPlan'
import { distanciaEntrePuntos } from '../../engine/geometria'
import type { AccionValidada, PlanValidado, ResultadoTirada } from '../../../ia/validarPlan'
import { FACCIONES_MAP } from '../../data/facciones'
import styles from './TacticoPanel.module.css'

// El Táctico en modo copiar/pegar. El turno se planifica en dos etapas: primero
// intención y movimiento, después disparo y carga con las unidades ya colocadas.
// Ver design/plan-implementacion.md § 4.

interface Props {
  estado: EstadoTablero
  /** `destino` viene ya recortado si la tirada se quedó corta. */
  onAplicar: (accion: AccionValidada, destino?: { x: number; y: number }) => void
  onTerminarTurno: () => void
  onFase: (fase: Fase) => void
}

/**
 * La etapa se deduce de la fase de la partida: no es una elección. El movimiento
 * ocurre antes que el disparo, así que planificar el ataque con las unidades aún
 * sin colocar daría un plan sobre posiciones que ya no existen.
 */
function etapaDeFase(fase: Fase): EtapaTactica {
  return fase === 'mando' || fase === 'movimiento' ? 'movimiento' : 'ataque'
}

const ETAPAS: EtapaTactica[] = ['movimiento', 'ataque']

const NOMBRE_ETAPA: Record<EtapaTactica, string> = {
  movimiento: '1 · Intención y movimiento',
  ataque: '2 · Disparo y carga',
}

/** Fase a la que salta la mesa al cerrar cada etapa. */
const FASE_DE_ETAPA: Record<EtapaTactica, Fase> = {
  movimiento: 'movimiento',
  ataque: 'disparo',
}

export function TacticoPanel({ estado, onAplicar, onTerminarTurno, onFase }: Props) {
  const [competencia, setCompetencia] = useState(3)
  const [pegado, setPegado] = useState('')
  const [validado, setValidado] = useState<PlanValidado | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [corpusEnviado, setCorpusEnviado] = useState(false)
  const [aplicadas, setAplicadas] = useState<Set<number>>(new Set())
  const [tiradas, setTiradas] = useState<Record<number, ResultadoTirada>>({})
  /** Pulgadas que recorrió de verdad cada acción aplicada. */
  const [movidas, setMovidas] = useState<Record<number, number>>({})

  const [abierto, setAbierto] = useState(false)

  const etapa = etapaDeFase(estado.fase)
  const esTurnoDelTactico = estado.turnoDe === 'oponente'

  // Se abre solo cuando le toca jugar y se pliega cuando el turno vuelve a ti,
  // para no tapar el mapa mientras juegas.
  useEffect(() => {
    setAbierto(esTurnoDelTactico)
  }, [esTurnoDelTactico])

  /** Cada etapa se planifica de cero: el plan anterior ya se ejecutó sobre la mesa. */
  useEffect(() => {
    limpiarPlan()
  }, [etapa, esTurnoDelTactico])

  function limpiarPlan() {
    setPegado('')
    setValidado(null)
    setError(null)
    setAplicadas(new Set())
    setTiradas({})
    setMovidas({})
  }

  /** El Táctico juega el bando contrario al tuyo. */
  const ladoTactico: Lado = 'oponente'
  const informe = useMemo(() => construirInforme(estado), [estado])

  const faccionOponente = useMemo(() => {
    const u = estado.unidades.find(x => x.bando === ladoTactico)
    return u ? (FACCIONES_MAP[u.faccionId]?.nombre ?? u.faccionId) : 'el oponente'
  }, [estado.unidades])

  const unidadesTactico = estado.unidades.filter(
    u => u.bando === ladoTactico && !u.marcas.includes('destruida')
  )

  function handleCopiar() {
    const textoEtapa = etapa === 'movimiento' ? ETAPA_MOVIMIENTO : ETAPA_ATAQUE
    const texto = corpusEnviado
      ? consultaTacticaBreve({ etapa: textoEtapa, informe })
      : consultaTacticaCompleta({
          corpus: obtenerCorpus().corpus,
          prompt: promptTactico({ faccionOponente, competencia }),
          etapa: textoEtapa,
          informe,
        })

    navigator.clipboard?.writeText(texto).then(() => {
      setCopiado(true)
      setCorpusEnviado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  function handleLeer() {
    const lectura = leerPlan(pegado)
    if (!lectura.ok || !lectura.plan) {
      setError(lectura.error ?? 'No se pudo leer el plan.')
      setValidado(null)
      return
    }
    setError(null)
    setAplicadas(new Set())
    setTiradas({})
    setMovidas({})
    setValidado(validarPlan(lectura.plan, estado, informe, ladoTactico))
  }

  /**
   * La etapa se cierra cuando no queda ninguna acción legal sin ejecutar. Un plan
   * sin acciones válidas también cuenta: no hay nada que mover.
   */
  const etapaCompleta =
    validado != null && validado.acciones.every((a, i) => !a.valida || aplicadas.has(i))

  function handleAvanzarEtapa() {
    onFase(FASE_DE_ETAPA.ataque)
  }

  function handleTirar(v: AccionValidada, i: number) {
    if (!v.tirada) return
    const valor = tirarDados(v.tirada.tipo === '2D6' ? 2 : 1)
    setTiradas(prev => ({ ...prev, [i]: resolverTirada(v.tirada!, valor) }))
  }

  function handleAplicar(v: AccionValidada, i: number) {
    const tirada = tiradas[i]
    const unidad = estado.unidades.find(u => u.instanciaId === v.accion.unidadId)

    // Si la tirada se quedó corta, la unidad no se queda quieta: avanza lo que
    // pueda hacia el destino. Una carga fallida, en cambio, no mueve nada.
    let destino = v.accion.destino
    if (v.tirada && tirada && !tirada.exito && unidad) {
      destino =
        v.accion.tipo === 'cargar'
          ? undefined
          : recortarDestino(unidad.pos, v.accion.destino ?? unidad.pos, tirada.alcance)
    }

    if (unidad && destino) {
      const real = Math.round(distanciaEntrePuntos(unidad.pos, destino) * 10) / 10
      setMovidas(prev => ({ ...prev, [i]: real }))
    }

    onAplicar(v, destino)
    setAplicadas(prev => new Set(prev).add(i))
  }

  const sinUnidades = unidadesTactico.length === 0

  return (
    <aside className={`${styles.cajon} ${abierto ? '' : styles.cajonCerrado}`}>
      <button
        className={styles.barra}
        onClick={() => setAbierto(v => !v)}
        aria-expanded={abierto}
      >
        <span className={styles.titulo}>Táctico</span>
        {sinUnidades ? (
          <span className={styles.enEspera}>sin unidades</span>
        ) : esTurnoDelTactico ? (
          <span className={styles.activo}>
            ronda {estado.ronda} · fase de {estado.fase}
          </span>
        ) : (
          <span className={styles.enEspera}>en espera · tu turno</span>
        )}
        <span className={styles.meta}>
          {sinUnidades ? '' : `juega ${faccionOponente} · ${unidadesTactico.length} unidades`}
        </span>
        <span className={styles.asa}>{abierto ? '▾' : '▴'}</span>
      </button>

      <div className={styles.contenido}>
        {sinUnidades ? (
          <p className={styles.vacio}>
            Añade unidades del bando oponente al tablero para que el Táctico tenga algo
            que planificar.
          </p>
        ) : !esTurnoDelTactico ? (
          <>
            <p className={styles.vacio}>
              Es tu turno, ronda {estado.ronda}, fase de {estado.fase}. El Táctico se activa
              cuando lo termines y toma el mando de {faccionOponente}.
            </p>
            <button className={styles.btn} onClick={onTerminarTurno}>
              Terminar mi turno →
            </button>
          </>
        ) : (
          <>
            <div className={styles.controles}>
              {ETAPAS.map((e, i) => {
                const actual = ETAPAS.indexOf(etapa)
                const estilo =
                  e === etapa ? styles.etapaActiva : i < actual ? styles.etapaHecha : styles.etapaBloqueada
                return (
                  <span key={e} className={`${styles.etapa} ${estilo}`}>
                    {i < actual && '✓ '}
                    {NOMBRE_ETAPA[e]}
                  </span>
                )
              })}

              <label className={styles.competencia}>
                Competencia
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={competencia}
                  onChange={e => setCompetencia(Number(e.target.value))}
                />
                <strong>{competencia}</strong>
              </label>
            </div>

            <div className={styles.acciones}>
              <button className={styles.btn} onClick={handleCopiar}>
                {copiado
                  ? '✓ Copiado'
                  : corpusEnviado
                    ? 'Copiar consulta'
                    : 'Copiar consulta + reglas'}
              </button>
              {corpusEnviado && (
                <button className={styles.btnSutil} onClick={() => setCorpusEnviado(false)}>
                  Empezar conversación nueva
                </button>
              )}
            </div>

            <textarea
              className={styles.pegado}
              rows={3}
              value={pegado}
              onChange={e => setPegado(e.target.value)}
              placeholder='Pega aquí el plan: { "intencion": …, "acciones": [ … ] }'
            />
            <button className={styles.btn} onClick={handleLeer} disabled={!pegado.trim()}>
              Leer plan
            </button>

            {error && <p className={styles.error}>{error}</p>}

            {validado && (
              <div className={styles.plan}>
                <p className={styles.intencion}>{validado.plan.intencion}</p>

                <div className={styles.lista}>
                  {validado.acciones.map((v, i) => (
                    <div key={i} className={v.valida ? styles.accion : styles.accionInvalida}>
                      <div className={styles.accionCabecera}>
                        <span className={styles.tipo}>{v.accion.tipo}</span>
                        <strong>{v.nombreUnidad}</strong>
                        {v.nombreBlanco && (
                          <span className={styles.flecha}>→ {v.nombreBlanco}</span>
                        )}
                        {v.accion.destino && (
                          <span className={styles.destino}>
                            a {v.accion.destino.x}, {v.accion.destino.y}
                            {v.recorrido != null && ` · ${v.recorrido}"`}
                          </span>
                        )}
                        {movidas[i] != null && movidas[i] !== v.recorrido && (
                          <span className={styles.movioReal}>movió {movidas[i]}"</span>
                        )}
                      </div>

                      <p className={styles.descripcion}>{v.accion.descripcion}</p>

                      {v.valida ? (
                        <div className={styles.pieAccion}>
                          {v.tirada && (
                            <span className={styles.tirada}>
                              <button
                                className={styles.btnDado}
                                onClick={() => handleTirar(v, i)}
                                disabled={aplicadas.has(i)}
                              >
                                🎲 {v.tirada.tipo}
                              </button>
                              {tiradas[i] ? (
                                <span className={tiradas[i].exito ? styles.exito : styles.fallo}>
                                  {tiradas[i].valor} · necesitaba {v.tirada.minimo}
                                  {tiradas[i].exito
                                    ? ' · llega'
                                    : v.accion.tipo === 'cargar'
                                      ? ' · carga fallida'
                                      : ` · solo ${tiradas[i].alcance}"`}
                                </span>
                              ) : (
                                <span className={styles.pendiente}>
                                  necesita {v.tirada.minimo}+ · {v.tirada.motivo}
                                </span>
                              )}
                            </span>
                          )}
                          <button
                            className={styles.btnAplicar}
                            onClick={() => handleAplicar(v, i)}
                            disabled={aplicadas.has(i) || (!!v.tirada && !tiradas[i])}
                          >
                            {aplicadas.has(i) ? '✓ Aplicada' : 'Aplicar'}
                          </button>
                        </div>
                      ) : (
                        <p className={styles.motivo}>✗ {v.motivo}</p>
                      )}
                    </div>
                  ))}
                </div>

                {validado.plan.justificacion && (
                  <p className={styles.justificacion}>{validado.plan.justificacion}</p>
                )}

                {validado.plan.dadosRequeridos && validado.plan.dadosRequeridos.length > 0 && (
                  <div className={styles.dados}>
                    <div className={styles.dadosTitulo}>Tiradas necesarias</div>
                    {validado.plan.dadosRequeridos.map((d, i) => (
                      <div key={i}>
                        <strong>{d.tipo}</strong> — {d.motivo}
                      </div>
                    ))}
                  </div>
                )}

                {validado.invalidas > 0 && (
                  <p className={styles.error}>
                    {validado.invalidas} de {validado.acciones.length} acciones no son legales.
                    Están tachadas con el motivo.
                  </p>
                )}
              </div>
            )}

            {etapa === 'movimiento' ? (
              <div className={styles.cierre}>
                <button
                  className={styles.btn}
                  onClick={handleAvanzarEtapa}
                  disabled={!etapaCompleta}
                >
                  Movimiento hecho · pasar a disparo y carga →
                </button>
                {!etapaCompleta && (
                  <span className={styles.pistaCierre}>
                    {validado
                      ? 'Quedan acciones de movimiento sin aplicar.'
                      : 'Primero pide y aplica el plan de movimiento.'}
                  </span>
                )}
              </div>
            ) : (
              <button className={styles.btnSutil} onClick={onTerminarTurno}>
                Terminar turno del oponente →
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

