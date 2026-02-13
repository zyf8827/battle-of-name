import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const autoLift: Modifier = {
  id: 'class.living_etc.auto_lift',
  source: 'TALENT',
  name: '自动抬杆 🚧',
  description: '反弹所有类型的伤害。',
  priority: 0,
  tags: ['talent', 'reflect'],
  hooks: {
    onPostAction: (event, { engine, owner }) => {
      // 只有自己是被打的目标才触发
      if (event.targetId !== owner.id || event.type !== 'ATTACK') return [];
      // 排除自己反弹的伤害 (reflect 标签)
      if (event.payload.tags.includes('reflect')) return [];

      const damage = Math.floor((event.payload.value ?? 0) * 0.3); // 反弹 30%
      if (damage <= 0) return [];

      return [
        engine.event.make({
          type: 'ATTACK',
          sourceId: owner.id, // 我发起的反击
          targetId: event.sourceId, // 目标是打我的人
          depth: event.depth + 1,
          payload: {
            value: damage,
            tags: ['reflect', 'true_damage', 'talent'],
          },
        }),
      ];
    },
  },
  texts: {
    trigger: ['{targetName} 自动抬杆，{sourceName} 被反伤了！ 💢'],
  },
};

const livingEtc: CharacterClass = {
  id: 'class.living_etc',
  name: 'ETC 成精 🛣️',
  description: '不论你说什么做什么，他都要抬一下。',
  baseStats: { STR: 8, AGI: 8, VIT: 14, LUK: 8 }, // 较肉
  talents: [autoLift],
  texts: {
    intro: ['{unitName} 斜眼看着你，准备好了一万句反驳。'],
  },
};

export default livingEtc;
