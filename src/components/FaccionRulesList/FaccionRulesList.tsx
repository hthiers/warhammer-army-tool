import type { ReglaFaccion } from '../../types'
import styles from './FaccionRulesList.module.css'

interface Props {
  reglas: ReglaFaccion[]
  faccionNombre: string
}

export function FaccionRulesList({ reglas, faccionNombre }: Props) {
  if (reglas.length === 0) {
    return <p className={styles.empty}>Sin reglas de facción para {faccionNombre}.</p>
  }

  return (
    <div className={styles.list}>
      {reglas.map(r => (
        <div key={r.id} className={styles.card}>
          <h3 className={styles.nombre}>{r.nombre}</h3>
          <p className={styles.desc}>{r.desc}</p>
          {r.efectos && r.efectos.length > 0 && (
            <ul className={styles.efectos}>
              {r.efectos.map((e, i) => (
                <li key={i} className={styles.efecto}>
                  <span className={styles.dot} />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
