import { useState } from 'react'
import { consultaBreve, consultaCompleta, leerRespuesta } from '../../../ia/consulta'
import { esReferenciaSeccion } from '../../../ia/corpus'
import type { ResultadoLectura } from '../../../ia/consulta'
import { obtenerCorpus } from '../../ia/corpusNavegador'
import { buscarRegla } from '../../data/reglas'
import styles from './ArbitroModal.module.css'

// El Árbitro en modo copiar/pegar: la app arma la consulta, tú la llevas a Claude
// y traes la respuesta de vuelta. Sin backend, sin clave y sin coste aparte.
// Ver design/plan-implementacion.md § 4.

interface Props {
  onClose: () => void
}

const EJEMPLOS = [
  '¿Puede disparar una unidad que avanzó?',
  'Mis Intercesores están trabados. ¿Pueden disparar sus bólters?',
  'Una unidad mía retrocedió este turno. ¿Puede cargar?',
]

export function ArbitroModal({ onClose }: Props) {
  const [pregunta, setPregunta] = useState('')
  const [pegado, setPegado] = useState('')
  const [resultado, setResultado] = useState<ResultadoLectura | null>(null)
  const [copiado, setCopiado] = useState(false)
  // El corpus solo se pega la primera vez: después la conversación ya lo tiene.
  const [corpusEnviado, setCorpusEnviado] = useState(false)

  function handleCopiar() {
    const texto = corpusEnviado
      ? consultaBreve({ pregunta })
      : consultaCompleta({ corpus: obtenerCorpus().corpus, pregunta })

    navigator.clipboard?.writeText(texto).then(() => {
      setCopiado(true)
      setCorpusEnviado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  function handleLeer() {
    setResultado(leerRespuesta(pegado, obtenerCorpus().citables))
  }

  function handleNuevaConversacion() {
    setCorpusEnviado(false)
    setResultado(null)
    setPegado('')
  }

  const respuesta = resultado?.respuesta

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.titulo}>Árbitro de reglas</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className={styles.cuerpo}>
          <ol className={styles.pasos}>
            <li>Escribe tu duda y copia la consulta.</li>
            <li>Pégala en Claude y copia su respuesta.</li>
            <li>Pégala aquí abajo para verla verificada.</li>
          </ol>

          <label className={styles.etiqueta}>Tu duda</label>
          <textarea
            className={styles.pregunta}
            rows={2}
            value={pregunta}
            onChange={e => setPregunta(e.target.value)}
            placeholder="¿Puede cargar una unidad que avanzó?"
          />

          <div className={styles.ejemplos}>
            {EJEMPLOS.map(e => (
              <button key={e} className={styles.ejemplo} onClick={() => setPregunta(e)}>
                {e}
              </button>
            ))}
          </div>

          <div className={styles.acciones}>
            <button className={styles.btn} onClick={handleCopiar} disabled={!pregunta.trim()}>
              {copiado ? '✓ Copiado' : corpusEnviado ? 'Copiar pregunta' : 'Copiar consulta + reglas'}
            </button>
            {corpusEnviado && (
              <button className={styles.btnSutil} onClick={handleNuevaConversacion}>
                Empezar conversación nueva
              </button>
            )}
          </div>

          <p className={styles.nota}>
            {corpusEnviado
              ? 'Las reglas ya están en tu conversación de Claude: ahora solo se copia la pregunta. Si abres un chat nuevo, pulsa «Empezar conversación nueva».'
              : 'La primera consulta incluye el reglamento completo (~200 KB). Pégala en un chat nuevo de Claude; las siguientes preguntas ya no lo repetirán.'}
          </p>

          <label className={styles.etiqueta}>Respuesta de Claude</label>
          <textarea
            className={styles.pegado}
            rows={4}
            value={pegado}
            onChange={e => setPegado(e.target.value)}
            placeholder='{ "veredicto": "depende", … }'
          />
          <button className={styles.btn} onClick={handleLeer} disabled={!pegado.trim()}>
            Leer respuesta
          </button>

          {resultado && !resultado.ok && <p className={styles.error}>{resultado.error}</p>}

          {respuesta && (
            <section className={styles.resultado}>
              <div className={`${styles.veredicto} ${styles[respuesta.veredicto]}`}>
                {respuesta.veredicto}
              </div>
              <p className={styles.explicacion}>{respuesta.explicacion}</p>

              {respuesta.condiciones && respuesta.condiciones.length > 0 && (
                <ul className={styles.condiciones}>
                  {respuesta.condiciones.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}

              {respuesta.reglasAplicadas.length > 0 && (
                <div className={styles.reglas}>
                  <div className={styles.reglasTitulo}>Reglas citadas</div>
                  {respuesta.reglasAplicadas.map(id => {
                    const inventada = resultado?.inventadas?.includes(id)
                    const seccion = esReferenciaSeccion(id)
                    const desc = buscarRegla(id)?.desc
                    return (
                      <div
                        key={id}
                        className={inventada ? styles.reglaInvalida : styles.regla}
                      >
                        <strong>{id}</strong>
                        {inventada ? (
                          <span className={styles.avisoInventada}>no existe en el corpus</span>
                        ) : seccion ? (
                          <span className={styles.reglaDesc}>
                            Sección del reglamento — búscala como ({id}) en la pestaña Reglas.
                          </span>
                        ) : (
                          desc && <span className={styles.reglaDesc}>{desc}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {resultado?.inventadas && resultado.inventadas.length > 0 && (
                <p className={styles.error}>
                  {resultado.inventadas.length} regla(s) citada(s) no existen en el corpus.
                  Trata esta respuesta con desconfianza.
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
