import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const notFound: Modifier = {
  id: 'consumable.page_404.stealth',
  source: 'BUFF',
  name: '404 Not Found 🚫',
  description: '找不到对象。大幅提升闪避。',
  duration: 2,
  tags: ['buff'],
  hooks: {
    onIncoming: (event, { engine, owner }) => {
      if (event.type !== 'ATTACK') return event;
      // 50% 概率 Force Miss
      if (engine.rng.bool(0.5, { domain: 'COMBAT', luk: owner.stats.LUK })) {
        return {
          ...event,
          payload: {
            ...event.payload,
            value: 0,
            tags: [...event.payload.tags, 'miss'],
            isMiss: true,
          },
        };
      }
      return event;
    },
  },
  texts: {
    trigger: ['攻击无法找到 {targetName} (404)！'],
  },
};

const page404: Consumable = {
  id: 'consumable.page_404',
  name: '404 页面 📄',
  description: '找不到对象。获得高额闪避。',
  effects: [{ kind: 'APPLY_MODIFIER', target: 'SELF', modifier: notFound }],
  texts: {
    use: ['{unitName} 举起 {itemName}，身形开始闪烁不定 💻。'],
  },
};

export default page404;
