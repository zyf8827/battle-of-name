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
        apply: '{targetName} 爆发出了一阵甚至引起邻居投诉的尖叫：出货了！🌟',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '盲盒包装拆开的一角，露出了那抹只在传说中见过的特殊色泽 🎴',
  },
};

export default hiddenGacha;
