import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { buscarRegla } from '../../data/reglas'
import styles from './ReglaBadge.module.css'

interface TooltipPos { top: number; left: number }

function ReglaBadge({ texto }: { texto: string }) {
  const [pos, setPos] = useState<TooltipPos | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const regla = buscarRegla(texto)

  if (!regla) return <span className={styles.plain}>{texto}</span>

  function show() {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect()
      setPos({ top: r.top, left: r.left + r.width / 2 })
    }
  }

  return (
    <span
      ref={ref}
      className={styles.badge}
      onMouseEnter={show}
      onMouseLeave={() => setPos(null)}
      onClick={() => pos ? setPos(null) : show()}
    >
      {texto}
      {pos && createPortal(
        <span
          className={styles.tooltip}
          style={{ top: pos.top, left: pos.left }}
          role="tooltip"
        >
          {regla.desc}
        </span>,
        document.body
      )}
    </span>
  )
}

export function ReglasEspeciales({ especial }: { especial: string }) {
  const partes = especial.split(',').map(s => s.trim()).filter(Boolean)
  return (
    <span className={styles.lista}>
      {partes.map((p, i) => (
        <span key={p}>
          <ReglaBadge texto={p} />
          {i < partes.length - 1 && <span className={styles.sep}>, </span>}
        </span>
      ))}
    </span>
  )
}
