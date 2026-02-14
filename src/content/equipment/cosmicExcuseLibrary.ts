import type { EquipmentLike } from '../base/equipment';

const cosmicExcuseLibrary: EquipmentLike = {
  id: 'equip.cosmic_excuse_library',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'LEGENDARY',
  name: '宇宙级托词库 🌌',
  description: '理由不够用？每回合随机给你一件新饰品。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.cosmic_excuse_library', policy: 'IGNORE' },
  statBonus: { VIT: 1, LUK: 2 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        { kind: 'GRANT_RANDOM_EQUIPMENT', target: 'SELF', slot: 'ACCESSORY' },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，宇宙级借口正在实时生成。'],
    equip: ['{unitName} 启用 {equipmentName}，每回合随机刷新一件饰品。'],
  },
};

export default cosmicExcuseLibrary;
