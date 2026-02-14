import type { EventPoolEntry } from '../../../engine/types';

const expressDelivery: EventPoolEntry = {
  id: 'event.express_delivery',
  name: '快递送到公司 📦',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.open_box_happy',
        source: 'ENV',
        name: '开箱快乐 📦',
        description: '拆快递的快乐',
        tags: ['buff', 'env'],
        statBonus: { LUK: 3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 顶着尴尬跑去签收，这就是开箱带来的救赎吗 📦',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '前台小妹高喊：“快递！有谁名字叫‘无敌战神’的快递到了！” 📦',
  },
};

export default expressDelivery;
