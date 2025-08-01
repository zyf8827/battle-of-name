import type { Equipment } from '../../types';

export const smartBracelet: Equipment = {
  id: 'smartBracelet',
  name: '智能手环 ⌚',
  type: 'accessory',
  description: '记录你的心率和步数，提升最大生命值和速度。',
  stats: {
    maxHp: 15,
    speed: 3,
  },
};
