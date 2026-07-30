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
