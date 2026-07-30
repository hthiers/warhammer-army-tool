type DescFn = (valor: string) => string
type Desc = string | DescFn

// ─── Habilidades (sección 24 del reglamento, 11ª edición) ─────────────────────
//
// El reglamento distingue dos familias:
//
//   · HABILIDADES DE ARMA — van entre corchetes en el perfil del arma, p. ej.
//     [ÁREA]. Se declaran en `ArmaDistancia.especial` / `ArmaCombate.especial`.
//   · HABILIDADES BÁSICAS — van en la hoja de datos de la unidad, sin corchetes.
//
// El número entre paréntesis en cada comentario es la referencia de la sección,
// por si hay que volver al PDF.
//
// Nota sobre 11ª: buena parte de estas habilidades se replantearon en torno a los
// conceptos de IMPACTO CRÍTICO y HERIDA CRÍTICA, en lugar de hablar de "tiradas
// no modificadas de 6". No es equivalente: una regla puede cambiar qué resultado
// cuenta como crítico, y las habilidades siguen ese resultado, no el 6 literal.

export const REGLAS_ESPECIALES: Record<string, Desc> = {
  // [ANTI X Y+] (24.03)
  Anti: x =>
    `Si la unidad blanco tiene la clave indicada, toda tirada para herir de ${x.split(' ').pop() || 'Y+'} sin modificar es una HERIDA CRÍTICA.`,
  Antiinfantería: x =>
    `Contra unidades INFANTERÍA, toda tirada para herir de ${x} sin modificar es una HERIDA CRÍTICA.`,
  Antivehículo: x =>
    `Contra unidades VEHÍCULO, toda tirada para herir de ${x} sin modificar es una HERIDA CRÍTICA.`,

  // [ASALTO] (24.04)
  Asalto: 'Las unidades que incluyan alguna miniatura con esta arma pueden disparar usando disparo de asalto, es decir, aunque hayan avanzado.',

  // [ÁREA] (24.05)
  Área: x =>
    `Al reunir dados de ataque, añade ${x || '1'} dado${x && Number(x) > 1 ? 's' : ''} de ataque adicional${x && Number(x) > 1 ? 'es' : ''} por cada 5 miniaturas que hubiera en la unidad blanco en el paso de elegir blancos (redondea a la baja).`,

  // [TAJAR X] (24.06)
  Tajar: x =>
    `Si eliges un único blanco para todos los ataques de esta arma, al reunir dados de ataque añade ${x} dados de ataque adicionales por cada 5 miniaturas que hubiera en la unidad blanco en el paso de elegir blancos (redondea a la baja).`,

  // [A QUEMARROPA] (24.07)
  'A Quemarropa':
    'Permite disparar usando disparo a quemarropa, incluso estando trabada. Al hacer otro tipo de disparo, cada miniatura (salvo MONSTRUO/VEHÍCULO) elige o sus armas [A Quemarropa] o sus otras armas a distancia, no ambas.',

  // [HERIDAS DEVASTADORAS] (24.10)
  'Heridas Devastadoras':
    'Cuando un ataque causa HERIDA CRÍTICA, su secuencia de ataque termina y el blanco sufre tantas heridas mortales como el atributo D del arma. Se infligen después del daño normal, dañan un máximo de 1 miniatura por herida crítica, y el resto se pierde.',

  // [ATAQUES ADICIONALES] (24.11)
  'Ataques Adicionales':
    'Al combatir, la miniatura ataca con esta arma ADEMÁS de cualquier otra. En el paso de elegir armas debe elegir todas sus armas [Ataques Adicionales] y, si es posible, 1 del resto de sus armas de combate.',

  // [DE RIESGO] (24.15)
  'De Riesgo':
    'Cuando la unidad se elige para disparar o para combatir, tras resolver todos sus ataques haz tantas tiradas de riesgo como armas [De Riesgo] hubieras elegido en el paso de elegir armas.',

  // [PESADA] (24.16)
  Pesada:
    'En tu fase de disparo, suma 1 a la tirada para impactar si la unidad atacante cumple TODO: no está trabada, no se desplegó en el campo de batalla este turno, y ninguna de sus miniaturas ha movido más de 3" este turno.',

  // [IGNORA COBERTURA] (24.18)
  'Ignora Cobertura':
    'El blanco no se beneficia de cobertura contra este ataque, ni de reglas que hagan que se beneficie de cobertura (por ejemplo Sigilo).',

  // [INDIRECTA] (24.19)
  Indirecta:
    'Las unidades que incluyan alguna miniatura con esta arma pueden disparar usando disparo indirecto, es decir, a blancos que no ven.',

  // [LANZA] (24.21)
  Lanza:
    'Si la unidad de la miniatura atacante hizo un movimiento de carga en este turno, suma 1 a las tiradas para herir.',

  // [IMPACTOS LETALES] (24.23)
  'Impactos Letales':
    'Cuando un ataque resulta en IMPACTO CRÍTICO, puedes elegir que hiera automáticamente al blanco. Al elegirlo no se hace tirada para herir, así que ese ataque no puede producir heridas críticas ni activar [Heridas Devastadoras].',

  // [FUSIÓN X] (24.25)
  Fusión: x =>
    `Si la unidad blanco estaba a la mitad o menos del alcance del arma en el paso de elegir blancos, suma ${x} al atributo D del arma hasta resolver los ataques de la unidad atacante.`,

  // [DISPARO ÚNICO] (24.26)
  'Disparo Único':
    'Solo puede elegirse para atacar una vez por batalla. Si una miniatura eliminada vuelve a la unidad, sus armas [Disparo Único] ya usadas no se pueden volver a elegir.',

  // [PISTOLA] (24.27) — término heredado, se sustituye por [A QUEMARROPA]
  Pistola:
    'Idéntica a [A Quemarropa] a todos los efectos de reglas. Es el término heredado: el reglamento lo irá sustituyendo por [A Quemarropa] a medida que avance la edición.',

  // [PRECISIÓN] (24.28)
  Precisión:
    'Al inicio del paso de orden de asignación, si la unidad blanco incluye miniaturas PERSONAJE visibles para la atacante, el jugador activo puede elegir un grupo de asignación que las incluya. Ese grupo pasa a ser el grupo de asignación en curso.',

  // [PSÍQUICA] (24.29)
  Psíquica:
    'Puedes ignorar cualquier modificador (o todos) al atributo HP o HA del ataque y a la tirada para impactar. Los ataques con estas armas se llaman ataques psíquicos, lo que activa otras reglas.',

  // [FUEGO RÁPIDO X] (24.30)
  'Fuego Rápido': x =>
    `Al reunir dados de ataque, añade ${x} dados de ataque adicionales si la unidad blanco estaba a la mitad o menos del alcance del arma en el paso de elegir blancos.`,

  // [GOLPES SOSTENIDOS X] (24.36)
  'Golpes Sostenidos': x =>
    `Cuando un ataque resulta en IMPACTO CRÍTICO, causa ${x} impacto${Number(x) > 1 ? 's' : ''} adicional${Number(x) > 1 ? 'es' : ''} al blanco.`,

  // [RÁFAGA] (24.37)
  Ráfaga: 'El ataque impacta automáticamente al blanco: no se hace tirada para impactar.',

  // [ACOPLADA] (24.38)
  Acoplada: 'Puedes repetir las tiradas para herir de esta arma.',
}

