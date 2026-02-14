import type { EventPoolEntry } from '../../../engine/types';

const bogoMilktea: EventPoolEntry = {
  id: 'event.bogo_milktea',
  name: '奶茶买一送一 🥤',
  weight: 12,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 40,
      tags: ['heal', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.sugar_rush',
        source: 'ENV',
        name: '糖分快乐 🍬',
        description: '全糖去冰，双倍快乐',
        tags: ['buff', 'env'],
        statBonus: { VIT: 4, STR: 2 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 发现奶茶买一送一，吨吨吨灌下去，快乐水续命大成功！😋',
  },
};

export default bogoMilktea;
