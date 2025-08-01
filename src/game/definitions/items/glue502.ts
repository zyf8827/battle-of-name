import type { Item } from '../../types';

export const glue502: Item = {
  id: 'glue502',
  name: '502胶水 💧',
  description: '使敌人防御力下降，持续3回合。',
  use: (self, state) => {
    state.addStatusEffect(state.opponent, {
      id: 'glued',
      name: '胶水粘滞',
      duration: 3,
      modifiers: {
        def: 0.7, // 防御力降低30%
      },
    });
    state.logEvent(`${self.name} 使用了502胶水，${state.opponent.name} 的防御力下降了。`);
  },
};
