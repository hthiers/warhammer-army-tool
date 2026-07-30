# Habilidades — WH40K 11.ª Edición

> Sección 24 del reglamento. Las **habilidades de arma** van entre corchetes en el
> perfil del arma, p. ej. `[ÁREA]`. Las **habilidades básicas** van en la hoja de
> datos de la unidad, sin corchetes.

## Generalidades (24.01)

Muchas unidades tienen habilidades básicas en sus hojas de datos y habilidades de
armas en sus perfiles de armas. Las armas suelen describirse usando una habilidad
concreta que posean: las armas `[ÁREA]` son aquellas con la habilidad `[ÁREA]`.

Si una habilidad de arma va seguida de alguna clave, al atacar con esa arma la
habilidad solo se aplica si la unidad blanco tiene alguna de esas claves. Por
ejemplo, `[IMPACTOS LETALES: VEHÍCULO]` solo se aplica a los ataques que tomen como
blanco unidades VEHÍCULO.

## Habilidades duplicadas (24.02)

Varias apariciones de la misma habilidad básica o de arma **no se acumulan**, con
independencia de los números o claves que incluyan. El jugador que la controla
elige qué aparición se aplica en cada momento; en el caso de habilidades de arma,
esto se elige siempre que la unidad ataque, en el paso de elegir armas.

- Las apariciones múltiples de habilidades básicas que incluyan un número se
  consideran duplicadas aunque ese número varíe. Excepción: con **Avanzadilla** se
  elige el número más bajo que compartan todas las miniaturas de la unidad.
- Las apariciones múltiples de habilidades de arma con número se consideran
  duplicadas aunque el número varíe; se elige cuál aplicar.
- Múltiples apariciones de habilidades de arma que incluyan una clave se consideran
  duplicadas aunque la clave varíe.

---

# Habilidades de arma

## [ANTI X Y+] (24.03)

Siempre que se ataque con un arma `[ANTI]`, si la unidad blanco tiene la clave
indicada por X, toda **tirada para herir** de Y+ sin modificar es una **herida
crítica**.

## Antiinfantería X+ (24.03)

Forma abreviada de `[ANTI INFANTERÍA X+]` tal como aparece en los perfiles de arma de
este proyecto: contra unidades INFANTERÍA, toda tirada para herir de X+ sin modificar
es una **herida crítica**. Es la misma habilidad 24.03, no una distinta.

## Antivehículo X+ (24.03)

Forma abreviada de `[ANTI VEHÍCULO X+]`: contra unidades VEHÍCULO, toda tirada para
herir de X+ sin modificar es una **herida crítica**. Misma habilidad 24.03.

## [ASALTO] (24.04)

Las unidades que incluyan alguna miniatura con un arma `[ASALTO]` pueden disparar
usando **disparo de asalto** (10.05), es decir, aunque hayan avanzado.

## [ÁREA] (24.05)

Siempre que reúnas dados de ataque para un arma `[ÁREA]`, añade 1 dado de ataque
adicional por cada 5 miniaturas que hubiera en la unidad blanco en el paso de elegir
blancos (redondea a la baja).

Si se presenta como `[ÁREA X]`, en su lugar añade X dados de ataque adicionales por
cada 5 miniaturas.

## [TAJAR X] (24.06)

Al reunir dados de ataque para un arma `[TAJAR]`, si elegiste un único blanco para
todos los ataques de esa arma, añade X dados de ataque adicionales por cada 5
miniaturas que hubiera en la unidad blanco en el paso de elegir blancos (redondea a
la baja).

## [A QUEMARROPA] (24.07)

Las unidades que incluyan alguna miniatura equipada con un arma `[A QUEMARROPA]`
pueden disparar usando **disparo a quemarropa** (10.06).

Al realizar otro tipo de disparo, solo se puede elegir para atacar 1 de las
siguientes opciones por cada miniatura de esa unidad (salvo miniaturas
MONSTRUO/VEHÍCULO):

- 1 o más de sus armas `[A QUEMARROPA]`
- 1 o más de sus otras armas a distancia

## [HERIDAS DEVASTADORAS] (24.10)

Cada vez que un ataque de un arma `[HERIDAS DEVASTADORAS]` cause **herida crítica**,
la secuencia de ataque de ese ataque termina y la unidad blanco sufre una cantidad
de heridas mortales igual al atributo D de esa arma. Se infligen después de resolver
cualquier daño normal.

Las heridas mortales infligidas por armas `[HERIDAS DEVASTADORAS]` pueden dañar un
máximo de 1 miniatura por cada herida crítica. Toda herida mortal restante infligida
por ese ataque se pierde.

## [ATAQUES ADICIONALES] (24.11)

Siempre que una unidad que incluya alguna miniatura con un arma `[ATAQUES
ADICIONALES]` combata, esas miniaturas atacarán con esas armas **además** de
cualquier otra. En el paso de elegir armas (04.01), para cada una de esas miniaturas
debes elegir:

- Todas las armas `[ATAQUES ADICIONALES]` de esa miniatura.
- 1 del resto de armas de combate de esa miniatura si es posible.

