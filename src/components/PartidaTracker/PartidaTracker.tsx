import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { MisionPrimaria, PosturaId } from '../../types/misiones'
import { MISIONES_SECUNDARIAS, MISIONES_SECUNDARIAS_MAP } from '../../data/misiones/secundarias'
import { MISIONES_PRIMARIAS_MAP } from '../../data/misiones/primarias'
import { POSTURAS_MAP, MATRIZ_DISPOSICION } from '../../data/misiones/disposicionFuerza'
import { cargarEstadoDisposicion } from '../../data/misiones/estadoDisposicion'
import { MissionCard } from '../MissionCard/MissionCard'
import styles from './PartidaTracker.module.css'

type TipoSecundarias = 'fija' | 'tactica'
type Lado = 'propio' | 'oponente'
type Rol = 'atacante' | 'defensor'

interface EstadoSecundarias {
  tipo: TipoSecundarias | null
  activas: string[]
  mazo: string[]
  mano: string[]
}

interface EstadoPartida {
  ronda: number
  turnoActivo: Lado
  pvPropio: number
  pvOponente: number
  cpPropio: number
  cpOponente: number
  rolPropio: Rol | null
  secundariasPropio: EstadoSecundarias
  secundariasOponente: EstadoSecundarias
}

const STORAGE_KEY = 'wh40k-partida-actual'
const SECUNDARIAS_INICIAL: EstadoSecundarias = { tipo: null, activas: [], mazo: [], mano: [] }
const ESTADO_INICIAL: EstadoPartida = {
  ronda: 1,
  turnoActivo: 'propio',
  pvPropio: 0,
  pvOponente: 0,
  cpPropio: 0,
  cpOponente: 0,
  rolPropio: null,
  secundariasPropio: SECUNDARIAS_INICIAL,
  secundariasOponente: SECUNDARIAS_INICIAL,
}

const NOMBRE_ROL: Record<Rol, string> = { atacante: 'Atacante', defensor: 'Defensor' }
const ROL_OPUESTO: Record<Rol, Rol> = { atacante: 'defensor', defensor: 'atacante' }

function cargarEstado(): EstadoPartida {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (guardado) return { ...ESTADO_INICIAL, ...JSON.parse(guardado) }
  } catch {
    // ignorar errores de parseo
  }
  return ESTADO_INICIAL
}

