import type { EquipmentLike } from '../base/equipment';

const keyboard: EquipmentLike = {
  id: 'equip.keyboard',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'COMMON',
  name: '电竞网吧键盘 ⌨️',
  description: '青轴咔哒声自带压迫感，手速和攻击欲一起拉满。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.keyboard', policy: 'IGNORE' },
  statBonus: { STR: 4 },
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，手感瞬间回到巅峰 🎮。'],
    equip: ['{unitName} 装上 {equipmentName}，敲击声里都是杀气 🔊。'],
  },
};

export default keyboard;
