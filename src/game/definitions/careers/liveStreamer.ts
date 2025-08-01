import type { Career } from '../../types';

export const liveStreamer: Career = {
  id: 'liveStreamer',
  name: '主播 🎤',
  description: '“感谢老铁送的火箭！” 能把收到的“礼物”转化为战斗力。',
  modifiers: {
    hp: 10,
  },
  hooks: {
    onBeforeAttack: (self, target, state) => {
      if (state.checkProbability('liveStreamer-heal', 0.15)) {
        const healAmount = Math.floor(self.stats.maxHp * 0.1);
        self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
        state.logEvent(
          `${self.name} 收到了粉丝的礼物，恢复了 ${healAmount} 点生命值！`,
        );
      }
    },
  },
};
