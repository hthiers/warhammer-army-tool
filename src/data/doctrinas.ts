import type { Doctrina, Destacamento } from '../types'

export const DESTACAMENTOS: Destacamento[] = [
  { id: 'gladius', nombre: 'Gladius Task Force' },
  { id: 'tormenta', nombre: 'Ironstorm Spearhead' },
  { id: 'fuego', nombre: 'Firestorm Assault Force' },
]

export const DOCTRINAS: Record<string, Doctrina[]> = {
  gladius: [
    {
      id: 'tactica',
      nombre: 'Doctrina Táctica',
      ronda: '1',
      rondaColor: '#9FE1CB',
      rondaTexto: '#085041',
      desc: 'En la primera ronda de batalla, los Adeptus Astartes hacen gala de su doctrina de guerra adaptable forjada durante siglos.',
      efectos: [
        'Todas las unidades <Adeptus Astartes> pueden disparar tras Avanzar sin penalización a la tirada de impactar.',
        'Las armas de Fuego Rápido ganan +1 Ataque cuando el objetivo está a la mitad del rango.',
        'Las unidades en radio de contacto añaden +1 a sus tiradas de Liderazgo.',
      ],
    },
    {
      id: 'asalto',
      nombre: 'Doctrina de Asalto',
      ronda: '2',
      rondaColor: '#F5C4B3',
      rondaTexto: '#993C1D',
      desc: 'En la segunda ronda de batalla, los guerreros cierran distancias con agresividad implacable.',
      efectos: [
        'Todas las unidades <Adeptus Astartes> ganan la palabra clave Asalto en sus armas bólter.',
        'Las unidades de combate que cargaron este turno añaden +1 a las tiradas de herir.',
        'Las unidades pueden Replegarse y aun así disparar con pistolas.',
      ],
    },
    {
      id: 'devastadora',
      nombre: 'Doctrina Devastadora',
      ronda: '3+',
      rondaColor: '#B5D4F4',
      rondaTexto: '#0C447C',
      desc: 'A partir de la ronda 3, el foco se traslada al fuego concentrado y devastador.',
      efectos: [
        'Las armas Pesadas ya no sufren la penalización de impactar cuando el portador se ha movido.',
        'Las armas de Explosión siempre tiran su número máximo de dados al apuntar a unidades de 6 o más modelos.',
        'Se pueden repetir tiradas de impactar de 1 para armas Pesadas que apunten a unidades en Cobertura.',
      ],
    },
  ],
  tormenta: [
    {
      id: 'flanqueo',
      nombre: 'Maniobra de Flanqueo',
      ronda: '1',
      rondaColor: '#CECBF6',
      rondaTexto: '#3C3489',
      desc: 'Las fuerzas de vanguardia se despliegan con precisión quirúrgica para cortar las líneas enemigas.',
      efectos: [
        'Una unidad <Adeptus Astartes> puede colocarse en Reserva Estratégica sin coste adicional.',
        'Las unidades que lleguen desde Reservas en la ronda 1 pueden disparar al llegar.',
        '+1 a las tiradas de Avanzar para todas las unidades <Adeptus Astartes>.',
      ],
    },
    {
      id: 'supresion',
      nombre: 'Fuego de Supresión',
      ronda: '2+',
      rondaColor: '#F5C4B3',
      rondaTexto: '#993C1D',
      desc: 'El fuego coordinado fija al enemigo en posición mientras las fuerzas de asalto avanzan.',
      efectos: [
        'Tras disparar, si una unidad impacta al enemigo, ese enemigo no puede Avanzar en su siguiente turno.',
        'Las armas Pesadas a distancia superior a la mitad de su rango ganan +1 F.',
        'Las unidades con la habilidad Sigilo pueden disparar sin perder dicha habilidad ese turno.',
      ],
    },
  ],
  fuego: [
    {
      id: 'asaltoPiro',
      nombre: 'Asalto Incendiario',
      ronda: '1',
      rondaColor: '#F5C4B3',
      rondaTexto: '#993C1D',
      desc: 'El ataque se lanza con total ferocidad desde el primer instante, sin dar respiro al enemigo.',
      efectos: [
        'Las unidades <Adeptus Astartes> pueden cargar en el primer turno aunque hayan Avanzado.',
        'Las armas con la regla Fusión o Fuego añaden +1 a las tiradas de herida.',
        'Las unidades que carguen en la ronda 1 no sufren penalización a la tirada de impactar en la siguiente fase de disparo enemiga.',
      ],
    },
  ],
}
