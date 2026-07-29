import type { Postura, PosturaId } from '../../types/misiones'

export const POSTURAS: Postura[] = [
  { id: 'hold', mazo: 'take-and-hold', nombre: 'Take and Hold', nombreEs: 'Ocupar y Mantener', color: '#2f6b4f' },
  { id: 'purge', mazo: 'purge-the-foe', nombre: 'Purge the Foe', nombreEs: 'Purgar al Enemigo', color: '#8a2b2b' },
  { id: 'disruption', mazo: 'disruption', nombre: 'Disruption', nombreEs: 'Disrupción', color: '#1f4f8a' },
  { id: 'recon', mazo: 'reconnaissance', nombre: 'Reconnaissance', nombreEs: 'Reconocimiento', color: '#1f7a82' },
  { id: 'priority', mazo: 'priority-assets', nombre: 'Priority Assets', nombreEs: 'Activos Prioritarios', color: '#a17b14' },
]

export const POSTURAS_MAP: Record<PosturaId, Postura> = Object.fromEntries(
  POSTURAS.map(p => [p.id, p])
) as Record<PosturaId, Postura>

// tu postura -> postura del oponente -> id de la carta de misión primaria (dentro de tu propio mazo)
export const MATRIZ_DISPOSICION: Record<PosturaId, Record<PosturaId, string>> = {
  hold: {
    hold: 'battlefield-dominance',
    purge: 'immovable-object',
    disruption: 'determined-acquisition',
    recon: 'purge-and-secure',
    priority: 'inescapable-dominion',
  },
  purge: {
    hold: 'unstoppable-force',
    purge: 'meatgrinder',
    disruption: 'punishment',
    recon: 'consecrate',
    priority: 'destroyers-wrath',
  },
  disruption: {
    hold: 'death-trap',
    purge: 'delaying-action',
    disruption: 'outmanoeuvre',
    recon: 'smoke-and-mirrors',
    priority: 'locate-and-deny',
  },
  recon: {
    hold: 'reconnaissance-sweep',
    purge: 'triangulation',
    disruption: 'surveil-the-foe',
    recon: 'gather-intel',
    priority: 'search-and-scour',
  },
  priority: {
    hold: 'secure-asset',
    purge: 'vital-link',
    disruption: 'extract-relic',
    recon: 'vanguard-operation',
    priority: 'sabotage',
  },
}
