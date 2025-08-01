import type { GameEvent } from '../../types';

export const redEnvelope: GameEvent = {
  id: 'redEnvelope',
  name: '天降红包 🧧',
  description: '天上掉下了一个红包，打开看看有什么惊喜。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      const healAmount = Math.floor(player.stats.maxHp * 0.2);
      player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + healAmount);
      state.logEvent(
        `天降红包！${player.name} 抢到了一个，恢复了 ${healAmount} 点生命值！`,
      );
    },
  },
};
