import { useState } from 'react'
import type { Pestana } from './types'
import { FACCIONES, FACCIONES_MAP } from './data/facciones'
import { Topbar } from './components/Topbar/Topbar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { DataSheet } from './components/DataSheet/DataSheet'
import { DoctrineList } from './components/DoctrineList/DoctrineList'
import { StratagemList } from './components/StratagemList/StratagemList'
import { FactionPicker } from './components/FactionPicker/FactionPicker'
import { ReglasModal } from './components/ReglasModal/ReglasModal'
import { FaccionRulesList } from './components/FaccionRulesList/FaccionRulesList'
import styles from './App.module.css'

const STORAGE_KEY = 'wh40k-faccion'

function getInitialFaccionId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export default function App() {
  const [faccionId, setFaccionId] = useState<string | null>(getInitialFaccionId)
  const [destacamento, setDestacamento] = useState<string>('')
  const [unidadId, setUnidadId] = useState<string>('')
  const [pestana, setPestana] = useState<Pestana>('ficha')
  const [mostrarHabilidades, setMostrarHabilidades] = useState(false)
  const [mostrarReglas, setMostrarReglas] = useState(false)

  function handleSeleccionarFaccion(id: string) {
    const faccion = FACCIONES_MAP[id]
    localStorage.setItem(STORAGE_KEY, id)
    setFaccionId(id)
    setDestacamento(faccion.destacamentos[0].id)
    setUnidadId(faccion.unidades[0].id)
    setPestana('ficha')
    setMostrarHabilidades(false)
  }

  function handleCambiarFaccion() {
    localStorage.removeItem(STORAGE_KEY)
    setFaccionId(null)
  }

  if (!faccionId || !FACCIONES_MAP[faccionId]) {
    return <FactionPicker facciones={FACCIONES} onSeleccionar={handleSeleccionarFaccion} />
  }

  const faccion = FACCIONES_MAP[faccionId]
  const unidadesActivas = faccion.unidades.filter(u => u.activo !== false)
  const destId = destacamento || faccion.destacamentos[0].id
  const unId = unidadId || unidadesActivas[0].id

  const unidad = unidadesActivas.find(u => u.id === unId) ?? unidadesActivas[0]
  const regla = faccion.reglas[destId]
  const estratagemas = faccion.estratagemas[destId] ?? []
  const tieneGranadas = unidad.palabrasClave.includes('Granadas')
  const estratagemasUnidad = estratagemas.filter(s => {
    if (s.etiqueta === 'Universal') return s.id !== 'granada' || tieneGranadas
    return unidad.estratagemasRelacionadas.includes(s.id)
  })

  function handleSeleccionarUnidad(id: string) {
    setUnidadId(id)
    setMostrarHabilidades(false)
    setPestana('ficha')
  }

  function handleCambiarDestacamento(id: string) {
    setDestacamento(id)
    setMostrarHabilidades(false)
  }

  return (
    <div className={styles.app}>
      <Topbar
        faccion={faccion}
        destacamentos={faccion.destacamentos}
        destacamentoActual={destId}
        onCambiarDestacamento={handleCambiarDestacamento}
        onCambiarFaccion={handleCambiarFaccion}
        onAbrirReglas={() => setMostrarReglas(true)}
      />
      {mostrarReglas && <ReglasModal onClose={() => setMostrarReglas(false)} />}

      <div className={styles.body}>
        <Sidebar
          unidades={unidadesActivas}
          unidadActual={unId}
          onSeleccionar={handleSeleccionarUnidad}
        />

        <div className={styles.main}>
          <nav className={styles.tabs}>
            <button
              className={`${styles.tab} ${pestana === 'ficha' ? styles.tabActive : ''}`}
              onClick={() => setPestana('ficha')}
            >
              Fichas
            </button>
            <button
              className={`${styles.tab} ${pestana === 'doctrinas' ? styles.tabActive : ''}`}
              onClick={() => setPestana('doctrinas')}
            >
              Destacamento
            </button>
            <button
              className={`${styles.tab} ${pestana === 'estratagemas' ? styles.tabActive : ''}`}
              onClick={() => setPestana('estratagemas')}
            >
              Estratagemas
              <span className={styles.count}>{estratagemas.length}</span>
            </button>
            <button
              className={`${styles.tab} ${pestana === 'faccion' ? styles.tabActive : ''}`}
              onClick={() => setPestana('faccion')}
            >
              Facción
              <span className={styles.count}>{faccion.reglasFaccion.length}</span>
            </button>
          </nav>

          <div className={styles.content}>
            {pestana === 'ficha' && (
              <DataSheet
                unidad={unidad}
                faccionId={faccionId}
                estratagemasRelacionadas={estratagemasUnidad}
                mostrarHabilidades={mostrarHabilidades}
                onToggleHabilidades={() => setMostrarHabilidades(v => !v)}
              />
            )}
            {pestana === 'doctrinas' && (
              <DoctrineList regla={regla} />
            )}
            {pestana === 'estratagemas' && (
              <StratagemList estratagemas={estratagemas} />
            )}
            {pestana === 'faccion' && (
              <FaccionRulesList reglas={faccion.reglasFaccion} faccionNombre={faccion.nombre} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
