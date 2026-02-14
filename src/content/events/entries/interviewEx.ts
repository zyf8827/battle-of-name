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
        apply: '{targetName} 发现面试官是前任 😱',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '{actorName} 推门进面试室，面试官抬头：好久不见 👻',
  },
};

export default interviewEx;
