import type { EquipmentLike } from '../base/equipment';

const emotionalValueGenerator: EquipmentLike = {
  id: 'equip.emotional_value_generator',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'COMMON',
  name: '情绪价值发电机 🔋',
  description: '每回合自动给你一点续航，文明战斗从你做起。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.emotional_value_generator', policy: 'IGNORE' },
  statBonus: { STR: 2, VIT: 1 },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [{ kind: 'DIRECT_HEAL', target: 'SELF', value: 3, tags: ['heal', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，主打一个自我充电。'],
    equip: ['{unitName} 装上 {equipmentName}，血条开始慢慢回暖。'],
  },
};

export default emotionalValueGenerator;
