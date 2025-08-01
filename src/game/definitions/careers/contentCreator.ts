import type { Career } from '../../types';

export const contentCreator: Career = {
  id: 'contentCreator',
  name: 'UP主 📹',
  description: '“一键三连！” 粉丝越多，能力越强。',
  modifiers: {
    atk: 5,
    def: 5,
  },
  hooks: {
    onTurnStart: (self, state) => {
      self.stats.attack += 1; // Gets stronger each turn (more followers)
      state.logEvent(`${self.name} 的粉丝增加了，攻击力提升了！`);
    },
  },
};
