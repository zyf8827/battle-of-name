import type { EventPoolEntry } from '../../../engine/types';

const colleaguePot: EventPoolEntry = {
  id: 'event.colleague_pot',
  name: '同事的甩锅 🍳',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.pot_holder',
        source: 'ENV',
        name: '资深背锅侠 🥷',
        description: '一口万年黑锅从天而降，压得喘不过气',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -5, STR: -5 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 感觉头顶阴影笼罩，一口厚重无比的黑锅稳稳落在了肩上，甚至听到了骨头碎裂的声音 🌚',
      },
    },
  ],
  texts: {
    trigger: '大群里突然飞出一条艾特：“这个 Bug 之前的逻辑是你写的吧？” 🍳',
  },
};

export default colleaguePot;
