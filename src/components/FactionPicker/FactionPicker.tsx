import type { DatosFaccion } from '../../types'
import styles from './FactionPicker.module.css'

interface Props {
  facciones: DatosFaccion[]
  onSeleccionar: (id: string) => void
}

export function FactionPicker({ facciones, onSeleccionar }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Warhammer 40.000</h1>
        <p className={styles.subtitle}>Elige tu facción para comenzar</p>
        <div className={styles.grid}>
          {facciones.map(f => (
            <button
              key={f.id}
              className={styles.card}
              style={{ '--faction-color': f.color } as React.CSSProperties}
              onClick={() => onSeleccionar(f.id)}
            >
              <span className={styles.cardName}>{f.nombre}</span>
              <span className={styles.cardUnits}>
                {f.unidades.length} unidades · {f.destacamentos.length} destacamentos
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
