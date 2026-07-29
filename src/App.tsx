import { useState, useEffect } from 'react'
import type { Pestana } from './types'
import { FACCIONES, FACCIONES_MAP } from './data/facciones'
import { Topbar } from './components/Topbar/Topbar'
import { DestacamentoBar } from './components/DestacamentoBar/DestacamentoBar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { DataSheet } from './components/DataSheet/DataSheet'
import { DetachmentView } from './components/DetachmentView/DetachmentView'
import { FactionPicker } from './components/FactionPicker/FactionPicker'
import { ReglasModal } from './components/ReglasModal/ReglasModal'
import { DiceRollerModal } from './components/DiceRollerModal/DiceRollerModal'
import { FaccionRulesList } from './components/FaccionRulesList/FaccionRulesList'
import { MisionesView } from './components/MisionesView/MisionesView'
import styles from './App.module.css'

const STORAGE_KEY = 'wh40k-faccion'
const STORAGE_DEST_PREFIX = 'wh40k-destacamentos'
const STORAGE_THEME_KEY = 'wh40k-theme'
const STORAGE_INACTIVAS_PREFIX = 'wh40k-unidades-inactivas'

type Tema = 'light' | 'dark'

function getInitialTema(): Tema {
  const saved = localStorage.getItem(STORAGE_THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialFaccionId(): string | null {
  const dePestana = sessionStorage.getItem(STORAGE_KEY)
  if (dePestana) return dePestana

  // Pestaña nueva: toma la última facción usada globalmente como sugerencia
  // inicial, pero a partir de ahora esta pestaña queda fijada a la suya propia
  // y no se ve afectada por cambios de facción en otras pestañas.
  const global = localStorage.getItem(STORAGE_KEY)
  if (global) sessionStorage.setItem(STORAGE_KEY, global)
  return global
}

function getInitialDestacamentos(faccionId: string | null, faccionDestacamentos: { id: string }[]): string[] {
  if (!faccionId) return []
  try {
    const saved = localStorage.getItem(`${STORAGE_DEST_PREFIX}-${faccionId}`)
    if (saved) {
      const parsed: string[] = JSON.parse(saved)
      const validIds = new Set(faccionDestacamentos.map(d => d.id))
      const valid = parsed.filter(id => validIds.has(id))
      if (valid.length > 0) return valid
    }
  } catch {
    // ignorar errores de parseo
  }
  return []
}

function getInitialUnidadesInactivas(faccionId: string | null): Set<string> {
  if (!faccionId) return new Set()
  try {
    const saved = localStorage.getItem(`${STORAGE_INACTIVAS_PREFIX}-${faccionId}`)
    if (saved) return new Set(JSON.parse(saved))
  } catch {
    // ignorar errores de parseo
  }
  return new Set()
}

function calcularPresupuestoDP(totalPts: number): number {
  if (totalPts <= 1000) return 2
  if (totalPts <= 2000) return 3
  return 4
}

export default function App() {
  const [faccionId, setFaccionId] = useState<string | null>(getInitialFaccionId)
  const initialFaccionId = getInitialFaccionId()
  const initialFaccion = initialFaccionId ? FACCIONES_MAP[initialFaccionId] : null
  const [destacamentos, setDestacamentos] = useState<string[]>(() =>
    getInitialDestacamentos(initialFaccionId, initialFaccion?.destacamentos ?? [])
  )
  const [destacamentoVista, setDestacamentoVista] = useState<string>('')
  const [unidadId, setUnidadId] = useState<string>('')
  const [unidadesInactivas, setUnidadesInactivas] = useState<Set<string>>(() =>
    getInitialUnidadesInactivas(initialFaccionId)
  )
  const [pestana, setPestana] = useState<Pestana>('ficha')
  const [mostrarHabilidades, setMostrarHabilidades] = useState(false)
  const [mostrarReglas, setMostrarReglas] = useState(false)
  const [mostrarDados, setMostrarDados] = useState(false)
  const [tema, setTema] = useState<Tema>(getInitialTema)
  const [vistaPartida, setVistaPartida] = useState(false)

  useEffect(() => {
    if (faccionId) {
      localStorage.setItem(`${STORAGE_DEST_PREFIX}-${faccionId}`, JSON.stringify(destacamentos))
    }
  }, [faccionId, destacamentos])

  useEffect(() => {
    if (faccionId) {
      localStorage.setItem(
        `${STORAGE_INACTIVAS_PREFIX}-${faccionId}`,
        JSON.stringify([...unidadesInactivas])
      )
    }
  }, [faccionId, unidadesInactivas])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem(STORAGE_THEME_KEY, tema)
  }, [tema])

  function handleToggleTema() {
    setTema(t => (t === 'dark' ? 'light' : 'dark'))
  }

  function handleSeleccionarFaccion(id: string) {
    const faccion = FACCIONES_MAP[id]
    const destGuardados = getInitialDestacamentos(id, faccion.destacamentos)
    const destIniciales = destGuardados.length > 0 ? destGuardados : [faccion.destacamentos[0].id]
    localStorage.setItem(STORAGE_KEY, id)
    sessionStorage.setItem(STORAGE_KEY, id)
    setFaccionId(id)
    setDestacamentos(destIniciales)
    setDestacamentoVista(destIniciales[0])
    setUnidadId(faccion.unidades[0].id)
    setUnidadesInactivas(getInitialUnidadesInactivas(id))
    setPestana('ficha')
    setMostrarHabilidades(false)
  }

  function handleToggleActivo(id: string) {
    setUnidadesInactivas(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleCambiarFaccion() {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    setFaccionId(null)
  }

  if (!faccionId || !FACCIONES_MAP[faccionId]) {
    return <FactionPicker facciones={FACCIONES} onSeleccionar={handleSeleccionarFaccion} />
  }

  const faccion = FACCIONES_MAP[faccionId]
  const unidadesConEstado = faccion.unidades.map(u => {
    const activoPorDefecto = u.activo !== false
    const alternado = unidadesInactivas.has(u.id)
    return { ...u, activo: alternado ? !activoPorDefecto : activoPorDefecto }
  })

  const destActivos = destacamentos.length > 0 ? destacamentos : [faccion.destacamentos[0].id]
  const vistaId = destActivos.includes(destacamentoVista) ? destacamentoVista : destActivos[0]

  const totalPts = unidadesConEstado.filter(u => u.activo).reduce((sum, u) => sum + u.pts, 0)
  const presupuestoDP = calcularPresupuestoDP(totalPts)
  const dpUsados = destacamentos.reduce((sum, id) => {
    const d = faccion.destacamentos.find(x => x.id === id)
    return sum + (d?.dp ?? 0)
  }, 0)

  const unId = unidadId || unidadesConEstado[0].id
  const unidad = unidadesConEstado.find(u => u.id === unId) ?? unidadesConEstado[0]

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
        onCambiarFaccion={handleCambiarFaccion}
        onAbrirReglas={() => setMostrarReglas(true)}
        onAbrirDados={() => setMostrarDados(true)}
        tema={tema}
        onToggleTema={handleToggleTema}
        vistaPartida={vistaPartida}
        onToggleVistaPartida={() => setVistaPartida(v => !v)}
      />
      {mostrarReglas && <ReglasModal onClose={() => setMostrarReglas(false)} />}
      {mostrarDados && <DiceRollerModal onClose={() => setMostrarDados(false)} />}

      {vistaPartida ? (
        <div className={styles.body}>
          <MisionesView />
        </div>
      ) : (
      <div className={styles.body}>
        <Sidebar
          unidades={unidadesConEstado}
          unidadActual={unId}
          onSeleccionar={handleSeleccionarUnidad}
          onToggleActivo={handleToggleActivo}
        />

        <div className={styles.main}>
          <DestacamentoBar
            destacamentos={faccion.destacamentos}
            destacamentosSeleccionados={destacamentos}
            presupuestoDP={presupuestoDP}
            dpUsados={dpUsados}
            onAgregarDestacamento={handleAgregarDestacamento}
            onQuitarDestacamento={handleQuitarDestacamento}
          />
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
      )}
    </div>
  )
}
