import type { EventPoolEntry } from '../../../engine/types';

const hairFood: EventPoolEntry = {
  id: 'event.hair_food',
  name: '外卖吃到头发 🧑‍🦲',
  weight: 10,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 12,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.hair_trauma',
        source: 'ENV',
        name: '头发PTSD 🤢',
        description: '看到头发就想吐',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -2 },
        duration: 1,
      },
      textOverrides: {
        apply:
          '{targetName} 胃部一阵剧烈翻腾，当场决定这辈子再也不点这家店了 🤮',
      },
    },
  ],
  texts: {
    trigger: '外卖里的红烧肉看起来很诱人，直到一根卷曲的黑线浮现出来 🤢',
  },
};

export default hairFood;
