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
        apply: '{targetName} 痛苦地捂住了钱包，甚至能听到系统嘲笑的声音 🎲',
      },
    },
  ],
  texts: {
    trigger: '伴随着激昂的音乐和金光，又一张熟悉的面孔出现在屏幕上 🎮',
  },
};

export default dupGacha;
