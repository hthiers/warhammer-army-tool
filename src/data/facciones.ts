import type { DatosFaccion, Estratagema } from '../types'
import { UNIDADES as SM_UNIDADES } from './spacemarines/unidades'
import { DESTACAMENTOS as SM_DESTACAMENTOS, REGLAS_DESTACAMENTO as SM_REGLAS, MEJORAS as SM_MEJORAS } from './spacemarines/doctrinas'
import { ESTRATAGEMAS as SM_ESTRATAGEMAS } from './spacemarines/estratagemas'
import { REGLAS_FACCION as SM_REGLAS_FACCION } from './spacemarines/reglasFaccion'
import { UNIDADES as NEC_UNIDADES } from './necrones/unidades'
import { DESTACAMENTOS as NEC_DESTACAMENTOS, REGLAS_DESTACAMENTO as NEC_REGLAS, MEJORAS as NEC_MEJORAS } from './necrones/doctrinas'
import { ESTRATAGEMAS as NEC_ESTRATAGEMAS } from './necrones/estratagemas'
import { REGLAS_FACCION as NEC_REGLAS_FACCION } from './necrones/reglasFaccion'
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
    reglas: SM_REGLAS,
    mejoras: SM_MEJORAS,
    estratagemas: conUniversales(SM_ESTRATAGEMAS),
    reglasFaccion: SM_REGLAS_FACCION,
  },
  {
    id: 'necrones',
    nombre: 'Necrones',
    color: '#1A6B3A',
    unidades: NEC_UNIDADES,
    destacamentos: NEC_DESTACAMENTOS,
    reglas: NEC_REGLAS,
    mejoras: NEC_MEJORAS,
    estratagemas: conUniversales(NEC_ESTRATAGEMAS),
    reglasFaccion: NEC_REGLAS_FACCION,
  },
]

export const FACCIONES_MAP: Record<string, DatosFaccion> = Object.fromEntries(
  FACCIONES.map(f => [f.id, f])
)
