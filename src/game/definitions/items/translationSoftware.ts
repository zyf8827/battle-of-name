import type { Item } from '../../types';

export const translationSoftware: Item = {
  id: 'translationSoftware',
  name: '翻译软件 🌐',
  description: '可以与敌人进行无障碍交流，有几率说服敌人放弃战斗。',
  use: (self, state) => {
    if (state.checkProbability('translationSoftware-endBattle', 0.1)) {
      state.logEvent(
        `${self.name} 通过翻译软件与 ${state.opponent.name} 进行了亲切友好的交流，对方决定放弃战斗。`,
      );
      // End the battle
    }
  },
};
