import type { EquipmentLike } from '../base/equipment';

const blameCatapult: EquipmentLike = {
  id: 'equip.blame_catapult',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'EPIC',
  name: '甩锅弹射器 🧷',
  description: '你打我，我把锅和伤害一起甩回去。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.blame_catapult', policy: 'IGNORE' },
  statBonus: { AGI: 1, LUK: 2 },
  triggers: [
    {
      trigger: {
        on: 'ON_HURT',
        when: {
          role: 'TARGET',
          notHasTags: ['miss', 'reflect', 'true_damage'],
        },
      },
      effects: [
        {
          kind: 'DIRECT_DAMAGE',
          target: 'SOURCE',
          value: 5,
          tags: ['reflect', 'true_damage', 'equip'],
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，甩锅轨道已校准。'],
    equip: ['{unitName} 架起 {equipmentName}，来伤害就反手弹回。'],
  },
};

export default blameCatapult;
