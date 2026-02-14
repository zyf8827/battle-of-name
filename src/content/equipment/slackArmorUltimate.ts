import type { EquipmentLike } from '../base/equipment';

const slackArmorUltimate: EquipmentLike = {
  id: 'equip.slack_armor_ultimate',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'EPIC',
  name: '摆烂盔甲·完全体 🛋️',
  description: '只要躺得够平，生命回复就够稳。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.slack_armor_ultimate', policy: 'IGNORE' },
  statBonus: { VIT: 4, AGI: -1 },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [{ kind: 'DIRECT_HEAL', target: 'SELF', value: 5, tags: ['heal', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，从此防御姿势只有一个：平躺。'],
    equip: ['{unitName} 套上 {equipmentName}，开局自动回血。'],
  },
};

export default slackArmorUltimate;
