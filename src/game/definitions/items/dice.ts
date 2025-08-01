import type { Item } from '../../types';

export const dice: Item = {
  id: 'dice',
  name: '骰子 🎲',
  description: '投掷一个骰子，根据点数触发不同的效果。',
  use: (self, state) => {
    const roll = Math.floor(state.rng() * 6) + 1;
    state.logEvent(`${self.name} 投掷了一个骰子，点数是 ${roll}。`);
    switch (roll) {
      case 1:
        state.logEvent('点数是1，运气真差，受到5点伤害！');
        self.stats.hp = Math.max(0, self.stats.hp - 5);
        break;
      case 6:
        state.logEvent('点数是6，运气爆棚，恢复10点生命值！');
        self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + 10);
        break;
      default:
        state.logEvent('点数是' + roll + '，什么也没发生。');
        break;
    }
  },
};
