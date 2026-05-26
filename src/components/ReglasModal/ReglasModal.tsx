import { useEffect } from 'react'
import styles from './ReglasModal.module.css'

interface Props {
  onClose: () => void
}

const TABLA_HERIR = [
  { condicion: 'F ≥ 2×R', tirada: '2+' },
  { condicion: 'F > R',    tirada: '3+' },
  { condicion: 'F = R',    tirada: '4+' },
  { condicion: 'F < R',    tirada: '5+' },
  { condicion: 'F ≤ R÷2',  tirada: '6+' },
]

export function ReglasModal({ onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <h2 className={styles.titulo}>Referencia rápida</h2>

        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Para herir — Fuerza vs Resistencia</h3>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Condición</th>
                <th>Tirada mínima</th>
              </tr>
            </thead>
            <tbody>
              {TABLA_HERIR.map(row => (
                <tr key={row.condicion}>
                  <td>{row.condicion}</td>
                  <td className={styles.tirada}>{row.tirada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Avanzar</h3>
          <ul className={styles.lista}>
            <li>En la fase de Movimiento, una unidad puede Avanzar en lugar de moverse normalmente.</li>
            <li>Tira 1D6 y suma el resultado a la característica M de todos sus modelos ese turno.</li>
            <li>Una unidad que haya Avanzado <strong>no puede disparar</strong> (salvo armas con Asalto) ni <strong>declarar una carga</strong> ese turno.</li>
          </ul>
        </section>

        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Cargar</h3>
          <ul className={styles.lista}>
            <li>Declara una carga contra una o más unidades enemigas a <strong>12" o menos</strong>.</li>
            <li>Tira 2D6. Si el resultado ≥ distancia al objetivo más cercano, la carga tiene éxito.</li>
            <li>Mueve cada modelo hasta ese número de pulgadas, terminando en zona de amenaza del objetivo.</li>
            <li>El enemigo puede elegir <strong>reaccionar</strong> (retroceder) antes de que se mueva el cargador.</li>
          </ul>
        </section>

        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Zona de amenaza</h3>
          <ul className={styles.lista}>
            <li>Un modelo está en zona de amenaza de un enemigo si se encuentra a <strong>1" o menos</strong> horizontalmente y a <strong>5" o menos</strong> verticalmente.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
