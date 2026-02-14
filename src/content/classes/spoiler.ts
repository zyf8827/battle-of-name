import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const finalSpoiler: Modifier = {
  id: 'class.spoiler.final_spoiler',
  source: 'TALENT',
  name: '剧透大结局 📢',
  description: '第一回合全属性大幅提升，之后变为白板。',
  priority: 0,
  tags: ['talent'],
  hooks: {
    onRoundStart: ({ engine, owner }) => {
      engine.state.applyModifierEffect(owner, owner, {
        kind: 'APPLY_MODIFIER',
        modifier: {
          id: 'buff.spoiler_burst',
          source: 'TALENT',
          name: '剧透一时爽',
          description: '我知道结局！',
          tags: ['buff'],
          statBonus: { STR: 25, AGI: 25 },
          duration: 1,
        },
      });

      // 移除这个天赋本身，确保只触发一次 (变为白板)
      engine.state.removeModifiersByMatcher(owner, (m) => m.id === 'class.spoiler.final_spoiler');
    },
  },
  texts: {
    trigger: ['{ownerName} 大喊一声：“凶手是司机！” (全属性爆发) 🗣️'],
  },
};

const spoiler: CharacterClass = {
  id: 'class.spoiler',
  name: '剧透狗 🐶',
  description: '让人恨得牙痒痒，但你又打不过他（仅限开局）。',
  baseStats: { STR: 8, AGI: 8, VIT: 8, LUK: 8 }, // 平庸面板，靠爆发
  talents: [finalSpoiler],
  texts: {
    intro: ['{unitName} 露出了邪恶的笑容，准备毁掉你的体验。'],
  },
};

export default spoiler;
