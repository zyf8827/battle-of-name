import type { GameEvent } from '../../types';

export const cosmicRay: GameEvent = {
  id: 'cosmicRay',
  name: '宇宙射线 ☄️',
  description: '宇宙射线击中了CPU，你的攻击力计算出现溢出，造成了成吨的伤害！',
  hooks: {
    onTurnStart: (state) => {
      if (state.checkProbability('cosmicRay-trigger', 0.02)) { // 增加触发概率
        state.logEvent('一道宇宙射线击中了CPU！计算发生了溢出！');
        state.addStatusEffect(state.activePlayer, {
          id: 'cosmic_ray_buff',
          name: '攻击力溢出',
          duration: 1,
          modifiers: {
            atk: 2, // 攻击力变为2倍
          },
        });
      }
    },
  },
};