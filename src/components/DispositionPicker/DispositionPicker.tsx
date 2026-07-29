import { useEffect, useState } from 'react'
import type { PosturaId } from '../../types/misiones'
import { POSTURAS, MATRIZ_DISPOSICION } from '../../data/misiones/disposicionFuerza'
import { MISIONES_PRIMARIAS_MAP } from '../../data/misiones/primarias'
import { DISENOS, LAYOUTS_CON_IMAGEN, obtenerNumeroLayout, rutaImagenLayout, type DisenoId } from '../../data/misiones/layouts'
import { STORAGE_KEY_DISPOSICION, cargarEstadoDisposicion, type EstadoDisposicion } from '../../data/misiones/estadoDisposicion'
import { MissionCard } from '../MissionCard/MissionCard'
import styles from './DispositionPicker.module.css'

const NOMBRE_DISENO: Record<DisenoId, string> = { a: 'A', b: 'B', c: 'C' }

export function DispositionPicker() {
  const [estado, setEstado] = useState<EstadoDisposicion>(cargarEstadoDisposicion)
  const { propia, oponente, diseno } = estado

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DISPOSICION, JSON.stringify(estado))
  }, [estado])

  function setPropia(propia: PosturaId) {
    setEstado(e => ({ ...e, propia }))
  }

  function setOponente(oponente: PosturaId) {
    setEstado(e => ({ ...e, oponente }))
  }

  function setDiseno(diseno: DisenoId) {
    setEstado(e => ({ ...e, diseno }))
  }

  const idMision = MATRIZ_DISPOSICION[propia][oponente]
  const mision = MISIONES_PRIMARIAS_MAP[idMision]

  const numeroLayout = obtenerNumeroLayout(propia, oponente)
  const layoutDisponible = LAYOUTS_CON_IMAGEN.includes(numeroLayout)

  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Elige tu postura y la de tu oponente para saber qué carta de misión primaria te toca jugar.
      </p>

      <div className={styles.selectors}>
        <label className={styles.field}>
          <span className={styles.label}>Tu postura</span>
          <select
            className={styles.select}
            value={propia}
            onChange={e => setPropia(e.target.value as PosturaId)}
          >
            {POSTURAS.map(p => (
              <option key={p.id} value={p.id}>{p.nombreEs} ({p.nombre})</option>
            ))}
          </select>
        </label>

        <span className={styles.vs}>vs</span>

        <label className={styles.field}>
          <span className={styles.label}>Postura del oponente</span>
          <select
            className={styles.select}
            value={oponente}
            onChange={e => setOponente(e.target.value as PosturaId)}
          >
            {POSTURAS.map(p => (
              <option key={p.id} value={p.id}>{p.nombreEs} ({p.nombre})</option>
            ))}
          </select>
        </label>
      </div>

      <p className={styles.resultado}>
        Te toca jugar: <strong>{mision.nombreEs}</strong> <span className={styles.resultadoEn}>({mision.nombre})</span>
      </p>

      <MissionCard mision={mision} />

      {layoutDisponible ? (
        <div className={styles.layout}>
          <div className={styles.layoutHeader}>
            <span className={styles.label}>Diseño de mesa</span>
            <div className={styles.disenos}>
              {DISENOS.map(d => (
                <button
                  key={d}
                  className={`${styles.disenoBtn} ${diseno === d ? styles.disenoBtnActive : ''}`}
                  onClick={() => setDiseno(d)}
                >
                  {NOMBRE_DISENO[d]}
                </button>
              ))}
            </div>
          </div>
          <img
            className={styles.layoutImg}
            src={rutaImagenLayout(numeroLayout, diseno)}
            alt={`Layout de mesa ${numeroLayout}, diseño ${NOMBRE_DISENO[diseno]}`}
          />
        </div>
      ) : (
        <p className={styles.layoutFaltante}>
          Todavía no hay layout de mesa cargado para esta combinación de disposiciones.
        </p>
      )}
    </div>
  )
}
