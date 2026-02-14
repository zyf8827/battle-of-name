import type { EventPoolEntry } from '../../../engine/types';

const fridgeSharing: EventPoolEntry = {
  id: 'event.fridge_sharing',
  name: '冰箱分享大会 ❄️',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'buff.sharing_is_caring',
        source: 'ENV',
        name: '分享美德 ❄️',
        description: '分享冰箱里的食物',
        tags: ['buff', 'env'],
        statBonus: { VIT: 1, LUK: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 在冰箱深处挖到了宝藏，职场生存率大幅提升 ❄️',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'ALL',
    },
  ],
  texts: {
    trigger: '有人在大群里喊话：冰箱里的存货谁要谁拿，不然明天就过期了 ❄️',
  },
};

export default fridgeSharing;
