import type { EventPoolEntry } from '../../../engine/types';

const melonOnMe: EventPoolEntry = {
  id: 'event.melon_on_me',
  name: '吃瓜吃到自己家 🍉',
  weight: 8,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 15,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.house_collapse',
        source: 'ENV',
        name: '房子塌了 🏚️',
        description: '不仅精神受创，还社死了',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -3 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 吃瓜吃得正香，突然发现主角是自己偶像！😧',
  },

};

export default melonOnMe;
