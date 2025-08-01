import type { Item } from '../../types';

export const dice: Item = {
  id: 'dice',
  name: '骰子 🎲',
  description: '投掷一个骰子，根据点数触发不同的效果。',
  use: (self, state) => {
    const roll = Math.floor(state.rng() * 6) + 1;
    state.logEvent(`${self.name} 投掷了一个骰子，点数是 ${roll}。`);
    // Implement different effects based on the roll
  },
};
