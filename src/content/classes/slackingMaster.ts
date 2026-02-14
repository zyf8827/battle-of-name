import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const toiletSanctuary: Modifier = {
  id: 'class.slacking_master.toilet',
  source: 'TALENT',
  name: '带薪拉屎 🚽',
  description: '躲进厕所，获得闪避与回复。',
  priority: 0,
  tags: ['talent'],
  // 使用 Hook 实现概率触发更稳
  hooks: {
    onRoundStart: ({ engine, owner }) => {
      if (engine.rng.bool(0.25, { domain: 'COMBAT', luk: owner.stats.LUK })) {
        engine.state.applyModifierEffect(owner, owner, {
          kind: 'APPLY_MODIFIER',
          modifier: {
            id: 'buff.toilet_hide',
            source: 'TALENT',
            name: '厕所遁术 🧻',
            description: '信号屏蔽中...',
            tags: ['buff'],
            statBonus: { AGI: 20 }, // 大幅提升 AGI 增加回避
            duration: 1,
          },
        });
        engine.event.emitDirectHeal(owner, owner, 15, ['heal', 'talent']);
      }
    },
  },
  texts: {
    trigger: ['{ownerName} 突然消失了，大概是去了厕所...'],
  },
};

const slackingMaster: CharacterClass = {
  id: 'class.slacking_master',
  name: '摸鱼大师 🐟',
  description: '工作只是副业，带薪拉屎才是主业。',
  baseStats: { STR: 8, AGI: 12, VIT: 10, LUK: 10 },
  talents: [toiletSanctuary],
  texts: {
    intro: ['{unitName} 熟练地切出了桌面，随时准备摸鱼。'],
  },
};

export default slackingMaster;
