import type { EquipmentLike } from '../base/equipment';

const carbonLifePatch: EquipmentLike = {
  id: 'equip.carbon_life_patch',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'COMMON',
  name: '碳基生物续命贴 🩹',
  description: '适用于任何“快没了”的碳基单位。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.carbon_life_patch', policy: 'IGNORE' },
  statBonus: { VIT: 2 },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [{ kind: 'DIRECT_HEAL', target: 'SELF', value: 5, tags: ['heal', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，生命值续航服务已开通。'],
    equip: ['{unitName} 贴上 {equipmentName}，每回合自动续命。'],
  },
};

export default carbonLifePatch;
