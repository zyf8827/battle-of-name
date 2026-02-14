import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const emotionalDamage: Modifier = {
  id: 'consumable.friend_zone.emo',
  source: 'BUFF',
  name: '好人卡 🃏',
  description: '精神受到暴击。',
  duration: 2,
  tags: ['debuff'],
  statBonus: { LUK: -5, STR: -2 },
};

const friendZoneCard: Consumable = {
  id: 'consumable.friend_zone_card',
  name: '好人卡 💔',
  description: '“你是个好人”。造成真实伤害并降低幸运。',
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'TARGET',
      value: 20,
      tags: ['true_damage'],
    },
    { kind: 'APPLY_MODIFIER', target: 'TARGET', modifier: emotionalDamage },
  ],
  texts: {
    use: ['{unitName} 递给 {targetName} 一张 {itemName}，杀人诛心！😭'],
  },
};

export default friendZoneCard;