function barajar<T>(arr: T[]): T[] {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function elegirAlAzar<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const CLAVE_LADO: Record<Lado, keyof EstadoPartida> = {
  propio: 'secundariasPropio',
  oponente: 'secundariasOponente',
}

export function PartidaTracker() {
  const [estado, setEstado] = useState<EstadoPartida>(cargarEstado)
  const [disposicion] = useState(cargarEstadoDisposicion)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
  }, [estado])

  const misionPropia = MISIONES_PRIMARIAS_MAP[MATRIZ_DISPOSICION[disposicion.propia][disposicion.oponente]]
  const misionOponente = MISIONES_PRIMARIAS_MAP[MATRIZ_DISPOSICION[disposicion.oponente][disposicion.propia]]

  function cambiarRonda(delta: number) {
    setEstado(e => ({ ...e, ronda: Math.min(5, Math.max(1, e.ronda + delta)) }))
  }

  function marcarTurno(lado: Lado) {
    setEstado(e => ({ ...e, turnoActivo: lado }))
  }

  function sumarPV(jugador: 'pvPropio' | 'pvOponente', delta: number) {
    setEstado(e => ({ ...e, [jugador]: Math.max(0, e[jugador] + delta) }))
  }

  function sumarCP(jugador: 'cpPropio' | 'cpOponente', delta: number) {
    setEstado(e => ({ ...e, [jugador]: Math.max(0, e[jugador] + delta) }))
  }

  function actualizarLado(lado: Lado, fn: (s: EstadoSecundarias) => EstadoSecundarias) {
    setEstado(e => ({ ...e, [CLAVE_LADO[lado]]: fn(e[CLAVE_LADO[lado]] as EstadoSecundarias) }))
  }

  function elegirTipo(lado: Lado, tipo: TipoSecundarias) {
    actualizarLado(lado, () => ({
      tipo,
      activas: [],
      mazo: tipo === 'tactica' ? barajar(MISIONES_SECUNDARIAS.map(m => m.id)) : [],
      mano: [],
    }))
  }

  function cambiarTipo(lado: Lado) {
    if (confirm('¿Cambiar el modo de secundarias? Se perderá la mano y las secundarias activas actuales.')) {
      actualizarLado(lado, () => SECUNDARIAS_INICIAL)
    }
  }

  function agregarFija(lado: Lado, id: string) {
    actualizarLado(lado, s => {
      if (!id || s.activas.includes(id) || s.activas.length >= 2) return s
      return { ...s, activas: [...s.activas, id] }
    })
  }

  function sortearFijas(lado: Lado) {
    actualizarLado(lado, s => {
      const disponibles = MISIONES_SECUNDARIAS.map(m => m.id).filter(id => !s.activas.includes(id))
      const faltan = 2 - s.activas.length
      if (faltan <= 0) return s
      const elegidas = barajar(disponibles).slice(0, faltan)
      return { ...s, activas: [...s.activas, ...elegidas] }
    })
  }

  function quitarFija(lado: Lado, id: string) {
    actualizarLado(lado, s => ({ ...s, activas: s.activas.filter(x => x !== id) }))
  }

  function robarMano(lado: Lado) {
    actualizarLado(lado, s => {
      const faltan = 3 - s.mano.length
      if (faltan <= 0) return s
      const robadas = s.mazo.slice(0, faltan)
      return { ...s, mano: [...s.mano, ...robadas], mazo: s.mazo.slice(faltan) }
    })
  }

  function activarSecundaria(lado: Lado, id: string) {
    actualizarLado(lado, s => {
      if (s.activas.length >= 2) return s
      return { ...s, activas: [...s.activas, id], mano: s.mano.filter(x => x !== id) }
    })
  }

  function activarAlAzar(lado: Lado) {
    actualizarLado(lado, s => {
      if (s.activas.length >= 2 || s.mano.length === 0) return s
      const id = elegirAlAzar(s.mano)
      return { ...s, activas: [...s.activas, id], mano: s.mano.filter(x => x !== id) }
    })
  }

  function descartarDeMano(lado: Lado, id: string) {
    actualizarLado(lado, s => ({ ...s, mano: s.mano.filter(x => x !== id), mazo: [...s.mazo, id] }))
  }

  function retirarActiva(lado: Lado, id: string) {
    actualizarLado(lado, s => ({ ...s, activas: s.activas.filter(x => x !== id) }))
  }

  function reiniciarPartida() {
    if (confirm('¿Reiniciar la partida actual? Se perderá la ronda, los PV, los CP y las secundarias.')) {
      setEstado(ESTADO_INICIAL)
    }
  }

  function elegirAtacante(lado: Lado) {
    setEstado(e => ({
      ...e,
      rolPropio: lado === 'propio' ? 'atacante' : 'defensor',
      secundariasPropio: SECUNDARIAS_INICIAL,
      secundariasOponente: SECUNDARIAS_INICIAL,
    }))
  }

  function cambiarRol() {
    if (confirm('¿Cambiar quién es el Atacante? Se perderán las secundarias elegidas de ambos jugadores.')) {
      setEstado(e => ({ ...e, rolPropio: null, secundariasPropio: SECUNDARIAS_INICIAL, secundariasOponente: SECUNDARIAS_INICIAL }))
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.panelSuperior}>
        <div className={styles.rondaBox}>
          <span className={styles.label}>Ronda de batalla</span>
          <div className={styles.rondaControl}>
            <button className={styles.rondaBtn} onClick={() => cambiarRonda(-1)} disabled={estado.ronda <= 1}>−</button>
            <span className={styles.rondaValor}>{estado.ronda}</span>
            <button className={styles.rondaBtn} onClick={() => cambiarRonda(1)} disabled={estado.ronda >= 5}>+</button>
          </div>
        </div>

        <div className={styles.turnoBox}>
          <span className={styles.label}>Turno activo</span>
          <div className={styles.turnoControl}>
            <button
              className={`${styles.turnoBtn} ${estado.turnoActivo === 'propio' ? styles.turnoBtnActivo : ''}`}
              onClick={() => marcarTurno('propio')}
            >
              Vos
            </button>
            <button
              className={`${styles.turnoBtn} ${estado.turnoActivo === 'oponente' ? styles.turnoBtnActivo : ''}`}
              onClick={() => marcarTurno('oponente')}
            >
              Oponente
            </button>
          </div>
        </div>

        <button className={styles.reiniciar} onClick={reiniciarPartida}>Reiniciar partida</button>
      </div>

      {estado.rolPropio === null ? (
        <div className={styles.tipoElegir}>
          <h3 className={styles.secundariasTitulo}>¿Quién es el Atacante?</h3>
          <p className={styles.ayuda}>Se decide antes de elegir las misiones secundarias.</p>
          <div className={styles.tipoOpciones}>
            <button className={styles.tipoBtn} onClick={() => elegirAtacante('propio')}>
              <strong>Vos sos el Atacante</strong>
              <span>El oponente (IA) queda como Defensor.</span>
            </button>
            <button className={styles.tipoBtn} onClick={() => elegirAtacante('oponente')}>
              <strong>El oponente (IA) es el Atacante</strong>
              <span>Vos quedás como Defensor.</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.rolResumen}>
            <span>Vos: <strong>{NOMBRE_ROL[estado.rolPropio]}</strong> · Oponente: <strong>{NOMBRE_ROL[ROL_OPUESTO[estado.rolPropio]]}</strong></span>
            <button className={styles.cambiarModo} onClick={cambiarRol}>Cambiar</button>
          </div>

          <div className={styles.columnas}>
            <div className={`${styles.columna} ${estado.turnoActivo === 'propio' ? styles.columnaActiva : ''}`}>
              <h3 className={styles.columnaTitulo}>
                Vos {estado.turnoActivo === 'propio' && <span className={styles.turnoIndicador}>● en turno</span>}
              </h3>

              <MisionPrimariaResumen postura={disposicion.propia} mision={misionPropia} />

              <div className={styles.contadores}>
                <Contador etiqueta="PV" valor={estado.pvPropio} deltas={[-1, 1, 3, 5]} onDelta={d => sumarPV('pvPropio', d)} />
                <Contador etiqueta="CP" valor={estado.cpPropio} deltas={[-2, -1, 1]} onDelta={d => sumarCP('cpPropio', d)} />
              </div>

              <SeccionSecundarias
                titulo="Tus secundarias"
                esIA={false}
                rol={estado.rolPropio}
                estado={estado.secundariasPropio}
                onElegirTipo={tipo => elegirTipo('propio', tipo)}
                onCambiarTipo={() => cambiarTipo('propio')}
                onAgregarFija={id => agregarFija('propio', id)}
                onSortearFijas={() => sortearFijas('propio')}
                onQuitarFija={id => quitarFija('propio', id)}
                onRobarMano={() => robarMano('propio')}
                onActivar={id => activarSecundaria('propio', id)}
                onActivarAlAzar={() => activarAlAzar('propio')}
                onDescartarDeMano={id => descartarDeMano('propio', id)}
                onRetirarActiva={id => retirarActiva('propio', id)}
              />
            </div>

            <div className={`${styles.columna} ${estado.turnoActivo === 'oponente' ? styles.columnaActiva : ''}`}>
              <h3 className={styles.columnaTitulo}>
                Oponente (IA) {estado.turnoActivo === 'oponente' && <span className={styles.turnoIndicador}>● en turno</span>}
              </h3>

              <MisionPrimariaResumen postura={disposicion.oponente} mision={misionOponente} />

              <div className={styles.contadores}>
                <Contador etiqueta="PV" valor={estado.pvOponente} deltas={[-1, 1, 3, 5]} onDelta={d => sumarPV('pvOponente', d)} />
                <Contador etiqueta="CP" valor={estado.cpOponente} deltas={[-2, -1, 1]} onDelta={d => sumarCP('cpOponente', d)} />
              </div>

              <SeccionSecundarias
                titulo="Secundarias del oponente"
                esIA
                rol={ROL_OPUESTO[estado.rolPropio]}
                estado={estado.secundariasOponente}
                onElegirTipo={tipo => elegirTipo('oponente', tipo)}
                onCambiarTipo={() => cambiarTipo('oponente')}
                onAgregarFija={id => agregarFija('oponente', id)}
                onSortearFijas={() => sortearFijas('oponente')}
                onQuitarFija={id => quitarFija('oponente', id)}
                onRobarMano={() => robarMano('oponente')}
                onActivar={id => activarSecundaria('oponente', id)}
                onActivarAlAzar={() => activarAlAzar('oponente')}
                onDescartarDeMano={id => descartarDeMano('oponente', id)}
                onRetirarActiva={id => retirarActiva('oponente', id)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface ContadorProps {
  etiqueta: string
  valor: number
  deltas: number[]
  onDelta: (delta: number) => void
}

function Contador({ etiqueta, valor, deltas, onDelta }: ContadorProps) {
  return (
    <div className={styles.marcador}>
      <span className={styles.label}>{etiqueta}</span>
      <span className={styles.pvValor}>{valor}</span>
      <div className={styles.botones}>
        {deltas.map(d => (
          <button key={d} onClick={() => onDelta(d)}>{d > 0 ? `+${d}` : d}</button>
        ))}
      </div>
    </div>
  )
}

interface MisionPrimariaResumenProps {
  postura: PosturaId
  mision: MisionPrimaria
}

function MisionPrimariaResumen({ postura, mision }: MisionPrimariaResumenProps) {
  const [expandida, setExpandida] = useState(false)
  const posturaInfo = POSTURAS_MAP[postura]

  return (
    <div className={styles.primaria}>
      <button className={styles.primariaHeader} onClick={() => setExpandida(v => !v)}>
        <span className={styles.primariaPostura} style={{ '--postura-color': posturaInfo.color } as CSSProperties}>
          {posturaInfo.nombreEs}
        </span>
        <span className={styles.primariaNombre}>{mision.nombreEs}</span>
        <span className={styles.primariaToggle}>{expandida ? '▾' : '▸'}</span>
      </button>
      {expandida && <MissionCard mision={mision} />}
    </div>
  )
}

interface SeccionSecundariasProps {
  titulo: string
  esIA: boolean
  rol: Rol
  estado: EstadoSecundarias
  onElegirTipo: (tipo: TipoSecundarias) => void
  onCambiarTipo: () => void
  onAgregarFija: (id: string) => void
  onSortearFijas: () => void
  onQuitarFija: (id: string) => void
  onRobarMano: () => void
  onActivar: (id: string) => void
  onActivarAlAzar: () => void
  onDescartarDeMano: (id: string) => void
  onRetirarActiva: (id: string) => void
}

function SeccionSecundarias({
  titulo,
  esIA,
  rol,
  estado,
  onElegirTipo,
  onCambiarTipo,
  onAgregarFija,
  onSortearFijas,
  onQuitarFija,
  onRobarMano,
  onActivar,
  onActivarAlAzar,
  onDescartarDeMano,
  onRetirarActiva,
}: SeccionSecundariasProps) {
  const disponiblesFija = MISIONES_SECUNDARIAS.filter(m => !estado.activas.includes(m.id))

  return (
    <div className={styles.secundariasSection}>
      {estado.tipo === null && (
        <div className={styles.tipoElegir}>
          <h3 className={styles.secundariasTitulo}>
            {titulo} <span className={styles.secundariasCount}>({NOMBRE_ROL[rol]})</span>: ¿fijas o tácticas?
          </h3>
          <p className={styles.ayuda}>
            {esIA
              ? 'Se elige una sola vez, antes de desplegar. Las decisiones de la IA se resuelven al azar.'
              : 'Se elige una sola vez, antes de desplegar, y no se puede cambiar durante la partida.'}
          </p>
          <div className={styles.tipoOpciones}>
            <button className={styles.tipoBtn} onClick={() => onElegirTipo('fija')}>
              <strong>Fijas</strong>
              <span>Se eligen 2 cartas antes de la partida. No cambian en toda la batalla.</span>
            </button>
            <button className={styles.tipoBtn} onClick={() => onElegirTipo('tactica')}>
              <strong>Tácticas</strong>
              <span>Se arma un mazo, se roba mano de 3 y se activan hasta 2 a lo largo de la partida.</span>
            </button>
          </div>
        </div>
      )}

      {estado.tipo === 'fija' && (
        <>
          <div className={styles.secundariasHeader}>
            <h3 className={styles.secundariasTitulo}>
              {titulo} <span className={styles.secundariasCount}>({estado.activas.length}/2)</span>
            </h3>
            <div className={styles.headerAcciones}>
              {estado.activas.length < 2 && esIA && (
                <button className={styles.robarBtn} onClick={onSortearFijas}>🎲 Sortear fijas</button>
              )}
              {estado.activas.length < 2 && (
                <select
                  className={styles.addSelect}
                  defaultValue=""
                  onChange={e => { onAgregarFija(e.target.value); e.target.value = '' }}
                >
                  <option value="" disabled>+ Añadir secundaria...</option>
                  {disponiblesFija.map(m => (
                    <option key={m.id} value={m.id}>{m.nombreEs}</option>
                  ))}
                </select>
              )}
              <button className={styles.cambiarModo} onClick={onCambiarTipo}>Cambiar modo</button>
            </div>
          </div>

          {estado.activas.length === 0 && (
            <p className={styles.empty}>
              {esIA ? 'Sorteá las 2 secundarias fijas de la IA.' : 'Elegí tus 2 secundarias fijas antes de empezar a jugar.'}
            </p>
          )}

          {estado.activas.map(id => (
            <div key={id} className={styles.secundariaItem}>
              <button className={styles.quitar} onClick={() => onQuitarFija(id)} title="Quitar secundaria">×</button>
              <MissionCard mision={MISIONES_SECUNDARIAS_MAP[id]} modoSecundaria="fija" />
            </div>
          ))}
        </>
      )}

      {estado.tipo === 'tactica' && (
        <>
          <div className={styles.secundariasHeader}>
            <h3 className={styles.secundariasTitulo}>{titulo}</h3>
            <button className={styles.cambiarModo} onClick={onCambiarTipo}>Cambiar modo</button>
          </div>

          <p className={styles.ayuda}>
            {esIA
              ? 'Robá la mano de la IA y usá "Activar al azar" para simular su elección.'
              : 'En tu primera fase de Mando: robá mano y activá 1. En tus fases de Mando siguientes, si tenés menos de 2 activas, volvé a robar y activá otra.'}
          </p>

          <div className={styles.mazoInfo}>
            <span>Mazo: {estado.mazo.length} cartas</span>
            {estado.mano.length < 3 && estado.mazo.length > 0 && (
              <button className={styles.robarBtn} onClick={onRobarMano}>
                Robar hasta tener 3 en mano
              </button>
            )}
            {esIA && estado.mano.length > 0 && estado.activas.length < 2 && (
              <button className={styles.robarBtn} onClick={onActivarAlAzar}>🎲 Activar al azar</button>
            )}
          </div>

          <div>
            <h4 className={styles.subtitulo}>
              Mano <span className={styles.secundariasCount}>({estado.mano.length}/3)</span>
            </h4>
            {estado.mano.length === 0 && <p className={styles.empty}>No hay cartas en mano.</p>}
            {estado.mano.map(id => (
              <div key={id} className={styles.manoItem}>
                <span className={styles.manoNombre}>{MISIONES_SECUNDARIAS_MAP[id].nombreEs}</span>
                <div className={styles.manoAcciones}>
                  <button
                    className={styles.activarBtn}
                    onClick={() => onActivar(id)}
                    disabled={estado.activas.length >= 2}
                  >
                    Activar
                  </button>
                  <button className={styles.descartarBtn} onClick={() => onDescartarDeMano(id)}>Descartar</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className={styles.subtitulo}>
              Activas <span className={styles.secundariasCount}>({estado.activas.length}/2)</span>
            </h4>
            {estado.activas.length === 0 && <p className={styles.empty}>Todavía no hay secundarias activas.</p>}
            {estado.activas.map(id => (
              <div key={id} className={styles.secundariaItem}>
                <button className={styles.quitar} onClick={() => onRetirarActiva(id)} title="Completada / descartar">×</button>
                <MissionCard mision={MISIONES_SECUNDARIAS_MAP[id]} modoSecundaria="tactica" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
