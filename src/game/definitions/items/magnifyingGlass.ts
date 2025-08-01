import type { Item } from '../../types';

export const magnifyingGlass: Item = {
  id: 'magnifyingGlass',
  name: '放大镜 🔎',
  description: '查看敌人的详细属性和状态。',
  use: (self, state) => {
    state.logEvent(
      `${self.name} 使用了放大镜，看清了 ${state.opponent.name} 的底细：`,
    );
    state.logEvent(`  HP: ${state.opponent.stats.hp}/${state.opponent.stats.maxHp}`);
    state.logEvent(`  攻击: ${state.opponent.stats.attack}`);
    state.logEvent(`  防御: ${state.opponent.stats.defense}`);
    state.logEvent(`  速度: ${state.opponent.stats.speed}`);
    state.logEvent(`  暴击率: ${state.opponent.stats.critRate}`);
    state.logEvent(`  暴击伤害: ${state.opponent.stats.critDamage}`);
    if (state.opponent.statusEffects.length > 0) {
      state.logEvent(`  状态效果: ${state.opponent.statusEffects.map(e => e.name).join(', ')}`);
    } else {
      state.logEvent(`  状态效果: 无`);
    }
  },
};
