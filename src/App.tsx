import { useState } from 'react'
import type { Pestana } from './types'
import { FACCIONES, FACCIONES_MAP } from './data/facciones'
import { Topbar } from './components/Topbar/Topbar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { DataSheet } from './components/DataSheet/DataSheet'
import { DetachmentView } from './components/DetachmentView/DetachmentView'
import { FactionPicker } from './components/FactionPicker/FactionPicker'
import { ReglasModal } from './components/ReglasModal/ReglasModal'
import { FaccionRulesList } from './components/FaccionRulesList/FaccionRulesList'
import styles from './App.module.css'

const STORAGE_KEY = 'wh40k-faccion'

function getInitialFaccionId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

function calcularPresupuestoDP(totalPts: number): number {
  if (totalPts <= 1000) return 2
  if (totalPts <= 2000) return 3
  return 4
}

export default function App() {
  const [faccionId, setFaccionId] = useState<string | null>(getInitialFaccionId)
  const [destacamentos, setDestacamentos] = useState<string[]>([])
  const [destacamentoVista, setDestacamentoVista] = useState<string>('')
  const [unidadId, setUnidadId] = useState<string>('')
  const [pestana, setPestana] = useState<Pestana>('ficha')
  const [mostrarHabilidades, setMostrarHabilidades] = useState(false)
  const [mostrarReglas, setMostrarReglas] = useState(false)

  function handleSeleccionarFaccion(id: string) {
    const faccion = FACCIONES_MAP[id]
    localStorage.setItem(STORAGE_KEY, id)
    setFaccionId(id)
    setDestacamentos([faccion.destacamentos[0].id])
    setDestacamentoVista(faccion.destacamentos[0].id)
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

  const destActivos = destacamentos.length > 0 ? destacamentos : [faccion.destacamentos[0].id]
  const vistaId = destActivos.includes(destacamentoVista) ? destacamentoVista : destActivos[0]

  const totalPts = unidadesActivas.reduce((sum, u) => sum + u.pts, 0)
  const presupuestoDP = calcularPresupuestoDP(totalPts)
  const dpUsados = destacamentos.reduce((sum, id) => {
    const d = faccion.destacamentos.find(x => x.id === id)
    return sum + (d?.dp ?? 0)
  }, 0)

  const unId = unidadId || unidadesActivas[0].id
  const unidad = unidadesActivas.find(u => u.id === unId) ?? unidadesActivas[0]

  // Estratagemas de todos los destacamentos activos (para la ficha de unidad)
  const estratagemasAll = destActivos.flatMap(id => faccion.estratagemas[id] ?? [])

  // Datos del destacamento en vista (para la pestaña Destacamento)
  const regla = faccion.reglas[vistaId]
  const estratagemasVista = faccion.estratagemas[vistaId] ?? []
  const mejorasVista = faccion.mejoras[vistaId] ?? []

  const tieneGranadas = unidad.palabrasClave.includes('Granadas')
  const tieneMonstruoVehiculo = unidad.palabrasClave.some(k => k === 'Monstruo' || k === 'Vehículo')
  const tieneHumo = unidad.palabrasClave.includes('Humo')
  const estratagemasUnidad = estratagemasAll.filter(s => {
    if (s.etiqueta === 'Universal') {
      if (s.id === 'explosivos') return tieneGranadas
      if (s.id === 'impacto-aplastante') return tieneMonstruoVehiculo
      if (s.id === 'pantalla-de-humo') return tieneHumo
      return true
    }
    return unidad.estratagemasRelacionadas.includes(s.id)
  })

  function handleSeleccionarUnidad(id: string) {
    setUnidadId(id)
    setMostrarHabilidades(false)
    setPestana('ficha')
  }

  function handleAgregarDestacamento(id: string) {
    setDestacamentos(prev => [...prev, id])
    setMostrarHabilidades(false)
  }

  function handleQuitarDestacamento(id: string) {
    setDestacamentos(prev => prev.filter(x => x !== id))
    if (destacamentoVista === id) {
      const remaining = destActivos.filter(x => x !== id)
      setDestacamentoVista(remaining[0] ?? destActivos[0])
    }
    setMostrarHabilidades(false)
  }

  return (
    <div className={styles.app}>
      <Topbar
        faccion={faccion}
        destacamentos={faccion.destacamentos}
        destacamentosSeleccionados={destacamentos}
        presupuestoDP={presupuestoDP}
        dpUsados={dpUsados}
        onAgregarDestacamento={handleAgregarDestacamento}
        onQuitarDestacamento={handleQuitarDestacamento}
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
              className={`${styles.tab} ${pestana === 'destacamento' ? styles.tabActive : ''}`}
              onClick={() => setPestana('destacamento')}
            >
              Destacamento
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
            {pestana === 'destacamento' && (
              <>
                {destActivos.length > 1 && (
                  <div className={styles.vistaSelector}>
                    {destActivos.map(id => {
                      const d = faccion.destacamentos.find(x => x.id === id)!
                      return (
                        <button
                          key={id}
                          className={`${styles.vistaBtn} ${id === vistaId ? styles.vistaBtnActive : ''}`}
                          onClick={() => setDestacamentoVista(id)}
                        >
                          {d.nombre}
                        </button>
                      )
                    })}
                  </div>
                )}
                <DetachmentView
                  regla={regla}
                  estratagemas={estratagemasVista}
                  mejoras={mejorasVista}
                />
              </>
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
