import type { EquipmentLike } from '../base/equipment';

const voiceToTextMachine: EquipmentLike = {
  id: 'equip.voice_to_text_machine',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'EPIC',
  name: '甲方语音转文字机 📼',
  description: '自动提炼重点：先驱散，再扣血。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.voice_to_text_machine', policy: 'IGNORE' },
  statBonus: { LUK: 2 },
  triggers: [
    {
      trigger: { on: 'ON_HIT', when: { role: 'SOURCE', notHasTags: ['miss', 'true_damage', 'reflect'] } },
      effects: [
        { kind: 'DISPEL', target: 'TARGET', mode: 'BUFF', max: 1 },
        { kind: 'DIRECT_DAMAGE', target: 'TARGET', value: 3, tags: ['true_damage', 'equip'] },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，有效信息浓缩成真实伤害。'],
    equip: ['{unitName} 启动 {equipmentName}，对手先掉状态再掉血。'],
  },
};

export default voiceToTextMachine;
