import type { CombatTag, Modifier } from '../../engine/types';

const allowedTags = new Set<CombatTag>([
  'physical',
  'magic',
  'true_damage',
  'heal',
  'shield',
  'dot',
  'control',
  'reflect',
  'crit',
  'miss',
  'immune',
  'buff',
  'debuff',
  'env',
  'talent',
  'equip',
]);

export function validateModifierSpec(id: string, modifier: Modifier): void {
  if (!modifier.id || !modifier.source || !modifier.name) {
    throw new Error(`Modifier ${id} 缺少必要字段(id/source/name)`);
  }
  for (const tag of modifier.tags ?? []) {
    if (!allowedTags.has(tag)) {
      throw new Error(`Modifier ${id} 使用了非法 tag: ${tag}`);
    }
  }
}
