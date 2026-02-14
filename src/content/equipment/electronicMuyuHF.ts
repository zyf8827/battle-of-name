import type { EquipmentLike } from '../base/equipment';

const electronicMuyuHF: EquipmentLike = {
  id: 'equip.electronic_muyu_hf',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '电子木鱼（高频版） 🔊',
  description: '边打边回血，主打一个赛博积德。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.electronic_muyu_hf', policy: 'IGNORE' },
  statBonus: { STR: 1, LUK: 2 },
  triggers: [
    {
      trigger: { on: 'POST_ACTION', when: { role: 'SOURCE', eventType: 'ATTACK', notHasTags: ['miss'] } },
      effects: [{ kind: 'DIRECT_HEAL', target: 'SELF', value: 4, tags: ['heal', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，功德值和血条一起涨。'],
    equip: ['{unitName} 装上 {equipmentName}，每次出手都在做电子善事。'],
  },
};

export default electronicMuyuHF;
