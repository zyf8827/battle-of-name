import type { Equipment } from '../../types';

export const luckyCatFigurine: Equipment = {
  id: 'luckyCatFigurine',
  name: '招财猫摆件 🐱',
  type: 'accessory',
  description: '据说能带来好运的摆件，微量提升所有属性。',
  stats: {
    maxHp: 5,
    attack: 1,
    defense: 1,
    speed: 1,
    critRate: 0.01,
    critDamage: 0.02,
  },
};
