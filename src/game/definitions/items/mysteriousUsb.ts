
import { Item } from '../../types';

export const mysteriousUsb: Item = {
  id: 'mysteriousUsb',
  name: '神秘的U盘 💾',
  description:
    '使用后可能触发“挖矿病毒”（持续掉血）或“学习资料”（下一次攻击必定暴击）。',
  use: (self, state) => {
    state.logEvent(`${self.name} 插入了 [神秘的U盘]...`);

    if (state.checkProbability('mysteriousUsb-effect', 0.5)) {
      // 触发“挖矿病毒”
      state.logEvent(`U盘里的“挖矿病毒”启动了！`);
      state.addStatusEffect(self, {
        id: 'mining_virus',
        name: '挖矿病毒',
        duration: 3, // 持续2回合
        hooks: {
          // 在这个钩子中实现持续掉血
          // (需要我们在 battleEngine 中添加 onTurnEnd 的状态效果钩子)
        },
      });
    } else {
      // 触发“学习资料”
      state.logEvent(`U盘里原来是珍贵的“学习资料”！`);
      state.addStatusEffect(self, {
        id: 'study_material_buff',
        name: '学习资料',
        duration: 2, // 持续到自己的下个回合结束
        // (需要一个钩子来让下次攻击必定暴击)
      });
    }
  },
};
