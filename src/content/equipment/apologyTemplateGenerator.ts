import type { EquipmentLike } from '../base/equipment';

const apologyTemplateGenerator: EquipmentLike = {
  id: 'equip.apology_template_generator',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'RARE',
  name: '认错模板生成器 🤖',
  description: '每回合自动生成一份“本人已深刻反思”，顺便驱散负面。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.apology_template_generator', policy: 'IGNORE' },
  statBonus: { LUK: 2, VIT: 1 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [{ kind: 'DISPEL', target: 'SELF', mode: 'DEBUFF', max: 1 }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，负面状态开始被模板化处理。'],
    equip: ['{unitName} 启动 {equipmentName}，先道歉，再清Debuff。'],
  },
};

export default apologyTemplateGenerator;
