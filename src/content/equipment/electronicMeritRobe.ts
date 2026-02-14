import type { EquipmentLike } from '../base/equipment';

const electronicMeritRobe: EquipmentLike = {
  id: 'equip.electronic_merit_robe',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'RARE',
  name: '电子功德袍 🧘',
  description: '每回合自动叠一点护盾，功德具象化。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.electronic_merit_robe', policy: 'IGNORE' },
  statBonus: { VIT: 3 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        {
          kind: 'SHIELD',
          value: [{ type: 'FLAT', value: 5 }],
          tags: ['shield', 'equip'],
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，护盾来源终于有了玄学解释。'],
    equip: ['{unitName} 披上 {equipmentName}，每回合自动攒护盾。'],
  },
};

export default electronicMeritRobe;
