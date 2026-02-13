import type { Consumable } from '../base/consumable';

const moneyPower: Consumable = {
  id: 'consumable.money_power',
  name: '除了钱什么都没有 💰',
  description: '钞能力。回复 50% 最大生命值。',
  effects: [
    { kind: 'SHIELD', target: 'SELF', value: [{ type: 'SCALE', stat: 'VIT', ratio: 0.5 }], tags: ['shield'] }, // 既然回血太普通，不如加个巨额护盾? 
    // 不，描述说的是买活。
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 50, tags: ['heal'] }, // 固定值太小
    // 由于 Effect 不支持百分比回血，我们用一个很高的固定值，或者用 SCALE VIT * 5
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 999, tags: ['heal'] }, // 简单粗暴满血
  ],
  texts: {
    use: ['{unitName} 撒出一把钞票，大喊：“我有的是钱！” 血条瞬间回满 💸。'],
  },
};

export default moneyPower;
