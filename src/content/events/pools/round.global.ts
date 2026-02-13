import type { EventPoolSpec } from '../../../engine/types';

import { roundEventEntries } from '../entries';

const roundGlobalPool: EventPoolSpec = {
  id: 'pool.round.global',
  domain: 'EVENT',
  entries: roundEventEntries,
};

export default roundGlobalPool;
