import type { SchedulerRule } from './scheduler';
import type {
  BaseStats,
  CombatEvent,
  EffectSpec,
  EngineRuntime,
  EventPoolSpec,
  Modifier,
  TriggerSpec,
  Unit,
} from './types';

export type BattleBootstrapInput = {
  name1: string;
  name2: string;
  seed: string;
};

export type BattleNarrationResolver = (
  event: CombatEvent,
  source: string,
  target: string,
  rngValue: number,
  recentKeys: string[],
) => { text: string; key: string };

export type BattleSystemLogKey =
  | 'rewind'
  | 'gainShield'
  | 'dispel'
  | 'envEventTriggered'
  | 'heal'
  | 'eventDamage'
  | 'eventHeal'
  | 'applyBuff'
  | 'removeBuff'
  | 'pickupConsumable'
  | 'dropConsumable'
  | 'pickupEquipment'
  | 'replaceEquipment'
  | 'dropEquipment'
  | 'useConsumable'
  | 'death'
  | 'controlSkip';

export type BattleLogTextResolver = (
  key: BattleSystemLogKey,
  variables: Record<string, string | number | undefined>,
  rngValue: number,
) => string;

export type EffectHandlerContext<K extends string = string> = {
  owner: Unit;
  effect: EffectSpec<K>;
  event: CombatEvent | null;
  trigger: TriggerSpec;
  phase: 'INTERCEPT' | 'REACTION';
  role: 'SOURCE' | 'TARGET';
  runtime: EngineRuntime;
  depth: number;
  parentId?: string;
};

export type EffectHandler<K extends string = string> = (
  ctx: EffectHandlerContext<K>,
) => CombatEvent | null | void;
export type EffectHandlerRegistry = Partial<Record<string, EffectHandler>>;

export type TurnActionContext = {
  actor: Unit;
  enemy: Unit;
  runtime: EngineRuntime;
  round: number;
  executeTurnConsumable: () => boolean;
  getEffectiveStat: (unit: Unit, stat: keyof BaseStats) => number;
};

export type TurnActionExecutor = (ctx: TurnActionContext) => void;

export type TurnConsumableContext = {
  actor: Unit;
  runtime: EngineRuntime;
  round: number;
  getConsumableById: (
    id: string,
  ) => { id: string; name: string; effects?: EffectSpec[] } | undefined;
  getConsumableIds: () => string[];
  pickRandomFrom: <T>(values: T[], label: string) => T | undefined;
  consumeById: (consumableId: string) => void;
};

export type TurnConsumableExecutor = (ctx: TurnConsumableContext) => boolean;

export type ControlSourceResolverContext = {
  actor: Unit;
  envModifiers: Modifier[];
};

export type ControlSourceResolver = (ctx: ControlSourceResolverContext) => Modifier | undefined;

export type BattleBootstrapResult = {
  units: Unit[];
  envModifiers?: Modifier[];
  eventPools: Record<string, EventPoolSpec>;
  consumablePoolIds?: string[];
  equipmentPoolIds?: string[];
  scheduleRules: SchedulerRule[];
  narrate: BattleNarrationResolver;
  logText: BattleLogTextResolver;
  createModifierById: (id: string, duration?: number) => Modifier;
  getEquipmentById?: (id: string) => Modifier | undefined;
  getConsumableById: (
    id: string,
  ) => { id: string; name: string; effects?: EffectSpec[] } | undefined;
  effectHandlers?: EffectHandlerRegistry;
  executeTurnAction?: TurnActionExecutor;
  executeTurnConsumable?: TurnConsumableExecutor;
  resolveControlSource?: ControlSourceResolver;
};

export interface BattleContentAdapter {
  bootstrap(input: BattleBootstrapInput): BattleBootstrapResult;
}
