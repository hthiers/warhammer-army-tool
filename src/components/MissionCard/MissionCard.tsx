import type { MisionPrimaria, MisionSecundaria, NivelPuntuacion } from '../../types/misiones'
import styles from './MissionCard.module.css'

interface Props {
  mision: MisionPrimaria | MisionSecundaria
  modoSecundaria?: 'fija' | 'tactica'
}

function esSecundaria(mision: MisionPrimaria | MisionSecundaria): mision is MisionSecundaria {
  return 'alRobarla' in mision || 'tipo' in mision || 'notaDisenador' in mision
}

function formatearPV(nivel: NivelPuntuacion): string {
  const signo = nivel.acumulable ? '+' : ''
  let texto = `${signo}${nivel.pv} PV`
  if (nivel.porUnidad) texto += ' c/u'
  if (nivel.cap) texto += `, máx ${nivel.cap} PV`
  return texto
}

export function MissionCard({ mision, modoSecundaria }: Props) {
  const secundaria = esSecundaria(mision) ? mision : null

  const CHIP_MODO_OPUESTO: Record<'fija' | 'tactica', string> = { fija: 'TÁCTICA', tactica: 'FIJA' }
  const secciones = modoSecundaria
    ? mision.secciones.filter(s => s.chip !== CHIP_MODO_OPUESTO[modoSecundaria])
    : mision.secciones

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.nombreEs}>{mision.nombreEs}</h3>
        <span className={styles.nombreEn}>{mision.nombre}</span>
      </div>

      {secundaria?.tipo && <span className={styles.tipoBadge}>{secundaria.tipo}</span>}

      {secundaria?.alRobarla && (
        <p className={styles.alRobarla}>
          <strong>Al robarla:</strong> {secundaria.alRobarla}
        </p>
      )}

      {secciones.map((seccion, i) => (
        <div key={i} className={styles.seccion}>
          <div className={styles.seccionHeader}>
            <span className={styles.cuando}>{seccion.cuando}</span>
            {seccion.chip && <span className={styles.chip}>{seccion.chip}</span>}
          </div>
          {seccion.disparador && <p className={styles.disparador}>{seccion.disparador}</p>}
          <ul className={styles.niveles}>
            {seccion.niveles.map((nivel, j) => (
              <li key={j} className={styles.nivel}>
                {nivel.disyuntivo && <span className={styles.o}>o</span>}
                <span className={styles.pv}>{formatearPV(nivel)}</span>
                <span className={styles.texto}>{nivel.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {mision.accion && (
        <div className={styles.accion}>
          <h4 className={styles.accionTitulo}>{mision.accion.titulo}</h4>
          <dl className={styles.accionFilas}>
            {mision.accion.filas.map((fila, i) => (
              <div key={i} className={styles.accionFila}>
                <dt className={styles.accionClave}>{fila.clave}:</dt>
                <dd className={styles.accionValor}>{fila.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {secundaria?.notaDisenador && (
        <p className={styles.nota}>Nota del diseñador: {secundaria.notaDisenador}</p>
      )}
    </div>
  )
}
