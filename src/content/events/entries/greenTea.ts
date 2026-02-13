import type { EventPoolEntry } from '../../../engine/types';

const greenTea: EventPoolEntry = {
  id: 'event.green_tea',
  name: '我只会心疼giegie 🍵',
  weight: 8,
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
        id: 'debuff.tea_poison',
        source: 'ENV',
        name: '茶言茶语 🐍',
        description: '精神污染',
        tags: ['debuff', 'env'],
        statBonus: { STR: -2 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '路人对 {actorName} 发动了技能：“不像我，我只会心疼giegie~” 🥺',
  },

};

export default greenTea;
