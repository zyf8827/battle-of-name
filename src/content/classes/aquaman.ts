import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const fishPond: Modifier = {
  id: 'class.aquaman.fish_pond',
  source: 'TALENT',
  name: '鱼塘管理 🎣',
  description: '多线操作，攻击后有概率追加一次普攻。',
  priority: 0,
  tags: ['talent'],
  hooks: {
    onPostAction: (event, { engine, owner }) => {
      // 仅限主动攻击触发
      if (event.sourceId !== owner.id || event.type !== 'ATTACK' || event.depth > 0) return [];

      // 30% 概率
      if (!engine.rng.bool(0.3, { domain: 'COMBAT', luk: owner.stats.LUK })) return [];

      // 追加一次 50% 伤害的攻击
      const damage = Math.floor((event.payload.value ?? 0) * 0.5);
      return [
        engine.event.make({
          type: 'ATTACK',
          sourceId: owner.id,
          targetId: event.targetId,
          depth: event.depth + 1,
          payload: {
            value: Math.max(1, damage),
            tags: ['physical', 'talent'],
          },
        }),
      ];
    },
  },
  texts: {
    trigger: ['{sourceName} 顺手回了另一个备胎的消息 (追加攻击) 📱。'],
  },
};

const aquaman: CharacterClass = {
  id: 'class.aquaman',
  name: '海王 🔱',
  description: '只要网撒得够广，总有鱼上钩。',
  baseStats: { STR: 9, AGI: 11, VIT: 8, LUK: 12 },
  talents: [fishPond],
  texts: {
    intro: ['{unitName} 拿出了三部手机，同时操作。'],
  },
};

export default aquaman;
