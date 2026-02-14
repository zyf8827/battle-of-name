import type { EventPoolEntry } from '../../../engine/types';

const waterOnKeyboard: EventPoolEntry = {
  id: 'event.water_on_keyboard',
  name: '键盘进水了 💧⌨️',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.keyboard_malfunction',
        source: 'ENV',
        name: '按键失灵 🚫',
        description: '疯狂乱跳中',
        tags: ['debuff', 'env', 'control'],
        duration: 1,
        hooks: {
          onTurnEnd: ({ engine, owner }) => {
            // 当失灵回合结束时，才换上新键盘
            engine.state.applyModifierEffect(owner, owner, {
              kind: 'APPLY_MODIFIER',
              modifier: {
                id: 'buff.new_mechanical_keyboard',
                source: 'ENV',
                name: '换了新机械轴 ⌨️✨',
                description: '手感大幅提升',
                tags: ['buff', 'env'],
                statBonus: { AGI: 10 },
                duration: 3, // 设置为3，因为本回合末会被立刻tick一次变成2，从而保证后续2个行动回合有效
              },
              textOverrides: {
                apply: '{targetName} 趁着键盘晾干的功夫换了一把定制机械键盘，操作流畅度直接起飞 ✨',
              },
            });
          },
        },
      },
      textOverrides: {
        apply: '{targetName} 绝望地拍打着键盘，但屏幕上只会出现一行行的“ssssss” 🚫',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 一个手滑，半瓶快乐水精准覆盖了整个键盘 💧',
  },
};

export default waterOnKeyboard;
