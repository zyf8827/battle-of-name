import type { Equipment } from '../../types';

export const bugAmulet: Equipment = {
  id: 'bugAmulet',
  name: 'BUG护身符 🐞',
  type: 'accessory',
  description: '玄学装备，据说能减少遇到BUG的几率。',
  stats: {
    defense: 3,
    critRate: 0.03,
  },
};
