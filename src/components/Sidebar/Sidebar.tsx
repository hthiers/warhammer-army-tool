import type { Unidad } from '../../types'
import styles from './Sidebar.module.css'

interface Props {
  unidades: Unidad[]
  unidadActual: string
  onSeleccionar: (id: string) => void
  onToggleActivo: (id: string) => void
}

export function Sidebar({ unidades, unidadActual, onSeleccionar, onToggleActivo }: Props) {
  const activas = unidades.filter(u => u.activo !== false)
  const totalPts = activas.reduce((sum, u) => sum + u.pts, 0)
  const ordenadas = [...unidades].sort((a, b) => {
    const aActivo = a.activo !== false
    const bActivo = b.activo !== false
    if (aActivo !== bActivo) return aActivo ? -1 : 1
    return a.nombre.localeCompare(b.nombre, 'es')
  })
  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>
        <span>Unidades ({activas.length}/{unidades.length})</span>
        <span className={styles.totalPts}>{totalPts} pts</span>
      </div>
      {ordenadas.map(u => {
        const activo = u.activo !== false
        return (
          <div
            key={u.id}
            className={`${styles.unitRow} ${!activo ? styles.inactiva : ''}`}
          >
            <button
              className={`${styles.unitBtn} ${u.id === unidadActual ? styles.active : ''}`}
              onClick={() => onSeleccionar(u.id)}
            >
              <span className={styles.dot} style={{ background: u.color }} />
              <div className={styles.info}>
                <span className={styles.nombre}>{u.nombre}</span>
                <span className={styles.pts}>{u.pts} pts</span>
              </div>
            </button>
            <label className={styles.switch} title={activo ? 'Desactivar unidad' : 'Activar unidad'}>
              <input
                type="checkbox"
                checked={activo}
                onChange={() => onToggleActivo(u.id)}
              />
              <span className={styles.switchTrack} />
            </label>
          </div>
        )
      })}
    </aside>
  )
}
