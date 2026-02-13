import { runBattle } from '../src/engine/engine.ts';
import { defaultBattleContentAdapter } from '../src/content/battleContentAdapter.ts';

function randomName(n: number) {
  const chars = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜';
  let s = '';
  for (let i = 0; i < n; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const total = 2000;
let sumRounds = 0;
let lt6 = 0;
let btw8_12 = 0;
let gt16 = 0;
const roundHist = new Map<number, number>();

for (let i = 0; i < total; i += 1) {
  const n1 = randomName(2 + (Math.random() > 0.7 ? 1 : 0));
  const n2 = randomName(2 + (Math.random() > 0.7 ? 1 : 0));
  const seed = `sim-${i}`;
  const result = runBattle({ name1: n1, name2: n2, seed }, defaultBattleContentAdapter);
  const maxRound = result.logs.reduce((m, log) => Math.max(m, log.round), 0);
  sumRounds += maxRound;
  roundHist.set(maxRound, (roundHist.get(maxRound) ?? 0) + 1);
  if (maxRound < 6) lt6 += 1;
  if (maxRound >= 8 && maxRound <= 12) btw8_12 += 1;
  if (maxRound > 16) gt16 += 1;
}

const avg = sumRounds / total;
const sorted = [...roundHist.entries()].sort((a, b) => a[0] - b[0]);
const p50Target = total * 0.5;
const p90Target = total * 0.9;
let cum = 0;
let p50 = 0;
let p90 = 0;
for (const [r, c] of sorted) {
  cum += c;
  if (!p50 && cum >= p50Target) p50 = r;
  if (!p90 && cum >= p90Target) {
    p90 = r;
    break;
  }
}

console.log(
  JSON.stringify(
    {
      total,
      avgRounds: Number(avg.toFixed(2)),
      p50,
      p90,
      lt6Pct: Number(((lt6 / total) * 100).toFixed(2)),
      btw8_12Pct: Number(((btw8_12 / total) * 100).toFixed(2)),
      gt16Pct: Number(((gt16 / total) * 100).toFixed(2)),
      histTop: sorted.filter(([r]) => r <= 20),
    },
    null,
    2,
  ),
);
