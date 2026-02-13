import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const blind: Modifier = {
  id: 'consumable.essential_balm.blind',
  source: 'BUFF',
  name: '辣眼睛 🙈',
  description: '无法直视。',
  duration: 2,
  tags: ['debuff'],
  statBonus: { AGI: -5 }, // 降低命中/闪避
};

const essentialBalm: Consumable = {
  id: 'consumable.essential_balm',
  name: '风油精 🧴',
  description: '涂在不可描述的地方...大幅降低敏捷。',
  effects: [
    { kind: 'APPLY_MODIFIER', target: 'TARGET', modifier: blind },
  ],
  texts: {
    use: ['{unitName} 把 {itemName} 抹在了 {targetName} 的眼皮上！👀🔥'],
  },
};

export default essentialBalm;
