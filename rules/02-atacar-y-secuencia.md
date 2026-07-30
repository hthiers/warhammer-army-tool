# Atacar y Secuencia de Ataque — WH40K 11.ª Edición

> Secciones 04 y 05 del reglamento básico

---

## Atacar (04)

Siempre que una unidad dispara o combate, el jugador activo sigue estos pasos:

1. **Elegir armas**
2. **Elegir blancos**
3. **Resolver ataques**

---

### 1. Elegir armas (04.01)

Elige, para cada miniatura de la unidad atacante, con qué armas atacará.

- **Al disparar:** Puedes elegir 1 o más de las armas **a distancia** de la miniatura.
- **Al combatir:** Elige **1 arma de combate** de la miniatura.

> Una miniatura sin armas a distancia no puede realizar ataques a distancia, y una miniatura sin armas de combate no puede realizar ataques de combate.

---

### 2. Elegir blancos (04.02)

Por cada arma elegida:

**Al disparar**, elige 1 unidad enemiga como blanco de esa arma. Si no se indica lo contrario, cada blanco debe:
- Ser **visible** para la miniatura que tiene esa arma (06.01).
- Estar dentro del **alcance** de esa arma.
- **No estar trabada**.

**Al combatir**, elige 1 o más unidades enemigas como blanco de esa arma:
- Cada blanco debe estar **trabada** con la miniatura que tiene esa arma.
- No puedes elegir una cantidad de blancos superior al atributo **A** de esa arma.

> Puedes elegir blancos diferentes para cada arma. Si no puedes elegir un blanco para un arma, o si decides no elegir un blanco para un arma a distancia, la miniatura no atacará con esa arma.

**Armas secundarias [A QUEMARROPA]:** Algunas miniaturas equipan armas [A QUEMARROPA] además de otras armas. Estas pueden ser una excepción a las reglas de esta sección, ya que es posible que no puedas elegir todas sus armas para atacar con ellas.

---

### 3. Resolver ataques (04.03)

Resuelve los ataques siguiendo esta secuencia:

1. **Elegir unidad enemiga:** Elige 1 de las unidades enemigas que se han tomado como blanco de algún arma.
2. **Reunir los dados de ataque:** Elige 1 arma que haya tomado esa unidad como blanco y que aún no haya sido usada para atacar, y reúne una cantidad de D6 igual al atributo **A** de esa arma. Estos son los **dados de ataque**, y cada uno representa un ataque de la miniatura atacante con esa arma.
   - Si varias armas que tomaron esa unidad como blanco realizan **ataques idénticos** (ver abajo) y esas armas aún no han atacado a ese blanco, lo hacen ahora y reúnes también los dados de ataque de esas armas.
3. **Resolver dados de ataque:** Resuelve la secuencia de ataque (05) para todos los dados de ataque que acabas de reunir.
4. **Otros ataques:** Sigue la primera de las siguientes instrucciones que se cumpla:
   - → Si hay armas que han tomado la misma unidad como blanco y que aún no han sido usadas para atacar, vuelve al paso **Reunir datos de ataque**.
   - → Si no, hay armas con ataques sin resolver que tomaron una unidad diferente como blanco, vuelve al paso **Elegir unidad enemiga**.
   - → Si no, si se han usado todas las armas y se han realizado todos sus ataques, esta secuencia termina y los ataques de la unidad atacante se consideran resueltos.

#### Ataques idénticos
Los **ataques idénticos** son los que tienen los mismos atributos HP/HA, F, FP y D, y a los que afectan las mismas habilidades y reglas.

#### Dividir ataques de combate
Al elegir blanco, si eliges más de una unidad como blanco de un arma de combate, divide los ataques de dicha arma entre esas unidades blanco. Para ello, declara cuántos ataques de esa arma se realizarán contra cada unidad (debes declarar al menos 1 ataque por unidad blanco).

---

## Secuencia de Ataque (05)

Siempre que las miniaturas ataquen, sigue la secuencia detallada en esta sección para determinar si infligen daño.

La secuencia tiene **4 pasos**. En cada paso, si se debe tirar más de 1D6, se deben hacer todas las tiradas a la vez.

> **¿Cuándo acaba esta secuencia?** Si un ataque falla o no inflige daño, esta secuencia finaliza para ese ataque. Cuando todos los ataques hayan fallado o infligido daño, la secuencia finaliza y dichos ataques se consideran resueltos.

---

### Paso 1 — Tiradas para impactar (05.01)

Haz una **tirada para impactar** por cada **dado de ataque** tirando 1D6. Comprueba si cada resultado falla o impacta según la **primera** de estas condiciones que se cumpla:

| Resultado | Efecto |
|-----------|--------|
| 1 sin modificar | **FALLO** |
| 6 sin modificar | **IMPACTO CRÍTICO** |
| Igual o mayor que el atributo HP/HA del ataque | **IMPACTO** |
| Cualquier otro resultado | **FALLO** |

> **Impactos críticos:** Los impactos críticos son impactos igualmente, y las **heridas críticas** son heridas igualmente. Además, otras reglas pueden activarse por un impacto crítico o una herida crítica, como **[IMPACTOS LETALES]** y **[HERIDAS DEVASTADORAS]**.

---

### Paso 2 — Tiradas para herir (05.02)

Haz una **tirada para herir** por cada impacto tirando 1D6. Comprueba si cada resultado falla o es una herida según la **primera** de estas condiciones que se cumpla:

| Resultado | Efecto |
|-----------|--------|
| 1 sin modificar | **FALLO** |
| 6 sin modificar | **HERIDA CRÍTICA** |
| Igual o mayor que el resultado requerido (ver tabla) | **HERIDA** |
| Cualquier otro resultado | **FALLO** |

