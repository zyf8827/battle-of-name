import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const adrenaline: Modifier = {
  id: 'class.ddl_warrior.adrenaline',
  source: 'TALENT',
  name: '死线爆发 ⏰',
  description: '生命值越低，攻击力越高。',
  priority: 0,
  tags: ['talent', 'buff'],
  hooks: {
    onOutgoing: (event, { owner }) => {
      if (event.type !== 'ATTACK') return event;
      
      // 计算已损失生命比例
      const missingRate = 1 - (owner.state.hp / owner.state.maxHp);
      // 伤害倍率：满血 1.0 -> 空血 2.0
      const multiplier = 1 + missingRate;
      
      const newValue = Math.floor((event.payload.value ?? 0) * multiplier);
      
      return {
        ...event,
        payload: {
          ...event.payload,
          value: newValue,
        }
      };
    },
  },
  texts: {
    trigger: ['{sourceName} 看着倒计时，手速飙升到了极致！ 🔥'],
  },
};

const ddlWarrior: CharacterClass = {
  id: 'class.ddl_warrior',
  name: 'DDL 战士 📅',
  description: '只有在截止日期前一小时，才是真正的完全体。',
  baseStats: { STR: 10, AGI: 10, VIT: 10, LUK: 5 },
  talents: [adrenaline],
  texts: {
    intro: ['{unitName} 顶着黑眼圈，手里拿着红牛。'],
  },
};

export default ddlWarrior;
