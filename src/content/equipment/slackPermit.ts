import type { EquipmentLike } from '../base/equipment';

const slackPermit: EquipmentLike = {
  id: 'equip.slack_permit',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'RARE',
  name: '摆烂许可证 🪪',
  description: '被打也不慌，先把负面状态下掉。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.slack_permit', policy: 'IGNORE' },
  statBonus: { VIT: 2, LUK: 1 },
  triggers: [
    {
      trigger: {
        on: 'ON_HURT',
        when: { role: 'TARGET', notHasTags: ['miss'] },
      },
      effects: [{ kind: 'DISPEL', target: 'SELF', mode: 'DEBUFF', max: 1 }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，从此“摆烂”合法合规。'],
    equip: ['{unitName} 出示 {equipmentName}，挨打时自动清除一层负面。'],
  },
};

export default slackPermit;
