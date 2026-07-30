# Force Disposition (postura)

Nombres de postura en español: **Take and Hold** = Sostener y Controlar · **Purge the Foe** = Purgar al Enemigo · **Reconnaissance** = Reconocimiento · **Priority Assets** = Activos Prioritarios · **Disruption** = Disrupción.

Fuentes: https://gdmissions.app/11th/force-disposition y https://gdmissions.app/11th/matrix

Las cartas individuales de `/11th/force-disposition/<mazo>` no tienen texto de
reglas embebido: son tablas gráficas (imágenes, no datos de React) que
indican **qué carta de misión primaria se juega**, en función de la postura
("force disposition") elegida por cada jugador. Cada mazo de misión primaria
(`take-and-hold`, `purge-the-foe`, `reconnaissance`, `priority-assets`,
`disruption`) contiene exactamente 5 cartas: una para cada postura posible
del oponente. El contenido de esta tabla se extrajo primero leyendo esas
imágenes, y luego se verificó letra por letra contra el objeto de datos fuente
embebido en el bundle JS de `/11th/matrix` (vista interactiva de la misma
matriz que usa el propio sitio).

## Cómo se usa

1. Cada jugador elige (o le corresponde) una de las 5 posturas: **Take and
   Hold**, **Purge the Foe**, **Reconnaissance**, **Priority Assets** o
   **Disruption**.
2. Con tu propia postura como fila y la postura de tu oponente como columna,
   la celda indica qué carta jugarás de tu mazo de misión primaria.
3. Cada jugador consulta la tabla de **su propia** postura (no es simétrico:
   la carta que te toca a ti y la que le toca a tu oponente son distintas,
   aunque ambos usen la fila con vuestras respectivas posturas).

## Tabla completa

| Tu postura ↓ / Postura del oponente → | Take and Hold | Purge the Foe | Reconnaissance | Priority Assets | Disruption |
|---|---|---|---|---|---|
| **Take and Hold** | Battlefield Dominance | Immovable Object | Purge and Secure | Inescapable Dominion | Determined Acquisition |
| **Purge the Foe** | Unstoppable Force | Meatgrinder | Consecrate | Destroyer's Wrath | Punishment |
| **Reconnaissance** | Reconnaissance Sweep | Triangulation | Gather Intel | Search and Scour | Surveil the Foe |
| **Priority Assets** | Secure Asset | Vital Link | Vanguard Operation | Sabotage | Extract Relic |
| **Disruption** | Death Trap | Delaying Action | Smoke and Mirrors | Locate and Deny | Outmanoeuvre |

Ver el texto completo de reglas de cada una de estas cartas en su mazo de
misión primaria correspondiente:
[take-and-hold.md](take-and-hold.md), [purge-the-foe.md](purge-the-foe.md),
[reconnaissance.md](reconnaissance.md), [priority-assets.md](priority-assets.md),
[disruption.md](disruption.md).
