import type { EventPoolEntry } from '../../../engine/types';

const hiddenGacha: EventPoolEntry = {
  id: 'event.hidden_gacha',
  name: '抽卡抽到隐藏款 🎴',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.gacha_luck',
        source: 'ENV',
        name: '欧气爆棚 🌟',
        description: '抽到隐藏款',
        tags: ['buff', 'env'],
        statBonus: { LUK: 5 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 抽到了隐藏款！欧皇附体 🌟',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '{actorName} 抽卡，闪卡出现！是隐藏款 🎴',
  },
};

export default hiddenGacha;
