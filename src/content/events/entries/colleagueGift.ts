import type { EventPoolEntry } from '../../../engine/types';

const colleagueGift: EventPoolEntry = {
  id: 'event.colleague_gift',
  name: '同事离职礼物 🎁',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.colleague_friendship',
        source: 'ENV',
        name: '同事友谊 🤝',
        description: '收到了离职同事的礼物',
        tags: ['buff', 'env'],
        statBonus: { STR: 2, VIT: 2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 拆开沉甸甸的包裹，感受到了职场最后的温情 🤝',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '离职同事在搬走私人物品前，特意留下了一个精致的包裹 🎁',
  },
};

export default colleagueGift;
