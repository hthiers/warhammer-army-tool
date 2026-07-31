import { useMemo, useState } from 'react'
import type { EstadoTablero, Lado, MarcaEstado } from '../../types/tablero'
import { construirInforme } from '../../engine/informe'
import { obtenerCorpus } from '../../ia/corpusNavegador'
import { consultaTacticaBreve, consultaTacticaCompleta, leerPlan } from '../../../ia/consulta'
import { ETAPA_ATAQUE, ETAPA_MOVIMIENTO, promptTactico } from '../../../ia/prompts'
import type { EtapaTactica } from '../../../ia/esquemas'
import { validarPlan } from '../../../ia/validarPlan'
import type { AccionValidada, PlanValidado } from '../../../ia/validarPlan'
import { FACCIONES_MAP } from '../../data/facciones'
import styles from './TacticoPanel.module.css'

// El Táctico en modo copiar/pegar. El turno se planifica en dos etapas: primero
// intención y movimiento, después disparo y carga con las unidades ya colocadas.
// Ver design/plan-implementacion.md § 4.

interface Props {
  estado: EstadoTablero
  onAplicar: (accion: AccionValidada) => void
}

const NOMBRE_ETAPA: Record<EtapaTactica, string> = {
  movimiento: '1 · Intención y movimiento',
  ataque: '2 · Disparo y carga',
}

export function TacticoPanel({ estado, onAplicar }: Props) {
  const [etapa, setEtapa] = useState<EtapaTactica>('movimiento')
  const [competencia, setCompetencia] = useState(3)
  const [pegado, setPegado] = useState('')
  const [validado, setValidado] = useState<PlanValidado | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [corpusEnviado, setCorpusEnviado] = useState(false)
  const [aplicadas, setAplicadas] = useState<Set<number>>(new Set())

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
    setValidado(validarPlan(lectura.plan, estado, informe, ladoTactico))
  }

  function handleAplicar(v: AccionValidada, i: number) {
    onAplicar(v)
    setAplicadas(prev => new Set(prev).add(i))
  }

  if (unidadesTactico.length === 0) {
    return (
      <section className={styles.wrap}>
        <h3 className={styles.titulo}>Táctico</h3>
        <p className={styles.vacio}>
          Añade unidades del bando oponente al tablero para que el Táctico tenga algo
          que planificar.
        </p>
      </section>
    )
  }

  return (
    <section className={styles.wrap}>
      <header className={styles.cabecera}>
        <h3 className={styles.titulo}>Táctico</h3>
        <span className={styles.meta}>
          juega {faccionOponente} · {unidadesTactico.length} unidades
        </span>
      </header>

      <div className={styles.controles}>
        {(['movimiento', 'ataque'] as EtapaTactica[]).map(e => (
          <button
            key={e}
            className={`${styles.etapa} ${etapa === e ? styles.etapaActiva : ''}`}
            onClick={() => setEtapa(e)}
          >
            {NOMBRE_ETAPA[e]}
          </button>
        ))}

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
          {copiado ? '✓ Copiado' : corpusEnviado ? 'Copiar consulta' : 'Copiar consulta + reglas'}
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
                  {v.nombreBlanco && <span className={styles.flecha}>→ {v.nombreBlanco}</span>}
                  {v.accion.destino && (
                    <span className={styles.destino}>
                      a {v.accion.destino.x}, {v.accion.destino.y}
                    </span>
                  )}
                </div>

                <p className={styles.descripcion}>{v.accion.descripcion}</p>

                {v.valida ? (
                  <button
                    className={styles.btnAplicar}
                    onClick={() => handleAplicar(v, i)}
                    disabled={aplicadas.has(i)}
                  >
                    {aplicadas.has(i) ? '✓ Aplicada' : 'Aplicar'}
                  </button>
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
              {validado.invalidas} de {validado.acciones.length} acciones no son legales. Están
              tachadas con el motivo.
            </p>
          )}
        </div>
      )}
    </section>
  )
}

/** Marcas que deja cada tipo de acción al aplicarse. */
export const MARCAS_POR_ACCION: Partial<Record<string, MarcaEstado>> = {
  avanzar: 'avanzada',
  retroceder: 'retrocedida',
  disparar: 'ha_disparado',
  cargar: 'ha_cargado',
}