/**
 * Habilidades básicas de unidad (sección 24). Van en la hoja de datos, sin
 * corchetes, y no se declaran en el perfil de un arma — por eso viven aparte de
 * `REGLAS_ESPECIALES`, que solo indexa habilidades de arma.
 */
export const HABILIDADES_UNIDAD: Record<string, Desc> = {
  // 24.08
  'Final Violento': x =>
    `Siempre que una miniatura de esta unidad resulte eliminada, tras los movimientos de desembarco de emergencia tira 1D6: con un 6, cada unidad a 6" o menos de esa miniatura sufre ${x || 'X'} heridas mortales.`,

  // 24.09
  'Despliegue Rápido':
    'Al hacer un movimiento de inserción, si toda miniatura de la unidad tiene esta habilidad, se puede desplegar en cualquier punto del campo de batalla a más de 8" en horizontal de toda unidad enemiga, aunque esté dentro de la zona de despliegue del oponente.',

  // 24.12
  'No Hay Dolor': x =>
    `Siempre que una miniatura con esta habilidad vaya a perder una herida, tira 1D6: con ${x} esa herida no se pierde.`,

  // 24.13
  'Combatir Primero':
    'Mientras todas las miniaturas de la unidad tengan esta habilidad, la unidad es una unidad Combatir primero y resuelve sus combates antes en la fase de Combate.',

  // 24.14
  'Cubierta de Disparo': x =>
    `En tu fase de disparo, cuando este TRANSPORTE se elija para disparar, hasta ${x} miniaturas embarcadas eligen 1 de sus armas a distancia (salvo [Disparo Único]) y disparan además de las armas del transporte. Al final del turno, las unidades embarcadas ya no son aptas para disparar.`,

  // 24.17
  Planeador: 'Siempre que esta unidad alza el vuelo, no restes 2" a la distancia máxima.',

  // 24.20
  Infiltradores:
    'Al desplegar, si toda miniatura de la unidad tiene esta habilidad, se puede desplegar en cualquier punto del campo de batalla a más de 8" en horizontal de la zona de despliegue del oponente y de toda unidad enemiga.',

  // 24.21
  Líder: 'Este PERSONAJE puede adjuntarse a las unidades indicadas y formar con ellas una unidad adjunta.',

  // 24.24
  'Agente Solitario': x =>
    `Si no forma parte de una unidad adjunta, esta unidad no es visible para miniaturas enemigas a más de ${x || '12'}" de ella, y no puede tomarse como blanco de armas [Indirecta] si la atacante está a más de esa distancia.`,

  // 24.31
  Avanzadilla: x =>
    `En el paso de resolver habilidades prebatalla, si toda miniatura de la unidad tiene esta habilidad, puedes: desplegarla desde reservas estratégicas en cualquier punto de tu zona de despliegue; o hacer un movimiento de avanzadilla de hasta ${x}"; o hacer ese movimiento con su TRANSPORTE DEDICADO si también la tiene.`,

  // 24.32
  'Movimiento de Avanzadilla':
    'Movimiento de hasta X" (según Avanzadilla X"), disponible para unidades completamente en tu zona de despliegue durante el paso de resolver habilidades prebatalla. Tras mover, la unidad debe estar a más de 9" en horizontal de toda unidad enemiga.',

  // 24.33
  Sigilo:
    'Si todas las miniaturas de la unidad tienen esta habilidad, siempre que la unidad sea blanco de un ataque a distancia se beneficia de cobertura contra ese ataque.',

  // 24.34
  Apoyo: 'Este PERSONAJE puede asignarse a escuadras de primera línea para reforzar su eficacia, como parte de una unidad adjunta.',

  // 24.35
  'Bípode Superpesado':
    'Al hacer un movimiento normal, de avanzar o de retroceder, sus miniaturas pueden atravesar miniaturas MONSTRUO/VEHÍCULO (no TITÁNICA) y secciones de terreno de 4" o menos de altura. Antes de mover puedes darle la clave MÓVIL hasta terminar el movimiento; si lo haces, tira 1D6 al acabar: con un 1 la unidad queda acobardada.',
}

