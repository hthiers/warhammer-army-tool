# Asistente IA para juego en solitario — Diseño técnico y plan de implementación

> Estado: propuesta. No implementado.
> Última actualización: 2026-07-29

## Problema

La herramienta actual tiene un motor de sugerencias para el ejército oponente basado en
tablas de dados (`src/data/ia/necrones.ts`, `src/components/AIOpponent/AIOpponent.tsx`).
El motor dice cosas como *"mueve hacia el objetivo de misión más cercano que no controle
el ejército Necrón"*, pero es el jugador quien tiene que resolver mentalmente **qué**
unidad, **cuál** objetivo, si hay línea de visión y a qué distancia.

El cuello de botella no es la inteligencia: es que el sistema no sabe dónde está nada.
El objetivo de este proyecto es cerrar esa brecha.

## Decisiones de diseño

Tres decisiones cargan con todo el diseño:

1. **El estado del tablero entra por un mini-mapa 2D táctil, no por fotografía.**
   Arrastrar una ficha sobre el layout es más rápido y mucho más confiable que
   cualquier visión por computador, y entrega distancias exactas gratis. La foto es la
   solución intuitiva; el mini-mapa es la correcta.

2. **La geometría la calcula el código, nunca el modelo.**
   Con ~20 unidades en mesa el navegador puede precalcular todas las distancias, líneas
   de visión y rangos de arma *antes* de llamar al modelo, e incluirlas en el prompt como
   hechos. Esto elimina el riesgo de alucinación geométrica, elimina el round-trip de
   herramientas y baja la latencia a una sola llamada. El modelo decide; nunca mide.

3. **El SDK de Anthropic vive en un Worker, no en el navegador.**
   El bundle del cliente sigue sin dependencias nuevas y la API key nunca sale del
   servidor. El browser solo hace `fetch`.

## Arquitectura

```
┌─────────────────────── Navegador (sin deps nuevas) ────────────────────┐
│                                                                        │
│  Tablero2D ──► EstadoTablero ──► engine/geometria.ts (determinista)    │
│  (arrastrar)      (localStorage)          │                            │
│                                           ▼                            │
│                                  engine/informe.ts                     │
│                          (hechos derivados: distancias, LdV,           │
│                           control de objetivos, amenazas)              │
│                                           │                            │
│                                     fetch POST                         │
└───────────────────────────────────────────┼────────────────────────────┘
                                            ▼
                          ┌─────────── Cloudflare Worker ───────────┐
                          │  @anthropic-ai/sdk + ANTHROPIC_API_KEY  │
                          │  prompt cache (corpus estático, TTL 1h) │
                          └──────────────────┬──────────────────────┘
                                             ▼
                                   Claude Sonnet 5 → JSON tipado
```

---

## 1. Modelo de estado

Archivo nuevo. No toca los tipos existentes en `src/types/index.ts`.

