import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const nextTimeForSure: Modifier = {
  id: 'class.flaker.next_time',
  source: 'TALENT',
  name: '下次一定 🕊️',
  description: '成功闪避后，回复生命值。',
  priority: 0,
  tags: ['talent', 'heal'],
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        {
          kind: 'SHIELD',
          target: 'SELF',
          value: [{ type: 'FLAT', value: 3 }],
          tags: ['shield', 'talent'],
        },
      ],
    },
  ],
  hooks: {
    onPostAction: (event, { engine, owner }) => {
      // 监听针对自己的攻击
      if (event.targetId !== owner.id || event.type !== 'ATTACK') return [];
      
      // 如果被闪避了 (miss)
      if (event.payload.tags.includes('miss')) {
        engine.event.emitDirectHeal(owner, owner, 10, ['heal', 'talent']);
        return [];
      }
      return [];
    },
  },
  texts: {
    trigger: ['{targetName} 鸽了这次攻击，并觉得很舒服 (回血) 😌。'],
  },
};

const flaker: CharacterClass = {
  id: 'class.flaker',
  name: '鸽子精 🐦',
  description: '人类的本质是复读机，而鸽子的本质是咕咕咕。',
  baseStats: { STR: 7, AGI: 14, VIT: 7, LUK: 12 }, // 高敏捷高闪避
  talents: [nextTimeForSure],
  texts: {
    intro: ['{unitName} 说他已经在路上了 (其实刚起床)。'],
  },
};

export default flaker;
