import { create } from 'zustand';

import { defaultBattleContentAdapter } from '../content';
import { runBattle } from '../engine/engine';
import type { BattleOutcome } from '../engine/types';

type BattlePhase = 'idle' | 'running' | 'paused' | 'finished';

type BattleStore = {
  nameA: string;
  nameB: string;
  seed: string;
  result: BattleOutcome | null;
  cursor: number;
  speed: 1 | 2;
  phase: BattlePhase;
  setNameA: (value: string) => void;
  setNameB: (value: string) => void;
  startBattle: (seedOverride?: string) => void;
  togglePause: () => void;
  step: () => void;
  setSpeed: (speed: 1 | 2) => void;
  reset: () => void;
};

let battleCounter = 0;

const SEED_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_SEED_LENGTH = 8;

function createSeedFromNumbers(values: number[], length: number): string {
  let seed = '';
  for (let index = 0; index < values.length && seed.length < length; index += 1) {
    seed += SEED_ALPHABET[values[index] % SEED_ALPHABET.length];
  }
  while (seed.length < length) {
    const fallbackValue = (Date.now() + battleCounter + seed.length * 17) % SEED_ALPHABET.length;
    seed += SEED_ALPHABET[fallbackValue];
  }
  return seed;
}

function createBattleSeed(nameA: string, nameB: string): string {
  battleCounter += 1;
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const values = new Uint32Array(DEFAULT_SEED_LENGTH);
    crypto.getRandomValues(values);
    return createSeedFromNumbers(Array.from(values), DEFAULT_SEED_LENGTH);
  }

  const fallbackBase = `${nameA.trim()}|${nameB.trim()}|${Date.now()}|${battleCounter}`;
  const values = Array.from(fallbackBase).map((char, index) => char.charCodeAt(0) + index * 13);
  return createSeedFromNumbers(values, DEFAULT_SEED_LENGTH);
}

export const useBattleStore = create<BattleStore>((set, get) => ({
  nameA: '',
  nameB: '',
  seed: '',
  result: null,
  cursor: 0,
  speed: 1,
  phase: 'idle',
  setNameA: (value) => set({ nameA: value }),
  setNameB: (value) => set({ nameB: value }),
  startBattle: (seedOverride) => {
    const { nameA, nameB } = get();
    const normalizedNameA = nameA.trim();
    const normalizedNameB = nameB.trim();
    if (!normalizedNameA || !normalizedNameB) {
      return;
    }
    const normalizedSeed = seedOverride?.trim() || createBattleSeed(normalizedNameA, normalizedNameB);
    const result = runBattle(
      {
        name1: normalizedNameA,
        name2: normalizedNameB,
        seed: normalizedSeed,
      },
      defaultBattleContentAdapter,
    );
    set({ result, seed: normalizedSeed, cursor: 0, phase: 'running' });
  },
  togglePause: () => {
    const { phase } = get();
    if (phase === 'finished' || phase === 'idle') return;
    set({ phase: phase === 'running' ? 'paused' : 'running' });
  },
  step: () => {
    const { result, cursor, phase } = get();
    if (!result) return;
    const next = Math.min(cursor + 1, result.logs.length);
    const nextPhase = next >= result.logs.length ? 'finished' : phase === 'idle' ? 'paused' : phase;
    set({ cursor: next, phase: nextPhase });
  },
  setSpeed: (speed) => set({ speed }),
  reset: () => set({ result: null, cursor: 0, phase: 'idle' }),
}));
