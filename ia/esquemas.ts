// ─── Esquemas de respuesta ────────────────────────────────────────────────────
//
// Se pasan en `output_config.format` como `json_schema`, lo que garantiza que la
// respuesta valide contra el esquema. Requisitos del formato: `additionalProperties`
// en false y `required` explícito en cada objeto.

export const ESQUEMA_ARBITRO = {
  type: 'object',
  additionalProperties: false,
  required: ['veredicto', 'explicacion', 'reglasAplicadas'],
  properties: {
    veredicto: {
      type: 'string',
      enum: ['permitido', 'prohibido', 'depende'],
      description:
        'permitido si la acción es legal; prohibido si no lo es; depende si la legalidad está condicionada a algo que no consta en la pregunta.',
    },
    explicacion: {
      type: 'string',
      description:
        'Justificación en dos o tres frases, citando la regla que decide. En español.',
    },
    reglasAplicadas: {
      type: 'array',
      description:
        'Ids exactos de las reglas, unidades, estratagemas o misiones del corpus en que se apoya el veredicto. Solo ids que aparezcan literalmente en el corpus.',
      items: { type: 'string' },
    },
    condiciones: {
      type: 'array',
      description: 'Solo cuando el veredicto es «depende»: qué debe cumplirse en cada caso.',
      items: { type: 'string' },
    },
  },
} as const

export interface RespuestaArbitro {
  veredicto: 'permitido' | 'prohibido' | 'depende'
  explicacion: string
  reglasAplicadas: string[]
  condiciones?: string[]
}

// ─── Táctico ──────────────────────────────────────────────────────────────────
//
// El turno se planifica en dos etapas, que es donde está el corte natural: el
// movimiento determina casi todo, y disparo y carga dependen de dónde quedaron
// las unidades. Ver design/plan-implementacion.md § 4.

export type EtapaTactica = 'movimiento' | 'ataque'

export const TIPOS_ACCION = [
  'mover',
  'avanzar',
  'retroceder',
  'mantener',
  'disparar',
  'cargar',
  'combatir',
  'estratagema',
  'accion',
] as const

export type TipoAccion = (typeof TIPOS_ACCION)[number]

export const ESQUEMA_TACTICO = {
  type: 'object',
  additionalProperties: false,
  required: ['intencion', 'acciones', 'justificacion'],
  properties: {
    intencion: {
      type: 'string',
      description: 'Objetivo del turno en una frase. Qué se busca conseguir y por qué.',
    },
    acciones: {
      type: 'array',
      description: 'Una entrada por unidad que actúa. Omite las que no hacen nada.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['unidadId', 'tipo', 'descripcion'],
        properties: {
          unidadId: {
            type: 'string',
            description: 'El id exacto de la unidad en mesa, tal como viene en el informe.',
          },
          tipo: { type: 'string', enum: [...TIPOS_ACCION] },
          destino: {
            type: 'object',
            additionalProperties: false,
            required: ['x', 'y'],
            description: 'Solo para mover, avanzar y retroceder. Coordenadas en pulgadas.',
            properties: { x: { type: 'number' }, y: { type: 'number' } },
          },
          blancoId: {
            type: 'string',
            description: 'Solo para disparar, cargar y combatir. Id de la unidad enemiga.',
          },
          estratagemaId: { type: 'string', description: 'Solo para estratagema.' },
          descripcion: {
            type: 'string',
            description: 'Qué hace y por qué, en una frase. En español.',
          },
          reglasAplicadas: {
            type: 'array',
            description: 'Ids del corpus que sustentan la acción, si alguno es decisivo.',
            items: { type: 'string' },
          },
        },
      },
    },
    justificacion: {
      type: 'string',
      description: 'Dos o tres frases sobre el plan en conjunto.',
    },
    dadosRequeridos: {
      type: 'array',
      description: 'Tiradas que el jugador debe hacer para resolver el plan.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['motivo', 'tipo'],
        properties: {
          motivo: { type: 'string' },
          tipo: { type: 'string', description: 'Por ejemplo "2D6" o "1D6".' },
        },
      },
    },
  },
} as const

export interface AccionTactica {
  unidadId: string
  tipo: TipoAccion
  destino?: { x: number; y: number }
  blancoId?: string
  estratagemaId?: string
  descripcion: string
  reglasAplicadas?: string[]
}

export interface PlanTactico {
  intencion: string
  acciones: AccionTactica[]
  justificacion: string
  dadosRequeridos?: { motivo: string; tipo: string }[]
}
