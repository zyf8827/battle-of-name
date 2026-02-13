import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const foodPoisoning: Modifier = {
  id: 'consumable.expired_sandwich.poison',
  source: 'BUFF',
  name: '食物中毒 🤢',
  description: '肚子痛...',
  duration: 2,
  tags: ['debuff', 'dot'],
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        { kind: 'DIRECT_DAMAGE', target: 'SELF', value: 5, tags: ['dot', 'true_damage'] }
      ]
    }
  ]
};

const expiredSandwich: Consumable = {
  id: 'consumable.expired_sandwich',
  name: '过期的三明治 🥪',
  description: '赌狗的选择，大量回血但会中毒。',
  effects: [
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 50, tags: ['heal'] },
    { kind: 'APPLY_MODIFIER', target: 'SELF', modifier: foodPoisoning },
  ],
  texts: {
    use: ['{unitName} 狼吞虎咽了 {itemName}，味道好像有点不对... 🤮'],
  },
};

export default expiredSandwich;
