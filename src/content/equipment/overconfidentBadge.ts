import type { EquipmentLike } from '../base/equipment';

const overconfidentBadge: EquipmentLike = {
  id: 'equip.overconfident_badge',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'RARE',
  name: '迷之自信徽章 😎',
  description: '自信到一定程度，连伤害都能回点血。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.overconfident_badge', policy: 'IGNORE' },
  statBonus: { STR: 1, LUK: 2 },
  triggers: [
    {
      trigger: {
        on: 'POST_ACTION',
        when: { role: 'SOURCE', eventType: 'ATTACK', notHasTags: ['miss', 'reflect', 'true_damage'] },
      },
      effects: [{ kind: 'LIFESTEAL', ratio: 0.12, tags: ['heal', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，气场先涨，血条后涨。'],
    equip: ['{unitName} 戴上 {equipmentName}，攻击后按比例回血。'],
  },
};

export default overconfidentBadge;