## [DE RIESGO] (24.15)

Siempre que una unidad se elige para disparar o para combatir, después de que esa
unidad haya resuelto todos sus ataques, haz una cantidad de **tiradas de riesgo**
(06.03) igual al número de armas `[DE RIESGO]` que elegiste en el paso de elegir
armas.

## [PESADA] (24.16)

En tu fase de disparo, siempre que se ataque con un arma `[PESADA]`, suma 1 a la
tirada para impactar si la unidad atacante cumple **todas** estas condiciones:

- Esa unidad no está trabada.
- Esa unidad no se desplegó en el campo de batalla en este turno.
- Ninguna miniatura de esa unidad ha movido más de 3" en este turno.

## [IGNORA COBERTURA] (24.18)

Siempre que se ataque con un arma `[IGNORA COBERTURA]`, el blanco no se beneficia de
cobertura contra ese ataque (13.08), ni de reglas que hagan que una miniatura o
unidad se beneficie de cobertura (p. ej., **Sigilo**).

## [INDIRECTA] (24.19)

Las unidades que incluyan alguna miniatura con un arma `[INDIRECTA]` pueden disparar
usando **disparo indirecto** (10.07).

## [LANZA] (24.21)

Siempre que se ataque con un arma `[LANZA]`, si la unidad de la miniatura atacante
hizo un **movimiento de carga** en este turno, suma 1 a las tiradas para herir.

## [IMPACTOS LETALES] (24.23)

Siempre que un ataque con un arma `[IMPACTOS LETALES]` resulte en **impacto
crítico**, puedes elegir que ese ataque hiera automáticamente al blanco.

> **Nota de diseño:** elegir herir automáticamente significa que no se hace tirada
> para herir. Puedes decidir no hacerlo, ya que significa que ese ataque no puede
> hacer heridas críticas y, por tanto, no puede activar otras habilidades como
> `[HERIDAS DEVASTADORAS]`.

## [FUSIÓN X] (24.25)

Siempre que una miniatura ataque con un arma `[FUSIÓN]`, si la unidad blanco estaba a
la mitad o menos del alcance de esa arma en el paso de elegir blancos, suma X al
atributo D de esa arma hasta resolver los ataques de la unidad atacante.

## [DISPARO ÚNICO] (24.26)

Cada arma con esta habilidad solo puede elegirse para atacar con ella **una vez por
batalla**.

Si una miniatura eliminada es devuelta a una unidad, todas sus armas `[DISPARO
ÚNICO]` que ya se hayan elegido para atacar durante la batalla no se pueden elegir
para atacar de nuevo. Si se añade una unidad nueva a un ejército, todas sus armas
`[DISPARO ÚNICO]` se pueden elegir para atacar una vez por batalla.

## [PISTOLA] (24.27)

`[PISTOLA]` y `[A QUEMARROPA]` son **idénticas** a todos los efectos de reglas. Ver
`[A QUEMARROPA]` (24.07).

> **Nota de diseño:** `[PISTOLA]` es una habilidad que ya existe y será sustituida
> por `[A QUEMARROPA]` a medida que esta edición de Warhammer 40,000 progrese. Ambas
> funcionan igual, pero esta última es un término más adecuado.

## [PRECISIÓN] (24.28)

Al resolver ataques con armas `[PRECISIÓN]`, al inicio del paso de orden de
asignación (05.03), si la unidad blanco incluye miniaturas PERSONAJE visibles para la
miniatura atacante, el jugador activo puede elegir un grupo de asignación que incluya
alguna de esas miniaturas PERSONAJE visibles. Si lo hace, hasta que se resuelvan esos
ataques —o hasta que ese grupo con PERSONAJES resulte eliminado, lo que ocurra
antes— ese grupo es el grupo de asignación en curso.

## [PSÍQUICA] (24.29)

Siempre que se ataque con un arma `[PSÍQUICA]`, puedes ignorar cualquier modificador,
o todos ellos, al atributo HP o HA de ese ataque, y cualquier modificador, o todos
ellos, a la tirada para impactar.

Los ataques con armas `[PSÍQUICA]` se llaman **ataques psíquicos**, algo importante
de cara a la activación de otras reglas.

## [FUEGO RÁPIDO X] (24.30)

Siempre que reúnas dados de ataque para un arma `[FUEGO RÁPIDO X]`, añade X dados de
ataque adicionales si la unidad blanco estaba a la mitad o menos del alcance de esa
arma en el paso de elegir blancos.

## [GOLPES SOSTENIDOS X] (24.36)

Siempre que un ataque de un arma `[GOLPES SOSTENIDOS]` resulte en **impacto
crítico**, ese ataque causa una cantidad de impactos adicionales al blanco igual a X.

## [RÁFAGA] (24.37)

Siempre que se ataca con un arma `[RÁFAGA]`, ese ataque **impacta automáticamente**
al blanco.

## [ACOPLADA] (24.38)

Siempre que se ataque con un arma `[ACOPLADA]`, puedes **repetir las tiradas para
herir**.

---

# Habilidades básicas de unidad

## Final violento X (24.08)

