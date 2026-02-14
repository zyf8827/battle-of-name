import type { EventPoolEntry } from '../../../engine/types';

const deliveryWarmth: EventPoolEntry = {
  id: 'event.delivery_warmth',
  name: '快递到了 📦',
  weight: 14,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 15,
      tags: ['heal', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.unboxing',
        source: 'ENV',
        name: '拆箱快乐 ✨',
        description: '这个社会仅存的温暖',
        tags: ['buff', 'env'],
        statBonus: { STR: 1, AGI: 1 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '快递小哥给 {actorName} 打电话：你的快递到了！🚚',
  },
};

export default deliveryWarmth;
