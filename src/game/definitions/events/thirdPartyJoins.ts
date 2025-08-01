import type { GameEvent } from '../../types';

export const thirdPartyJoins: GameEvent = {
  id: 'thirdPartyJoins',
  name: '第三方加入 🤺',
  description: '一个神秘的第三方加入了战斗，他/她/它可能会攻击你们中的任何一个。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('一个神秘的第三方加入了战斗！');
      // This would require a third character in the battle
    },
  },
};
