
import { Item } from '../../types';

export const otakuHappyWater: Item = {
  id: 'otakuHappyWater',
  name: '肥宅快乐水 🥤',
  description: '立即回复50点HP，但下一回合速度减半。',
  use: (self, state) => {
    const healedHp = 50;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healedHp);
    state.logEvent(
      `${self.name} 吨吨吨喝下了一瓶 [肥宅快乐水]，回复了 ${healedHp} 点HP！`,
    );

    // 添加一个“满足”的debuff，降低下回合的属性
    state.addStatusEffect(self, {
      id: 'happy_sated',
      name: '心满意足',
      duration: 2, // 持续到自己的下个回合结束
      modifiers: {
        // 我们还没有速度属性，暂时用降低防御力来模拟
        def: 0.8, // 防御力降低20%
      },
    });
  },
};
