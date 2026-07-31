import type { RolIA, Stats } from './index'

// ─── Tablero (estado físico de la partida) ────────────────────────────────────
//
// Modelo del estado espacial de la mesa. Es la fuente de verdad para el motor de
// geometría (src/engine/geometria.ts) y para el informe táctico que se le entrega
// al asistente. Ver design/plan-implementacion.md.

export type Pulgadas = number
export type Lado = 'propio' | 'oponente'
export type Rol = 'atacante' | 'defensor'
export type Fase = 'mando' | 'movimiento' | 'disparo' | 'carga' | 'combate' | 'final'

/**
 * Origen (0,0) = esquina inferior izquierda, con y creciendo hacia arriba.
 *
 * La mesa se modela con la orientación de los diagramas oficiales de layout:
 * 44" de ancho × 60" de alto, con el DEFENSOR en el borde inferior (y = 0) y el
 * ATACANTE en el superior (y = 60). El despliegue ocurre en los bordes de 44".
 */
export interface Punto {
  x: Pulgadas
  y: Pulgadas
}

export const MESA_ANCHO: Pulgadas = 44
export const MESA_ALTO: Pulgadas = 60

/** Bordes de despliegue por rol, en la orientación oficial. */
export const BORDE_DE_ROL: Record<Rol, 'inferior' | 'superior'> = {
  defensor: 'inferior',
  atacante: 'superior',
}

export type MarcaEstado =
  | 'empeñada'
  | 'retrocedida'
  | 'avanzada'
  | 'ha_disparado'
  | 'ha_cargado'
  | 'en_reserva'
  | 'destruida'

export const MARCAS_ESTADO: MarcaEstado[] = [
  'empeñada',
  'retrocedida',
  'avanzada',
  'ha_disparado',
  'ha_cargado',
  'en_reserva',
  'destruida',
]

export interface UnidadEnMesa {
  /** Identificador de esta instancia — permite dos escuadras de la misma unidad. */
  instanciaId: string
  /** Id de la unidad en UNIDADES de su facción. */
  unidadId: string
  faccionId: string
  bando: Lado
  /** Centro del pelotón. */
  pos: Punto
  /** Huella aproximada; se deriva del número de miniaturas. */
  radio: Pulgadas
  /** Miniaturas todavía en pie. */
  miniaturas: number
  /** Tamaño de la escuadra al desplegar. Es la referencia para medir el desgaste. */
  miniaturasIniciales?: number
  /**
   * Heridas que le quedan a la miniatura que está recibiendo el daño; las demás
   * están intactas. El total de la unidad se deriva en `src/engine/heridas.ts`.
   * Si falta, se asume que esa miniatura está a plena salud.
   */
  heridasRestantes?: number
  marcas: MarcaEstado[]
  /** instanciaId de la unidad a la que va adjunta. */
  adjuntoA?: string
}

/** Nomenclatura oficial de 11ª según la ubicación del objetivo. */
export type TipoObjetivo = 'local' | 'central' | 'expansion'

export const NOMBRE_TIPO_OBJETIVO: Record<TipoObjetivo, string> = {
  local: 'Objetivo local',
  central: 'Objetivo central',
  expansion: 'Objetivo de expansión',
}

export interface ObjetivoMesa {
  id: string
  pos: Punto
  tipo: TipoObjetivo
  /** Solo para objetivos `local`: de qué rol es la zona que lo contiene. */
  deRol?: Rol
}

/** Zona de despliegue como polígono en pulgadas: cubre bandas, rectángulos,
 *  formas escalonadas en L y mitades diagonales sin necesitar un tipo por forma. */
export interface ZonaDespliegue {
  rol: Rol
  poligono: Punto[]
}

// ─── Terreno ──────────────────────────────────────────────────────────────────

/** Formas del set fijo de 11ª. El catálogo con sus medidas está en
 *  `src/data/tablero/footprints.ts`. */
export type FootprintId =
  | 'rect-grande'
  | 'triangulo-grande'
  | 'rect-mediano'
  | 'linea-larga'
  | 'linea-corta'

