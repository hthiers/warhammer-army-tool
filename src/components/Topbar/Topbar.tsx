import type { DatosFaccion, Destacamento } from '../../types'
import styles from './Topbar.module.css'

interface Props {
  faccion: DatosFaccion
  destacamentos: Destacamento[]
  destacamentoActual: string
  onCambiarDestacamento: (id: string) => void
  onCambiarFaccion: () => void
  onAbrirReglas: () => void
}

export function Topbar({ faccion, destacamentos, destacamentoActual, onCambiarDestacamento, onCambiarFaccion, onAbrirReglas }: Props) {
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
        <button className={styles.reglasBtn} onClick={onAbrirReglas} title="Referencia rápida de reglas">
          ? Reglas
        </button>
        <label className={styles.label} htmlFor="destacamento-select">Destacamento</label>
        <select
          id="destacamento-select"
          className={styles.select}
          value={destacamentoActual}
          onChange={e => onCambiarDestacamento(e.target.value)}
        >
          {destacamentos.map(d => (
            <option key={d.id} value={d.id}>{d.nombre}</option>
          ))}
        </select>
      </div>
    </header>
  )
}
