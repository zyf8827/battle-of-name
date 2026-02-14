import type { EventPoolEntry } from '../../../engine/types';

const interviewEx: EventPoolEntry = {
  id: 'event.interview_ex',
  name: '面试遇到前任 👻',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.interview_ex_awkward',
        source: 'ENV',
        name: '面试尴尬 😓',
        description: '面试官是前任',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -3, VIT: -2 },
        duration: 1,
      },
      textOverrides: {
        apply:
          '{targetName} 的大脑瞬间一片空白，脚趾已经开始在鞋里抠三室一厅 😱',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '推开面试室的大门，那个刻在记忆深处的面孔缓缓抬起头 👻',
  },
};

export default interviewEx;
