import type { EquipmentLike } from '../base/equipment';

const embarrassmentRecycleBag: EquipmentLike = {
  id: 'equip.embarrassment_recycle_bag',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'EPIC',
  name: '丢人回收袋 🗑️',
  description: '每回合清一件背包垃圾，换一口续命气。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.embarrassment_recycle_bag', policy: 'IGNORE' },
  statBonus: { VIT: 2 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        { kind: 'LOSE_RANDOM_CONSUMABLE', target: 'SELF', count: 1 },
        { kind: 'DIRECT_HEAL', target: 'SELF', value: 6, tags: ['heal', 'equip'] },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，开始边丢包袱边回血。'],
    equip: ['{unitName} 打开 {equipmentName}，随机清包并恢复生命。'],
  },
};

export default embarrassmentRecycleBag;
