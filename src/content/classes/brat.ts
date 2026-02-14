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

      // 尝试弄坏装备
      if (engine.rng.bool(0.1, { domain: 'COMBAT', luk: owner.stats.LUK })) {
        const equipments = target.modifiers.filter((m) => m.source === 'EQUIP');
        if (equipments.length > 0) {
          const dropped =
            equipments[Math.floor(engine.rng.next() * equipments.length)];
          if (dropped) {
            // 记录触发日志
            engine.log.system({
              key: 'bratDisassembleEquipment',
              variables: {
                sourceName: owner.name,
                sourceId: owner.id,
                targetName: target.name,
                targetId: target.id,
                equipmentName: dropped.name,
                equipmentId: dropped.id,
              },
              tags: ['talent', 'equip'],
              actor: owner,
              target,
            });
            // 移除装备（使用 state.removeModifiersByMatcher，不会记录日志）
            engine.state.removeModifiersByMatcher(
              target,
              (m) =>
                m.id === dropped.id &&
                m.source === 'EQUIP' &&
                m.stacking?.stackKey === dropped.stacking?.stackKey,
              1,
            );
          }
        }
      }

      // 尝试弄坏消耗品
      if (engine.rng.bool(0.1, { domain: 'COMBAT', luk: owner.stats.LUK })) {
        const consumables = target.state.consumables ?? [];
        if (consumables.length > 0) {
          const dropped =
            consumables[Math.floor(engine.rng.next() * consumables.length)];
          if (dropped) {
            // 记录触发日志
            engine.log.system({
              key: 'bratDisassembleConsumable',
              variables: {
                sourceName: owner.name,
                sourceId: owner.id,
                targetName: target.name,
                targetId: target.id,
                itemId: dropped,
              },
              tags: ['talent', 'consumable'],
              actor: owner,
              target,
            });
            // 移除消耗品（只移除第一个匹配项）
            const droppedIndex = consumables.indexOf(dropped);
            target.state.consumables = consumables.filter(
              (id, idx) => id !== dropped || idx !== droppedIndex,
            );
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
