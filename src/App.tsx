import { useState } from 'react'
import type { Pestana } from './types'
import { UNIDADES } from './data/unidades'
import { DESTACAMENTOS, DOCTRINAS } from './data/doctrinas'
import { ESTRATAGEMAS } from './data/estratagemas'
import { Topbar } from './components/Topbar/Topbar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { DataSheet } from './components/DataSheet/DataSheet'
import { DoctrineList } from './components/DoctrineList/DoctrineList'
import { StratagemList } from './components/StratagemList/StratagemList'
import styles from './App.module.css'

export default function App() {
  const [destacamento, setDestacamento] = useState('gladius')
  const [unidadId, setUnidadId] = useState(UNIDADES[0].id)
  const [pestana, setPestana] = useState<Pestana>('ficha')
  const [mostrarHabilidades, setMostrarHabilidades] = useState(false)

  const unidad = UNIDADES.find(u => u.id === unidadId)!
  const doctrinas = DOCTRINAS[destacamento] ?? []
  const estratagemas = ESTRATAGEMAS[destacamento] ?? []
  const estratagemasUnidad = estratagemas.filter(s =>
    unidad.estratagemasRelacionadas.includes(s.id)
  )

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
        destacamentos={DESTACAMENTOS}
        destacamentoActual={destacamento}
        onCambiarDestacamento={handleCambiarDestacamento}
      />

      <div className={styles.body}>
        <Sidebar
          unidades={UNIDADES}
          unidadActual={unidadId}
          onSeleccionar={handleSeleccionarUnidad}
        />

        <div className={styles.main}>
          {/* Pestañas */}
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
              Doctrinas
              <span className={styles.count}>{doctrinas.length}</span>
            </button>
            <button
              className={`${styles.tab} ${pestana === 'estratagemas' ? styles.tabActive : ''}`}
              onClick={() => setPestana('estratagemas')}
            >
              Estratagemas
              <span className={styles.count}>{estratagemas.length}</span>
            </button>
          </nav>

          {/* Contenido */}
          <div className={styles.content}>
            {pestana === 'ficha' && (
              <DataSheet
                unidad={unidad}
                estratagemasRelacionadas={estratagemasUnidad}
                mostrarHabilidades={mostrarHabilidades}
                onToggleHabilidades={() => setMostrarHabilidades(v => !v)}
              />
            )}
            {pestana === 'doctrinas' && (
              <DoctrineList doctrinas={doctrinas} />
            )}
            {pestana === 'estratagemas' && (
              <StratagemList estratagemas={estratagemas} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
