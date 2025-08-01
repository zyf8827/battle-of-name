import type { Equipment } from '../../types';

export const goldRimmedGlasses: Equipment = {
  id: 'goldRimmedGlasses',
  name: '金丝眼镜 👓',
  type: 'armor',
  description: '看起来斯文败类，增加暴击率和暴击伤害。',
  stats: {
    critRate: 0.08,
    critDamage: 0.15,
  },
};