```ts
// src/types/tablero.ts
export type Pulgadas = number
export type Lado = 'propio' | 'oponente'
export type Rol = 'atacante' | 'defensor'
export type Fase = 'mando' | 'movimiento' | 'disparo' | 'carga' | 'combate' | 'final'

/**
 * Origen (0,0) = esquina inferior izquierda, y creciendo hacia arriba.
 * Mesa de 44" de ancho × 60" de alto — la orientación de los diagramas oficiales
 * de layout, con el DEFENSOR en el borde inferior y el ATACANTE en el superior.
 * El despliegue ocurre en los bordes de 44".
 */
export interface Punto { x: Pulgadas; y: Pulgadas }

export type MarcaEstado =
  | 'empeñada' | 'replegada' | 'avanzada' | 'ha_disparado'
  | 'ha_cargado' | 'en_reserva' | 'destruida'

export interface UnidadEnMesa {
  instanciaId: string          // uuid — permite dos escuadras del mismo tipo
  unidadId: string             // → UNIDADES de la facción
  bando: Lado
  pos: Punto                   // centro del pelotón
  radio: Pulgadas              // huella aproximada, derivada del nº de miniaturas
  miniaturas: number
  heridasRestantes?: number    // solo personajes / vehículos
  marcas: MarcaEstado[]
  adjuntoA?: string            // instanciaId de la unidad que lidera
}

export type TipoObjetivo = 'hogar' | 'centro' | 'tierra-de-nadie'

export interface ObjetivoMesa {
  id: string
  pos: Punto
  tipo: TipoObjetivo
  deRol?: Rol            // solo para objetivos de hogar
}

/** Zona de despliegue como polígono: cubre bandas, L escalonadas y diagonales. */
export interface ZonaDespliegue {
  rol: Rol
  poligono: Punto[]
}

/** El terreno de 11ª es un set fijo de 5 formas — ver «Footprints» más abajo. */
export type FootprintId =
  | 'rect-grande' | 'triangulo-grande' | 'rect-mediano' | 'linea-larga' | 'linea-corta'

/** Denso (verde en los diagramas) obstruye la LdV; ligero (amarillo) no. */
export type Densidad = 'denso' | 'ligero'

/** Pieza colocada: fuente de verdad del terreno. */
export interface PiezaTerreno {
  id: string                     // marca del set Armageddon: 'AB', 'CD'…
  footprint: FootprintId
  ancla: Punto                   // esquina de referencia, no el centro
  rotacion: number               // grados antihorario, libres
  reflejada?: boolean            // solo relevante en los triángulos
  densidad: Densidad
  areaId: string                 // mismo valor = área de terreno única
}

/** Pieza resuelta a geometría — lo que consume el motor. Se deriva con
 *  `terrenoDePiezas()`; el motor no sabe nada del catálogo de footprints. */
export interface Terreno {
  id: string
  poligono: Punto[]
  bloqueaLdV: boolean
  daCobertura: boolean
  areaId?: string
}

export interface EntradaBitacora { ronda: number; lado: Lado; resumen: string }

export interface EstadoTablero {
  ronda: number
  fase: Fase
  turnoDe: Lado
  rolPropio: Rol                // el oponente toma el rol opuesto
  unidades: UnidadEnMesa[]
  objetivos: ObjetivoMesa[]
  zonas: ZonaDespliegue[]
  piezas: PiezaTerreno[]        // el `Terreno[]` se deriva en cada render
  pm: Record<Lado, number>
  pv: Record<Lado, number>
  secundariasActivas: Record<Lado, string[]>
  bitacora: EntradaBitacora[]   // memoria táctica entre turnos
}
```

Se persiste bajo la clave `wh40k-tablero`, junto al `wh40k-partida-actual` que ya usa
`PartidaTracker.tsx`. El guardado lleva un número de versión: cuando un cambio de
modelo invalida el formato anterior se sube la versión y el estado viejo se descarta
en vez de cargarse a medias.

### Layouts de mesa

`src/data/tablero/layouts.ts` guarda la geometría por layout —zonas de despliegue,
objetivos y terreno— separada de `src/data/misiones/layouts.ts`, que solo resuelve
el *número* de layout a partir del par de disposiciones.

Hay 15 emparejamientos únicos × 3 diseños = **45 layouts**. Se cargan de a poco; los
que no tienen datos degradan a mesa vacía con zonas genéricas de 12", líneas de
centro y rejilla.

Las zonas se construyen con `zonaEscalones(borde, tramos[])`, que acepta cualquier
perfil de tramos contiguos. `zonaBanda` (1 tramo) y `zonaEscalonada` (2 tramos) son
envoltorios de una línea sobre él. Para layouts espejo se define solo una zona y un
miembro de cada par de objetivos; el resto sale de `rotar180()` / `espejo()`.

### Footprints

El terreno de 11ª no son polígonos libres: es un set fijo que todos los mapas
reutilizan, colocando las mismas **16 piezas** en distinta posición y rotación. Los
componentes corresponden al set «Campos de batalla: Armageddon», y las letras de los
diagramas (AB, CD, EF, GH…) son sus marcas.

| Cantidad | Footprint | Tamaño |
|---|---|---|
| 4 | Rectángulo grande | 7" × 11,5" |
| 2 | Triángulo rectángulo grande | 8" × 11,5" |
| 4 | Rectángulo mediano | 6" × 4" |
| 2 | Línea larga | 10" × 2,5" |
| 4 | Línea corta | 6" × 2" |

Cada footprint se define con el origen en una **esquina**, no en su centro, porque las
cotas de los diagramas oficiales van de esquina de footprint a borde de mesa. Dos
triángulos unidos por la hipotenusa forman un rectángulo de 8" × 11,5".

`validarComposicion()` comprueba que un layout use exactamente ese set, y el panel del
tablero muestra los desajustes por forma. Con 45 layouts que cargar, eso convierte un
error de omisión en algo visible al instante.

