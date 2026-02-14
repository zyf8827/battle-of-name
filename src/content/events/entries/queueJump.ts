import type { EventPoolEntry } from '../../../engine/types';

const queueJump: EventPoolEntry = {
  id: 'event.queue_jump',
  name: '超市插队 🛒',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.no_shame',
        source: 'ENV',
        name: '厚脸皮 👺',
        description: '只要我不尴尬，尴尬的就是别人',
        tags: ['buff', 'env'],
        statBonus: { AGI: 3 },
        duration: 1,
      },
      textOverrides: {
        apply:
          '{targetName} 顶着后面排队大妈杀人般的目光，强行缩短了等待时间 👺',
      },
    },
  ],
  texts: {
    trigger: '超市收银台前排起了长龙，一个人影突然鬼鬼祟祟地插到了最前面 🛒',
  },
};

export default queueJump;
