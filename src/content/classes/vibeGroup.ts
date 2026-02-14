import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const rhythmMaster: Modifier = {
  id: 'class.vibe_group.rhythm',
  source: 'TALENT',
  name: '带节奏 🥁',
  description: '每回合随机给自己刷一个增益状态。',
  priority: 0,
  tags: ['talent', 'buff'],
  hooks: {
    onRoundStart: ({ engine, owner }) => {
      const buffs = [
        { statBonus: { STR: 3 }, name: '起哄', description: '攻击力提升' },
        { statBonus: { AGI: 3 }, name: '狂欢', description: '速度提升' },
        { statBonus: { VIT: 3 }, name: '氛围', description: '体质提升' },
      ];
      const picked = engine.rng.weightedPick(buffs, () => 1, 'vibe_group.buff');

      engine.state.applyModifierEffect(owner, owner, {
        kind: 'APPLY_MODIFIER',
        modifier: {
          id: `buff.vibe_${picked.name}`,
          source: 'TALENT',
          name: picked.name,
          description: picked.description,
          tags: ['buff'],
          statBonus: picked.statBonus,
          duration: 1,
        },
      });
    },
  },
  texts: {
    trigger: ['{ownerName} 开始带节奏，全场气氛high了起来 🎉。'],
  },
};

const vibeGroup: CharacterClass = {
  id: 'class.vibe_group',
  name: '气氛组 👯',
  description: '自身实力一般，但擅长营造声势。',
  baseStats: { STR: 9, AGI: 9, VIT: 9, LUK: 12 },
  talents: [rhythmMaster],
  texts: {
    intro: ['{unitName} 拿出了荧光棒和手幅。'],
  },
};

export default vibeGroup;
