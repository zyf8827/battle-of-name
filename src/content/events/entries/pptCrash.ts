import type { EventPoolEntry } from '../../../engine/types';

const pptCrash: EventPoolEntry = {
  id: 'event.ppt_crash',
  name: 'PPT崩溃 💥',
  weight: 10,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 15,
      tags: ['env', 'true_damage'],
    },
  ],
  texts: {
    trigger: '{actorName} 辛辛苦苦做了一天的PPT突然闪退，且没有保存！💻🔥',
  },
};

export default pptCrash;
