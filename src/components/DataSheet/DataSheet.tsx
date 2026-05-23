import type { Unidad, Estratagema } from '../../types'
import { AbilitiesPanel } from '../AbilitiesPanel/AbilitiesPanel'
import styles from './DataSheet.module.css'

interface Props {
  unidad: Unidad
  estratagemasRelacionadas: Estratagema[]
  mostrarHabilidades: boolean
  onToggleHabilidades: () => void
}

export function DataSheet({ unidad, estratagemasRelacionadas, mostrarHabilidades, onToggleHabilidades }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sheet}>
        {/* Cabecera */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.nombre}>{unidad.nombre}</h2>
            <div className={styles.keywords}>
              {unidad.palabrasClave.map(k => (
                <span key={k} className={styles.keyword}>{k}</span>
              ))}
            </div>
          </div>
          <button
            className={`${styles.habBtn} ${mostrarHabilidades ? styles.habBtnActive : ''}`}
            onClick={onToggleHabilidades}
          >
            ⚡ {mostrarHabilidades ? 'Ocultar habilidades' : `Ver habilidades (${estratagemasRelacionadas.length})`}
          </button>
        </div>

        {/* Estadísticas */}
        <div className={styles.statsRow}>
          {Object.entries(unidad.stats).map(([k, v]) => (
            <div key={k} className={styles.statBox}>
              <span className={styles.statVal}>{v}</span>
              <span className={styles.statLbl}>{k}</span>
            </div>
          ))}
        </div>

        {/* Armas a distancia */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Armas a distancia</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Arma</th><th>Rango</th><th>A</th>
                <th>HA</th><th>F</th><th>FP</th><th>D</th>
              </tr>
            </thead>
            <tbody>
              {unidad.distancia.map((w, i) => (
                <tr key={i}>
                  <td>
                    <span className={styles.wNombre}>{w.nombre}</span>
                    {w.especial && <span className={styles.wEspecial}>[{w.especial}]</span>}
                  </td>
                  <td>{w.rango}</td>
                  <td>{w.A}</td>
                  <td>{w.HA}</td>
                  <td>{w.F}</td>
                  <td>{w.FP}</td>
                  <td>{w.D}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Armas de combate */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Armas de combate</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Arma</th><th>A</th><th>HP</th>
                <th>F</th><th>FP</th><th>D</th>
              </tr>
            </thead>
            <tbody>
              {unidad.combate.map((w, i) => (
                <tr key={i}>
                  <td><span className={styles.wNombre}>{w.nombre}</span></td>
                  <td>{w.A}</td>
                  <td>{w.HP}</td>
                  <td>{w.F}</td>
                  <td>{w.FP}</td>
                  <td>{w.D}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Habilidades de unidad */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Habilidades de la unidad</h3>
          <div className={styles.habilidades}>
            {unidad.habilidades.map((h, i) => (
              <div key={i} className={styles.habilidadCard}>
                <span className={styles.habilidadNombre}>{h.nombre}</span>
                <p className={styles.habilidadDesc}>{h.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Panel lateral de estratagemas */}
      {mostrarHabilidades && (
        <AbilitiesPanel estratagemas={estratagemasRelacionadas} />
      )}
    </div>
  )
}
