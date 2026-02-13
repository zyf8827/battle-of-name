import type { EventPoolSpec } from '../../../engine/types';

import { turnEventEntries } from '../entries';

const turnPersonalPool: EventPoolSpec = {
  id: 'pool.turn.personal',
  domain: 'EVENT',
  entries: turnEventEntries,
};

export default turnPersonalPool;
