import type { Equipment } from '../../types';

export const forgivenessHat: Equipment = {
  id: 'forgivenessHat',
  name: '原谅帽 👒',
  type: 'armor',
  description: '当然是选择原谅他/她/它！大幅提升防御力，但会降低攻击力。',
  stats: {
    defense: 20,
    attack: -10,
  },
};