Siempre que una miniatura de esta unidad resulte **eliminada**, después de que las
unidades embarcadas en ella (si las hay) hayan hecho sus movimientos de desembarco de
emergencia, tira 1D6. Con un 6, cada unidad a 6" o menos de esa miniatura sufre una
cantidad de heridas mortales indicada por X. Si X es un número aleatorio, tira por
separado para cada unidad a 6" o menos.

## Despliegue rápido (24.09)

Siempre que esta unidad haga un **movimiento de inserción** (20.04), si toda miniatura
de la unidad tiene esta habilidad, se puede desplegar en cualquier punto del campo de
batalla a más de 8" en horizontal de toda unidad enemiga, aunque esté dentro de la
zona de despliegue del oponente.

## No hay dolor X+ (24.12)

Siempre que una miniatura con esta habilidad vaya a perder una herida, tira 1D6: con
X+, esa herida no se pierde.

## Combatir primero (24.13)

Mientras todas las miniaturas de una unidad tengan esta habilidad, esa unidad es una
unidad **Combatir primero**. Ver el paso de resolver combates en la fase de Combate
(12.04).

## Cubierta de disparo X (24.14)

En tu fase de disparo, siempre que este TRANSPORTE se elija para disparar, si hay
alguna unidad embarcada en él, resuelve la secuencia siguiente:

1. Elige hasta X miniaturas embarcadas en este TRANSPORTE (salvo las miniaturas de
   unidades que ya se hayan elegido para disparar en esta fase).
2. Por cada miniatura elegida, elige una de sus armas a distancia (salvo armas
   `[DISPARO ÚNICO]`).
3. Hasta que este TRANSPORTE haya resuelto todos sus ataques, tiene todas esas armas
   elegidas además de sus otras armas.
4. Hasta el final del turno, las unidades embarcadas en este TRANSPORTE **no** son
   aptas para disparar.

## Planeador (24.17)

Siempre que esta unidad **alza el vuelo** (21.03), no restes 2" a la distancia máxima.

## Infiltradores (24.20)

Al desplegar, si toda miniatura de esta unidad tiene esta habilidad, se puede
desplegar en cualquier punto del campo de batalla a más de 8" en horizontal de la zona
de despliegue del oponente y de toda unidad enemiga.

## Líder (24.22)

Los héroes formidables luchan al frente de la batalla. Ver unidades adjuntas (19).

## Agente solitario X" (24.24)

Si no forma parte de una unidad **adjunta**, esta unidad no es **visible** para
miniaturas enemigas a más de 12" de esta unidad, y no puede tomarse como blanco de
armas `[INDIRECTA]` si la miniatura atacante está a más de 12" de esta unidad.

Si la habilidad se presenta como **Agente solitario X"**, se aplica lo mismo usando X"
en lugar de 12".

## Avanzadilla X" (24.31)

En el paso de resolver habilidades prebatalla, si toda miniatura de una unidad tiene
esta habilidad, puedes hacer **1** de las siguientes opciones:

- Si esa unidad está en **reservas estratégicas**, desplegarla en cualquier punto que
  esté completamente en tu zona de despliegue.
- Si esa unidad está completamente en tu zona de despliegue, hacer un **movimiento de
  avanzadilla** (24.32).
- Si esa unidad está embarcada en un TRANSPORTE DEDICADO que está completamente en tu
  zona de despliegue, y si toda miniatura en ese TRANSPORTE DEDICADO tiene
  Avanzadilla, ese TRANSPORTE DEDICADO puede hacer un movimiento de avanzadilla.

## Movimiento de avanzadilla (24.32)

- **Distancia máxima:** las X" de **Avanzadilla X"**.
- **Apta:** unidades completamente en tu zona de despliegue, y solo en el paso de
  resolver habilidades prebatalla.
- **Efecto:** tu unidad mueve como se describe en Movimiento (03).
- **Después de mover:** tu unidad debe estar a más de 9" en horizontal de toda unidad
  enemiga.

## Sigilo (24.33)

Si todas las miniaturas de una unidad tienen esta habilidad, siempre que esa unidad
sea blanco de un ataque a distancia, esa unidad **se beneficia de cobertura** contra
ese ataque (13.08).

## Apoyo (24.34)

Los combatientes especialistas pueden asignarse a escuadras de primera línea para
reforzar su eficacia. Ver unidades adjuntas (19).

## Bípode superpesado (24.35)

Siempre que una unidad con esta habilidad haga un **movimiento normal**, **de
avanzar** o **de retroceder**:

- Las miniaturas de esa unidad pueden atravesar miniaturas MONSTRUO/VEHÍCULO, pero no
  miniaturas TITÁNICA, y pueden atravesar en horizontal secciones de elementos de
  terreno de 4" o menos de altura.
- Antes de mover esa unidad, puedes decidir que todas sus miniaturas tengan la clave
  MÓVIL hasta que termine ese movimiento. Si lo haces, tira 1D6 al terminar ese
  movimiento: con un 1, esa unidad queda **acobardada**.

> **Nota de diseño:** tener la clave MÓVIL durante un movimiento permite atravesar en
> horizontal elementos de terreno denso (13.06).
