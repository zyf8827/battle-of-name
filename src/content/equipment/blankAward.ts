import type { EquipmentLike } from '../base/equipment';

const blankAward: EquipmentLike = {
  id: 'equip.blank_award',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'RARE',
  name: '空白奖状 🏅',
  description: '内容随便填，但增益是真的。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.blank_award', policy: 'IGNORE' },
  statBonus: { STR: 1, LUK: 2 },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [
        {
          kind: 'APPLY_MODIFIER',
          target: 'SELF',
          modifier: {
            id: 'buff.blank_award.str_up',
            source: 'BUFF',
            name: '被表彰',
            duration: 1,
            tags: ['buff'],
            statBonus: { STR: 2 },
          },
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，奖项名称未定但力量先加了。'],
    equip: ['{unitName} 展示 {equipmentName}，本回合攻击力获奖升级。'],
  },
};

export default blankAward;
