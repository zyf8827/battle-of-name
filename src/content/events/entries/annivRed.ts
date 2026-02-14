import type { EventPoolEntry } from '../../../engine/types';

const annivRed: EventPoolEntry = {
  id: 'event.anniv_red',
  name: '周年庆发红包 🧧',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'buff.anniv_bonus',
        source: 'ENV',
        name: '周年红包 🧧',
        description: '公司发红包了',
        tags: ['buff', 'env'],
        statBonus: { LUK: 2, VIT: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 收到周年庆红包 🧧',
      },
    },
  ],
  texts: {
    trigger: '公司周年庆，全员发红包雨 🧧',
  },
};

export default annivRed;
