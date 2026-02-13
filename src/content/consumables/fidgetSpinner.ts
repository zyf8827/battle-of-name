import type { Consumable } from '../base/consumable';

const fidgetSpinner: Consumable = {
  id: 'consumable.fidget_spinner',
  name: '指尖陀螺 🌀',
  description: '高速旋转，切割空气。造成三次伤害。',
  effects: [
    { kind: 'DIRECT_DAMAGE', target: 'TARGET', value: 6, tags: ['physical'] },
    { kind: 'DIRECT_DAMAGE', target: 'TARGET', value: 6, tags: ['physical'] },
    { kind: 'DIRECT_DAMAGE', target: 'TARGET', value: 6, tags: ['physical'] },
  ],
  texts: {
    use: ['{unitName} 扔出 {itemName}，在 {targetName} 身上疯狂旋转切割！🌪️'],
  },
};

export default fidgetSpinner;
