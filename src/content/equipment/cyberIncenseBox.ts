import type { EquipmentLike } from '../base/equipment';

const cyberIncenseBox: EquipmentLike = {
  id: 'equip.cyber_incense_box',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '赛博香灰盒 🛰️',
  description: '看似玄学，其实是稳定加攻插件。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.cyber_incense_box', policy: 'IGNORE' },
  statBonus: { LUK: 3 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        {
          kind: 'APPLY_MODIFIER',
          target: 'SELF',
          modifier: {
            id: 'buff.cyber_incense_box.str_up',
            source: 'BUFF',
            name: '香火加持',
            duration: 1,
            tags: ['buff'],
            statBonus: { STR: 2 },
          },
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，不科学但很有效。'],
    equip: ['{unitName} 摆好 {equipmentName}，攻击力按玄学增长。'],
  },
};

export default cyberIncenseBox;
