import type { EquipmentLike } from '../base/equipment';

const duelSprayer: EquipmentLike = {
  id: 'equip.duel_sprayer',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '甲乙双方对喷器 🧯',
  description: '喷到点上，体质先掉一格。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.duel_sprayer', policy: 'IGNORE' },
  statBonus: { STR: 3 },
  triggers: [
    {
      trigger: { on: 'ON_HIT', when: { role: 'SOURCE', notHasTags: ['miss'] } },
      effects: [
        {
          kind: 'APPLY_MODIFIER',
          target: 'TARGET',
          modifier: {
            id: 'debuff.duel_sprayer.vit_down',
            source: 'BUFF',
            name: '被连续输出',
            duration: 1,
            tags: ['debuff'],
            statBonus: { VIT: -2 },
          },
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，争议话术库已预热。'],
    equip: ['{unitName} 启用 {equipmentName}，对手体质被嘴到发虚。'],
  },
};

export default duelSprayer;
