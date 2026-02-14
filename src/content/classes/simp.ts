import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const selfMoved: Modifier = {
  id: 'class.simp.self_moved',
  source: 'TALENT',
  name: '自我感动 🥺',
  description: '受到伤害时，有概率获得护盾。',
  priority: 0,
  tags: ['talent'],
  hooks: {
    onPostAction: (event, { engine, owner }) => {
      // 只有自己是被打的目标才触发
      if (event.targetId !== owner.id || event.type !== 'ATTACK') return [];

      // 20% 概率
      if (!engine.rng.bool(0.2, { domain: 'COMBAT', luk: owner.stats.LUK }))
        return [];

      return [
        engine.event.make({
          type: 'APPLY_BUFF',
          sourceId: owner.id,
          targetId: owner.id,
          depth: event.depth + 1,
          payload: {
            modifier: {
              id: 'buff.simp_shield',
              source: 'TALENT',
              name: '深情护盾',
              description: '我对你这么好...',
              tags: ['buff', 'shield'],
              duration: 1,
              statBonus: { VIT: 2 }, // 增加体质
            },
            tags: ['buff'],
          },
        }),
      ];
    },
  },
  texts: {
    trigger: ['{targetName} 被打得好疼，但觉得这是爱的考验 💔。'],
  },
};

const simp: CharacterClass = {
  id: 'class.simp',
  name: '舔狗 🐕',
  description: '只要我还在呼吸，就不会停止付出。',
  baseStats: { STR: 6, AGI: 6, VIT: 14, LUK: 4 }, // 高血量抗揍
  talents: [selfMoved],
  texts: {
    intro: ['{unitName} 手捧鲜花，即使对方没有回头。'],
  },
};

export default simp;
