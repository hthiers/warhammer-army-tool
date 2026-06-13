import { useState } from 'react'
import type { ReglaDestacamento, Estratagema, Mejora } from '../../types'
import { DoctrineList } from '../DoctrineList/DoctrineList'
import { StratagemList } from '../StratagemList/StratagemList'
import styles from './DetachmentView.module.css'

type SubPestana = 'regla' | 'estratagemas' | 'mejoras'

interface Props {
  regla: ReglaDestacamento | undefined
  estratagemas: Estratagema[]
  mejoras: Mejora[]
}

export function DetachmentView({ regla, estratagemas, mejoras }: Props) {
  const [sub, setSub] = useState<SubPestana>('regla')

  return (
    <div className={styles.container}>
      <nav className={styles.subTabs}>
        <button
          className={`${styles.subTab} ${sub === 'regla' ? styles.subTabActive : ''}`}
          onClick={() => setSub('regla')}
        >
          Regla
        </button>
        <button
          className={`${styles.subTab} ${sub === 'estratagemas' ? styles.subTabActive : ''}`}
          onClick={() => setSub('estratagemas')}
        >
          Estratagemas
          <span className={styles.count}>{estratagemas.length}</span>
        </button>
        <button
          className={`${styles.subTab} ${sub === 'mejoras' ? styles.subTabActive : ''}`}
          onClick={() => setSub('mejoras')}
        >
          Mejoras
          <span className={styles.count}>{mejoras.length}</span>
        </button>
      </nav>

      <div className={styles.content}>
        {sub === 'regla' && <DoctrineList regla={regla} />}
        {sub === 'estratagemas' && <StratagemList estratagemas={estratagemas} />}
        {sub === 'mejoras' && <MejorasList mejoras={mejoras} />}
      </div>
    </div>
  )
}

function MejorasList({ mejoras }: { mejoras: Mejora[] }) {
  if (mejoras.length === 0) {
    return <p className={styles.empty}>Sin mejoras para este destacamento.</p>
  }

  return (
    <div className={styles.mejorasList}>
      {mejoras.map(m => (
        <div key={m.id} className={styles.mejoraCard}>
          <div className={styles.mejoraHeader}>
            <h3 className={styles.mejoraNombre}>{m.nombre}</h3>
            <span className={styles.restriccionBadge}>{m.restriccion}</span>
          </div>
          <p className={styles.mejoraDesc}>{m.desc}</p>
        </div>
      ))}
    </div>
  )
}
