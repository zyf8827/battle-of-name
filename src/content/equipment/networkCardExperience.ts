import type { EquipmentLike } from '../base/equipment';

const networkCardExperience: EquipmentLike = {
  id: 'equip.network_card_experience',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'RARE',
  name: '人脉体验卡 🪪',
  description: '打一拳，顺手把你身上的增益关系也断了。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.network_card_experience', policy: 'IGNORE' },
  statBonus: { LUK: 3 },
  triggers: [
    {
      trigger: { on: 'ON_HIT', when: { role: 'SOURCE', notHasTags: ['miss'] } },
      effects: [{ kind: 'DISPEL', target: 'TARGET', mode: 'BUFF', max: 1 }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，开始精准拆人脉。'],
    equip: ['{unitName} 使用 {equipmentName}，命中后可剥离目标增益。'],
  },
};

export default networkCardExperience;
