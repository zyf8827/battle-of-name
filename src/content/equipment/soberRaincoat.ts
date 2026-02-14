import type { EquipmentLike } from '../base/equipment';

const soberRaincoat: EquipmentLike = {
  id: 'equip.sober_raincoat',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'RARE',
  name: '人间清醒雨衣 ☔',
  description: '每回合自动洗掉一层负面情绪。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.sober_raincoat', policy: 'IGNORE' },
  statBonus: { VIT: 2, LUK: 2 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [{ kind: 'DISPEL', target: 'SELF', mode: 'DEBUFF', max: 1 }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，坏情绪开始自动排水。'],
    equip: ['{unitName} 穿上 {equipmentName}，每回合先清一层负面状态。'],
  },
};

export default soberRaincoat;
