import type { GameEvent } from '../../types';

export const networkLag: GameEvent = {
  id: 'networkLag',
  name: '网络延迟 🌐',
  description: '双方速度大幅下降。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'network_lag_debuff',
        name: '网络延迟',
        duration: 1,
        modifiers: {
          speed: 0.5,
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'network_lag_debuff',
        name: '网络延迟',
        duration: 1,
        modifiers: {
          speed: 0.5,
        },
      });
      state.logEvent('网络延迟！双方速度大幅下降！');
    },
  },
};