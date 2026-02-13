/**
 * 默认战斗内容适配器
 *
 * 本模块实现 `BattleContentAdapter` 接口，负责：
 *
 * 1. **姓名 → 属性映射**：通过哈希算法将姓名转换为角色属性
 * 2. **初始装备生成**：根据姓名和种子生成随机装备/消耗品
 * 3. **文本模板解析**：提供战斗日志的文本渲染
 * 4. **效果处理器注册**：注册内置的 DSL 效果处理器
 * 5. **默认执行器**：提供默认的行动/消耗品/控制解析逻辑
 *
 * === 确定性设计 ===
 *
 * - 属性生成：仅依赖姓名（相同姓名 = 相同属性）
 * - 职业选择：仅依赖姓名（相同姓名 = 相同职业）
 * - 装备/道具：依赖姓名 + 种子（增加随机性）
 *
 * 这确保了：
 * - 相同姓名的基础属性永远一致
 * - 相同姓名 + 相同种子的装备/道具永远一致
 * - 不同种子下可以有不同开局
 */

import type { BattleContentAdapter } from '../engine/contentAdapter';
import { deepCloneKeepFns } from '../engine/clone';
import type { BaseStats, Unit } from '../engine/types';
import seedrandom from 'seedrandom';

import type { TextTemplate } from './base/text';
import { classList } from './classes';
import { getConsumableById, consumableIds } from './consumables';
import { cloneEquipment, equipmentIds, getEquipmentById } from './equipment';
import { defaultTurnActionExecutor } from './effects/defaultTurnAction';
import { defaultControlSourceResolver } from './effects/defaultControlResolver';
import { defaultTurnConsumableExecutor } from './effects/defaultTurnConsumable';
import { standardEffectHandlers } from './effects/standardEffectHandlers';
import { eventPools, getEventEntryById } from './events';
import { createModifierById } from './modifiers';
import { createNarrationResolver } from './narration';
import { renderTextTemplate } from './base/text';

/**
 * 文本模板标准化
 *
 * 将 `TextTemplate` 转换为统一的数组格式：
 * - `undefined` → `[]`
 * - `string` → `[string]`
 * - `string[]` → `string[]` (不变)
 *
 * 用途：统一处理随机选择（从数组中随机选一个）
 */
function asTemplateArray(template: TextTemplate | undefined): string[] {
  if (!template) return [];
  return Array.isArray(template) ? template : [template];
}

