import type { EventPoolEntry } from '../../../engine/types';

const soupSpill: EventPoolEntry = {
  id: 'event.soup_spill',
  name: '外卖汤洒了一身 🍲',
  weight: 12,
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
        id: 'debuff.soup_burn',
        source: 'ENV',
        name: '烫伤+脏衣服 🤕',
        description: '衣服毁了，皮肤烫了',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 的外卖汤洒了一身，衣服烫坏了 🤕',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 端外卖，汤盖飞了...浑身汤汁 🍲',
  },
};

export default soupSpill;
