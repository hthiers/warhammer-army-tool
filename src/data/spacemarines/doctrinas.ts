import type { Destacamento, ReglaDestacamento, Mejora } from '../../types'

export const DESTACAMENTOS: Destacamento[] = [
  { id: 'centinelas-ceramita', nombre: 'Centinelas de Ceramita', dp: 3 },
  { id: 'filo-ultramar', nombre: 'Filo de Ultramar', dp: 3 },
  { id: 'buscadores-padre-forjador', nombre: 'Buscadores del Padre Forjador', dp: 2 },
  { id: 'escudo-emperador', nombre: 'Escudo del Emperador', dp: 2 },
  { id: 'espolon-marca-sombria', nombre: 'Espolón de la Marca Sombría', dp: 2 },
  { id: 'contingente-bastion', nombre: 'Contingente Bastión', dp: 2 },
  { id: 'fuerza-asalto-orbital', nombre: 'Fuerza de Asalto Orbital', dp: 2 },
  { id: 'fuerza-recuperacion', nombre: 'Fuerza de Recuperación', dp: 2 },
  { id: 'martillo-avernii', nombre: 'Martillo de Avernii', dp: 2 },
  { id: 'contingente-punta-lanza', nombre: 'Contingente Punta de Lanza', dp: 2 },
]

export const REGLAS_DESTACAMENTO: Record<string, ReglaDestacamento> = {
  'centinelas-ceramita': {
    nombre: 'Defensa versátil',
    efectos: [
      'Siempre que una miniatura ADEPTUS ASTARTES ataque y su unidad esté en un elemento de terreno: repite tiradas para impactar de 1 y tiradas para herir de 1.',
      'Las unidades ADEPTUS ASTARTES reciben la clave ATRINCHERADA mientras estén en un elemento de terreno, no se desplegaron este turno y ninguna miniatura movió más de 3" este turno.',
    ],
  },
  'filo-ultramar': {
    nombre: 'Doctrinas dominadas',
    efectos: [
      'Al inicio de hasta 3 fases de mando por partida, selecciona una doctrina de combate activa para todas las unidades ADEPTUS ASTARTES hasta la siguiente fase de mando. No se puede repetir doctrina ya usada, salvo que MARNEUS CALGAR esté en el campo de batalla.',
      'Doctrina Devastadora: La unidad puede elegirse para disparar en un turno en que avanzó.',
      'Doctrina Táctica: La unidad puede elegirse para disparar y declarar carga en un turno en que retrocedió.',
      'Doctrina de Asalto: La unidad puede declarar carga en un turno en que avanzó.',
    ],
  },
  'buscadores-padre-forjador': {
    nombre: 'La misión de Vulkan',
    efectos: [
      'Las armas a distancia ADEPTUS ASTARTES tienen [ASALTO] y +1 Fuerza contra blancos a 12" o menos.',
      "Acompañantes del Buscador: Si VULKAN HE'STAN está en campo, cada unidad ESCUADRA INFERNUS puede empezar una acción en turno en que avanzó, O disparar en turno en que empezó una acción.",
    ],
  },
  'escudo-emperador': {
    nombre: 'Ira de Dorn',
    efectos: [
      'Siempre que una miniatura con Juramento y Órdenes ataque al blanco de Juramento: puede repetir tiradas para herir de 1.',
      'Siempre que una miniatura de unidad DARNATH LYSANDER ataque al blanco de Juramento: puede repetir todas las tiradas para herir.',
    ],
  },
  'espolon-marca-sombria': {
    nombre: 'Señores de las sombras',
    efectos: [
      'Siempre que un ataque a distancia tome como blanco una unidad ADEPTUS ASTARTES, si el atacante está a más de 12": el blanco se beneficia de cobertura.',
      'Táctico sin igual: 1 vez por ronda, si AETHON SHAAN está en campo, puedes usar la estratagema "A la oscuridad" por 0 PM.',
    ],
  },
  'contingente-bastion': {
    nombre: 'Tácticas interconectadas',
    efectos: [
      'Las unidades LÍNEA DE BATALLA ADEPTUS ASTARTES pueden elegirse para disparar y declarar carga en turno en que avanzaron o retrocedieron, y pueden empezar a realizar una acción en turno en que avanzaron o retrocedieron.',
      'Cuando una unidad LÍNEA DE BATALLA ADEPTUS ASTARTES ataca, tras resolver sus ataques, elige 1 unidad enemiga en que haya impactado: queda escaneada con áuspex hasta el final del turno.',
      'Siempre que una miniatura ADEPTUS ASTARTES ataque a una unidad escaneada con áuspex: repite tiradas para impactar de 1.',
    ],
  },
  'fuerza-asalto-orbital': {
    nombre: 'Despliegue en descenso rápido',
    efectos: [
      'Al inicio del paso de declarar formaciones, elige N unidades ADEPTUS ASTARTES no TITÁNICA que tendrán Despliegue rápido: Incursión=2, Fuerza de choque=3, Conquista=4.',
      'Siempre que una miniatura ADEPTUS ASTARTES ataque y se desplegó en campo este turno: repite tiradas para herir de 1. Si además desembarcó de una CÁPSULA DE DESEMBARCO este turno: repite también tiradas para impactar de 1.',
    ],
  },
  'fuerza-recuperacion': {
    nombre: 'Juramento de la recuperación',
    efectos: [
      'Siempre que una miniatura ADEPTUS ASTARTES realice un ataque de combate que tome como blanco una unidad dentro del alcance de un marcador de objetivo: mejora en 1 el FP de ese ataque.',
      'Siempre que un ataque tome como blanco una unidad ADEPTUS ASTARTES de tu ejército, si tu unidad controla un marcador de objetivo al inicio de la fase Y la Fuerza del ataque supera la Resistencia de tu unidad (o la unidad tiene clave TITUS): resta 1 a las tiradas para herir.',
    ],
  },
  'martillo-avernii': {
    nombre: 'Aniquilación Calculada',
    efectos: [
      'Siempre que una miniatura de tu ejército con la habilidad Juramento y órdenes realice un ataque que tome como blanco tu blanco de Juramento y órdenes, puedes repetir las tiradas para herir de 1.',
      'Recalcular: 1 vez por ronda, tras eliminar tu blanco de Juramento y órdenes, si una miniatura CAANOK VAR de tu ejército está en campo, elige una unidad enemiga visible para esa miniatura. Esa unidad se convierte en el nuevo blanco de Juramento y órdenes.',
      'Tu ejército puede incluir unidades MANOS DE HIERRO pero no puede incluir unidades ADEPTUS ASTARTES de otros Capítulos.',
    ],
  },
  'contingente-punta-lanza': {
    nombre: 'Matanza Arrolladora',
    efectos: [
      'Las unidades ADEPTUS ASTARTES de tu ejército pueden elegirse para declarar una carga en un turno en el que hayan avanzado o retrocedido.',
      'Ira del Primer Khan: Al final de la fase de combate, si una unidad SUBODEN KHAN de tu ejército eliminó una o más unidades enemigas durante esta fase y no se encuentra en la zona de amenaza de ninguna unidad enemiga, esa unidad puede hacer un movimiento Normal de hasta 6".',
      'Tu ejército puede incluir unidades CICATRICES BLANCAS pero no puede incluir unidades ADEPTUS ASTARTES de otros Capítulos.',
    ],
  },
}

