import type { Consumable } from '../base/consumable';

const heartPills: Consumable = {
  id: 'consumable.heart_pills',
  name: '速效救心丸 💊',
  description: '被队友气晕时使用，回复大量生命。',
  effects: [{ kind: 'DIRECT_HEAL', target: 'SELF', value: 40, tags: ['heal'] }],
  texts: {
    use: ['{unitName} 捂着胸口服下 {itemName}，心率终于平稳了 💓。'],
  },
};

export default heartPills;
