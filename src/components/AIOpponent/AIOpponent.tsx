import { useState } from 'react'
import type { RolIA } from '../../types'
import { UNIDADES as UNIDADES_NECRONES } from '../../data/necrones/unidades'
import {
  DIRECTIVAS_MOVIMIENTO,
  PRIORIDADES_BLANCO,
  ACTIVACION_ESTRATAGEMA,
  ESTRATAGEMAS_DEFENSIVAS_IA,
  ESTRATAGEMAS_OFENSIVAS_IA,
} from '../../data/ia/necrones'
import styles from './AIOpponent.module.css'

type SubVista = 'directiva' | 'blanco' | 'estratagema' | 'referencia'

const NOMBRES_ROL: Record<RolIA, string> = {
  asalto: 'Asalto',
  disparo: 'Disparo',
  linea: 'Línea',
  soporte: 'Soporte',
  mando: 'Mando',
}

const ORDEN_ROLES: RolIA[] = ['asalto', 'disparo', 'linea', 'soporte', 'mando']

function rolBadgeClass(rol: RolIA | 'nota'): string {
  if (rol === 'nota') return styles.badgeNota
  return styles[`badge${rol.charAt(0).toUpperCase()}${rol.slice(1)}`]
}

function tirarD6(): number {
  return 1 + Math.floor(Math.random() * 6)
}

function tirarD3(): number {
  return 1 + Math.floor(Math.random() * 3)
}

