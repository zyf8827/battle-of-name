import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const disassemble: Modifier = {
  id: 'class.brat.disassemble',
  source: 'TALENT',
  name: '拆家 🧸',
  description: '熊孩子所过之处寸草不生，有概率弄坏对手装备。',
  priority: 0,
  tags: ['talent'],
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        {
          kind: 'SHIELD',
          target: 'SELF',
          value: [{ type: 'FLAT', value: 6 }],
          tags: ['shield', 'talent'],
        },
      ],
    },
  ],
  // 使用 Hook 实现概率触发
  hooks: {
    onPostAction: (event, { engine, owner, target }) => {
      if (event.sourceId !== owner.id || event.type !== 'ATTACK') return [];
      
      if (engine.rng.bool(0.1, { domain: 'COMBAT', luk: owner.stats.LUK })) {
         engine.state.loseRandomEquipment(target);
      }
      if (engine.rng.bool(0.1, { domain: 'COMBAT', luk: owner.stats.LUK })) {
         engine.state.loseRandomConsumable(target);
      }
      return [];
    }
  },
  texts: {
    trigger: ['{targetName} 发现自己的东西被 {sourceName} 弄坏了！ 😭', '{sourceName} 的家长说：他还只是个孩子，又不是故意的。'],
  },
};

const brat: CharacterClass = {
  id: 'class.brat',
  name: '熊孩子 👶',
  description: '无法无天，甚至能把规则本身拆掉。',
  baseStats: { STR: 6, AGI: 12, VIT: 6, LUK: 15 }, // 高运高敏，脆皮
  talents: [disassemble],
  texts: {
    intro: ['{unitName} 尖叫着跑来跑去，手里好像拿着什么东西。'],
  },
};

export default brat;
