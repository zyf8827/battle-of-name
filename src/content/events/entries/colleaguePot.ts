import type { EventPoolEntry } from '../../../engine/types';

const colleaguePot: EventPoolEntry = {
  id: 'event.colleague_pot',
  name: '同事的甩锅 🍳',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.pot_holder',
        source: 'ENV',
        name: '背锅侠 🥷',
        description: '一口黑锅从天而降',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -3, STR: -2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 感觉头顶阴影笼罩，一口厚重的黑锅稳稳落在了肩上 🌚',
      },
    },
  ],
  texts: {
    trigger: '大群里突然飞出一条艾特：“这个 Bug 之前的逻辑是你写的吧？” 🍳',
  },
};

export default colleaguePot;
