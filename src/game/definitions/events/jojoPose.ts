
import type { GameEvent } from '../../types';

export const jojoPose: GameEvent = {
  id: 'jojoPose',
  name: 'JOJO立 🕺',
  description: '你的对手突然摆出了JOJO立，本回合闪避率大幅提升！',
  hooks: {
    onTurnStart: (state) => {
      if (state.checkProbability('jojoPose-trigger', 0.02)) {
        state.logEvent(
          `${state.activePlayer.name} 突然摆出了一个奇怪的姿势！气场变得不一样了！`,
        );
        state.addStatusEffect(state.activePlayer, {
          id: 'jojo_pose_buff',
          name: 'JOJO立',
          duration: 1,
          hooks: {
            onBeforeAttack: (self, target, state) => {
              state.logEvent(
                `${self.name} 摆出的JOJO立让 ${target.name} 的攻击落空了！`,
              );
              return true; // 取消攻击
            },
          },
        });
      }
    },
  },
};
