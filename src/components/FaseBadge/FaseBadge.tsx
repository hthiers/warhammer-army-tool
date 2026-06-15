import styles from './FaseBadge.module.css'

interface FaseConfig {
  icono: string
  clase: string
}

const FASES: { clave: string; config: FaseConfig; etiqueta: string }[] = [
  { clave: 'Mando',      config: { icono: '⚙', clase: 'mando' },      etiqueta: 'Mando' },
  { clave: 'Movimiento', config: { icono: '↗', clase: 'movimiento' },  etiqueta: 'Movimiento' },
  { clave: 'Disparo',    config: { icono: '◎', clase: 'disparo' },     etiqueta: 'Disparo' },
  { clave: 'Carga',      config: { icono: '▲', clase: 'carga' },       etiqueta: 'Carga' },
  { clave: 'Combate',    config: { icono: '⚔', clase: 'lucha' },       etiqueta: 'Combate' },
  { clave: 'Lucha',      config: { icono: '⚔', clase: 'lucha' },       etiqueta: 'Lucha' },
  { clave: 'Despliegue', config: { icono: '⬇', clase: 'despliegue' },  etiqueta: 'Despliegue' },
  { clave: 'Cualquier',  config: { icono: '∞', clase: 'cualquier' },   etiqueta: 'Cualquier fase' },
]

function detectarFase(fase: string): { config: FaseConfig; etiqueta: string } {
  const match = FASES.find(f => fase.toLowerCase().includes(f.clave.toLowerCase()))
  return match
    ? { config: match.config, etiqueta: match.etiqueta }
    : { config: { icono: '·', clase: 'cualquier' }, etiqueta: 'Cualquier fase' }
}

export function FaseBadge({ fase }: { fase: string }) {
  const { config: { icono, clase }, etiqueta } = detectarFase(fase)
  return (
    <span className={`${styles.badge} ${styles[clase]}`}>
      <span className={styles.icono}>{icono}</span>
      {etiqueta}
    </span>
  )
}
