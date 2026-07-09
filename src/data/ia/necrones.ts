import type { DirectivaMovimiento, PrioridadBlanco, RangoActivacionEstratagema, EstratagemaIA } from '../../types/ia'

// ─── Directivas de movimiento (1D6, al inicio del turno Necrón) ───────────────

export const DIRECTIVAS_MOVIMIENTO: DirectivaMovimiento[] = [
  {
    roll: 1,
    nombre: 'Avance',
    reglaGeneral: 'Mueve hacia el objetivo de misión más cercano que no controle el ejército Necrón.',
    reglaGeneralSino: 'Si ya controla todos los objetivos → mueve hacia el objetivo con menor OC enemigo.',
    excepciones: [
      { rol: 'asalto', etiqueta: 'Excepción ASALTO', entonces: 'Ignora objetivos. Mueve hacia la unidad enemiga más cercana. Declara carga si está a rango.' },
      { rol: 'soporte', etiqueta: 'Excepción SOPORTE', entonces: 'Mueve junto a la unidad LÍNEA o MANDO aliada más cercana. No mueve si ya está adyacente.' },
    ],
  },
  {
    roll: 2,
    nombre: 'Presión',
    reglaGeneral: 'Avanza hacia la unidad enemiga más cercana visible.',
    reglaGeneralSino: 'Desempate: la unidad con más miniaturas.',
    excepciones: [
      { rol: 'disparo', etiqueta: 'Excepción DISPARO', entonces: 'Mantiene distancia mínima de 18" del enemigo más cercano. Si está más cerca, retrocede hasta alcanzarla.' },
      { rol: 'soporte', etiqueta: 'Excepción SOPORTE', entonces: 'Mueve junto a la unidad LÍNEA o MANDO aliada más cercana.' },
    ],
  },
  {
    roll: 3,
    nombre: 'Control',
    reglaGeneral: 'Si no controla un objetivo de misión: mueve hacia el más cercano. Si ya controla uno: permanece en posición.',
    excepciones: [
      { rol: 'asalto', etiqueta: 'Excepción ASALTO', entonces: 'Ignora objetivos. Mueve hacia la unidad enemiga más cercana. Declara carga si está a rango.' },
      { rol: 'disparo', etiqueta: 'Excepción DISPARO', entonces: 'Mantiene posición si ya tiene línea de visión a un enemigo dentro de rango. Si no, avanza hasta encontrar rango óptimo.' },
    ],
  },
  {
    roll: 4,
    nombre: 'Repliegue',
    reglaGeneral: 'Mueve hacia la zona de despliegue Necrón buscando terreno denso para cobertura.',
    excepciones: [
      { rol: 'asalto', etiqueta: 'Excepción ASALTO', entonces: 'Solo retrocede si está bajo mitad de efectivos. Si no, aplica la directiva Presión (D6 = 2).' },
      { rol: 'disparo', etiqueta: 'Excepción DISPARO', entonces: 'Busca posición con cobertura que mantenga rango a un enemigo. Si no existe, retrocede hacia zona propia.' },
    ],
  },
  {
    roll: 5,
    nombre: 'Cazador',
    reglaGeneral: 'Mueve hacia la unidad enemiga con más miniaturas visible.',
    reglaGeneralSino: 'Desempate: la más cercana. Si el objetivo es un vehículo/monstruo, compara heridas totales.',
    excepciones: [
      { rol: 'asalto', etiqueta: 'Excepción ASALTO', entonces: 'Si ya está a rango de carga, declara carga directamente. Si no, avanza hacia ese objetivo.' },
      { rol: 'soporte', etiqueta: 'Excepción SOPORTE', entonces: 'Mueve junto a la unidad LÍNEA o MANDO aliada más cercana.' },
    ],
  },
  {
    roll: 6,
    nombre: 'Protocolo dividido',
    reglaGeneral: 'El ejército opera con órdenes distintas por sección. Tira un D6 separado para cada grupo.',
    excepciones: [
      { rol: 'asalto', etiqueta: 'ASALTO → tira D6', entonces: '1–3: aplica Directiva 3 (Control). 4–6: aplica Directiva 2 (Presión).' },
      { rol: 'disparo', etiqueta: 'DISPARO + LÍNEA → tira D6', entonces: '1–3: aplica Directiva 3 (Control). 4–6: aplica Directiva 2 (Presión).' },
      { rol: 'soporte', etiqueta: 'SOPORTE', entonces: 'Siempre aplica la excepción SOPORTE de la Directiva 1 (Avance). No tira dado adicional.' },
    ],
  },
]

