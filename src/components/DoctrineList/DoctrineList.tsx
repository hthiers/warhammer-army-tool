import type { Doctrina } from '../../types'
import styles from './DoctrineList.module.css'

interface Props {
  doctrinas: Doctrina[]
}

export function DoctrineList({ doctrinas }: Props) {
  if (doctrinas.length === 0) {
    return <p className={styles.empty}>Sin doctrinas para este destacamento.</p>
  }

  return (
    <div className={styles.list}>
      {doctrinas.map(d => (
        <div key={d.id} className={styles.card}>
          <div className={styles.header}>
            <div
              className={styles.rondaBadge}
              style={{ background: d.rondaColor, color: d.rondaTexto }}
            >
              R{d.ronda}
            </div>
            <div>
              <h3 className={styles.nombre}>{d.nombre}</h3>
              <span className={styles.rondaLabel}>Ronda {d.ronda}</span>
            </div>
          </div>
          <p className={styles.desc}>{d.desc}</p>
          <ul className={styles.efectos}>
            {d.efectos.map((e, i) => (
              <li key={i} className={styles.efecto}>
                <span className={styles.dot} />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
