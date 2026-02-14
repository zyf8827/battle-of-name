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
        apply: '{targetName} 惊叫着跳了起来，手忙脚乱地开始拯救进水的按键 🧻',
      },
    },
  ],
  texts: {
    trigger: '手滑了！一整杯浓缩咖啡呈完美的抛物线落向了键盘 ☕',
  },
};

export default coffeeSpill;
