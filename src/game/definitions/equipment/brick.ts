import type { Equipment } from '../../types';

export const brick: Equipment = {
  id: 'brick',
  name: '板砖 🧱',
  type: 'weapon',
  description: '街头智慧的结晶，出其不意，攻其不备。',
  stats: {
    attack: 12,
    critDamage: 0.2,
  },
};
