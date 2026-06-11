import styles from './FaseBadge.module.css'

interface FaseConfig {
  icono: string
  clase: string
}

const FASES: { clave: string; config: FaseConfig }[] = [
  { clave: 'Mando',      config: { icono: '⚙', clase: 'mando' } },
  { clave: 'Movimiento', config: { icono: '↗', clase: 'movimiento' } },
  { clave: 'Disparo',    config: { icono: '◎', clase: 'disparo' } },
  { clave: 'Carga',      config: { icono: '▲', clase: 'carga' } },
  { clave: 'Combate',    config: { icono: '⚔', clase: 'lucha' } },
  { clave: 'Lucha',      config: { icono: '⚔', clase: 'lucha' } },
  { clave: 'Despliegue', config: { icono: '⬇', clase: 'despliegue' } },
  { clave: 'Cualquier',  config: { icono: '∞', clase: 'cualquier' } },
]

function detectarFase(fase: string): FaseConfig {
  const match = FASES.find(f => fase.toLowerCase().includes(f.clave.toLowerCase()))
  return match?.config ?? { icono: '·', clase: 'cualquier' }
}

export function FaseBadge({ fase }: { fase: string }) {
  const { icono, clase } = detectarFase(fase)
  return (
    <span className={`${styles.badge} ${styles[clase]}`}>
      <span className={styles.icono}>{icono}</span>
      {fase}
    </span>
  )
}
