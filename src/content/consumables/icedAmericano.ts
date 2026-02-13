import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const caffeineBoost: Modifier = {
  id: 'consumable.iced_americano.boost',
  source: 'BUFF',
  name: '咖啡因 ☕',
  description: '提神醒脑，提升敏捷。',
  duration: 3,
  tags: ['buff'],
  statBonus: { AGI: 3 },
  stacking: { stackKey: 'buff.caffeine', policy: 'REFRESH_DURATION' },
};

const icedAmericano: Consumable = {
  id: 'consumable.iced_americano',
  name: '冰美式 🧊',
  description: '打工人的血液，苦涩但清醒。',
  effects: [
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 10, tags: ['heal'] },
    { kind: 'APPLY_MODIFIER', target: 'SELF', modifier: caffeineBoost },
  ],
  texts: {
    use: ['{unitName} 灌下一杯 {itemName}，苦得精神一振！😳'],
  },
};

export default icedAmericano;
