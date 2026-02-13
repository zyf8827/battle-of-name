import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const onHitLifestealTalent: Modifier = {
  id: 'class.sustainer.on_hit_lifesteal',
  source: 'TALENT',
  name: '命中回血 🩸',
  description: '命中后按伤害比例回复生命。',
  tags: ['talent', 'heal'],
  texts: {
    triggerByTag: {
      heal: [
        '{sourceName} 触发 {modifierName}，回复 {amount} 点生命 💚。',
        '{sourceName} 的 {modifierName} 生效，状态回暖 {amount} 点 🌡️。',
      ],
    },
    trigger: ['{sourceName} 的 {modifierName} 生效，状态回暖 ☕。'],
  },
  triggers: [
    {
      trigger: {
        on: 'ON_HIT',
        when: { role: 'SOURCE', hasTag: 'physical', notHasTag: 'miss' },
      },
      effects: [{ kind: 'LIFESTEAL', ratio: 0.1, tags: ['heal', 'talent'] }],
    },
  ],
};

const sustainer: CharacterClass = {
  id: 'class.sustainer',
  name: '续航运营 🐢',
  description: '擅长拉长战线，靠稳定续航把对面拖到心态掉线。',
  baseStats: {
    STR: 9,
    AGI: 9,
    VIT: 12,
    LUK: 10,
  },
  talents: [onHitLifestealTalent],
  texts: {
    intro: [
      '{unitName} 开局就把节奏放慢，准备打长期运营局 📉。',
      '{unitName} 表示：不急，先把血线稳住再说 🧘。',
    ],
  },
};

export default sustainer;
