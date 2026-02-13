import type { Consumable } from '../base/consumable';



const bossPie: Consumable = {
  id: 'consumable.boss_pie',
  name: '老板画的饼 🥧',
  description: '看着很大，口感很虚。获得临时高额护盾。',
  effects: [
    { 
      kind: 'SHIELD', 
      target: 'SELF', 
      value: [{ type: 'FLAT', value: 60 }], 
      tags: ['shield'] 
    },
    // 加个 buff 仅用于显示状态
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.boss_pie_visual',
        source: 'BUFF',
        name: '饱腹感',
        description: '感觉吃饱了，又好像没吃',
        duration: 1,
        tags: ['buff'],
      }
    }
  ],
  texts: {
    use: ['{unitName} 接住了 {itemName}，瞬间充满了虚幻的安全感！🛡️'],
  },
};

export default bossPie;
