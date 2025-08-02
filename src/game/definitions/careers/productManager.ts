import type { Career } from '../../types';

export const productManager: Career = {
  id: 'productManager',
  name: '产品经理 👨‍💻',
  description: '“你这儿得改一下。” 需求变更多，血量和防御力较高。',
  modifiers: {
    hp: 20,
    def: 5,
    atk: -5,
  },
  hooks: {
    onTurnStart: (self, state) => {
      if (state.checkProbability('productManager-debuff', 0.2)) {
        // 20% chance to change the rules
        state.opponent.stats.defense -= 1;
        state.logEvent(
          `${self.name} 提出了一个新需求，${state.opponent.name} 的防御力下降了！`,
        );
      }
    },
  },
};
