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

        <h2 className={styles.titulo}>Reglas Básicas — 11.ª Edición</h2>

        {/* ── 1. MOVIMIENTO ── */}
        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Movimiento</h3>
          <ul className={styles.lista}>
            <li>
              <strong>Normal:</strong> Mueve hasta el atributo M. Después de mover la unidad no puede quedar <strong>trabada</strong>.
            </li>
            <li>
              <strong>Avanzar:</strong> Haz una tirada de avanzar (1D6) y súmala a M ese turno. No puede declarar cargas ni iniciar acciones (salvo armas <strong>[ASALTO]</strong>).
            </li>
            <li>
              <strong>Retroceder</strong> (solo si la unidad está <strong>trabada</strong>): elige <strong>Retirada ordenada</strong> (si no está acobardada) o <strong>Huida desesperada</strong> (tirada de riesgo por miniatura). Después no puede disparar ni declarar cargas.
            </li>
            <li>
              <strong>Coherencia:</strong> Cada miniatura debe estar a 2" o menos en horizontal y 5" o menos en vertical de al menos otra miniatura de su unidad, y a 9" o menos del resto.
            </li>
            <li>
              <strong>Zona de amenaza:</strong> 2" en horizontal y 5" en vertical. Dos unidades están <strong>trabadas</strong> cuando al menos una miniatura de cada una está en la zona de amenaza de la otra.
            </li>
          </ul>
        </section>

        {/* ── 2. ATACAR ── */}
        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Atacar — 3 pasos</h3>
          <ol className={styles.pasos}>
            <li>
              <strong>Elegir armas:</strong> Al disparar, elige 1 o más armas a distancia por miniatura. Al combatir, elige 1 arma de combate por miniatura.
            </li>
            <li>
              <strong>Elegir blancos:</strong> Al disparar: 1 unidad enemiga <strong>visible</strong>, dentro de alcance y que la unidad no esté <strong>trabada</strong>. Al combatir: 1 o más unidades enemigas <strong>trabadas</strong> con la miniatura (no más blancos que el atributo A del arma).
            </li>
            <li>
              <strong>Resolver ataques:</strong> Para cada unidad blanco: reúne los dados de ataque (1D6 por punto de A del arma), resuelve la secuencia de ataque, y continúa con el siguiente blanco o arma.
            </li>
          </ol>
        </section>

        {/* ── 3. SECUENCIA DE ATAQUE ── */}
        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Secuencia de Ataque — 4 pasos</h3>
          <ol className={styles.pasos}>
            <li>
              <strong>Tiradas para impactar:</strong> Tira 1D6 por dado de ataque.
              <span className={styles.reglaInline}><strong>1 sin modificar</strong> = fallo siempre.</span>
              <span className={styles.reglaInline}><strong>6 sin modificar</strong> = impacto crítico.</span>
              <span className={styles.reglaInline}>Igual o mayor que HP/HA = impacto. Cualquier otro = fallo.</span>
            </li>
            <li>
              <strong>Tiradas para herir:</strong> Por cada impacto, tira 1D6.
              <span className={styles.reglaInline}><strong>1 sin modificar</strong> = fallo siempre.</span>
              <span className={styles.reglaInline}><strong>6 sin modificar</strong> = herida crítica.</span>
              <span className={styles.reglaInline}>Mínimo requerido según F vs R del blanco:</span>
              <table className={styles.tablaInline}>
                <thead>
                  <tr>
                    <th>F vs Resistencia del blanco</th>
                    <th>Mínimo</th>
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
            </li>
            <li>
              <strong>Tiradas de salvación:</strong> El oponente agrupa miniaturas por H, S y S Inv. Por cada herida tira 1D6. Si tiene <strong>S Inv</strong> y el resultado es igual o mayor = fallo. Si no, modifica S con el FP del arma; si el resultado es igual o mayor a S modificada = fallo. Cualquier otro resultado = inflige daño.
            </li>
            <li>
              <strong>Infligir daño:</strong> La miniatura pierde heridas igual al atributo D del ataque. Si H llega a 0 o menos, la miniatura queda <strong>eliminada</strong>.
            </li>
          </ol>
        </section>

        {/* ── 4. CARGA ── */}
        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Fase de Carga</h3>
          <ul className={styles.lista}>
            <li>
              <strong>Apta para declarar carga:</strong> la unidad está en campo, no está trabada, no avanzó ni retrocedió ese turno, y hay al menos 1 unidad enemiga a 12" o menos.
            </li>
            <li>
              <strong>Tirada de carga:</strong> 2D6. Ese resultado es la distancia máxima del movimiento de carga. Un resultado de 2 (doble 1) nunca es suficiente para completar la carga.
            </li>
            <li>
              <strong>Movimiento de carga:</strong> Todas las minis deben terminar más cerca del blanco que al empezar. Toda miniatura que pueda terminar a 2" de un blanco debe hacerlo. Toda miniatura que pueda quedar <strong>trabada</strong> con un blanco debe hacerlo.
            </li>
            <li>
              <strong>Tras la carga:</strong> La unidad debe estar trabada con todos los blancos. Todas las miniaturas de la unidad cargadora obtienen la habilidad <strong>Combatir primero</strong> hasta el final del turno.
            </li>
          </ul>
        </section>

        {/* ── 5. LA RONDA Y SUS FASES ── */}
        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>La Ronda de Batalla</h3>
          <ul className={styles.lista}>
            <li>La partida dura normalmente <strong>5 rondas</strong>. Cada ronda: Inicio → Turno jugador A → Turno jugador B → Fin de ronda.</li>
          </ul>
          <p className={styles.subTitulo}>Cada turno consta de 7 partes:</p>
          <ol className={styles.fases}>
            <li>
              <span className={styles.faseNom}>Inicio del turno</span>
              <span className={styles.faseDesc}>Se resuelven reglas activadas al inicio del turno.</span>
            </li>
            <li>
              <span className={styles.faseNom}>Fase de Mando</span>
              <span className={styles.faseDesc}>Ambos jugadores obtienen 1 PM básico. El jugador activo hace tiradas de acobardamiento por unidades acobardadas o a mitad de efectivos. Luego se resuelven habilidades de mando.</span>
            </li>
            <li>
              <span className={styles.faseNom}>Fase de Movimiento</span>
              <span className={styles.faseDesc}>El jugador activo mueve sus unidades una a una: permanecer inmóvil, normal, avanzar, retroceder, desembarcar o inserción.</span>
            </li>
            <li>
              <span className={styles.faseNom}>Fase de Disparo</span>
              <span className={styles.faseDesc}>Las unidades aptas disparan: disparo normal (no trabada), de asalto (avanzó + arma [ASALTO]), a quemarropa (trabada) o indirecto.</span>
            </li>
            <li>
              <span className={styles.faseNom}>Fase de Carga</span>
              <span className={styles.faseDesc}>Las unidades aptas declaran y resuelven sus cargas.</span>
            </li>
            <li>
              <span className={styles.faseNom}>Fase de Combate</span>
              <span className={styles.faseDesc}>1) Agruparse (ambos jugadores, hasta 3"). 2) Combatir: primero unidades con Combatir primero, alternando; luego el resto alternando. 3) Consolidar (hasta 3").</span>
            </li>
            <li>
              <span className={styles.faseNom}>Final del turno</span>
              <span className={styles.faseDesc}>Se resuelven reglas de final de turno y se consulta la misión.</span>
            </li>
          </ol>
        </section>

        {/* ── 6. UNIDADES ADJUNTAS ── */}
        <section className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Unidades Adjuntas</h3>
          <ul className={styles.lista}>
            <li>
              Las unidades con habilidad <strong>Líder</strong> o <strong>Apoyo</strong> pueden liderar una unidad <strong>guardaespaldas</strong> específica, formando una <strong>unidad adjunta</strong> que actúa como una sola unidad a efectos de reglas.
            </li>
            <li>
              Cada unidad guardaespaldas puede tener como máximo <strong>1 unidad líder</strong> y <strong>1 unidad apoyo</strong>.
            </li>
            <li>
              <strong>Atacar a una unidad adjunta:</strong> Si incluye miniaturas guardaespaldas, se usa el atributo R más alto de esas miniaturas. Si solo quedan miniaturas líder/apoyo, se usa la R más alta de ellas.
            </li>
            <li>
              <strong>Claves:</strong> La unidad adjunta tiene todas las claves de todas sus unidades componentes.
            </li>
            <li>
              <strong>Habilidades de líder/apoyo</strong> se aplican hasta que su última miniatura resulte <strong>eliminada</strong>. <strong>Habilidades de guardaespaldas</strong> se aplican hasta que la última miniatura guardaespaldas resulte <strong>eliminada</strong>.
            </li>
          </ul>
        </section>

      </div>
    </div>
  )
}
