import seedrandom from 'seedrandom';

import { runBattle } from '../src/engine/engine.ts';
import { defaultBattleContentAdapter } from '../src/content/battleContentAdapter.ts';

type Counter = { games: number; wins: number; roundSum: number };
type EventCounter = {
  gamesTriggered: number;
  fastGames: number;
  longGames: number;
};

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? 'true'];
  }),
);

const total = Number(args.total ?? 5000);
const baseSeed = String(args.seed ?? 'balance-sim-v2');
const minSamples = Number(args.minSamples ?? 150);

const nameChars =
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜马牛猫狗鸟鱼龙凤虎豹宇宙量子朋克摸鱼摆烂玄学暴富社死';

function makeRandomName(rng: seedrandom.PRNG): string {
  const len = rng() < 0.68 ? 3 : rng() < 0.92 ? 4 : 5;
  let value = '';
  for (let index = 0; index < len; index += 1) {
    value += nameChars[Math.floor(rng() * nameChars.length)];
  }
  return value;
}

function upsert(
  map: Map<string, Counter>,
  key: string,
  won: boolean,
  rounds: number,
): void {
  const prev = map.get(key) ?? { games: 0, wins: 0, roundSum: 0 };
  prev.games += 1;
  if (won) prev.wins += 1;
  prev.roundSum += rounds;
  map.set(key, prev);
}

function percentileFromHist(
  hist: Map<number, number>,
  totalGames: number,
  ratio: number,
): number {
  const sorted = [...hist.entries()].sort((a, b) => a[0] - b[0]);
  const target = totalGames * ratio;
  let cumulative = 0;
  for (const [round, count] of sorted) {
    cumulative += count;
    if (cumulative >= target) return round;
  }
  return sorted[sorted.length - 1]?.[0] ?? 0;
}

function topWinrate(
  map: Map<string, Counter>,
  minGameCount: number,
  limit = 12,
): Array<{ id: string; games: number; winRate: number; avgRounds: number }> {
  return [...map.entries()]
    .filter(([, stat]) => stat.games >= minGameCount)
    .map(([id, stat]) => ({
      id,
      games: stat.games,
      winRate: Number((stat.wins / stat.games).toFixed(4)),
      avgRounds: Number((stat.roundSum / stat.games).toFixed(2)),
    }))
    .sort((a, b) => b.winRate - a.winRate || b.games - a.games)
    .slice(0, limit);
}

function bottomWinrate(
  map: Map<string, Counter>,
  minGameCount: number,
  limit = 12,
): Array<{ id: string; games: number; winRate: number; avgRounds: number }> {
  return [...map.entries()]
    .filter(([, stat]) => stat.games >= minGameCount)
    .map(([id, stat]) => ({
      id,
      games: stat.games,
      winRate: Number((stat.wins / stat.games).toFixed(4)),
      avgRounds: Number((stat.roundSum / stat.games).toFixed(2)),
    }))
    .sort((a, b) => a.winRate - b.winRate || b.games - a.games)
    .slice(0, limit);
}

function weightSuggestionByWinrate(
  map: Map<string, Counter>,
  baselineWinrate: number,
  minGameCount: number,
): Record<string, number> {
  const suggestions: Record<string, number> = {};
  for (const [id, stat] of map) {
    if (stat.games < minGameCount) continue;
    const wr = stat.wins / stat.games;
    const delta = wr - baselineWinrate;
    let multiplier = 1;
    if (delta >= 0.12) multiplier = 0.82;
    else if (delta >= 0.08) multiplier = 0.88;
    else if (delta >= 0.05) multiplier = 0.94;
    else if (delta <= -0.12) multiplier = 1.18;
    else if (delta <= -0.08) multiplier = 1.12;
    else if (delta <= -0.05) multiplier = 1.06;
    if (multiplier !== 1) {
      suggestions[id] = Number(multiplier.toFixed(2));
    }
  }
  return suggestions;
}

function weightSuggestionByEventCorrelation(
  map: Map<string, EventCounter>,
  overallFastRate: number,
  overallLongRate: number,
  minGameCount: number,
): Record<string, number> {
  const scored: Array<{ id: string; multiplier: number; score: number }> = [];
  for (const [id, stat] of map) {
    if (stat.gamesTriggered < minGameCount) continue;
    const fastRate = stat.fastGames / stat.gamesTriggered;
    const longRate = stat.longGames / stat.gamesTriggered;
    const fastDelta = fastRate - overallFastRate;
    const longDelta = longRate - overallLongRate;
    if (fastDelta >= 0.06) {
      scored.push({ id, multiplier: 0.9, score: fastDelta });
      continue;
    }
    if (fastDelta >= 0.04) {
      scored.push({ id, multiplier: 0.94, score: fastDelta });
      continue;
    }
    if (longDelta >= 0.05) {
      scored.push({ id, multiplier: 0.93, score: longDelta });
      continue;
    }
    if (fastDelta <= -0.05 && longDelta <= 0.01) {
      scored.push({ id, multiplier: 1.05, score: Math.abs(fastDelta) });
    }
  }
  const suggestions: Record<string, number> = {};
  for (const item of scored.sort((a, b) => b.score - a.score).slice(0, 18)) {
    suggestions[item.id] = item.multiplier;
  }
  return suggestions;
}

const classStats = new Map<string, Counter>();
const equipStats = new Map<string, Counter>();
const consumableStats = new Map<string, Counter>();
const eventStats = new Map<string, EventCounter>();
const effectTriggered = new Map<string, number>();
const roundHist = new Map<number, number>();

let sumRounds = 0;
let fastGames = 0;
let midGames = 0;
let longGames = 0;

