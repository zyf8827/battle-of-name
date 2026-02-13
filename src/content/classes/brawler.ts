import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const onHitDispelTalent: Modifier = {
  id: 'class.brawler.on_hit_dispel',
  source: 'TALENT',
  name: '命中驱散 🧹',
  description: '命中后移除目标一个增益。',
  texts: {
    trigger: ['{ownerName} 触发 {modifierName}，对面一个增益被当场拆掉 💥。'],
  },
  priority: 0,
  tags: ['talent'],
  triggers: [
    {
      trigger: {
        on: 'ON_HIT',
        when: { role: 'SOURCE', hasTag: 'physical', notHasTag: 'miss' },
      },
      effects: [{ kind: 'DISPEL', target: 'TARGET', mode: 'BUFF', max: 1 }],
    },
  ],
};

const brawler: CharacterClass = {
  id: 'class.brawler',
  name: '评论区战神 ⌨️',
  description: '高强度冲浪选手，擅长用梗图、热词和手速把对面节奏打乱。',
  baseStats: {
    STR: 10,
    AGI: 10,
    VIT: 10,
    LUK: 10,
  },
  talents: [onHitDispelTalent],
  texts: {
    intro: [
      '{unitName} 打开评论区，准备开始高强度对线 🗣️。',
      '{unitName} 甩出表情包：今天谁都别想体面下线 😎。',
    ],
  },
};

export default brawler;
