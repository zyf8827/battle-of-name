import type { EventPoolEntry } from '../../../engine/types';

const gymOnce: EventPoolEntry = {
  id: 'event.gym_once',
  name: '健身卡终于用了一次 💪',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.gym_achievement',
        source: 'ENV',
        name: '健身成就 🏆',
        description: '办卡后第一次去',
        tags: ['buff', 'env'],
        statBonus: { STR: 3, VIT: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 终于去健身房了！办卡没白办 💪',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 翻出健身卡...第一次去健身房 💪',
  },
};

export default gymOnce;
