import type { EventPoolEntry } from '../../../engine/types';

const vendingMachine: EventPoolEntry = {
  id: 'event.vending_machine',
  name: '自动售货机故障 🤖',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.free_snack',
        source: 'ENV',
        name: '免费零食 🎉',
        description: '售货机故障吐出免费零食',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2, LUK: 3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 面对满地的免费饮料，一时间不知道该先拿哪一瓶 🎉',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '自动售货机在吞掉硬币后发出了奇怪的咯吱声，随后像喷泉一样往外吐东西 🤖',
  },
};

export default vendingMachine;
