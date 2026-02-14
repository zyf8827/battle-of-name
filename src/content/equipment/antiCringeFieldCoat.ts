import type { EquipmentLike } from '../base/equipment';

const antiCringeFieldCoat: EquipmentLike = {
  id: 'equip.anti_cringe_field_coat',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'EPIC',
  name: '防社死结界外套 🧥',
  description: '只要你不尴尬，掉血的就是别人。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.anti_cringe_field_coat', policy: 'IGNORE' },
  statBonus: { VIT: 3, LUK: 1 },
  triggers: [
    {
      trigger: { on: 'PIPELINE_INCOMING' },
      effects: [
        {
          kind: 'MITIGATE',
          when: { role: 'TARGET', eventType: 'ATTACK', notHasTags: ['true_damage'] },
          multiplier: 0.88,
          min: 1,
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，尴尬值直接转化为防御值。'],
    equip: ['{unitName} 穿上 {equipmentName}，物理防社死领域已展开。'],
  },
};

export default antiCringeFieldCoat;
