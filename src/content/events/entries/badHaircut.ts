import type { EventPoolEntry } from '../../../engine/types';

const badHaircut: EventPoolEntry = {
  id: 'event.bad_haircut',
  name: '理发师的“一点点” 💇',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.ugly_hair',
        source: 'ENV',
        name: '发型崩坏 🗿',
        description: '丑到不敢见人',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -5 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 看着镜子里那个像被狗啃过的发型，陷入了沉思 🗿',
      },
    },
  ],
  texts: {
    trigger: '理发师挥舞着剪刀：“信我，这绝对是今年最火的造型。” 💇',
  },
};

export default badHaircut;
