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

      // 弄坏对手装备
      if (engine.rng.bool(0.1, { domain: 'COMBAT', luk: owner.stats.LUK })) {
        const equipments = target.modifiers.filter((m) => m.source === 'EQUIP');
        if (equipments.length > 0) {
          // 随机选择一件装备
          const index = engine.rng.range(0, equipments.length - 1, 'talent.brat.disassemble.equip');
          const dropped = equipments[index];
          if (dropped) {
            // 移除装备
            engine.state.removeModifiersByMatcher(target, (m) => m.id === dropped.id, 1);
            // 手动记录日志，包含 sourceName 和 targetName
            engine.log.system({
              key: 'dropEquipment',
              variables: {
                sourceName: owner.name,
                sourceId: owner.id,
                targetName: target.name,
                targetId: target.id,
                equipmentId: dropped.id,
                equipmentName: dropped.name,
              },
              tags: ['equip'],
              actor: owner,
              target,
            });
          }
        }
      }

      // 弄坏对手道具
      if (engine.rng.bool(0.1, { domain: 'COMBAT', luk: owner.stats.LUK })) {
        const consumables = target.state.consumables ?? [];
        if (consumables.length > 0) {
          // 随机选择一个道具
          const index = engine.rng.range(0, consumables.length - 1, 'talent.brat.disassemble.consumable');
          const dropped = consumables[index];
          if (dropped) {
            // 移除道具
            target.state.consumables = consumables.filter((c) => c !== dropped);
            // 手动记录日志，包含 sourceName 和 targetName
            engine.log.system({
              key: 'dropConsumable',
              variables: {
                sourceName: owner.name,
                sourceId: owner.id,
                targetName: target.name,
                targetId: target.id,
                itemId: dropped,
                itemName: dropped,
              },
              tags: ['env'],
              actor: owner,
              target,
            });
          }
        }
      }

      return [];
    },
  },
  texts: {
    trigger: [
      '{targetName} 发现自己的东西被 {sourceName} 弄坏了！ 😭',
      '{sourceName} 的家长说：他还只是个孩子，又不是故意的。',
    ],
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
