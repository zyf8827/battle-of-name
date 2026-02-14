import type { EventPoolEntry } from '../../../engine/types';

const dupGacha: EventPoolEntry = {
  id: 'event.dup_gacha',
  name: '抽卡抽到重复角色 🎮',
  weight: 10,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 8,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.gacha_salt',
        source: 'ENV',
        name: '非酋之力 🎲',
        description: '保底歪了',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 抽到了重复角色！非酋实锤 🎲',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 十连抽，金光一闪...是已经有的角色 🎮',
  },
};

export default dupGacha;
