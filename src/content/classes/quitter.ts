import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const tacticalSleep: Modifier = {
  id: 'class.quitter.tactical_sleep',
  source: 'TALENT',
  name: '战术睡眠 🛌',
  description: '受到致命伤害时，强制锁血并回复生命（限一次）。',
  priority: 0,
  tags: ['talent', 'immune'],
  hooks: {
    onIncoming: (event, { engine, owner }) => {
      // 检查是否致死
      if (
        ['ATTACK', 'DIRECT_DAMAGE'].includes(event.type) &&
        (event.payload.value ?? 0) >= owner.state.hp
      ) {
        // 确保没有被触发过 (通过检查是否拥有这个 buff? 本身就是天赋，不能移除天赋)
        // 我们可以给 owner 加个标记，或者把这个天赋替换成已失效版本
        // 简单做法：给自己施加一个“已触发”标记，如果已有标记则不触发

        const used = owner.modifiers.some((m) => m.id === 'debuff.quitter_used');
        if (used) return event;

        // 触发锁血：伤害置为 0
        // 同时触发回血
        engine.event.emitDirectHeal(owner, owner, Math.floor(owner.state.maxHp * 0.2), [
          'heal',
          'talent',
        ]);

        // 标记已使用
        engine.state.applyModifierEffect(owner, owner, {
          kind: 'APPLY_MODIFIER',
          modifier: {
            id: 'debuff.quitter_used',
            source: 'TALENT',
            name: '退堂鼓已敲',
            description: '下次真的退了',
            tags: ['debuff'], // 也可以是 hidden
            duration: -1,
          },
        });

        return {
          ...event,
          payload: {
            ...event.payload,
            value: 0,
            tags: [...event.payload.tags, 'immune', 'talent'],
          },
        };
      }
      return event;
    },
  },
  texts: {
    trigger: ['{targetName} 觉得这把打不了，决定先睡一觉 (免死回血) 💤。'],
  },
};

const quitter: CharacterClass = {
  id: 'class.quitter',
  name: '退堂鼓艺术家 🥁',
  description: '只要我放弃得够快，失败就追不上我。',
  baseStats: { STR: 6, AGI: 6, VIT: 12, LUK: 12 },
  talents: [tacticalSleep],
  texts: {
    intro: ['{unitName} 甚至还没开始，就已经在想怎么投降了。'],
  },
};

export default quitter;
