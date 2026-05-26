import type { Unidad } from '../../types'
import styles from './Sidebar.module.css'

interface Props {
  unidades: Unidad[]
  unidadActual: string
  onSeleccionar: (id: string) => void
}

export function Sidebar({ unidades, unidadActual, onSeleccionar }: Props) {
  const totalPts = unidades.reduce((sum, u) => sum + u.pts, 0)
  const ordenadas = [...unidades].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>
        <span>Unidades ({unidades.length})</span>
        <span className={styles.totalPts}>{totalPts} pts</span>
      </div>
      {ordenadas.map(u => (
        <button
          key={u.id}
          className={`${styles.unitBtn} ${u.id === unidadActual ? styles.active : ''}`}
          onClick={() => onSeleccionar(u.id)}
        >
          <span className={styles.dot} style={{ background: u.color }} />
          <div className={styles.info}>
            <span className={styles.nombre}>{u.nombre}</span>
            <span className={styles.pts}>{u.pts} pts</span>
          </div>
        </button>
      ))}
    </aside>
  )
}