Los layouts simétricos se declaran como **8 pares** y `expandirPares()` genera los
espejos con `piezaEspejo()` — la simetría queda garantizada por construcción, no por
que dos listas de números coincidan.

### Editor de terreno

La pestaña Tablero permite seleccionar una pieza, arrastrarla, rotarla, cambiar su
densidad y reflejarla. **Exportar layout** serializa las piezas actuales como
TypeScript pegable en `layouts.ts` — el bucle se cierra corrigiendo visualmente y
devolviendo el resultado al código como dato, sin transcribir coordenadas a mano.

La exportación detecta la simetría (con tolerancia de 0,4", porque el arrastre a mano
no acierta décimas de pulgada) y emite `expandirPares([…])` con 8 entradas cuando el
layout es simétrico. La sección **Simetría** del panel lista las parejas cuyo espejo no
calza y ofrece `Simetrizar`, que las snapea al espejo exacto.

> Cuidado: `Simetrizar` empareja **por id**. Si dos etiquetas están cruzadas (p. ej.
> `GH'` ocupando el sitio de `IJ'`), mueve las piezas para que coincidan con sus
> nombres en vez de renombrarlas. El resultado geométrico es el mismo layout, pero
> conviene saberlo al revisar un export.

Los objetivos habituales son **5**: uno al centro exacto de la mesa y dos pares
simétricos a 180° (hogar y tierra de nadie).

---

## 2. Capa determinista

```ts
// src/engine/geometria.ts — funciones puras, sin React
export function distancia(a: UnidadEnMesa, b: UnidadEnMesa): Pulgadas
  // hipotenusa entre centros − radio_a − radio_b, con piso en 0

export function lineaDeVision(a: UnidadEnMesa, b: UnidadEnMesa, terreno: Terreno[]): boolean
  // segmento centro-centro vs. polígonos con bloqueaLdV

export function enCobertura(u: UnidadEnMesa, terreno: Terreno[]): boolean

export function controlObjetivo(obj: ObjetivoMesa, unidades: UnidadEnMesa[]): {
  propio: number; oponente: number; controlaA: Lado | null
}  // suma OC de unidades dentro de 3"

export function alcanceArma(rango: string): Pulgadas | 'combate'
  // parsea "24\"" / "Combate" desde ArmaDistancia.rango

export function enZonaDespliegue(u: UnidadEnMesa, zona: ZonaDespliegue): boolean
export function zonaDe(u: UnidadEnMesa, zonas: ZonaDespliegue[]): Rol | null
  // null = la unidad está en tierra de nadie
```

**Sobre la aproximación de huella circular:** es exactamente la que hace un jugador
midiendo desde la peana más cercana. No busques precisión de milímetro; busca que no se
contradiga con la cinta métrica sobre la mesa.

Estas funciones sirven **también** al motor D6 actual: *"el objetivo más cercano que no
controle el ejército Necrón"* pasa de ser una instrucción que resuelve el jugador a una
que resuelve el código.

---

## 3. Informe táctico

Es lo único que ve el modelo sobre el estado de la partida.

```ts
// src/engine/informe.ts
export interface InformeTactico {
  ronda: number
  fase: Fase
  turnoDe: Lado
  marcador: { pv: Record<Lado, number>; pm: Record<Lado, number> }
  mision: { primaria: string; secundarias: Record<Lado, string[]> }

  unidades: {
    id: string; nombre: string; bando: Lado; pts: number
    stats: Stats; rolIA?: RolIA; palabrasClave: string[]
    miniaturas: number; heridasRestantes?: number
    pos: Punto; marcas: MarcaEstado[]
    enCobertura: boolean
  }[]

  objetivos: {
    id: string; pos: Punto
    ocPropio: number; ocOponente: number; controlaA: Lado | null
    unidadesEn3: string[]
  }[]

  /** Solo pares relevantes: ≤ 36" o con LdV. Evita una matriz N² inútil. */
  distancias: { a: string; b: string; pulgadas: number; ldv: boolean }[]

  /** El cálculo que el modelo NO puede hacer y más necesita. */
  amenazas: {
    atacante: string; arma: string; blanco: string
    alcance: number; distancia: number
    enRango: boolean; puedeCargar: boolean
  }[]

  bitacora: string[]   // últimas 2-3 rondas, en prosa breve
}
```

