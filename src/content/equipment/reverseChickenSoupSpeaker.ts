import type { EquipmentLike } from '../base/equipment';

const reverseChickenSoupSpeaker: EquipmentLike = {
  id: 'equip.reverse_chicken_soup_speaker',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '反向鸡汤扩音器 📢',
  description: '每一句大道理都精准打击对方自信心。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.reverse_chicken_soup_speaker', policy: 'IGNORE' },
  statBonus: { STR: 2, LUK: 1 },
  triggers: [
    {
      trigger: { on: 'ON_HIT', when: { role: 'SOURCE', notHasTags: ['miss'] } },
      effects: [
        {
          kind: 'APPLY_MODIFIER',
          target: 'TARGET',
          modifier: {
            id: 'debuff.reverse_chicken_soup_speaker.str_down',
            source: 'BUFF',
            name: '被反向灌输',
            duration: 1,
            tags: ['debuff'],
            statBonus: { STR: -2 },
          },
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，毒鸡汤开到最大音量。'],
    equip: ['{unitName} 举起 {equipmentName}，对手攻击欲当场下线。'],
  },
};

export default reverseChickenSoupSpeaker;
