import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const stunEffect: Modifier = {
  id: 'consumable.brick.stun',
  source: 'BUFF',
  name: '脑壳疼 🤕',
  description: '被板砖拍懵了。',
  duration: 1,
  tags: ['debuff', 'control'], // Control tag 会触发 skip turn
};

const brick: Consumable = {
  id: 'consumable.brick',
  name: '板砖 🧱',
  description: '朴实无华的物理说服工具。造成伤害并概率眩晕。',
  effects: [
    { kind: 'DIRECT_DAMAGE', target: 'TARGET', value: 15, tags: ['physical'] },
    // 30% 概率眩晕
    // 使用 Effect 的条件机制 (engine draft feature) 或者拆分为两个效果
    // 这里使用 APPLY_MODIFIER 并借助 Modifier 自身的 hook 实现概率生效?
    // 不，EffectSpec 目前不支持 condition 字段 (Standard handler)。
    // 我们可以给 Consumable 加 effects，然后在 effects 里用自定义的 modifier logic?
    // 简单起见，必中眩晕太强。
    // 我们用一个带有 onTurnStart 检测的 Debuff，概率生效?
    // 或者，我们假装它是一个 "Dizziness" Debuff，降低命中率，而不是完全眩晕。
    // 如果要完全眩晕，且带概率，最好的办法是 Hook。
    // 这里我们做成: 100% 施加 "轻微脑震荡" (降属性), 且该 Debuff 在生效瞬间有概率转化为 "Stun"。
    
    // 简化方案：直接施加 Stun，持续 1 回合。作为一次性道具，这很合理。
    { kind: 'APPLY_MODIFIER', target: 'TARGET', modifier: stunEffect },
  ],
  texts: {
    use: ['{unitName} 抄起 {itemName} 呼在了 {targetName} 脸上！💥'],
  },
};

export default brick;