`amenazas` es la pieza que hace que todo funcione. Es una tabla precalculada de "quién
puede alcanzar a quién con qué", y convierte una pregunta geométrica en una pregunta
táctica.

---

## 4. Capa LLM

### Elección de modelo

**Un solo modelo para los tres agentes: `claude-sonnet-5`.** La diferenciación va por
`effort`, no por modelo.

El motivo es concreto: **los prompt caches están scopeados al modelo.** Si el Árbitro
corriera en Sonnet 5 y el Táctico en Opus 5, se pagarían *dos* escrituras del corpus de
~40k tokens por hora en vez de una, lo que se come cualquier ahorro de mezclar.

`claude-opus-5` se mantiene como escalamiento del Táctico si tras 2–3 partidas se observan
jugadas malas. Es una constante en el Worker: cambiarlo es una línea.

| Agente | Cuándo corre | `effort` |
|---|---|---|
| **Árbitro** | Bajo demanda ("¿puedo hacer esto?") | `medium` |
| **Táctico** | Al inicio de cada fase del turno oponente | `xhigh` |
| **Comandante** | 1× por ronda, fase de mando | `low` |

Nota de calibración: en Sonnet 5, `medium` rinde aproximadamente como Sonnet 4.6 en
`high`. No trasladar intuiciones de effort de otros modelos — barrer los niveles sobre
partidas reales.

### Worker

```ts
// worker/index.ts
import Anthropic from '@anthropic-ai/sdk'
import { CORPUS_REGLAS } from './corpus'   // build-time: JSON generado desde src/data/

const MODELO = 'claude-sonnet-5'

const EFFORT_POR_AGENTE = {
  arbitro: 'medium',
  tactico: 'xhigh',
  comandante: 'low',
} as const

const ESQUEMA_PLAN = {
  type: 'object',
  additionalProperties: false,
  required: ['intencion', 'acciones', 'justificacion'],
  properties: {
    intencion: { type: 'string', description: 'Objetivo del turno en una frase' },
    acciones: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['unidadId', 'tipo', 'descripcion'],
        properties: {
          unidadId: { type: 'string' },
          tipo: {
            type: 'string',
            enum: ['mover', 'avanzar', 'disparar', 'cargar', 'combatir',
                   'replegar', 'mantener', 'estratagema', 'accion'],
          },
          destino: {
            type: 'object', additionalProperties: false,
            properties: { x: { type: 'number' }, y: { type: 'number' } },
          },
          blancoId: { type: 'string' },
          estratagemaId: { type: 'string' },
          descripcion: { type: 'string' },
          reglasAplicadas: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    justificacion: { type: 'string' },
    dadosRequeridos: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['motivo', 'tipo'],
        properties: { motivo: { type: 'string' }, tipo: { type: 'string' } },
      },
    },
  },
} as const

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { agente, informe } = await req.json()
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

    const respuesta = await client.messages.create({
      model: MODELO,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: EFFORT_POR_AGENTE[agente],
        format: { type: 'json_schema', schema: ESQUEMA_PLAN },
      },
      system: [
        { type: 'text', text: PROMPTS[agente] },
        {
          type: 'text',
          text: CORPUS_REGLAS,                              // ~40k tokens, estático
          cache_control: { type: 'ephemeral', ttl: '1h' },  // cubre una partida entera
        },
      ],
      messages: [{ role: 'user', content: JSON.stringify(informe) }],
    })

    if (respuesta.stop_reason === 'refusal') {
      return Response.json({ error: 'rechazo' }, { status: 422 })
    }
    return Response.json(JSON.parse(respuesta.content[0].text))
  },
}
```

### Puntos técnicos que importan

- **`max_tokens` cubre pensamiento + respuesta.** El pensamiento adaptativo está activo
  al omitir o declarar `thinking`. Si se deja corto, el JSON se trunca a mitad. 16000 es
  holgado para este tamaño de respuesta.
- **Nada de `temperature` ni `top_p`.** Sonnet 5 y Opus 5 rechazan valores no-default con
  400. La variabilidad se controla por prompt (ver "personalidad de facción").
- **El orden del `system` no es cosmético.** El corpus estático va al final con el
  `cache_control`; el prompt del agente va antes. Cualquier byte que cambie antes del
  breakpoint invalida la caché completa — por eso el estado de partida va en `messages`,
  nunca interpolado en el `system`.