export const MEJORAS: Record<string, Mejora[]> = {
  'centinelas-ceramita': [
    {
      id: 'honor-infatigable',
      nombre: 'Honor infatigable',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '1ª vez que se elimine al portador: tira 1D6 al final de la fase; con 2+ se despliega de nuevo con todas sus heridas iniciales, fuera de zona de amenaza enemiga.',
    },
    {
      id: 'vocosistema-castellum',
      nombre: 'Vocosistema Castellum',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Cuando la unidad retrocede, elige: (a) puede realizar acciones en turno en que retrocedió, o (b) puede disparar y declarar cargas en turno en que retrocedió.',
    },
    {
      id: 'datacraneo-espia',
      nombre: 'Datacráneo espía',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Las armas a distancia de las miniaturas de la unidad del portador tienen [IGNORA COBERTURA].',
    },
    {
      id: 'maestria-defensiva',
      nombre: 'Maestría defensiva',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Tras el despliegue, elige hasta 3 unidades ADEPTUS ASTARTES y redespliégalas; puedes ponerlas en reserva estratégica sin importar cuántas haya ya.',
    },
  ],
  'filo-ultramar': [
    {
      id: 'armadura-antoninus',
      nombre: 'Armadura de Antoninus',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'El portador tiene Salvación 2+ y No hay dolor 5+.',
    },
    {
      id: 'juramento-macragge',
      nombre: 'Juramento de Macragge',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 Ataques y +1 Fuerza a armas de combate del portador. Con Doctrina de Asalto activa: +2 Ataques y +2 Fuerza en su lugar.',
    },
    {
      id: 'estudiante-codex',
      nombre: 'Estudiante del Codex',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Al inicio de tu fase de mando, si el portador está en campo: la Doctrina Táctica queda activa para esa unidad hasta la siguiente fase de mando (ignorando la doctrina activa del ejército).',
    },
    {
      id: 'veterano-coloso',
      nombre: 'Veterano del Coloso',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Mientras el portador lidere una unidad: armas a distancia de esa unidad tienen [GOLPES SOSTENIDOS 1]. Con Doctrina Devastadora activa: puede repetir tiradas de avanzar de la unidad.',
    },
  ],
  'buscadores-padre-forjador': [
    {
      id: 'inmolador',
      nombre: 'Inmolador',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 Ataques a las armas Ráfaga de las miniaturas de la unidad del portador.',
    },
    {
      id: 'artifice-curtido-guerra',
      nombre: 'Artífice curtido en la guerra',
      restriccion: 'INFANTERÍA ADEPTUS ASTARTES',
      desc: '+3 Fuerza a las armas de combate del portador.',
    },
    {
      id: 'forjado-batalla',
      nombre: 'Forjado en batalla',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Mientras el portador lidere una unidad: 1 vez por turno, tras una tirada para impactar o salvación de una miniatura de esa unidad, puedes cambiar el resultado a 6 sin modificar.',
    },
    {
      id: 'manto-adamantino',
      nombre: 'Manto adamantino',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Siempre que se asigne un ataque al portador: resta 1 al Daño de ese ataque. Si el arma es Fusión o Ráfaga, cambia el Daño a 1.',
    },
  ],
  'escudo-emperador': [
    {
      id: 'campeon-suyos',
      nombre: 'Campeón entre los suyos',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 Ataques a armas de combate del portador. 1 vez por batalla, al inicio de cualquier fase: también +1 Ataques al resto de miniaturas de su unidad hasta el final de la fase.',
    },
    {
      id: 'discipulo-rhetoricus',
      nombre: 'Discípulo de Rhetoricus',
      restriccion: 'EXTERMINADOR ADEPTUS ASTARTES',
      desc: '+1 OC al portador. 1 vez por batalla, al inicio de cualquier fase: también +1 OC al resto de miniaturas de su unidad hasta el final de la fase.',
    },
    {
      id: 'campeon-indomable',
      nombre: 'Campeón indomable',
      restriccion: 'EXTERMINADOR ADEPTUS ASTARTES',
      desc: '1ª vez que se elimine al portador: tira 1D6 al final de la fase; con 2+ se despliega de nuevo con 3 heridas restantes, fuera de zona de amenaza enemiga.',
    },
    {
      id: 'estandarte-malodrax',
      nombre: 'Estandarte de Malodrax',
      restriccion: 'ANCIANO ADEPTUS ASTARTES',
      desc: 'Siempre que un ataque tome como blanco la unidad del portador y Fuerza > Resistencia de la unidad: resta 1 a las tiradas para herir.',
    },
  ],
  'espolon-marca-sombria': [
    {
      id: 'sudario-alanegra',
      nombre: 'Sudario Alanegra',
      restriccion: 'INFANTERÍA ADEPTUS ASTARTES',
      desc: 'Mientras el portador lidere una unidad: las miniaturas de esa unidad tienen la habilidad Infiltradores.',
    },
    {
      id: 'coronario-susurrante',
      nombre: 'Coronario susurrante',
      restriccion: 'PHOBOS',
      desc: 'Aura "Señor del engaño": cuando el oponente toma una unidad a 12" o menos del portador como blanco de una estratagema, aumenta en 1 PM el coste.',
    },
    {
      id: 'rapaz-umbrio',
      nombre: 'Rapaz umbrío',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'El portador tiene las habilidades Agente solitario y Sigilo.',
    },
    {
      id: 'instintos-cazador',
      nombre: 'Instintos de cazador',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Si la unidad del portador está en reservas estratégicas: a efectos de despliegue, trata el número de ronda actual como 1 más alto.',
    },
  ],
  'contingente-bastion': [
    {
      id: 'ojo-primarca',
      nombre: 'El Ojo del Primarca',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Las armas a distancia del portador y de las miniaturas LÍNEA DE BATALLA de su unidad tienen [PRECISIÓN].',
    },
    {
      id: 'heroe-capitulo',
      nombre: 'Héroe del Capítulo',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Mientras el portador lidere una unidad: el portador tiene la clave LÍNEA DE BATALLA.',
    },
    {
      id: 'filos-preciados',
      nombre: 'Filos Preciados',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 FP a armas de combate del portador y de las miniaturas LÍNEA DE BATALLA de su unidad.',
    },
    {
      id: 'comunicador-amplificado',
      nombre: 'Comunicador Amplificado',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Siempre que la unidad del portador sea blanco de una estratagema: tira 1D6 (+1 si tiene clave LÍNEA DE BATALLA); con 4+ ganas 1 PM.',
    },
  ],
  'fuerza-asalto-orbital': [
    {
      id: 'laureles-trueno',
      nombre: 'Laureles del Trueno',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Puede repetir tiradas de carga de la unidad en turnos en que se despliegue en campo.',
    },
    {
      id: 'veterano-vanguardia',
      nombre: 'Veterano de la Vanguardia',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Las miniaturas de la unidad del portador tienen la habilidad Avanzadilla 6".',
    },
    {
      id: 'relicario-enlace-orbital',
      nombre: 'Relicario de enlace orbital',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Tras el despliegue, elige hasta 3 unidades ADEPTUS ASTARTES y redespliégalas; puedes ponerlas en reserva estratégica sin límite.',
    },
    {
      id: 'canonera-asignada',
      nombre: 'Cañonera asignada',
      restriccion: 'EXTERMINADOR ADEPTUS ASTARTES',
      desc: '1 vez por batalla, al final de la fase de combate del oponente, si la unidad del portador no tiene enemigos en su zona de amenaza: retira la unidad del campo y colócala en reservas estratégicas.',
    },
  ],
  'fuerza-recuperacion': [
    {
      id: 'sellos-reconquista',
      nombre: 'Sellos de la Reconquista',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Las miniaturas de la unidad del portador tienen salvación invulnerable de 5+.',
    },
    {
      id: 'avatar-vengativo',
      nombre: 'Avatar Vengativo',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Aura: en el paso de acobardamiento de la fase de mando del oponente, toda unidad enemiga por debajo de sus efectivos iniciales a 9" o menos del portador debe hacer un chequeo de acobardamiento.',
    },
    {
      id: 'pergamino-proclamacion',
      nombre: 'Pergamino de la Proclamación',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Cuando la unidad declara una carga y hay una unidad enemiga a 12" dentro del alcance de un objetivo: puede repetir la tirada de carga, pero debe trabar con esa unidad enemiga.',
    },
    {
      id: 'liberatum',
      nombre: 'Liberatum',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Siempre que el portador ataque a una unidad enemiga dentro del alcance de un marcador de objetivo: puede repetir cualquier tirada para impactar y para herir.',
    },
  ],
  'martillo-avernii': [
    {
      id: 'spiritus-ferrum',
      nombre: 'Spiritus Ferrum',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 Ataques a las armas de combate del portador. 1 vez por batalla, al inicio de cualquier fase: hasta el final de la fase, también suma 1 Ataques a las armas de combate de otras miniaturas de su unidad.',
    },
    {
      id: 'rugido-medusa',
      nombre: 'Rugido de Medusa (Aura)',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Mientras una unidad enemiga (salvo MONSTRUO y VEHÍCULO) esté a 6" o menos del portador: cuando esa unidad falle un chequeo de acobardamiento, una miniatura de esa unidad es eliminada. 1 vez por batalla: en su lugar puedes eliminar 1D3 miniaturas de esa unidad.',
    },
    {
      id: 'laurel-hierro',
      nombre: 'Laurel de Hierro',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 OC al portador. 1 vez por batalla, al inicio de cualquier fase: hasta el final de la fase, también suma 1 OC al resto de miniaturas de su unidad.',
    },
    {
      id: 'fuente-acero',
      nombre: 'Fuente de Acero',
      restriccion: 'EXTERMINADOR ADEPTUS ASTARTES',
      desc: 'Mientras el portador lidere una unidad: en tu fase de mando puedes devolver a esa unidad 1 miniatura Guardaespaldas eliminada.',
    },
  ],
  'contingente-punta-lanza': [
    {
      id: 'parangon-punta-lanza',
      nombre: 'Parangón Punta de Lanza',
      restriccion: 'ADEPTUS ASTARTES',
      desc: '+1 Fuerza y +1 FP a las armas de combate del portador. Siempre que el portador termine un movimiento de carga: hasta el final del turno mejora en 2 Fuerza y FP de sus armas de combate en lugar de en 1.',
    },
    {
      id: 'sabiduria-vidente-tormentas',
      nombre: 'Sabiduría del Vidente de las Tormentas',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Mientras el portador lidere una unidad: puedes repetir las tiradas de avanzar de esa unidad.',
    },
    {
      id: 'ojo-cazador',
      nombre: 'Ojo del Cazador',
      restriccion: 'ADEPTUS ASTARTES',
      desc: 'Las armas a distancia equipadas a miniaturas de la unidad del portador tienen las habilidades [GOLPES SOSTENIDOS 1] e [IGNORA COBERTURA].',
    },
    {
      id: 'cazador-maestre-chogoriano',
      nombre: 'Cazador Maestre Chogoriano',
      restriccion: 'MONTADA ADEPTUS ASTARTES',
      desc: 'Si la unidad del portador está en reservas estratégicas, a efectos de despliegue en campo trata el número de ronda actual como 1 punto más alto del actual.',
    },
  ],
}
