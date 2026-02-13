import type { EventPoolEntry } from '../../../engine/types';

const coffeeSpill: EventPoolEntry = {
  id: 'event.coffee_spill',
  name: '咖啡泼键盘 ☕',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.panic_clean',
        source: 'ENV',
        name: '手忙脚乱 😰',
        description: '疯狂擦拭键盘中',
        tags: ['debuff', 'control', 'env'],
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 本回合只能用来擦键盘了！(无法行动) 🧻',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 不小心把美式咖啡倒进了机械键盘里！💧',
  },

};

export default coffeeSpill;