- **Verificar que la caché pegue:** `respuesta.usage.cache_read_input_tokens` debe ser > 0
  desde la segunda llamada. Si es 0 siempre, algo volátil se coló en el prefijo.
- **Manejar `stop_reason: 'refusal'`** antes de leer `content`. Poco probable en este
  dominio, pero `content` puede venir vacío.

### Cliente

```ts
// src/ia/cliente.ts — cero dependencias
export async function pedirPlan(informe: InformeTactico): Promise<PlanTactico> {
  const r = await fetch(`${import.meta.env.VITE_IA_ENDPOINT}/tactico`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ agente: 'tactico', informe }),
  })
  if (!r.ok) throw new ErrorIA(r.status)
  return validarPlan(await r.json())
}
```

`validarPlan` es determinista y corre en el navegador. Comprueba que:

- cada `unidadId` existe en mesa y no está destruida,
- cada `destino` está dentro del alcance de movimiento de esa unidad,
- cada `blancoId` venía marcado `enRango` en el informe,
- hay PM suficientes para las estratagemas propuestas.

**Una acción que no pasa la validación se muestra tachada con el motivo, no se descarta en
silencio.** El contraste entre lo que el modelo propuso y lo que era legal es información
útil para el jugador.

### Personalidad de facción

Como no hay `temperature`, la variabilidad va en el prompt del Táctico, parametrizada:

```
Juegas los Necrones con doctrina de <intención>. Nivel de competencia: <1-5>.
A nivel 3 cometes errores plausibles de un jugador intermedio: sobreextiendes
para tomar un objetivo, gastas PM temprano, priorizas la amenaza visible sobre
la importante. No juegues óptimo salvo a nivel 5.
```

Esto reemplaza el ruido D6 actual con algo mejor: error *caracterizado* en vez de error
aleatorio.

### Build single-file

`vite-plugin-singlefile` produce un `dist/index.html` autónomo. Con Worker se necesita
`VITE_IA_ENDPOINT` como URL absoluta en el build, y CORS habilitado en el Worker. El modo
sin endpoint debe caer al motor D6 actual — eso da un degradado limpio y offline.

---

## 5. UI

- **`Tablero2D`** — SVG de 44" × 60" (`viewBox="0 0 44 60"`, 1 unidad = 1 pulgada).
  Rejilla en dos niveles (1" fina, 6" marcada), líneas de centro, zonas de despliegue,
  objetivos y terreno. Fichas, objetivos y piezas de terreno arrastrables; al
  seleccionar una unidad, anillo de movimiento y regla virtual con distancias y línea
  de visión hacia todo el bando contrario. Incluye el editor de terreno y la
  exportación descritos arriba.

  Se descartó usar el PNG del layout como fondo: las imágenes disponibles no calzan con
  las dimensiones reales, y el sistema de coordenadas es la fuente de verdad.
- **`PanelPlan`** — el plan devuelto, acción por acción, con ✓ aplicar / ✗ vetar /
  ✎ ajustar. Acciones inválidas tachadas con su motivo.
- **`ArbitroModal`** — pregunta libre, respuesta con enlaces a las reglas citadas
  (reutiliza `ReglaBadge` y `ReglasModal`).
- Indicador de estado IA: pensando / offline / cayó al motor D6.

---

## 6. Plan de implementación

| # | Fase | Entregable | Depende de | Estado |
|---|---|---|---|---|
| 1 | **Estado del tablero** | `src/types/tablero.ts`, persistencia versionada | — | ✅ hecho |
| 2 | **Mini-mapa 2D** | `src/components/Tablero/`, arrastrar, regla virtual | 1 | ✅ hecho |
| 3 | **Motor de geometría** | `src/engine/geometria.ts` + `informe.ts` | 1, 2 | ✅ hecho |
| 3b | **Layouts y terreno** | `footprints.ts`, `layouts.ts`, editor + exportación | 3 | 🔶 1 de 45 layouts cargado |
| 4 | **Worker + Árbitro** | `worker/`, corpus build-time, `ArbitroModal` | 3 | ⬜ pendiente |
| 5 | **Táctico** | Esquema del plan, `validarPlan`, `PanelPlan` | 4 | ⬜ pendiente |
| 6 | **Comandante + bitácora** | Intención por ronda, memoria entre turnos | 5 | ⬜ pendiente |
| 7 | **Voz** | Web Speech API → parser → mutaciones de estado | 1 | ⬜ pendiente |

