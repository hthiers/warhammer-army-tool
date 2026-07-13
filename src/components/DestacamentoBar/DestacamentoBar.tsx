import type { Destacamento } from '../../types'
import styles from './DestacamentoBar.module.css'

interface Props {
  destacamentos: Destacamento[]
  destacamentosSeleccionados: string[]
  presupuestoDP: number
  dpUsados: number
  onAgregarDestacamento: (id: string) => void
  onQuitarDestacamento: (id: string) => void
}

export function DestacamentoBar({
  destacamentos,
  destacamentosSeleccionados,
  presupuestoDP,
  dpUsados,
  onAgregarDestacamento,
  onQuitarDestacamento,
}: Props) {
  const disponibles = destacamentos.filter(
    d => !destacamentosSeleccionados.includes(d.id) && d.dp <= presupuestoDP - dpUsados
  )
  const dpRestantes = presupuestoDP - dpUsados
  const dpClass = dpRestantes === 0 ? styles.dpFull : dpRestantes <= 1 ? styles.dpWarn : styles.dpOk

  function handleAddSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value) {
      onAgregarDestacamento(e.target.value)
      e.target.value = ''
    }
  }

  return (
    <div className={styles.bar}>
      <span className={`${styles.dpBadge} ${dpClass}`} title="Puntos de Destacamento usados / presupuesto">
        DP {dpUsados}/{presupuestoDP}
      </span>

      <div className={styles.chips}>
        {destacamentosSeleccionados.map(id => {
          const d = destacamentos.find(x => x.id === id)!
          return (
            <span key={id} className={styles.chip}>
              <span className={styles.chipNombre}>{d.nombre}</span>
              <span className={styles.chipDp}>{d.dp} DP</span>
              <button
                className={styles.chipRemove}
                onClick={() => onQuitarDestacamento(id)}
                title="Quitar destacamento"
              >
                ×
              </button>
            </span>
          )
        })}
      </div>

      {disponibles.length > 0 && (
        <select className={styles.addSelect} onChange={handleAddSelect} defaultValue="">
          <option value="" disabled>
            {destacamentosSeleccionados.length === 0 ? 'Elegir destacamento...' : '+ Añadir'}
          </option>
          {disponibles.map(d => (
            <option key={d.id} value={d.id}>{d.nombre} ({d.dp} DP)</option>
          ))}
        </select>
      )}
    </div>
  )
}
