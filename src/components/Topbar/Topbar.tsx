import type { DatosFaccion } from '../../types'
import styles from './Topbar.module.css'

interface Props {
  faccion: DatosFaccion
  onCambiarFaccion: () => void
  onAbrirReglas: () => void
  onAbrirDados: () => void
  onAbrirArbitro: () => void
  tema: 'light' | 'dark'
  onToggleTema: () => void
  vistaPartida: boolean
  onToggleVistaPartida: () => void
}

export function Topbar({
  faccion,
  onCambiarFaccion,
  onAbrirReglas,
  onAbrirDados,
  onAbrirArbitro,
  tema,
  onToggleTema,
  vistaPartida,
  onToggleVistaPartida,
}: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span
          className={styles.factionBadge}
          style={{ '--faction-color': faccion.color } as React.CSSProperties}
        >
          {faccion.nombre}
        </span>
        <button className={styles.cambiarFaccion} onClick={onCambiarFaccion}>
          Cambiar facción
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${!vistaPartida ? styles.viewToggleBtnActive : ''}`}
            onClick={() => vistaPartida && onToggleVistaPartida()}
          >
            📋 Ejército
          </button>
          <button
            className={`${styles.viewToggleBtn} ${vistaPartida ? styles.viewToggleBtnActive : ''}`}
            onClick={() => !vistaPartida && onToggleVistaPartida()}
            title="Misiones, disposición de fuerzas y seguimiento de la partida"
          >
            🎯 Partida
          </button>
        </div>

        <span className={styles.divider} />

        <button
          className={styles.temaBtn}
          onClick={onToggleTema}
          title={tema === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {tema === 'dark' ? '☀️' : '🌙'}
        </button>

        <button className={styles.reglasBtn} onClick={onAbrirReglas} title="Referencia rápida de reglas">
          ? Reglas
        </button>

        <button className={styles.reglasBtn} onClick={onAbrirDados} title="Lanzador de dados">
          🎲 Dados
        </button>

        <button
          className={styles.reglasBtn}
          onClick={onAbrirArbitro}
          title="Consultar una duda de reglas al Árbitro"
        >
          ⚖️ Árbitro
        </button>
      </div>
    </header>
  )
}
