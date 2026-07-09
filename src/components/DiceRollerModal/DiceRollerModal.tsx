import { useEffect, useState } from 'react'
import styles from './DiceRollerModal.module.css'

interface Props {
  onClose: () => void
}

const MIN_DADOS = 1
const MAX_DADOS = 50

function tirarD6(): number {
  return 1 + Math.floor(Math.random() * 6)
}

function claseDado(valor: number): string {
  if (valor === 6) return styles.dadoSeis
  if (valor === 1) return styles.dadoUno
  return styles.dado
}

export function DiceRollerModal({ onClose }: Props) {
  const [cantidad, setCantidad] = useState(1)
  const [resultados, setResultados] = useState<number[] | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function cambiarCantidad(delta: number) {
    setCantidad(c => Math.min(MAX_DADOS, Math.max(MIN_DADOS, c + delta)))
  }

  function tirar() {
    setResultados(Array.from({ length: cantidad }, tirarD6))
  }

  const seises = resultados?.filter(r => r === 6).length ?? 0
  const unos = resultados?.filter(r => r === 1).length ?? 0
  const suma = resultados?.reduce((a, b) => a + b, 0) ?? 0

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <h2 className={styles.titulo}>🎲 Lanzador de dados</h2>

        <div className={styles.controlFila}>
          <span className={styles.label}>Cantidad de D6</span>
          <div className={styles.cantidadControl}>
            <button className={styles.cantidadBtn} onClick={() => cambiarCantidad(-1)} disabled={cantidad <= MIN_DADOS}>−</button>
            <span className={styles.cantidadValor}>{cantidad}</span>
            <button className={styles.cantidadBtn} onClick={() => cambiarCantidad(1)} disabled={cantidad >= MAX_DADOS}>+</button>
          </div>
        </div>

        <button className={styles.tirarBtn} onClick={tirar}>
          Tirar {cantidad} D6
        </button>

        {resultados && (
          <>
            <div className={styles.resumen}>
              <span>Suma: <strong>{suma}</strong></span>
              <span className={styles.resumenSeis}>6s: <strong>{seises}</strong></span>
              <span className={styles.resumenUno}>1s: <strong>{unos}</strong></span>
            </div>

            <div className={styles.dados}>
              {resultados.map((valor, i) => (
                <span key={i} className={claseDado(valor)}>{valor}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
