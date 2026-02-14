import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const repeatMachine: Modifier = {
  id: 'class.repeater.repeat',
  source: 'TALENT',
  name: '+1 🦜',
  description: '攻击有概率触发完全相同的第二次攻击。',
  priority: 0,
  tags: ['talent'],
  hooks: {
    onPostAction: (event, { engine, owner }) => {
      if (
        event.sourceId !== owner.id ||
        event.type !== 'ATTACK' ||
        event.depth > 0
      )
        return [];

      // 20% 概率
      if (!engine.rng.bool(0.2, { domain: 'COMBAT', luk: owner.stats.LUK }))
        return [];

      return [
        engine.event.make({
          ...event,
          parentId: event.id,
          depth: event.depth + 1,
          payload: {
            ...event.payload,
            tags: [...event.payload.tags, 'talent'],
          }, // 复读
        }),
      ];
    },
  },
  texts: {
    trigger: ['{sourceName} 复读了上一条消息！ 📝'],
  },
};

const repeater: CharacterClass = {
  id: 'class.repeater',
  name: '复读机 🤖',
  description: '人类的本质。人类的本质。',
  baseStats: { STR: 10, AGI: 10, VIT: 10, LUK: 10 },
  talents: [repeatMachine],
  texts: {
    intro: ['{unitName} 准备就绪。{unitName} 准备就绪。'],
  },
};

export default repeater;
