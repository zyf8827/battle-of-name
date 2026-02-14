import type { EquipmentLike } from '../base/equipment';

const urgentRedHeadDoc: EquipmentLike = {
  id: 'equip.urgent_red_head_doc',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '加急红头文件 🚨',
  description: '只要文件够红，护盾就会自己长出来。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.urgent_red_head_doc', policy: 'IGNORE' },
  statBonus: { AGI: 2 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [{ kind: 'SHIELD', value: [{ type: 'FLAT', value: 5 }], tags: ['shield', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 拿到 {equipmentName}，流程虽然复杂但真的管用。'],
    equip: ['{unitName} 翻开 {equipmentName}，先给自己批了个护盾。'],
  },
};

export default urgentRedHeadDoc;
