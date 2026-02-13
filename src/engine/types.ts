export type BaseStats = {
  STR: number;
  AGI: number;
  VIT: number;
  LUK: number;
};

export type ModifierSource = 'PASSIVE' | 'EQUIP' | 'BUFF' | 'ENV' | 'TALENT';

export type CombatTag =
  | 'physical'
  | 'magic'
  | 'true_damage'
  | 'heal'
  | 'shield'
  | 'dot'
  | 'control'
  | 'reflect'
  | 'crit'
  | 'miss'
  | 'immune'
  | 'buff'
  | 'debuff'
  | 'env'
  | 'talent'
  | 'equip';

export type StackPolicy = 'STACK' | 'REFRESH_DURATION' | 'REPLACE' | 'IGNORE';

export type TextTemplate = string | string[];

export type ModifierStacking = {
  stackKey: string;
  policy: StackPolicy;
  maxStacks?: number;
};

export interface Unit {
  id: string;
  name: string;
  classId?: string;
  className?: string;
  stats: BaseStats;
  state: {
    hp: number;
    maxHp: number;
    shield: number;
    cd: Record<string, number>;
    rewindUsed?: boolean;
    consumables?: string[];
  };
  modifiers: Modifier[];
}

export interface ModifierHooks {
  onRoundStart?: (ctx: TriggerContext) => void;
  onRoundEnd?: (ctx: TriggerContext) => void;
  onTurnStart?: (ctx: TriggerContext) => void;
  onTurnEnd?: (ctx: TriggerContext) => void;
  onOutgoing?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent | null;
  onIncoming?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent | null;
  onPostAction?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent[];
}

export type ValueExpr =
  | { type: 'FLAT'; value: number }
  | { type: 'SCALE'; stat: keyof BaseStats; ratio: number }
  | { type: 'EVENT_VALUE' };

export type TargetSelector = 'SELF' | 'SOURCE' | 'TARGET';
export type EventEffectTarget = TargetSelector | 'ALL';

export type EventWhen = {
  role?: 'SOURCE' | 'TARGET';
  eventType?: CombatEvent['type'];
  hasTag?: CombatTag;
  notHasTag?: CombatTag;
  notHasTags?: CombatTag[];
};

export type TriggerSpec =
  | { on: 'ROUND_START' }
  | { on: 'TURN_START' }
  | { on: 'PIPELINE_INCOMING'; when?: EventWhen }
  | { on: 'PIPELINE_OUTGOING'; when?: EventWhen }
  | { on: 'POST_ACTION'; when?: EventWhen }
  | { on: 'ON_HIT'; when?: Omit<EventWhen, 'eventType'> }
  | { on: 'ON_HURT'; when?: Omit<EventWhen, 'eventType'> };

export type ModifierTextOverrides = {
  apply?: TextTemplate;
  remove?: TextTemplate;
  trigger?: TextTemplate;
  triggerByTag?: Partial<Record<CombatTag, TextTemplate>>;
  tick?: TextTemplate;
};

export type EffectSpec = {
  kind: string;
  target?: EventEffectTarget;
  [key: string]: unknown;
};

export type ModifierSpec = {
  id: string;
  source: ModifierSource;
  name: string;
  description?: string;
  texts?: ModifierTextOverrides;
  priority?: number;
  duration?: number;
  tags?: CombatTag[];
  stacking?: ModifierStacking;
  statBonus?: Partial<BaseStats>;
  triggers?: Array<{ trigger: TriggerSpec; effects: EffectSpec[] }>;
  hooks?: ModifierHooks;
};

export interface Modifier extends ModifierSpec {
  appliedOrder?: number;
  stacks?: number;
}

export interface CombatEvent {
  id: string;
  type: 'ATTACK' | 'HEAL' | 'APPLY_BUFF' | 'REMOVE_BUFF' | 'DEATH';
  sourceId: string;
  targetId: string;
  meta: {
    round: number;
    turn: number;
    seq: number;
  };
  payload: Readonly<{
    value?: number;
    modifier?: Modifier;
    tags: CombatTag[];
    isCrit?: boolean;
    isMiss?: boolean;
  }>;
  depth: number;
  parentId?: string;
}

export type TriggerContext = {
  engine: EngineRuntime;
  owner: Unit;
};

export type InteractionContext = TriggerContext & {
  source: Unit;
  target: Unit;
};

export type EventPoolEntry = {
  id: string;
  name: string;
  weight: number;
  effects: EffectSpec[];
  texts?: {
    trigger?: TextTemplate;
    tick?: TextTemplate;
  };
};

export type RewindReason = {
  sourceType?: 'consumable' | 'event' | 'talent' | 'system';
  sourceId?: string;
  sourceName?: string;
};

export type EventPoolSpec = {
  id: string;
  domain: 'EVENT' | 'COMBAT';
  entries: EventPoolEntry[];
};

