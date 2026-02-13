import type { EventPoolSpec } from '../../engine/types';

import roundGlobalPool from './pools/round.global';
import turnPersonalPool from './pools/turn.personal';
export { getEventEntryById } from './entries';

const allPools: EventPoolSpec[] = [roundGlobalPool, turnPersonalPool];

export const eventPools: Record<string, EventPoolSpec> = Object.fromEntries(
  allPools.map((pool) => [pool.id, pool]),
);
