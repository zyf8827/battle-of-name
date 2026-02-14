import type { EquipmentLike } from '../base/equipment';

const mysticBadge: EquipmentLike = {
  id: 'equip.mystic_badge',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '玄学工牌 🪪',
  description: '刷一下就能掉点奇怪好东西。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.mystic_badge', policy: 'IGNORE' },
  statBonus: { LUK: 3 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        { kind: 'GRANT_RANDOM_CONSUMABLE', target: 'SELF' },
        { kind: 'SHIELD', value: [{ type: 'FLAT', value: 3 }], tags: ['shield', 'equip'] },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，背包里开始刷出未知补给。'],
    equip: ['{unitName} 刷了下 {equipmentName}，系统随机发货中。'],
  },
};

export default mysticBadge;
