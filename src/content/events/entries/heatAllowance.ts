import type { EventPoolEntry } from '../../../engine/types';

const heatAllowance: EventPoolEntry = {
  id: 'event.heat_allowance',
  name: '高温补贴 ☀️',
  weight: 6,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'ALL',
      value: 15,
      tags: ['heal', 'env'],
    },
  ],
  texts: {
    trigger: '天气太热，公司发了高温补贴（一根老冰棍） 🍦。',
  },
};

export default heatAllowance;
