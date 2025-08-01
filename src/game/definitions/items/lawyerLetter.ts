import type { Item } from '../../types';

export const lawyerLetter: Item = {
  id: 'lawyerLetter',
  name: '律师函 📜',
  description: '对敌人造成精神打击，使其攻击力和防御力都下降5点。',
  use: (self, state) => {
    state.opponent.stats.attack = Math.max(0, state.opponent.stats.attack - 5);
    state.opponent.stats.defense = Math.max(0, state.opponent.stats.defense - 5);
    state.logEvent(
      `${self.name} 发出了一封律师函，${state.opponent.name} 的攻击力和防御力都下降了。`,
    );
  },
};
