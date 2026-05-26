import type { Doctrina, Destacamento } from '../../types'

export const DESTACAMENTOS: Destacamento[] = [
  { id: 'dinasta', nombre: 'Dinasta Despertada' },
  { id: 'canoptek', nombre: 'Guardia Canoptek' },
]

export const DOCTRINAS: Record<string, Doctrina[]> = {
  dinasta: [
    {
      id: 'dominioEterno',
      nombre: 'Protocolo de Dominio Eterno',
      ronda: '1',
      rondaColor: '#A8E6C3',
      rondaTexto: '#0A4020',
      desc: 'En la primera ronda de batalla, los Necrones avanzan con una implacable determinación para reclamar lo que les pertenece.',
      efectos: [
        'Todas las unidades <Necrones> añaden +1 a sus características OC mientras estén en rango de un marcador de objetivo.',
        'Las unidades <Necrones> que terminen el movimiento a 6" de un marcador de objetivo no controlado lo capturan automáticamente al final de la fase de Movimiento.',
        'Los Protocolos de Reanudación de todas las unidades <Necrones> se activan con 4+ en la primera ronda.',
      ],
    },
    {
      id: 'persecucionVengativa',
      nombre: 'Protocolo de Persecución Vengativa',
      ronda: '2',
      rondaColor: '#C3E8A8',
      rondaTexto: '#1A4A08',
      desc: 'En la segunda ronda, los cañones Gauss y las armas de energía necrón concentran su poder destructivo.',
      efectos: [
        'Las armas con la regla especial Gauss mejoran su FP en 1 hasta el final de la ronda.',
        'Las unidades <Necrones> pueden repetir una tirada de impactar por unidad al disparar.',
        'Las armas de Energía Necrón con D de 1 pasan a D de 2 contra unidades de Infantería.',
      ],
    },
    {
      id: 'aniquilacion',
      nombre: 'Protocolo de Aniquilación Indiferente',
      ronda: '3+',
      rondaColor: '#B8D4F0',
      rondaTexto: '#0C3060',
      desc: 'A partir de la tercera ronda, los Necrones ignoran las bajas y continúan su marcha imparable.',
      efectos: [
        'Las unidades <Necrones> ignoran los modificadores de penalización a la tirada de impactar causados por heridas.',
        'Los Protocolos de Reanudación se activan con 4+ en lugar de 5+.',
        'Las unidades <Necrones> pueden Avanzar y aun así disparar con armas que no sean Pesadas.',
      ],
    },
  ],
  canoptek: [
    {
      id: 'enjambreCanoptek',
      nombre: 'Enjambre Canoptek',
      ronda: '1',
      rondaColor: '#D4F0B8',
      rondaTexto: '#1A4A08',
      desc: 'Los constructos Canoptek inundan el campo de batalla antes de que el enemigo pueda reaccionar.',
      efectos: [
        'Una unidad <Canoptek> puede desplegarse en Reserva Estratégica sin coste adicional.',
        'Las unidades <Canoptek> que lleguen desde Reservas añaden +3" a su distancia de movimiento ese turno.',
        'Al final de la fase de Movimiento, una unidad <Necrones> a 3" de una unidad <Canoptek> amiga puede restaurar 1 herida perdida a uno de sus modelos.',
      ],
    },
    {
      id: 'reparacionContinua',
      nombre: 'Reparación Continua',
      ronda: '2+',
      rondaColor: '#A8E6C3',
      rondaTexto: '#0A4020',
      desc: 'Los escarabajos y autómatas de reparación mantienen los ejércitos Necrones en combate más allá de sus límites.',
      efectos: [
        'Al inicio de cada fase de Mando, una unidad <Necrones> a 6" de una unidad <Canoptek> amiga puede intentar un Protocolo de Reanudación adicional.',
        'Las unidades <Canoptek> pueden moverse a través de modelos enemigos durante la fase de Movimiento.',
        'Las unidades <Necrones> con el Protocolo de Reanudación activo tiran dos dados y descartan el resultado más bajo.',
      ],
    },
  ],
}
