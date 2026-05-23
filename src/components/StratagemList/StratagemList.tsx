import type { Estratagema } from '../../types'
import styles from './StratagemList.module.css'

interface Props {
  estratagemas: Estratagema[]
}

export function StratagemList({ estratagemas }: Props) {
  if (estratagemas.length === 0) {
    return <p className={styles.empty}>Sin estratagemas para este destacamento.</p>
  }

  return (
    <div className={styles.list}>
      {estratagemas.map(s => (
        <div key={s.id} className={styles.card}>
          <div className={styles.header}>
            <h3 className={styles.nombre}>{s.nombre}</h3>
            <span className={styles.pcBadge}>{s.pc}PC</span>
          </div>
          <div className={styles.meta}>
            <span className={styles.fase}>{s.fase}</span>
            {s.etiqueta && <span className={styles.etiqueta}>{s.etiqueta}</span>}
          </div>
          <p className={styles.efecto}>{s.efecto}</p>
          {s.restriccion && <p className={styles.restriccion}>{s.restriccion}</p>}
        </div>
      ))}
    </div>
  )
}
