import type { EventPoolSpec } from './types';

export type TriggerWindow = 'RoundStart' | 'RoundEnd' | 'TurnStart' | 'TurnEnd';

export type SchedulerRule = {
  window: TriggerWindow;
  poolId: string;
  chance: number;
};

export class EventScheduler {
  constructor(
    private readonly pools: Record<string, EventPoolSpec>,
    private readonly rules: SchedulerRule[],
  ) {}

  getRules(window: TriggerWindow): SchedulerRule[] {
    return this.rules.filter((rule) => rule.window === window && this.pools[rule.poolId]);
  }
}
