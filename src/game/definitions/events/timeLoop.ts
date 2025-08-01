import type { GameEvent } from '../../types';

export const timeLoop: GameEvent = {
  id: 'timeLoop',
  name: '时间循环 ⏳',
  description: '你陷入了时间循环，战斗将回到上一回合的状态。',
  hooks: {
    onTurnStart: (state) => {
      // This would be complex to implement, requires saving previous states
      state.logEvent('你陷入了时间循环！');
    },
  },
};
