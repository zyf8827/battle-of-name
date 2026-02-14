import type { EventPoolEntry } from '../../../engine/types';

const toiletPaper: EventPoolEntry = {
  id: 'event.toilet_paper',
  name: '路人借厕纸成功 🧻',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.toilet_kindness',
        source: 'ENV',
        name: '善良小确幸 💚',
        description: '帮助了陌生人',
        tags: ['buff', 'env'],
        statBonus: { LUK: 2, VIT: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 慷慨地递过去一叠纸，完成了一次充满禅意的跨隔间交流 💚',
      },
    },
  ],
  texts: {
    trigger: '一只苍白的手从隔壁隔间底下悄悄伸了过来：“大哥，救救火……” 🧻',
  },
};

export default toiletPaper;
