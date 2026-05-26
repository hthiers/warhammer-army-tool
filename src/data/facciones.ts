import type { DatosFaccion, Estratagema } from '../types'
import { UNIDADES as SM_UNIDADES } from './spacemarines/unidades'
import { DESTACAMENTOS as SM_DESTACAMENTOS, DOCTRINAS as SM_DOCTRINAS } from './spacemarines/doctrinas'
import { ESTRATAGEMAS as SM_ESTRATAGEMAS } from './spacemarines/estratagemas'
import { REGLAS_FACCION as SM_REGLAS } from './spacemarines/reglasFaccion'
import { UNIDADES as NEC_UNIDADES } from './necrones/unidades'
import { DESTACAMENTOS as NEC_DESTACAMENTOS, DOCTRINAS as NEC_DOCTRINAS } from './necrones/doctrinas'
import { ESTRATAGEMAS as NEC_ESTRATAGEMAS } from './necrones/estratagemas'
import { REGLAS_FACCION as NEC_REGLAS } from './necrones/reglasFaccion'
import { ESTRATAGEMAS_UNIVERSALES } from './estratagemasUniversales'

function conUniversales(
  estratagemas: Record<string, Estratagema[]>
): Record<string, Estratagema[]> {
  return Object.fromEntries(
    Object.entries(estratagemas).map(([id, lista]) => [
      id,
      [...lista, ...ESTRATAGEMAS_UNIVERSALES],
    ])
  )
}

export const FACCIONES: DatosFaccion[] = [
  {
    id: 'spacemarines',
    nombre: 'Space Marines',
    color: '#BA7517',
    unidades: SM_UNIDADES,
    destacamentos: SM_DESTACAMENTOS,
    doctrinas: SM_DOCTRINAS,
    estratagemas: conUniversales(SM_ESTRATAGEMAS),
    reglasFaccion: SM_REGLAS,
  },
  {
    id: 'necrones',
    nombre: 'Necrones',
    color: '#1A6B3A',
    unidades: NEC_UNIDADES,
    destacamentos: NEC_DESTACAMENTOS,
    doctrinas: NEC_DOCTRINAS,
    estratagemas: conUniversales(NEC_ESTRATAGEMAS),
    reglasFaccion: NEC_REGLAS,
  },
]

export const FACCIONES_MAP: Record<string, DatosFaccion> = Object.fromEntries(
  FACCIONES.map(f => [f.id, f])
)