for (let gameIndex = 0; gameIndex < total; gameIndex += 1) {
  const rng = seedrandom(`${baseSeed}:name:${gameIndex}`);
  const name1 = makeRandomName(rng);
  const name2 = makeRandomName(rng);
  const seed = `${baseSeed}:battle:${gameIndex}`;

  const bootstrap = defaultBattleContentAdapter.bootstrap({
    name1,
    name2,
    seed,
  });
  const result = runBattle(
    { name1, name2, seed },
    defaultBattleContentAdapter,
    {
      diagnostics: {
        debugLog: false,
        collectSummary: true,
      },
    },
  );

  const rounds = result.summary.totalRounds;
  const winnerId = result.winnerId;
  sumRounds += rounds;
  roundHist.set(rounds, (roundHist.get(rounds) ?? 0) + 1);

  const isFast = rounds <= 6;
  const isLong = rounds > 16;
  if (isFast) fastGames += 1;
  if (!isFast && rounds >= 8 && rounds <= 12) midGames += 1;
  if (isLong) longGames += 1;

  for (const unit of bootstrap.units) {
    const won = unit.id === winnerId;
    if (unit.classId) {
      upsert(classStats, unit.classId, won, rounds);
    }
    const equipIds = unit.modifiers
      .filter((modifier) => modifier.source === 'EQUIP')
      .map((modifier) => modifier.id);
    for (const equipmentId of equipIds) {
      upsert(equipStats, equipmentId, won, rounds);
    }
    for (const consumableId of unit.state.consumables ?? []) {
      upsert(consumableStats, consumableId, won, rounds);
    }
  }

  const diagnostics = result.summary.diagnostics;
  if (diagnostics) {
    for (const [kind, count] of Object.entries(diagnostics.effectsTriggered)) {
      effectTriggered.set(kind, (effectTriggered.get(kind) ?? 0) + count);
    }

    for (const [eventId, count] of Object.entries(
      diagnostics.poolEntriesTriggered,
    )) {
      if (count <= 0) continue;
      const prev = eventStats.get(eventId) ?? {
        gamesTriggered: 0,
        fastGames: 0,
        longGames: 0,
      };
      prev.gamesTriggered += 1;
      if (isFast) prev.fastGames += 1;
      if (isLong) prev.longGames += 1;
      eventStats.set(eventId, prev);
    }
  }
}

const avgRounds = Number((sumRounds / total).toFixed(2));
const p50 = percentileFromHist(roundHist, total, 0.5);
const p90 = percentileFromHist(roundHist, total, 0.9);
const p95 = percentileFromHist(roundHist, total, 0.95);

const overallFastRate = fastGames / total;
const overallLongRate = longGames / total;
const baselineWinrate = 0.5;

const classWeightAdjustments = weightSuggestionByWinrate(
  classStats,
  baselineWinrate,
  minSamples,
);
const equipmentWeightAdjustments = weightSuggestionByWinrate(
  equipStats,
  baselineWinrate,
  minSamples,
);
const consumableMinSample = Math.max(30, Math.floor(minSamples * 0.3));
const consumableWeightAdjustments = weightSuggestionByWinrate(
  consumableStats,
  baselineWinrate,
  consumableMinSample,
);
const eventWeightAdjustments = weightSuggestionByEventCorrelation(
  eventStats,
  overallFastRate,
  overallLongRate,
  Math.max(100, Math.floor(minSamples * 0.7)),
);

const effectTop = [...effectTriggered.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 16)
  .map(([kind, count]) => ({ kind, count }));

const result = {
  config: { total, baseSeed, minSamples },
  summary: {
    avgRounds,
    p50,
    p90,
    p95,
    fastPct: Number((overallFastRate * 100).toFixed(2)),
    mid8to12Pct: Number(((midGames / total) * 100).toFixed(2)),
    longPct: Number((overallLongRate * 100).toFixed(2)),
  },
  histTop20: [...roundHist.entries()]
    .sort((a, b) => a[0] - b[0])
    .filter(([round]) => round <= 20),
  topClassWinrate: topWinrate(classStats, minSamples),
  lowClassWinrate: bottomWinrate(classStats, minSamples),
  topEquipmentWinrate: topWinrate(equipStats, minSamples),
  lowEquipmentWinrate: bottomWinrate(equipStats, minSamples),
  topConsumableWinrate: topWinrate(consumableStats, consumableMinSample),
  lowConsumableWinrate: bottomWinrate(consumableStats, consumableMinSample),
  eventCorrelationTop: [...eventStats.entries()]
    .filter(
      ([, stat]) =>
        stat.gamesTriggered >= Math.max(100, Math.floor(minSamples * 0.7)),
    )
    .map(([id, stat]) => ({
      id,
      gamesTriggered: stat.gamesTriggered,
      fastRate: Number((stat.fastGames / stat.gamesTriggered).toFixed(4)),
      longRate: Number((stat.longGames / stat.gamesTriggered).toFixed(4)),
    }))
    .sort((a, b) => b.fastRate - a.fastRate)
    .slice(0, 20),
  effectsTop: effectTop,
  recommendations: {
    classWeights: classWeightAdjustments,
    equipmentWeights: equipmentWeightAdjustments,
    consumableWeights: consumableWeightAdjustments,
    eventWeights: eventWeightAdjustments,
    scheduleHint: {
      roundStartGlobalMultiplier:
        overallFastRate > 0.02 ? 0.95 : overallLongRate > 0.15 ? 1.05 : 1,
      turnStartPersonalMultiplier:
        overallLongRate > 0.15 ? 1.06 : overallFastRate > 0.02 ? 0.96 : 1,
    },
  },
};

console.log(JSON.stringify(result, null, 2));
