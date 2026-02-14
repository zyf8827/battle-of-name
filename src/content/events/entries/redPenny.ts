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
        apply:
          '{targetName} 看着屏幕上弹出的“0.01元”，感觉自尊受到了极大的侮辱 😒',
      },
    },
  ],
  texts: {
    trigger: '满怀期待地点击开那个巨大的虚拟红包，金光灿灿 🧧',
  },
};

export default redPenny;
