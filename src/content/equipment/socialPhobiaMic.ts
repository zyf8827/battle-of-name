import type { EquipmentLike } from '../base/equipment';

const socialPhobiaMic: EquipmentLike = {
  id: 'equip.social_phobia_mic',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '社恐克星麦克风 🎤',
  description: '谁接话谁掉幸运。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.social_phobia_mic', policy: 'IGNORE' },
  statBonus: { AGI: 2 },
  triggers: [
    {
      trigger: { on: 'ON_HIT', when: { role: 'SOURCE', notHasTags: ['miss'] } },
      effects: [
        {
          kind: 'APPLY_MODIFIER',
          target: 'TARGET',
          modifier: {
            id: 'debuff.social_phobia_mic.luk_down',
            source: 'BUFF',
            name: '社恐发作',
            duration: 1,
            tags: ['debuff'],
            statBonus: { LUK: -2 },
          },
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，沉默的人先慌了。'],
    equip: ['{unitName} 打开 {equipmentName}，对手的社交运势极速下跌。'],
  },
};

export default socialPhobiaMic;
