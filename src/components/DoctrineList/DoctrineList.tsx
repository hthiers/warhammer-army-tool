import type { ReglaDestacamento } from '../../types'
import styles from './DoctrineList.module.css'

interface Props {
  regla: ReglaDestacamento | undefined
}

export function DoctrineList({ regla }: Props) {
  if (!regla) {
    return <p className={styles.empty}>Sin regla de destacamento.</p>
  }

  return (
    <div className={styles.list}>
      <div className={styles.card}>
        <h3 className={styles.nombre}>{regla.nombre}</h3>
        <ul className={styles.efectos}>
          {regla.efectos.map((e, i) => (
            <li key={i} className={styles.efecto}>
              <span className={styles.dot} />
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
