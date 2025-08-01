import type { Equipment } from '../../types';

export const selfieStick: Equipment = {
  id: 'selfieStick',
  name: '自拍杆 🤳',
  type: 'weapon',
  description: '攻击距离 +1，但攻击力较低。',
  stats: {
    attack: 3,
    speed: 2,
  },
};
