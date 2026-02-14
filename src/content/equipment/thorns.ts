import type { EquipmentLike } from '../base/equipment';

const thorns: EquipmentLike = {
  id: 'equip.thorns',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'RARE',
  name: '防暴钉钉外套 🧥',
  description: '主打一个“你敢碰我就一起掉血”，街头实战款。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.thorns', policy: 'IGNORE' },
  texts: {
    pickup: ['{unitName} 披上 {equipmentName}，气质写着“别挨我” 😤。'],
    equip: ['{unitName} 穿好 {equipmentName}，反碰瓷系统启动 🚨。'],
    triggerByTag: {
      reflect: [
        '{sourceName} 的 {modifierName} 生效，{targetName} 被反弹 {value} 点伤害 💢。',
        '{sourceName} 身上的 {modifierName} 触发，{targetName} 反受 {value} 点伤害 🤡。',
      ],
    },
  },
  hooks: {
    onPostAction: (event, ctx) => {
      if (event.type !== 'ATTACK' || event.targetId !== ctx.owner.id) {
        return [];
      }
      // 去重：如果是反射伤害，已经被反弹过就不再反弹
      if (
        event.payload.tags.includes('reflect') ||
        event.payload.tags.includes('miss') ||
        event.payload.tags.includes('true_damage') // 原始攻击也跳过
      ) {
        return [];
      }
      const reflected = Math.max(1, Math.floor((event.payload.value ?? 0) * 0.3));
      return [
        ctx.engine.event.make({
          type: 'ATTACK',
          sourceId: ctx.owner.id,
          targetId: event.sourceId,
          depth: event.depth + 1,
          parentId: event.id,
          payload: { value: reflected, tags: ['reflect', 'true_damage'] },
        }),
      ];
    },
  },
};

export default thorns;