La fase 3b no estaba en el plan original: apareció al descubrir que el terreno de 11ª es
un catálogo fijo de footprints y no polígonos libres. El único layout cargado es el
**1-A (Take & Hold espejo)**; los otros 44 degradan a mesa vacía con zonas genéricas.

### Notas por fase

**Fases 1–3** no tocan la IA en absoluto y ya resuelven la mitad del problema. Si el
proyecto se detuviera ahí, la herramienta igual mejoró mucho.

**Fase 4 (Árbitro) va antes que el Táctico** deliberadamente: es el agente de menor riesgo
(no toma decisiones, solo consulta reglas que ya están en `src/data/`), valida toda la
infraestructura del Worker y la caché, y le sirve al jugador tanto como al oponente.

**Fase 7 (voz)** solo depende de la fase 1 — se puede adelantar. Es el canal correcto
durante una partida porque las manos están ocupadas con las miniaturas.

---

## 7. Costos estimados

Con el corpus cacheado a 1h en Sonnet 5 ($3/$15 por millón; precio introductorio $2/$10
hasta el 2026-08-31):

- Escritura de caché (TTL 1h, 2×): ~40k tokens → **~$0.16–0.24**, una vez por partida.
- Lectura por llamada (0.1×): ~40k tokens → **~$0.008–0.012**.
- ~30 llamadas por partida más los tokens de salida ≈ **$0.60–1 por partida completa**.

Son estimaciones con supuestos sobre el tamaño del corpus y el número de llamadas.
**Medir con `count_tokens` sobre el corpus real y con `usage` en las primeras partidas
antes de darlas por buenas.**

---

## 8. Riesgos

1. **El corpus crece.** Con 4–5 facciones el prefijo cacheado se hincha.
   *Mitigación:* cargar solo las dos facciones en juego. Implementar desde la fase 4, no
   después.

2. **El asistente juega demasiado bien.** Si el oponente juega óptimo siempre, las
   partidas dejan de ser entretenidas.
   *Mitigación:* el parámetro de nivel de competencia es obligatorio, no opcional.
   Empezar en 3.

3. **Desincronización mesa ↔ app.** Es inevitable mover una miniatura y olvidar arrastrar
   la ficha.
   *Mitigación barata:* al inicio de cada ronda, un resumen de una línea por unidad
   ("Guerreros: 6 min, sector centro-izq") que se revisa de un vistazo.

4. **Latencia.** Con `effort: xhigh` y pensamiento adaptativo, una llamada del Táctico
   puede tardar decenas de segundos. Es aceptable una vez por fase; no lo es por unidad.
   *Mitigación:* el Táctico devuelve el plan de la fase completa en una sola llamada.

---

## Anexo: alternativas descartadas

**Motor determinista ampliado (sin LLM).** Escalar las tablas D6 actuales a un árbol de
decisión con estado. Ventajas reales: offline, reproducible, gratis, cero latencia, nunca
inventa una regla. Se descartó porque cada facción nueva exige escribir su árbol a mano y
porque no razona sobre sinergias ni sobre la misión — es el techo que el proyecto ya está
tocando. **Se conserva como fallback offline.**

**Visión por foto de la mesa.** Fotografiar el tablero y pedirle a un modelo de visión que
identifique las miniaturas. Se descartó por confiabilidad: identificar 30 miniaturas
grises por foto no funciona de forma consistente, y las distancias en pulgadas menos.

La variante que sí funcionaría es con marcadores fiduciales (ArUco/AprilTag impresos junto
a cada unidad, más 4 en las esquinas de la mesa, homografía → coordenadas con error <1").
Es determinista y sin costo de inferencia, pero es el mayor esfuerzo de todas las opciones
y obliga a poner marcadores físicos. **Queda como posible fase futura**, no en el alcance
inicial.

Dos usos de foto que sí son costo-efectivos y podrían sumarse más adelante:

- **Terreno al inicio de la partida.** Dónde hay cobertura y qué bloquea LdV es estático
  toda la partida: una sola inferencia poblaría `Terreno[]`.
- **Checkpoint de sincronización.** "¿El estado que tengo coincide con lo que ves?" para
  detectar desincronizaciones gruesas — como verificación, nunca como fuente de verdad.
