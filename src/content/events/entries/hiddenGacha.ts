import type { EventPoolEntry } from '../../../engine/types';

const hiddenGacha: EventPoolEntry = {
  id: 'event.hidden_gacha',
  name: '抽卡抽到隐藏款 🎴',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.gacha_luck',
        source: 'ENV',
        name: '欧气爆棚 🌟',
        description: '抽到隐藏款，感觉自己就是世界之王',
        tags: ['buff', 'env'],
        statBonus: { LUK: 15 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 爆发出了一阵甚至引起邻居投诉的尖叫：真的出货了！全属性欧气加满！🌟',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '盲盒包装拆开的一角，露出了那抹只在传说中见过的特殊色泽，金光万丈！🎴',
  },
};

export default hiddenGacha;
