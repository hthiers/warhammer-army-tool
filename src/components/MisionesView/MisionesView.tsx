import { useState } from 'react'
import type { CSSProperties } from 'react'
import { DispositionPicker } from '../DispositionPicker/DispositionPicker'
import { PartidaTracker } from '../PartidaTracker/PartidaTracker'
import { MissionCard } from '../MissionCard/MissionCard'
import { AIOpponent } from '../AIOpponent/AIOpponent'
import { Tablero2D } from '../Tablero/Tablero2D'
import { MISIONES_PRIMARIAS } from '../../data/misiones/primarias'
import { MISIONES_SECUNDARIAS } from '../../data/misiones/secundarias'
import { POSTURAS } from '../../data/misiones/disposicionFuerza'
import styles from './MisionesView.module.css'

type SubVista = 'partida' | 'tablero' | 'disposicion' | 'primarias' | 'secundarias' | 'ia'

export function MisionesView() {
  const [subVista, setSubVista] = useState<SubVista>('partida')

  return (
    <div className={styles.wrap}>
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${subVista === 'partida' ? styles.tabActive : ''}`}
          onClick={() => setSubVista('partida')}
        >
          Partida
        </button>
        <button
          className={`${styles.tab} ${subVista === 'tablero' ? styles.tabActive : ''}`}
          onClick={() => setSubVista('tablero')}
        >
          Tablero
        </button>
        <button
          className={`${styles.tab} ${subVista === 'disposicion' ? styles.tabActive : ''}`}
          onClick={() => setSubVista('disposicion')}
        >
          Disposición
        </button>
        <button
          className={`${styles.tab} ${subVista === 'primarias' ? styles.tabActive : ''}`}
          onClick={() => setSubVista('primarias')}
        >
          Primarias
        </button>
        <button
          className={`${styles.tab} ${subVista === 'secundarias' ? styles.tabActive : ''}`}
          onClick={() => setSubVista('secundarias')}
        >
          Secundarias
          <span className={styles.count}>{MISIONES_SECUNDARIAS.length}</span>
        </button>
        <button
          className={`${styles.tab} ${subVista === 'ia' ? styles.tabActive : ''}`}
          onClick={() => setSubVista('ia')}
        >
          IA Necrón
        </button>
      </nav>

      <div className={styles.content}>
        {subVista === 'partida' && <PartidaTracker />}

        {subVista === 'tablero' && <Tablero2D />}

        {subVista === 'disposicion' && <DispositionPicker />}

        {subVista === 'primarias' && (
          <div className={styles.mazos}>
            {POSTURAS.map(postura => (
              <div key={postura.id} className={styles.mazoGrupo}>
                <h3
                  className={styles.mazoTitulo}
                  style={{ '--mazo-color': postura.color } as CSSProperties}
                >
                  {postura.nombreEs} <span className={styles.mazoTituloEn}>({postura.nombre})</span>
                </h3>
                <div className={styles.listaCartas}>
                  {MISIONES_PRIMARIAS.filter(m => m.mazo === postura.mazo).map(m => (
                    <MissionCard key={m.id} mision={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {subVista === 'secundarias' && (
          <div className={styles.listaCartas}>
            {MISIONES_SECUNDARIAS.map(m => (
              <MissionCard key={m.id} mision={m} />
            ))}
          </div>
        )}

        {subVista === 'ia' && <AIOpponent />}
      </div>
    </div>
  )
}