// ─── Prioridad de blanco (1D6 por unidad que dispara) ─────────────────────────

export const PRIORIDADES_BLANCO: PrioridadBlanco[] = [
  {
    roll: 1,
    nombre: 'Objetivo más cercano',
    descripcion: 'Dispara a la unidad enemiga más cercana que sea visible y esté dentro de rango.',
    desempate: 'La unidad con mayor número de miniaturas.',
  },
  {
    roll: 2,
    nombre: 'Mayor amenaza numérica',
    descripcion: 'Dispara a la unidad enemiga con más miniaturas que sea visible y esté dentro de rango.',
    desempate: 'La más cercana.',
  },
  {
    roll: 3,
    nombre: 'Defensa de objetivo',
    descripcion: 'Dispara a la unidad enemiga que esté sobre un objetivo de terreno (dentro del área de terreno del objetivo).',
    desempate: 'Si ninguna unidad enemiga está sobre un objetivo → aplica resultado 1 (más cercana).',
  },
  {
    roll: 4,
    nombre: 'Remate',
    descripcion: 'Dispara a la unidad enemiga bajo mitad de efectivos más cercana. Si ninguna está bajo mitad → a la que tenga menos heridas/miniaturas restantes.',
    desempate: 'Si ninguna está dañada → aplica resultado 2 (mayor número).',
  },
  {
    roll: 5,
    nombre: 'Hostigamiento',
    descripcion: 'Dispara a la unidad enemiga más lejana dentro de rango que sea visible.',
    desempate: 'La con más miniaturas.',
  },
  {
    roll: 6,
    nombre: 'Fuego concentrado',
    descripcion: 'Toda unidad que pueda disparar apunta al mismo blanco que elija la unidad MANDO más cercana en mesa. Tira un D6 adicional solo para la unidad MANDO y aplica ese resultado de blanco; el resto del ejército copia su elección.',
    desempate: 'Si no hay MANDO en mesa → aplica resultado 2 (mayor número).',
  },
]

// ─── Activación de estratagema (2D6, fase de mando) ────────────────────────────

export const ACTIVACION_ESTRATAGEMA: RangoActivacionEstratagema[] = [
  { min: 2, max: 5, descripcion: 'No usa estratagema este turno. Guarda los PM.' },
  { min: 6, max: 7, descripcion: 'Usa 1 estratagema defensiva si tiene al menos 1 PM. Si no tiene PM, no actúa.' },
  { min: 8, max: 9, descripcion: 'Usa 1 estratagema ofensiva si tiene al menos 1 PM. Si no tiene PM, no actúa.' },
  { min: 10, max: 11, descripcion: 'Intenta usar 1 estratagema defensiva. Luego, si le quedan PM, usa 1 ofensiva.' },
  { min: 12, max: 12, descripcion: 'Usa 1 defensiva + 1 ofensiva si tiene 2 PM. Con solo 1 PM, usa únicamente la defensiva.' },
]

export const ESTRATAGEMAS_DEFENSIVAS_IA: EstratagemaIA[] = [
  {
    roll: 1,
    nombre: 'Reanimación eterna',
    cuando: 'Fase de mando',
    descripcion: 'Se usa sobre la unidad LÍNEA con más heridas perdidas actualmente en mesa.',
  },
  {
    roll: 2,
    nombre: 'Huida de fase',
    cuando: 'Fase de mando',
    descripcion: 'Se usa sobre la unidad SOPORTE o LÍNEA que esté bajo mitad de efectivos. Retírala del campo de batalla.',
  },
  {
    roll: 3,
    nombre: 'Escudos voidales',
    cuando: 'Fase de mando',
    descripcion: 'Se usa sobre la unidad LÍNEA o MANDO más expuesta: sin cobertura y más cercana al enemigo.',
  },
]

export const ESTRATAGEMAS_OFENSIVAS_IA: EstratagemaIA[] = [
  {
    roll: 1,
    nombre: 'Aniquilación exterminadora',
    cuando: 'Fase de disparo',
    descripcion: 'Se usa sobre la unidad DISPARO que vaya a disparar este turno.',
  },
  {
    roll: 2,
    nombre: "Ira del C'tan",
    cuando: 'Al declarar carga',
    descripcion: 'Se usa sobre la unidad ASALTO que declare carga en este turno.',
  },
  {
    roll: 3,
    nombre: 'Aceleración temporal',
    cuando: 'Fase de movimiento',
    descripcion: 'Permite a una unidad ASALTO adicional mover aunque ya lo haya hecho este turno.',
  },
]
