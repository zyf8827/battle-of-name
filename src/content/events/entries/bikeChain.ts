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
        apply: '{targetName} 低头一看，裤脚被死死搅进了油腻的链条里 🔗',
      },
    },
  ],
  texts: {
    trigger: '共享单车发出了哐当一声，链条由于老化突然锁死 🚲',
  },
};

export default bikeChain;
