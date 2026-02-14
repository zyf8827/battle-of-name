import type { EventPoolEntry } from '../../../engine/types';

const badHaircut: EventPoolEntry = {
  id: 'event.bad_haircut',
  name: '理发师的“一点点” 💇',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.ugly_hair',
        source: 'ENV',
        name: '发型崩坏 🗿',
        description: '丑到不敢见人，试图用手遮脸',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -10, AGI: -2 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 看着镜子里那个像被狗啃过的发型，感觉自己成了行走的笑话 🗿',
      },
    },
  ],
  texts: {
    trigger: '理发师挥舞着剪刀：“信我，这绝对是今年最火的造型。” 结果剪完像个盆 💇',
  },
};

export default badHaircut;