#### Tabla: Fuerza del ataque vs Resistencia del blanco

| Condición | Mínimo requerido |
|-----------|-----------------|
| F es **EL DOBLE (o más del doble)** de la R | 2+ |
| F es **MAYOR** que la R | 3+ |
| F es **IGUAL** a la R | 4+ |
| F es **MENOR** que la R | 5+ |
| F es **LA MITAD (o menos de la mitad)** de la R | 6+ |

---

### Paso 3 — Tiradas de salvación (05.03)

El jugador oponente resuelve esta secuencia:

1. **Crear grupos:** Divide todas las miniaturas de la unidad blanco en los siguientes grupos, tantas veces como sea necesario:
   - 1 grupo por cada miniatura **PERSONAJE**.
   - 1 grupo por todas las demás miniaturas con los mismos atributos **H**, **S** y **S Inv**.

2. **Orden de asignación:** Declara el orden en el que se asignarán los ataques a esos grupos:
   - Si algún grupo que no es PERSONAJE incluye alguna miniatura herida (que haya perdido 1 o más heridas), ese grupo debe ser el primero en el orden de asignación.
   - Ningún grupo PERSONAJE puede ir antes en el orden de asignación que un grupo que no es PERSONAJE.
   - Los grupos PERSONAJE que tengan alguna miniatura herida van antes en el orden de asignación que los grupos PERSONAJE que no incluyan miniaturas heridas.

3. **Realizar tiradas de salvación:** El jugador oponente hace una **tirada de salvación** por cada ataque que haya herido al blanco, tirando 1D6.

#### Comprobar tirada de salvación

Para cada resultado, comprueba si ese ataque inflige daño o falla según la **primera** condición que se cumpla:

| Condición | Efecto |
|-----------|--------|
| 1 sin modificar | **INFLIGE DAÑO** |
| Las miniaturas del grupo tienen S Inv, y el resultado es igual o mayor que dicho atributo | **FALLO** |
| Tras modificar el resultado según el atributo FP del arma atacante, este es igual o mayor que el atributo S de las miniaturas del grupo de asignación en curso | **FALLO** |
| Cualquier otro resultado | **INFLIGE DAÑO** |

> **Ej.:** Un atributo FP de -1 modifica una tirada de salvación de 3 a 2. Para miniaturas con un atributo S de 2+ o mejor, ese ataque falla.

---

### Paso 4 — Infligir daño (05.04)

El oponente sigue esta secuencia para cada **tirada de salvación** que inflige daño, comenzando por el resultado más bajo y terminando por el más alto, hasta resolver todos los ataques o hasta que todas las miniaturas de la unidad blanco sean **eliminadas**.

1. **Elegir miniatura:** Elige 1 miniatura del **grupo de asignación en curso**; debe ser una que haya perdido alguna herida, si es posible.
2. **Comprobar tirada de salvación:** Confirmar que el ataque inflige daño (según el paso 3).
3. **Resolver daño:** Si ese ataque inflige daño, la miniatura elegida pierde una cantidad de heridas igual al atributo **D** de ese ataque. Si esto reduce las heridas restantes de esa miniatura a 0 o menos, resulta **eliminada**.

> **Grupo de asignación en curso:** El primer grupo en el orden de asignación es el grupo en curso. Una vez **eliminadas** todas las miniaturas de un grupo, el siguiente en el orden de asignación se convierte en el grupo en curso.

---

## Conceptos adicionales (06)

### Visibilidad (06.01)
La **línea de visión** se usa para determinar la visibilidad entre miniaturas. Para que una miniatura que observa tenga **línea de visión**, debe ser posible trazar una línea recta imaginaria de 1 mm de ancho desde cualquier parte de esa miniatura hasta cualquier parte de la miniatura observada (ignorando las demás miniaturas de la unidad de la miniatura que observa y de la unidad de la miniatura observada).

- **Miniatura visible:** Si alguna parte de otra miniatura es visible para la miniatura que observa.
- **Miniatura completamente visible:** Si todas las partes de otra miniatura frente a la que observa son visibles para esta.
- **Unidad visible:** Si alguna miniatura de una unidad es visible para la miniatura que observa.

### Heridas mortales (06.02)
Algunos ataques o reglas infligen **heridas mortales**. Siempre que una unidad sufra alguna herida mortal, el jugador que la controla debe resolver esta secuencia por cada una de esas heridas mortales, hasta que se inflijan todas o la unidad resulte eliminada:

1. **Elegir miniatura:** Elige 1 miniatura de esa unidad siguiendo esta prioridad:
   - Si alguna miniatura no PERSONAJE ha perdido alguna herida → elige esa miniatura.
   - Si no, si esta unidad incluye miniaturas no PERSONAJE → elige una de ellas.
   - Si no, si alguna miniatura PERSONAJE ha perdido alguna herida → elige una de ellas.
   - Si no → elige una miniatura PERSONAJE de esa unidad.
2. **Resolver daño:** La miniatura elegida pierde 1 herida. Si esto reduce a 0 sus heridas restantes, resulta **eliminada**.

> Al resolver dados de ataque, si estos infligen una combinación de heridas mortales y daño normal, resuelve primero el daño normal y después todas las heridas mortales.

### Tiradas de riesgo (06.03)
Para hacer una **tirada de riesgo** para una unidad, tira 1D6: con 1-2, la tirada falla y esa unidad sufre 1 herida mortal, o 3 heridas mortales si toda miniatura de esa unidad es MONSTRUO/VEHÍCULO. Si hay que hacer varias tiradas de riesgo para una unidad, hazlas todas a la vez.
