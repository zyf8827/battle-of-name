import type { Consumable } from '../base/consumable';

const regretPill: Consumable = {
  id: 'consumable.regret_pill',
  name: '后悔药 💊',
  description: '世上居然有卖？驱散双方所有状态。',
  effects: [
    { kind: 'DISPEL', target: 'SELF', mode: 'ANY', max: 99 },
    { kind: 'DISPEL', target: 'TARGET', mode: 'ANY', max: 99 },
  ],
  texts: {
    use: ['{unitName} 吞下 {itemName}，感觉一切都重新开始了 🔄。'],
  },
};

export default regretPill;
