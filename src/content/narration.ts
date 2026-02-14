import type { CombatEvent, CombatTag } from '../engine/types';
import type { TextVariables } from './base/text';
import { renderTextTemplate } from './base/text';

export type NarrationTemplateKey = 'hit' | 'crit' | 'miss';

export type NarrationTemplateMap = Record<NarrationTemplateKey, string[]>;

const defaultTemplateMap: NarrationTemplateMap = {
  hit: [
    '{source} 上手就是一套输出，{target} 掉了 {value} 点血 🩸。',
    '{source} 这波操作命中，{target} 扣除 {value} 点生命 🤕。',
    '{source} 打点精准，{target} 当场损失 {value} HP 📉。',
  ],
  crit: [
    '{source} 触发名场面暴击 💥，{target} 吃下 {value} 点伤害！',
    '{source} 打出高光镜头，{target} 承受 {value} 点暴击伤害 🌟。',
    '{source} 卡点重击到位，{target} 直接掉了 {value} 点生命 ❗。',
  ],
  miss: [
    '{source} 这下空挥了，{target} 完美躲开 💨。',
    '{source} 手感断电，{target} 轻松闪过 ⚡。',
    '{target} 一个走位拉满，{source} 这波直接打空气 🍃。',
  ],
};

export type NarrationTemplateResolveResult =
  | string[]
  | {
      templates: string[];
      variables?: TextVariables;
    };

export type NarrationTemplateResolver = (
  event: CombatEvent,
  key: NarrationTemplateKey,
) => NarrationTemplateResolveResult | undefined;

function buildTemplateMap(
  overrides?: Partial<NarrationTemplateMap>,
): NarrationTemplateMap {
  return {
    hit: overrides?.hit?.length ? overrides.hit : defaultTemplateMap.hit,
    crit: overrides?.crit?.length ? overrides.crit : defaultTemplateMap.crit,
    miss: overrides?.miss?.length ? overrides.miss : defaultTemplateMap.miss,
  };
}

export function pickNarration(
  event: CombatEvent,
  source: string,
  target: string,
  rngValue: number,
  recentKeys: string[],
): { text: string; key: string } {
  return createNarrationResolver()(event, source, target, rngValue, recentKeys);
}

export function createNarrationResolver(options?: {
  templateOverrides?: Partial<NarrationTemplateMap>;
  resolveTemplates?: NarrationTemplateResolver;
}) {
  const templateMap = buildTemplateMap(options?.templateOverrides);

  return (
    event: CombatEvent,
    source: string,
    target: string,
    rngValue: number,
    recentKeys: string[],
  ): { text: string; key: string } => {
    const key = resolveTemplateKey(event.payload.tags);
    const resolved = options?.resolveTemplates?.(event, key);
    const resolvedTemplates = Array.isArray(resolved)
      ? resolved
      : resolved?.templates;
    const extraVariables = Array.isArray(resolved)
      ? undefined
      : resolved?.variables;
    const templates = resolvedTemplates?.length
      ? resolvedTemplates
      : templateMap[key];
    let index = Math.floor(rngValue * templates.length) % templates.length;

    if (templates.length > 1) {
      let loop = 0;
      while (
        recentKeys.includes(`${key}:${index}`) &&
        loop < templates.length
      ) {
        index = (index + 1) % templates.length;
        loop += 1;
      }
    }

    const text = renderTextTemplate(
      templates[index],
      {
        ...extraVariables,
        source,
        sourceName: source,
        sourceId: event.sourceId,
        target,
        targetName: target,
        targetId: event.targetId,
        value: event.payload.value ?? 0,
        damage: event.payload.value ?? 0,
        round: event.meta.round,
        turn: event.meta.turn,
        seq: event.meta.seq,
        eventId: event.id,
        eventType: event.type,
        isCrit: event.payload.isCrit ? 1 : 0,
        isMiss: event.payload.isMiss ? 1 : 0,
        tags: event.payload.tags.join(','),
        depth: event.depth,
        parentEventId: event.parentId,
      },
      rngValue,
    );

    return { text, key: `${key}:${index}` };
  };
}

function resolveTemplateKey(tags: CombatTag[]): 'hit' | 'crit' | 'miss' {
  if (tags.includes('miss')) {
    return 'miss';
  }
  if (tags.includes('crit')) {
    return 'crit';
  }
  return 'hit';
}
