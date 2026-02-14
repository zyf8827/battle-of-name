import type { EquipmentLike } from '../base/equipment';

const readIgnoreBoomerang: EquipmentLike = {
  id: 'equip.read_ignore_boomerang',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'RARE',
  name: '已读不回回旋镖 🪃',
  description: '你不回我？没事，消息会以伤害的形式飞回来。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.read_ignore_boomerang', policy: 'IGNORE' },
  statBonus: { AGI: 2, LUK: 2 },
  triggers: [
    {
      trigger: { on: 'ON_HIT', when: { role: 'SOURCE', notHasTags: ['miss', 'true_damage', 'reflect'] } },
      effects: [{ kind: 'DIRECT_DAMAGE', target: 'TARGET', value: 5, tags: ['true_damage', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，对方“已读”瞬间变“已伤” 📩。'],
    equip: ['{unitName} 装上 {equipmentName}，冷暴力自动反弹中 🌀。'],
  },
};

export default readIgnoreBoomerang;
