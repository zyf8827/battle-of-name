
import { Career } from '../../types';

export const masterOfLoafing: Career = {
  id: 'masterOfLoafing',
  name: '摸鱼大师 🐟',
  description: '有几率“带薪摸鱼”躲过一次攻击并回复少量生命。',
  hooks: {
    onBeforeAttack: (self, target, state) => {
      // 15% 的几率摸鱼
      if (state.checkProbability('masterOfLoafing-dodge', 0.15)) {
        const healedHp = Math.floor(self.stats.maxHp * 0.1); // 回复10%的生命
        self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healedHp);
        state.logEvent(
          `${self.name} 开始“带薪摸鱼”，躲开了攻击并回复了 ${healedHp} 点HP！`,
        );
        return true; // 返回 true 来表示攻击被取消
      }
    },
  },
};
