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
        apply: '{targetName} 吃到一根头发，反胃了一下午 🤢',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 吃外卖，嚼到一根卷曲的头发 🧑‍🦲',
  },
};

export default hairFood;
