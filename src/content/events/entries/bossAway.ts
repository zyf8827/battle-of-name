import type { EventPoolEntry } from '../../../engine/types';

const bossAway: EventPoolEntry = {
  id: 'event.boss_away',
  name: '老板出差去了 🛫',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'buff.boss_away_freedom',
        source: 'ENV',
        name: '自由万岁 🕊️',
        description: '老板不在家，空气都甜了',
        tags: ['buff', 'env'],
        statBonus: { LUK: 5 },
        duration: 3,
        triggers: [
          {
            trigger: { on: 'TURN_START' },
            effects: [
              {
                kind: 'DIRECT_HEAL',
                target: 'SELF',
                value: 5,
                tags: ['heal', 'env'],
              },
            ],
          },
        ],
      },
      textOverrides: {
        apply: '{targetName} 感到一阵轻松，连呼吸都顺畅了许多 ✨',
      },
    },
  ],
  texts: {
    trigger: '秘书在大群宣布：老板下周出差，大家“辛苦了” 🛫',
  },
};

export default bossAway;
