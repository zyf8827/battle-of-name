import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const legoPain: Modifier = {
  id: 'consumable.lego.pain',
  source: 'BUFF',
  name: '脚底板穿刺 🦶',
  description: '每回合行动前受到伤害。',
  duration: 3,
  tags: ['debuff'],
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        { kind: 'DIRECT_DAMAGE', target: 'SELF', value: 12, tags: ['physical', 'true_damage'] }
      ]
    }
  ]
};

const lego: Consumable = {
  id: 'consumable.lego',
  name: '乐高积木 🧱',
  description: '地板上的噩梦。敌人每回合行动时受到伤害。',
  effects: [
    { kind: 'APPLY_MODIFIER', target: 'TARGET', modifier: legoPain },
  ],
  texts: {
    use: ['{unitName} 悄悄在地上撒了一把 {itemName}。'],
  },
};

export default lego;