export type EngineLimits = {
  maxEventDepth: number;
  maxEventsPerRound: number;
  maxDerivedEventsPerEvent: number;
  maxTriggersPerModifierPerRound: number;
};

export type LogEntry = {
  round: number;
  turn: number;
  seq: number;
  text: string;
  tags: CombatTag[];
  eventId?: string;
  eventType?: CombatEvent['type'];
  actorId?: string;
  actorName?: string;
  targetId?: string;
  targetName?: string;
};

export type ReplayRecord = {
  engineVersion: string;
  seed: string;
  initialState: Snapshot;
  rngTrace: Array<{ n: number; label: string; value: number }>;
  eventTrace: Array<{
    eventId: string;
    parentId?: string;
    type: string;
    meta: { round: number; turn: number; seq: number };
    tags: CombatTag[];
  }>;
};

export type Snapshot = {
  round: number;
  units: Array<{
    id: string;
    name: string;
    stats: BaseStats;
    state: Unit['state'];
    modifiers: Modifier[];
  }>;
  envModifiers: Modifier[];
};

export type BattleOutcome = {
  seed: string;
  winnerId: string;
  logs: LogEntry[];
  snapshots: Snapshot[];
  replay: ReplayRecord;
  summary: {
    totalRounds: number;
    totalDamageByUnit: Record<string, number>;
  };
};

export interface RNG {
  next(label?: string): number;
  range(min: number, max: number, label?: string): number;
  bool(chance: number, luck?: { domain: 'EVENT' | 'COMBAT'; luk: number }, label?: string): boolean;
  weightedPick<T>(options: T[], weights: (item: T) => number, label?: string): T;
  getTrace(): Array<{ n: number; label: string; value: number }>;
}

export type RuntimeMath = {
  clamp: (value: number, min: number, max: number) => number;
  toInt: (value: number, min?: number, max?: number) => number;
  nonNegativeInt: (value: number, max?: number) => number;
  safeStat: (value: number) => number;
  safeHp: (value: number, maxHp: number) => number;
  safeShield: (value: number) => number;
  chance: (base: number, options?: { min?: number; max?: number }) => number;
  critRate: (base: number, luk: number) => number;
  evadeRate: (base: number, luk: number) => number;
  scale: (value: number, ratio: number, min?: number, max?: number) => number;
  splitDamageByShield: (incoming: number, shield: number) => {
    incoming: number;
    shieldBlocked: number;
    hpDamage: number;
    shieldAfter: number;
  };
  hpAfterDamage: (hp: number, damage: number) => number;
  hpAfterHeal: (hp: number, maxHp: number, amount: number) => number;
};

export type EngineRuntime = {
  rng: RNG;
  calc: RuntimeMath;
  rule: {
    evaluateValueExpr: (unit: Unit, event: CombatEvent | undefined, value: ValueExpr) => number;
    whenMatched: (when: EventWhen | undefined, event: CombatEvent, role: 'SOURCE' | 'TARGET') => boolean;
  };
  event: {
    make: (partial: Omit<CombatEvent, 'id' | 'meta'> & { meta?: Partial<CombatEvent['meta']> }) => CombatEvent;
    process: (event: CombatEvent) => void;
    triggerPool: (poolId: string, ownerId: string, depth: number, parentId?: string) => void;
    emitDirectDamage: (owner: Unit, target: Unit, value: number, tags?: CombatTag[], depth?: number, parentId?: string) => void;
    emitDirectHeal: (owner: Unit, target: Unit, value: number, tags?: CombatTag[], depth?: number, parentId?: string) => void;
  };
  state: {
    resolveTargets: (owner: Unit, selector: EventEffectTarget) => Unit[];
    resolveTargetFromEvent: (owner: Unit, selector: TargetSelector, event: CombatEvent) => Unit;
    applyModifierEffect: (source: Unit, target: Unit, effect: EffectSpec) => void;
    removeModifiersByMatcher: (target: Unit, matcher: (modifier: Modifier) => boolean, max?: number) => number;
    grantConsumable: (target: Unit, consumableId: string) => void;
    grantRandomConsumable: (target: Unit) => void;
    loseRandomConsumable: (target: Unit, count?: number) => void;
    loseConsumable: (target: Unit, consumableId: string) => boolean;
    grantEquipment: (target: Unit, equipment: Modifier) => void;
    grantRandomEquipment: (target: Unit, slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY') => void;
    loseRandomEquipment: (target: Unit, slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY') => void;
    loseEquipment: (target: Unit, equipmentId: string) => boolean;
    grantRandomItem: (target: Unit) => void;
    loseRandomItem: (target: Unit) => void;
  };
  log: {
    system: (args: {
      key: string;
      variables: Record<string, string | number | undefined>;
      tags: CombatTag[];
      actor?: Unit;
      target?: Unit;
    }) => void;
  };
};
