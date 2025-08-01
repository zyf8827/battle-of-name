import type { GameEvent } from '../../types';

export const onlineBug: GameEvent = {
  id: 'onlineBug',
  name: '线上BUG 🐛',
  description: '生产环境出现了紧急BUG，当前玩家必须立即修复，本回合无法行动。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.activePlayer, {
        id: 'stunned',
        name: '眩晕',
        duration: 1,
      });
      state.logEvent(
        `线上BUG！${state.activePlayer.name} 必须立即修复，本回合无法行动！`,
      );
    },
  },
};
