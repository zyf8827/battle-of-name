import type { Equipment } from '../../types';

export const legacyCode: Equipment = {
  id: 'legacyCode',
  name: '祖传代码 📜',
  type: 'accessory',
  description: '屎山一样的代码，但它就是能跑！增加防御力和攻击力，但降低速度。',
  stats: {
    attack: 10,
    defense: 10,
    speed: -5,
  },
};
