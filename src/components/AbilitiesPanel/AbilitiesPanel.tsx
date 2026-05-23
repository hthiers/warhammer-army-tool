import type { Estratagema } from '../../types'
import styles from './AbilitiesPanel.module.css'

interface Props {
  estratagemas: Estratagema[]
}

export function AbilitiesPanel({ estratagemas }: Props) {
  return (
    <aside className={styles.panel}>
      <div className={styles.title}>⚡ Estratagemas aplicables</div>
      {estratagemas.length === 0 && (
        <p className={styles.empty}>Ninguna estratagema para esta unidad.</p>
      )}
      {estratagemas.map(s => (
        <div key={s.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.nombre}>{s.nombre}</span>
            <span className={styles.pcBadge}>{s.pc}PC</span>
          </div>
          <div className={styles.fase}>{s.fase}</div>
          <p className={styles.efecto}>{s.efecto}</p>
          {s.etiqueta && <span className={styles.etiqueta}>{s.etiqueta}</span>}
        </div>
      ))}
    </aside>
  )
}
