import type { EquipmentLike } from '../base/equipment';

const thickSkinMecha: EquipmentLike = {
  id: 'equip.thick_skin_mecha',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'EPIC',
  name: '脸皮增厚机甲 🤖',
  description: '你越打我，我越有盾。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.thick_skin_mecha', policy: 'IGNORE' },
  statBonus: { VIT: 3 },
  triggers: [
    {
      trigger: { on: 'ON_HURT', when: { role: 'TARGET', notHasTags: ['miss'] } },
      effects: [{ kind: 'SHIELD', value: [{ type: 'FLAT', value: 7 }], tags: ['shield', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，脸皮硬度已升级到机械级。'],
    equip: ['{unitName} 合体 {equipmentName}，挨打就长护盾。'],
  },
};

export default thickSkinMecha;