// FNV-1a Hash 算法：用于将字符串转换为唯一的数字
function nameHash(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

// 核心逻辑：从名字生成基础属性
// 保证同一个名字永远生成相同的 STR/AGI/VIT/LUK 分布
function statsFromName(name: string): BaseStats {
  const hash = nameHash(name);
  return {
    STR: 8 + (hash % 10),           // 基础力量
    AGI: 8 + ((hash >>> 5) % 10),   // 基础敏捷 (位移取不同段的哈希值)
    VIT: 8 + ((hash >>> 10) % 10),  // 基础体质
    LUK: 8 + ((hash >>> 15) % 10),  // 基础幸运
  };
}

type Loadout = {
  classId?: string;
  equipmentIds: string[];
  consumables: string[];
};

function chooseOne<T>(rng: seedrandom.PRNG, values: T[]): T {
  const index = Math.floor(rng() * values.length);
  return values[index];
}

function uniquePush(target: string[], value: string): void {
  if (!target.includes(value)) {
    target.push(value);
  }
}

// 身份生成：只依赖名字，不依赖对局种子
// 保证同一个名字总是同一个职业
function buildIdentityFromName(name: string): Pick<Loadout, 'classId'> {
  const rng = seedrandom(`identity::${name}`);
  const classId = rng() < 0.85 && classList.length > 0 ? chooseOne(rng, classList).id : undefined;

  return { classId };
}

// 装备生成：依赖名字 + 种子
// 保证同一个名字在不同对局中可能有不同的初始装备 (增加肉鸽随机性)
function buildGearFromNameAndSeed(name: string, seed: string): Pick<Loadout, 'equipmentIds' | 'consumables'> {
  const rng = seedrandom(`${seed}::gear::${name}`);
  const equipmentBySlot = new Map<string, string>();
  const items: string[] = [];

  for (const equipId of equipmentIds) {
    if (rng() < 0.5) {
      const equip = getEquipmentById(equipId);
      if (!equip) continue;
      if (!equipmentBySlot.has(equip.slot)) {
        equipmentBySlot.set(equip.slot, equipId);
      }
    }
  }

  // 保底机制：如果随机没随到装备，有一定概率给一件
  if (equipmentBySlot.size === 0 && rng() < 0.35 && equipmentIds.length > 0) {
    const fallback = getEquipmentById(chooseOne(rng, equipmentIds));
    if (fallback) {
      equipmentBySlot.set(fallback.slot, fallback.id);
    }
  }

  // 随机初始道具
  if (rng() < 0.3 && consumableIds.length > 0) {
    uniquePush(items, chooseOne(rng, consumableIds));
  }

  return {
    equipmentIds: [...equipmentBySlot.values()],
    consumables: items.slice(0, 3),
  };
}

/**
 * 构建战斗单位
 *
 * 综合所有生成逻辑，创建完整的单位对象：
 *
 * **步骤**：
 * 1. 从姓名生成身份（职业）
 * 2. 从姓名 + 种子生成装备和消耗品
 * 3. 查找职业规格，获取职业基础属性和天赋
 * 4. 从姓名生成种子属性（STR/AGI/VIT/LUK）
 * 5. 合并属性：classBase + seededStats
 * 6. 构建单位对象：
 *    - 基础信息（id, name, classId/className）
 *    - 属性（stats）
 *    - 初始状态（hp: 0, 后续由引擎计算 maxHp）
 *    - 初始消耗品（consumables）
 *    - 修饰器（装备 + 天赋）
 *
 * **确定性**：
 * - 相同 name → 相同 stats + classId
 * - 相同 name + seed → 相同 equipmentIds + consumables
 */
function buildUnit(id: string, name: string, seed: string): Unit {
  // 1-2. 生成身份和装备
  const identity = buildIdentityFromName(name);
  const gear = buildGearFromNameAndSeed(name, seed);
  const loadout: Loadout = {
    classId: identity.classId,
    equipmentIds: gear.equipmentIds,
    consumables: gear.consumables,
  };

  // 3-4. 计算属性
  const classSpec = loadout.classId ? classList.find((item) => item.id === loadout.classId) : undefined;
  const classBase = classSpec?.baseStats ?? { STR: 0, AGI: 0, VIT: 0, LUK: 0 };
  const seededStats = statsFromName(name);
  const stats: BaseStats = {
    STR: classBase.STR + seededStats.STR,
    AGI: classBase.AGI + seededStats.AGI,
    VIT: classBase.VIT + seededStats.VIT,
    LUK: classBase.LUK + seededStats.LUK,
  };

  // 5-6. 构建单位对象
  return {
    id,
    name,
    classId: classSpec?.id,
    className: classSpec?.name,
    stats,
    state: { hp: 0, maxHp: 0, shield: 0, cd: {}, rewindUsed: false, consumables: loadout.consumables },
    modifiers: [
      ...loadout.equipmentIds.map((equipId) => cloneEquipment(equipId)),
      ...(classSpec?.talents.map((talent) => deepCloneKeepFns(talent)) ?? []),
    ],
  };
}

const systemTextFallback: Record<string, TextTemplate> = {
  rewind: ['{unitName} 按下撤回键 ↩️，战局回到上一回合。'],
  gainShield: ['{ownerName} 临时加了防护层 🛡️，获得 {amount} 点护盾。'],
  dispel: ['{ownerName} 一键清插件，{targetName} 的增益被下线 🧹。'],
  envEventTriggered: ['热搜突发：{eventName} 📢'],
  heal: ['{sourceName} 血条回暖，恢复 {amount} 点生命 💚。'],
  eventDamage: ['{targetName} 被突发事件波及，掉了 {amount} 点生命 📉。'],
  eventHeal: ['{targetName} 吃到临时补给，恢复 {amount} 点生命 💊。'],
  applyBuff: ['{targetName} 获得新状态：{modifierName} ✨'],
  removeBuff: ['{targetName} 的状态失效：{modifierName} 💨'],
  pickupConsumable: ['{targetName} 捡到道具：{itemName} 🎒。'],
  dropConsumable: ['{targetName} 背包已满，丢弃了：{itemName} 🗑️。'],
  pickupEquipment: ['{targetName} 捡到装备：{equipmentName} 🗡️。'],
  replaceEquipment: ['{targetName} 用 {equipmentName} 替换了 {oldEquipmentName} 🔄。'],
  dropEquipment: ['{targetName} 在突发事件里丢失了装备：{equipmentName} 💸。'],
  useConsumable: ['{unitName} 使用了道具：{itemName} 🧪。'],
  death: ['{targetName} 已被击败 💀。'],
  controlSkip: ['{unitName} 被控到发呆，本回合只能看戏 😵。'],
};

function renderSystemLog(
  key: string,
  variables: Record<string, string | number | undefined>,
  rngValue: number,
  unitMap?: Map<string, Unit>,
): string {
  if (key === 'rewind') {
    const sourceType = String(variables.sourceType ?? '');
    const sourceId = String(variables.sourceId ?? '');
    if (sourceType === 'consumable' && sourceId) {
      const consumable = getConsumableById(sourceId);
      if (consumable?.texts?.use) {
        return renderTextTemplate(consumable.texts.use, variables, rngValue);
      }
    }
    if (sourceType === 'event' && sourceId) {
      const eventEntry = getEventEntryById(sourceId);
      if (eventEntry?.texts?.trigger) {
        return renderTextTemplate(eventEntry.texts.trigger, variables, rngValue);
      }
    }
  }

  if (key === 'useConsumable') {
    const sourceId = String(variables.sourceId ?? variables.unitId ?? '');
    if (sourceId) {
      const consumable = getConsumableById(sourceId);
      if (consumable?.texts?.use) {
        return renderTextTemplate(consumable.texts.use, {
          ...variables,
          itemName: consumable.name,
        }, rngValue);
      }
      if (consumable) {
        return renderTextTemplate(systemTextFallback.useConsumable, {
          ...variables,
          itemName: consumable.name,
        }, rngValue);
      }
    }
  }

  if (key === 'envEventTriggered') {
    const eventId = String(variables.eventId ?? '');
    if (eventId) {
      const eventEntry = getEventEntryById(eventId);
      if (eventEntry?.texts?.trigger) {
        return renderTextTemplate(eventEntry.texts.trigger, variables, rngValue);
      }
    }
  }

  if (key === 'dispel') {
    const sourceType = String(variables.sourceType ?? '');
    const sourceId = String(variables.sourceId ?? '');
    if (sourceType === 'equip' && sourceId) {
      const equipment = getEquipmentById(sourceId);
      if (equipment?.texts?.equip) {
        return renderTextTemplate(
          equipment.texts.equip,
          {
            ...variables,
            unitName: String(variables.unitName ?? variables.ownerName ?? variables.sourceName ?? variables.actorName ?? ''),
            equipmentName: equipment.name,
          },
          rngValue,
        );
      }
    }
  }

  if (key === 'pickupConsumable' || key === 'dropConsumable') {
    const itemId = String(variables.itemId ?? '');
    if (itemId) {
      const item = getConsumableById(itemId);
      if (item) {
        return renderTextTemplate(systemTextFallback[key] ?? '{targetName} 处理了一个道具。', {
          ...variables,
          itemName: item.name,
        }, rngValue);
      }
    }
  }

  if (key === 'pickupEquipment' || key === 'replaceEquipment') {
    const equipmentId = String(variables.equipmentId ?? '');
    const oldEquipmentId = String(variables.oldEquipmentId ?? '');
    const equipment = equipmentId ? getEquipmentById(equipmentId) : undefined;
    const oldEquipment = oldEquipmentId ? getEquipmentById(oldEquipmentId) : undefined;
    return renderTextTemplate(systemTextFallback[key] ?? '{targetName} 调整了装备。', {
      ...variables,
      equipmentName: equipment?.name ?? String(variables.equipmentName ?? equipmentId),
      oldEquipmentName: oldEquipment?.name ?? String(variables.oldEquipmentName ?? oldEquipmentId),
    }, rngValue);
  }

  if (key === 'heal') {
    const sourceId = String(variables.sourceId ?? '');
    const sourceUnit = sourceId ? unitMap?.get(sourceId) : undefined;
    if (sourceUnit) {
      for (const modifier of sourceUnit.modifiers) {
        const byTag = modifier.texts?.triggerByTag?.heal;
        if (byTag) {
          return renderTextTemplate(byTag, { ...variables, modifierId: modifier.id, modifierName: modifier.name }, rngValue);
        }
        if (modifier.texts?.trigger) {
          return renderTextTemplate(modifier.texts.trigger, { ...variables, modifierId: modifier.id, modifierName: modifier.name }, rngValue);
        }
      }
    }
  }

  const fallback = systemTextFallback[key] ?? '{unitName} 做出了行动。';
  return renderTextTemplate(fallback, variables, rngValue);
}

export const defaultBattleContentAdapter: BattleContentAdapter = {
  bootstrap(input) {
    const units = [buildUnit('u1', input.name1, input.seed), buildUnit('u2', input.name2, input.seed)];
    const unitMap = new Map(units.map((unit) => [unit.id, unit]));
    const narrate = createNarrationResolver({
      resolveTemplates: (event) => {
        const sourceUnit = unitMap.get(event.sourceId);
        if (!sourceUnit) {
          return undefined;
        }
        for (const modifier of sourceUnit.modifiers) {
          if (!(modifier.texts?.triggerByTag || modifier.texts?.trigger)) {
            continue;
          }
          for (const tag of event.payload.tags) {
            const byTag = asTemplateArray(modifier.texts?.triggerByTag?.[tag]);
            if (byTag.length > 0) {
              return {
                templates: byTag,
                variables: {
                  modifierId: modifier.id,
                  modifierName: modifier.name,
                },
              };
            }
          }
        }
        return undefined;
      },
    });

    return {
      units,
      envModifiers: [],
      eventPools,
      consumablePoolIds: consumableIds,
      equipmentPoolIds: equipmentIds,
      scheduleRules: [
        { window: 'RoundStart', poolId: 'pool.round.global', chance: 0.28 },
        { window: 'RoundEnd', poolId: 'pool.round.global', chance: 0 },
        { window: 'TurnStart', poolId: 'pool.turn.personal', chance: 0.16 },
        { window: 'TurnEnd', poolId: 'pool.turn.personal', chance: 0 },
      ],
      narrate,
      logText: (key, variables, rngValue) => renderSystemLog(key, variables, rngValue, unitMap),
      createModifierById,
      getEquipmentById: (id: string) => {
        const equipment = getEquipmentById(id);
        return equipment ? deepCloneKeepFns(equipment) : undefined;
      },
      getConsumableById,
      effectHandlers: standardEffectHandlers,
      executeTurnAction: defaultTurnActionExecutor,
      executeTurnConsumable: defaultTurnConsumableExecutor,
      resolveControlSource: defaultControlSourceResolver,
    };
  },
};
