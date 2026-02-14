import type { EventPoolEntry } from '../../../engine/types';

const bikeChain: EventPoolEntry = {
  id: 'event.bike_chain',
  name: '骑共享单车裤链卡住 🚲',
  weight: 10,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 10,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.chain_pain',
        source: 'ENV',
        name: '裤链卡住 🔗',
        description: '下不来车了',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 的裤链被单车卡住了 🚲',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 骑共享单车，裤链卡进车链里了 🚲',
  },
};

export default bikeChain;
