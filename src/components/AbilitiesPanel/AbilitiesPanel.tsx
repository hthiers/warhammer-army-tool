import type { Habilidad, Estratagema } from '../../types'
import { FaseBadge } from '../FaseBadge/FaseBadge'
import styles from './AbilitiesPanel.module.css'

interface Props {
  habilidades: Habilidad[]
  estratagemas: Estratagema[]
}

export function AbilitiesPanel({ habilidades, estratagemas }: Props) {
  return (
    <aside className={styles.panel}>

      {/* Habilidades de la unidad */}
      <div className={styles.sectionTitle}>Habilidades</div>
      {habilidades.length === 0 && (
        <p className={styles.empty}>Sin habilidades propias.</p>
      )}
      {habilidades.map((h, i) => (
        <div key={i} className={styles.habilidadCard}>
          <span className={styles.habilidadNombre}>{h.nombre}</span>
          <p className={styles.habilidadDesc}>{h.desc}</p>
        </div>
      ))}

      {/* Estratagemas aplicables */}
      <div className={`${styles.sectionTitle} ${styles.sectionTitleGold}`}>⚡ Estratagemas</div>
      {estratagemas.length === 0 && (
        <p className={styles.empty}>Ninguna estratagema para esta unidad.</p>
      )}
      {estratagemas.map(s => (
        <div key={s.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.nombre}>{s.nombre}</span>
            <span className={styles.pcBadge}>{s.pc}PC</span>
          </div>
          <div className={styles.fase}><FaseBadge fase={s.fase} /></div>
          <p className={styles.efecto}>{s.efecto}</p>
          {s.etiqueta && <span className={styles.etiqueta}>{s.etiqueta}</span>}
        </div>
      ))}
    </aside>
  )
}
