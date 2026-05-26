import { useState } from 'react'
import type { Unidad, Estratagema } from '../../types'
import { AbilitiesPanel } from '../AbilitiesPanel/AbilitiesPanel'
import { ImageModal } from '../ImageModal/ImageModal'
import { ReglasEspeciales } from '../ReglaBadge/ReglaBadge'
import styles from './DataSheet.module.css'

interface Props {
  unidad: Unidad
  faccionId: string
  estratagemasRelacionadas: Estratagema[]
  mostrarHabilidades: boolean
  onToggleHabilidades: () => void
}

export function DataSheet({ unidad, faccionId, estratagemasRelacionadas, mostrarHabilidades, onToggleHabilidades }: Props) {
  const [mostrarImagen, setMostrarImagen] = useState(false)
  const imageSrc = `/images/unidades/${faccionId}/${unidad.id}.jpg`

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
          <div className={styles.headerActions}>
            <button
              className={styles.imgBtn}
              onClick={() => setMostrarImagen(true)}
              aria-label="Ver imagen de la unidad"
              title="Ver imagen"
            >
              🖼
            </button>
            <button
              className={`${styles.habBtn} ${mostrarHabilidades ? styles.habBtnActive : ''}`}
              onClick={onToggleHabilidades}
            >
              ⚡ {mostrarHabilidades ? 'Ocultar' : `Ver habilidades (${unidad.habilidades.length + estratagemasRelacionadas.length})`}
            </button>
          </div>
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
        {unidad.distancia.length > 0 && (
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
                  <tr key={i} className={w.opcional ? styles.rowOpcional : ''}>
                    <td>
                      <span className={styles.wNombre}>
                        {w.esAlternativa && <span className={styles.altPrefix}>▸</span>}
                        {w.nombre}
                        {w.opcional && !w.esAlternativa && <span className={styles.opcBadge}>OPC</span>}
                      </span>
                      {w.especial && (
                        <span className={styles.wEspecial}>
                          [<ReglasEspeciales especial={w.especial} />]
                        </span>
                      )}
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
        )}

        <hr className={styles.divider} />

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
                <tr key={i} className={w.opcional ? styles.rowOpcional : ''}>
                  <td>
                    <span className={styles.wNombre}>
                      {w.esAlternativa && <span className={styles.altPrefix}>▸</span>}
                      {w.nombre}
                      {w.opcional && !w.esAlternativa && <span className={styles.opcBadge}>OPC</span>}
                    </span>
                    {w.especial && (
                      <span className={styles.wEspecial}>
                        [<ReglasEspeciales especial={w.especial} />]
                      </span>
                    )}
                  </td>
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

      {/* Panel lateral de habilidades + estratagemas */}
      {mostrarHabilidades && (
        <AbilitiesPanel habilidades={unidad.habilidades} estratagemas={estratagemasRelacionadas} />
      )}

      {/* Modal de imagen */}
      {mostrarImagen && (
        <ImageModal
          src={imageSrc}
          alt={unidad.nombre}
          onClose={() => setMostrarImagen(false)}
        />
      )}
    </div>
  )
}