export function AIOpponent() {
  const [subVista, setSubVista] = useState<SubVista>('directiva')
  const [rollDirectiva, setRollDirectiva] = useState<number | null>(null)
  const [rollBlanco, setRollBlanco] = useState<number | null>(null)
  const [rollEstrat, setRollEstrat] = useState<number | null>(null)
  const [rollEstratTipo, setRollEstratTipo] = useState<number | null>(null)

  const rolesLegend = ORDEN_ROLES.map(rol => ({
    rol,
    unidades: UNIDADES_NECRONES.filter(u => u.rolIA === rol).map(u => u.nombre),
  })).filter(g => g.unidades.length > 0)

  const activacion = rollEstrat != null
    ? ACTIVACION_ESTRATAGEMA.find(r => rollEstrat >= r.min && rollEstrat <= r.max) ?? null
    : null
  const necesitaDefensiva = activacion != null && /defensiva/.test(activacion.descripcion)
  const necesitaOfensiva = activacion != null && /ofensiva/.test(activacion.descripcion)
  const estratTipoLista = necesitaDefensiva && !necesitaOfensiva
    ? ESTRATAGEMAS_DEFENSIVAS_IA
    : necesitaOfensiva && !necesitaDefensiva
    ? ESTRATAGEMAS_OFENSIVAS_IA
    : null

  function handleTirarDirectiva() {
    setRollDirectiva(tirarD6())
  }

  function handleTirarBlanco() {
    setRollBlanco(tirarD6())
  }

  function handleTirarEstrat() {
    setRollEstrat(tirarD6() + tirarD6())
    setRollEstratTipo(null)
  }

  function handleTirarEstratTipo() {
    setRollEstratTipo(tirarD3())
  }

  return (
    <div className={styles.wrap}>
      <nav className={styles.subtabs}>
        <button className={`${styles.subtab} ${subVista === 'directiva' ? styles.subtabActive : ''}`} onClick={() => setSubVista('directiva')}>Directiva</button>
        <button className={`${styles.subtab} ${subVista === 'blanco' ? styles.subtabActive : ''}`} onClick={() => setSubVista('blanco')}>Blanco</button>
        <button className={`${styles.subtab} ${subVista === 'estratagema' ? styles.subtabActive : ''}`} onClick={() => setSubVista('estratagema')}>Estratagema</button>
        <button className={`${styles.subtab} ${subVista === 'referencia' ? styles.subtabActive : ''}`} onClick={() => setSubVista('referencia')}>Referencia</button>
      </nav>

      {subVista === 'directiva' && (
        <div className={styles.seccion}>
          <p className={styles.intro}>
            Tira 1D6 al inicio del turno Necrón, antes de mover ninguna unidad. El resultado define el comportamiento de todo el ejército ese turno. Las excepciones por rol tienen prioridad sobre la regla general.
          </p>

          <div className={styles.dado}>
            <button className={styles.dadoBtn} onClick={handleTirarDirectiva}>🎲 Tirar D6</button>
            {rollDirectiva != null && <span className={styles.dadoResultado}>Resultado: {rollDirectiva}</span>}
          </div>

          <div className={styles.cards}>
            {DIRECTIVAS_MOVIMIENTO.map(d => (
              <div key={d.roll} className={`${styles.card} ${rollDirectiva === d.roll ? styles.cardActiva : ''}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitulo}>{d.nombre}</span>
                  <span className={styles.cardRoll}>D6 = {d.roll}</span>
                </div>
                <div className={styles.condicion}>
                  <div className={styles.condIf}>Regla general</div>
                  <div className={styles.condThen}>{d.reglaGeneral}</div>
                  {d.reglaGeneralSino && <div className={styles.condSino}>{d.reglaGeneralSino}</div>}
                </div>
                {d.excepciones.map((exc, i) => (
                  <div key={i} className={styles.condicion}>
                    <div className={styles.condIf}>
                      <span className={rolBadgeClass(exc.rol)}>{exc.etiqueta}</span>
                    </div>
                    <div className={styles.condThen}>{exc.entonces}</div>
                    {exc.sino && <div className={styles.condSino}>{exc.sino}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.legend}>
            <div className={styles.legendTitulo}>Roles del ejército Necrón</div>
            <div className={styles.legendGrid}>
              {rolesLegend.map(g => (
                <div key={g.rol} className={styles.legendItem}>
                  <span className={rolBadgeClass(g.rol)}>{NOMBRES_ROL[g.rol]}</span>
                  {g.unidades.join(' · ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subVista === 'blanco' && (
        <div className={styles.seccion}>
          <p className={styles.intro}>
            Tira 1D6 por cada unidad Necrón que vaya a disparar en ese turno. Cada unidad tira de forma independiente. Aplica la condición de desempate si ninguna condición principal se cumple.
          </p>

          <div className={styles.dado}>
            <button className={styles.dadoBtn} onClick={handleTirarBlanco}>🎲 Tirar D6</button>
            {rollBlanco != null && <span className={styles.dadoResultado}>Resultado: {rollBlanco}</span>}
          </div>

          <div className={styles.cards}>
            {PRIORIDADES_BLANCO.map(p => (
              <div key={p.roll} className={`${styles.card} ${rollBlanco === p.roll ? styles.cardActiva : ''}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitulo}>{p.nombre}</span>
                  <span className={styles.cardRoll}>D6 = {p.roll}</span>
                </div>
                <div className={styles.condicion}>
                  <div className={styles.condThen}>{p.descripcion}</div>
                  {p.desempate && <div className={styles.condSino}>{p.desempate}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subVista === 'estratagema' && (
        <div className={styles.seccion}>
          <p className={styles.intro}>
            Tira 2D6 al inicio de la fase de mando del turno Necrón, justo después de obtener el PM básico. El resultado determina si gasta PM en estratagemas y de qué tipo.
          </p>

          <div className={styles.dado}>
            <button className={styles.dadoBtn} onClick={handleTirarEstrat}>🎲🎲 Tirar 2D6</button>
            {rollEstrat != null && <span className={styles.dadoResultado}>Resultado: {rollEstrat}</span>}
          </div>

          <div className={styles.tabla}>
            {ACTIVACION_ESTRATAGEMA.map(r => (
              <div key={r.min} className={`${styles.filaTabla} ${activacion === r ? styles.filaTablaActiva : ''}`}>
                <span className={styles.filaRango}>{r.min === r.max ? r.min : `${r.min}–${r.max}`}</span>
                <span>{r.descripcion}</span>
              </div>
            ))}
          </div>

          {estratTipoLista && (
            <div className={styles.dado}>
              <button className={styles.dadoBtn} onClick={handleTirarEstratTipo}>🎲 Tirar D3</button>
              {rollEstratTipo != null && <span className={styles.dadoResultado}>Resultado: {rollEstratTipo}</span>}
            </div>
          )}

          <div className={styles.stratContainer}>
            <div className={styles.stratCard}>
              <div className={styles.stratTipo}>Estratagemas defensivas</div>
              <div className={styles.stratSubtitulo}>Tira D3 para saber cuál usar</div>
              {ESTRATAGEMAS_DEFENSIVAS_IA.map(e => (
                <div
                  key={e.roll}
                  className={`${styles.stratItem} ${estratTipoLista === ESTRATAGEMAS_DEFENSIVAS_IA && rollEstratTipo === e.roll ? styles.stratItemActivo : ''}`}
                >
                  <span className={styles.stratNombre}>{e.roll} — {e.nombre}</span>
                  <span className={styles.stratCuando}>{e.cuando}.</span> {e.descripcion}
                </div>
              ))}
            </div>

            <div className={styles.stratCard}>
              <div className={styles.stratTipo}>Estratagemas ofensivas</div>
              <div className={styles.stratSubtitulo}>Tira D3 para saber cuál usar</div>
              {ESTRATAGEMAS_OFENSIVAS_IA.map(e => (
                <div
                  key={e.roll}
                  className={`${styles.stratItem} ${estratTipoLista === ESTRATAGEMAS_OFENSIVAS_IA && rollEstratTipo === e.roll ? styles.stratItemActivo : ''}`}
                >
                  <span className={styles.stratNombre}>{e.roll} — {e.nombre}</span>
                  <span className={styles.stratCuando}>{e.cuando}.</span> {e.descripcion}
                </div>
              ))}
            </div>
          </div>

          <p className={styles.aviso}>
            <strong>Condición de fallo:</strong> Si la estratagema elegida no puede aplicarse — no hay unidad del tipo requerido en mesa, o no hay PM suficientes — se descarta sin efecto. No se tira otra en su lugar.
          </p>
        </div>
      )}

      {subVista === 'referencia' && (
        <div className={styles.seccion}>
          <div className={styles.flowCard}>
            <div className={styles.legendTitulo}>Orden de uso en cada turno Necrón</div>
            <ol className={styles.flowLista}>
              <li>Fase de mando → tira 2D6 para estratagemas</li>
              <li>Movimiento → tira D6 directiva (todo el ejército)</li>
              <li>Disparo → tira D6 por unidad</li>
              <li>Carga → ASALTO declara si la directiva lo indica</li>
              <li>Combate → reglas normales, sin decisiones adicionales</li>
            </ol>
          </div>

          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <div className={styles.refHeader}>Directivas de movimiento (D6)</div>
              {DIRECTIVAS_MOVIMIENTO.map(d => (
                <div key={d.roll} className={styles.filaTabla}>
                  <span className={styles.filaRango}>{d.roll}</span>
                  <span>{d.nombre}</span>
                </div>
              ))}
            </div>

            <div className={styles.refCard}>
              <div className={styles.refHeader}>Prioridad de blanco (D6 por unidad)</div>
              {PRIORIDADES_BLANCO.map(p => (
                <div key={p.roll} className={styles.filaTabla}>
                  <span className={styles.filaRango}>{p.roll}</span>
                  <span>{p.nombre}</span>
                </div>
              ))}
            </div>

            <div className={styles.refCard}>
              <div className={styles.refHeader}>Activación de estratagema (2D6)</div>
              {ACTIVACION_ESTRATAGEMA.map(r => (
                <div key={r.min} className={styles.filaTabla}>
                  <span className={styles.filaRango}>{r.min === r.max ? r.min : `${r.min}–${r.max}`}</span>
                  <span>{r.descripcion}</span>
                </div>
              ))}
            </div>

            <div className={styles.refCard}>
              <div className={styles.refHeader}>Roles del ejército Necrón</div>
              {rolesLegend.map(g => (
                <div key={g.rol} className={styles.filaTabla}>
                  <span className={rolBadgeClass(g.rol)}>{NOMBRES_ROL[g.rol]}</span>
                  <span>{g.unidades.join(' · ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
