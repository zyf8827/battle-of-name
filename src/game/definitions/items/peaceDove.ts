import type { Item } from '../../types';

export const peaceDove: Item = {
  id: 'peaceDove',
  name: '和平鸽 🕊️',
  description: '放飞一只和平鸽，双方在接下来的1回合内无法互相攻击。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'peace_dove_effect',
      name: '和平鸽',
      duration: 1,
    });
    state.addStatusEffect(state.opponent, {
      id: 'peace_dove_effect',
      name: '和平鸽',
      duration: 1,
    });
    state.logEvent(
      `${self.name} 放飞了一只和平鸽，战场上暂时充满了和平的气氛。`,
    );
  },
};
