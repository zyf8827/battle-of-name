import type { EventPoolEntry } from '../../../engine/types';

const bogoMilktea: EventPoolEntry = {
  id: 'event.bogo_milktea',
  name: '奶茶买一送一 🥤',
  weight: 14,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 25,
      tags: ['heal', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.sugar_rush',
        source: 'ENV',
        name: '糖分快乐 🍬',
        description: '全糖去冰',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2, STR: 1 },
        duration: 1,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 发现喜茶买一送一，快乐水续命成功！😋',
  },

};

export default bogoMilktea;
