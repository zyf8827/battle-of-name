import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const dimensionStrike: Modifier = {
  id: 'class.ppt_architect.dimension_strike',
  source: 'TALENT',
  name: '降维打击 📉',
  description: '用精美的胶片掩盖空洞的内容，造成魔法伤害。',
  priority: 0,
  tags: ['talent', 'magic'],
  hooks: {
    onOutgoing: (event) => {
      if (event.type === 'ATTACK') {
        // 强制转换为魔法伤害，并增加 50% 伤害
        const newTags = event.payload.tags.filter((t) => t !== 'physical').concat('magic');
        const newValue = Math.floor((event.payload.value ?? 0) * 1.5);

        return {
          ...event,
          payload: {
            ...event.payload,
            value: newValue,
            tags: newTags,
          },
        };
      }
      return event;
    },
  },
  texts: {
    trigger: ['{sourceName} 打开了精心制作的 PPT，对 {targetName} 造成了降维打击 📊。'],
  },
};

const pptArchitect: CharacterClass = {
  id: 'class.ppt_architect',
  name: 'PPT 架构师 🏗️',
  description: '画图能力远超编码能力，擅长用概念击溃对手。',
  baseStats: { STR: 5, AGI: 10, VIT: 8, LUK: 15 }, // 低 STR 但靠倍率
  talents: [dimensionStrike],
  texts: {
    intro: ['{unitName} 正在调整投影仪的分辨率...'],
  },
};

export default pptArchitect;