/**
 * Nombres alternativos con los que aparece una misma habilidad, sea en el
 * reglamento en prosa o en los perfiles de arma. La clave es el nombre CANÓNICO
 * —el id citable— y el valor las variantes que hay que aceptar.
 *
 * Fuente única: la consumen `buscarRegla()` para la UI y el corpus del asistente,
 * que antes llevaba su propia copia y podía desincronizarse.
 */
export const ALIAS_REGLAS: Record<string, string[]> = {
  // [PISTOLA] (24.27) es el término heredado; el reglamento lo sustituye por
  // [A QUEMARROPA] a medida que avanza la edición.
  'A Quemarropa': ['Pistola'],
  // Nombres de 10ª que aún aparecen en los perfiles de arma de este proyecto.
  Ráfaga: ['Torrente'],
  Fusión: ['Melta'],
}

/** Nombre canónico de una etiqueta, si es una variante conocida. */
export function canonizarRegla(etiqueta: string): string {
  const norm = etiqueta.trim().toLowerCase()
  for (const [canonico, variantes] of Object.entries(ALIAS_REGLAS)) {
    for (const v of variantes) {
      const vn = v.toLowerCase()
      if (norm === vn) return canonico
      if (norm.startsWith(`${vn} `)) return `${canonico}${etiqueta.trim().slice(v.length)}`
    }
  }
  return etiqueta.trim()
}

/**
 * Busca la descripción de una etiqueta, admitiendo el parámetro pegado al nombre
 * («Fuego Rápido 1», «No Hay Dolor 4+») y los nombres alternativos («Melta 4»).
 * Consulta primero las habilidades de arma y luego las de unidad.
 */
export function buscarRegla(texto: string): { desc: string } | null {
  const textNorm = canonizarRegla(texto)

  for (const tabla of [REGLAS_ESPECIALES, HABILIDADES_UNIDAD]) {
    const exacta = tabla[textNorm]
    if (exacta) {
      return { desc: typeof exacta === 'function' ? exacta('') : exacta }
    }
  }

  // Coincidencia por prefijo, del nombre más largo al más corto, para que
  // «Antiinfantería 4+» no caiga en «Anti».
  const entradas = [
    ...Object.entries(REGLAS_ESPECIALES),
    ...Object.entries(HABILIDADES_UNIDAD),
  ].sort(([a], [b]) => b.length - a.length)

  for (const [clave, entrada] of entradas) {
    if (textNorm.toLowerCase().startsWith(clave.toLowerCase())) {
      const valor = textNorm.slice(clave.length).trim()
      return { desc: typeof entrada === 'function' ? entrada(valor) : entrada }
    }
  }

  return null
}
