import type { Destacamento } from '../../types'
import styles from './Topbar.module.css'

interface Props {
  destacamentos: Destacamento[]
  destacamentoActual: string
  onCambiarDestacamento: (id: string) => void
}

export function Topbar({ destacamentos, destacamentoActual, onCambiarDestacamento }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.factionBadge}>Space Marines</span>
        <span className={styles.armyName}>1ª Compañía — Lista de ejemplo</span>
      </div>
      <div className={styles.right}>
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
