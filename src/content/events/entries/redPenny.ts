import type { EventPoolEntry } from '../../../engine/types';

const redPenny: EventPoolEntry = {
  id: 'event.red_penny',
  name: '扫码领红包得0.01元 🧧',
  weight: 10,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 5,
      tags: ['heal'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.red_penny_insult',
        source: 'ENV',
        name: '侮辱性红包 😒',
        description: '一分钱也是爱',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -4 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 扫码领了0.01元红包...侮辱性极强 😒',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 兴奋扫码，红包到账：0.01元 🧧',
  },
};

export default redPenny;
