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
        apply: '{targetName} 接住了一口又黑又大的锅 🌚。',
      },
    },
  ],
  texts: {
    trigger: '同事突然在群里艾特 {actorName}：“这块不是你负责的吗？” 🤔',
  },

};

export default colleaguePot;
