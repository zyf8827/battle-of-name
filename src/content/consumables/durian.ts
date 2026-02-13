import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const smell: Modifier = {
  id: 'consumable.durian.smell',
  source: 'BUFF',
  name: '生化毒气 🤢',
  description: '太臭了，无法呼吸。',
  duration: 2,
  tags: ['debuff', 'dot'],
  statBonus: { AGI: -3 }, // 熏得走不动
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [{ kind: 'DIRECT_DAMAGE', target: 'SELF', value: 8, tags: ['dot', 'magic'] }]
    }
  ]
};

const durian: Consumable = {
  id: 'consumable.durian',
  name: '没吃完的榴莲 💩',
  description: '生化武器。造成中毒和减速。',
  effects: [
    { kind: 'APPLY_MODIFIER', target: 'TARGET', modifier: smell },
  ],
  texts: {
    use: ['{unitName} 掏出一块 {itemName} 扔了过去，全场窒息！😷'],
  },
};

export default durian;