/** El terreno denso (verde en los diagramas) obstruye la línea de visión; el
 *  ligero (amarillo) no. */
export type Densidad = 'denso' | 'ligero'

/** Pieza colocada sobre la mesa. Es la fuente de verdad del terreno. */
export interface PiezaTerreno {
  /** Marca del componente en el set Armageddon: 'AB', 'CD', 'EF', 'GH'… */
  id: string
  footprint: FootprintId
  /** Esquina de anclaje sobre la mesa, en pulgadas. */
  ancla: Punto
  /** Grados en sentido antihorario. Los diseños B y C usan ángulos libres. */
  rotacion: number
  /** Refleja la forma antes de rotar. Solo relevante en los triángulos. */
  reflejada?: boolean
  densidad: Densidad
  /**
   * Piezas con el mismo `areaId` cuentan como un ÁREA DE TERRENO ÚNICA (ojo
   * abierto en el diagrama). Con `areaId` distinto son ÁREAS SEPARADAS (ojo
   * tachado), aunque se toquen.
   */
  areaId: string
}

/**
 * Pieza ya resuelta a geometría — es lo que consume el motor. Se deriva de las
 * `PiezaTerreno` con `terrenoDePiezas()`; el motor no sabe nada del catálogo.
 */
export interface Terreno {
  id: string
  poligono: Punto[]
  /** El terreno denso obstruye; el ligero no. */
  bloqueaLdV: boolean
  daCobertura: boolean
  /** Piezas con el mismo valor forman un área de terreno única. */
  areaId?: string
}

export interface EntradaBitacora {
  ronda: number
  lado: Lado
  resumen: string
}

export interface EstadoTablero {
  ronda: number
  fase: Fase
  turnoDe: Lado
  /** Rol que juegas tú; el oponente toma el opuesto. Determina qué zona es tuya. */
  rolPropio: Rol
  unidades: UnidadEnMesa[]
  objetivos: ObjetivoMesa[]
  zonas: ZonaDespliegue[]
  /**
   * Fuente de verdad del terreno: footprint + ancla + rotación. La geometría
   * (`Terreno[]`) se deriva con `terrenoDePiezas()` en cada render, para que
   * mover una pieza no requiera mantener dos representaciones sincronizadas.
   */
  piezas: PiezaTerreno[]
  pm: Record<Lado, number>
  pv: Record<Lado, number>
  secundariasActivas: Record<Lado, string[]>
  bitacora: EntradaBitacora[]
}

// ─── Informe táctico (lo único que ve el asistente) ───────────────────────────

export interface UnidadInforme {
  id: string
  nombre: string
  bando: Lado
  pts: number
  stats: Stats
  rolIA?: RolIA
  palabrasClave: string[]
  miniaturas: number
  /** Heridas de la miniatura que está recibiendo el daño. */
  heridasRestantes?: number
  /** Heridas que le quedan a la unidad entera. */
  heridasTotales: number
  /** Las que aguantaría a plena potencia, para leer el desgaste de un vistazo. */
  heridasMaximas: number
  pos: Punto
  marcas: MarcaEstado[]
  enCobertura: boolean
}

export interface ObjetivoInforme {
  id: string
  pos: Punto
  ocPropio: number
  ocOponente: number
  controlaA: Lado | null
  unidadesEn3: string[]
}

export interface ParDistancia {
  a: string
  b: string
  pulgadas: number
  ldv: boolean
}

export interface Amenaza {
  atacante: string
  arma: string
  blanco: string
  alcance: number
  distancia: number
  enRango: boolean
  puedeCargar: boolean
}

export interface InformeTactico {
  ronda: number
  fase: Fase
  turnoDe: Lado
  marcador: { pv: Record<Lado, number>; pm: Record<Lado, number> }
  secundarias: Record<Lado, string[]>
  unidades: UnidadInforme[]
  objetivos: ObjetivoInforme[]
  distancias: ParDistancia[]
  amenazas: Amenaza[]
  bitacora: string[]
}
