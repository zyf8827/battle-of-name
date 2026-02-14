#!/usr/bin/env node
/**
 * Simple script to verify the brat disassemble talent fix
 * This manually creates a battle scenario and checks the logs
 */

import { GameEngine } from '../src/engine/engine.js';
import { defaultBattleContentAdapter } from '../src/content/battleContentAdapter.js';
import brat from '../src/content/classes/brat.js';

console.log('Testing Brat Disassemble Talent Fix\n');
console.log('Creating a battle between 熊孩子 (brat) and 普通人...\n');

const engine = new GameEngine({
  adapter: defaultBattleContentAdapter,
  battleInput: {
    name1: '熊孩子',
    name2: '受害者',
    seed: 'test-brat',
  },
  battleSeed: 'test-123',
});

// Get units
const bratUnit = engine.state.units[0];
const victimUnit = engine.state.units[1];

console.log(`Unit 1: ${bratUnit.name}`);
console.log(`Unit 2: ${victimUnit.name}\n`);

// Ensure brat has the disassemble talent
const hasTalent = bratUnit.modifiers.some((m) => m.id === 'class.brat.disassemble');
if (!hasTalent) {
  console.log('Adding disassemble talent to bratUnit...');
  bratUnit.modifiers.push({
    ...brat.talents[0],
    appliedOrder: Date.now(),
  });
}

// Ensure victim has equipment
const victimEquipment = victimUnit.modifiers.filter((m) => m.source === 'EQUIP');
console.log(`Victim has ${victimEquipment.length} equipment(s):`);
victimEquipment.forEach((eq) => console.log(`  - ${eq.name}`));

if (victimEquipment.length === 0) {
  console.log('\nAdding test equipment to victim...');
  victimUnit.modifiers.push({
    id: 'test-equipment',
    source: 'EQUIP',
    name: '测试装备',
    priority: 0,
    tags: ['equip'],
  });
}

console.log('\nRunning battle rounds...\n');
let foundDisassembleLog = false;
let roundsRun = 0;
const maxRounds = 30;

for (let i = 0; i < maxRounds && !engine.state.isOver; i++) {
  const logCountBefore = engine.state.logs.length;
  engine.nextRound();
  roundsRun++;

  const newLogs = engine.state.logs.slice(logCountBefore);

  for (const log of newLogs) {
    // Look for the disassemble log
    if (log.text.includes('发现自己的东西被') && log.text.includes('弄坏了')) {
      console.log(`\n✓ FOUND DISASSEMBLE LOG in round ${roundsRun}:`);
      console.log(`  ${log.text}`);

      // Parse the log to check if source and target are different
      const parts = log.text.split('发现自己的东西被');
      if (parts.length === 2) {
        const targetName = parts[0].trim();
        const sourceName = parts[1].split('弄坏了')[0].trim();

        console.log(`\n  Target (victim): "${targetName}"`);
        console.log(`  Source (brat): "${sourceName}"`);

        if (targetName === sourceName) {
          console.log('\n  ✗ BUG: Source and target are the same!');
          foundDisassembleLog = true;
        } else {
          console.log('\n  ✓ CORRECT: Source and target are different!');
          foundDisassembleLog = true;
        }
      }
      break;
    }
  }

  if (foundDisassembleLog) break;
}

if (!foundDisassembleLog) {
  console.log(
    `\nNote: Disassemble talent did not trigger in ${roundsRun} rounds (10% chance per attack)`,
  );
  console.log('This is normal - the talent has random chance to trigger.');
  console.log('\nYou can run this script multiple times to see it trigger.');
} else {
  console.log('\n--- Test Complete ---');
}

// Print battle result
if (engine.state.isOver) {
  console.log(`\nBattle ended in ${engine.state.round} rounds`);
  const winner = engine.state.units.find((u) => u.hp > 0);
  if (winner) {
    console.log(`Winner: ${winner.name}`);
  }
}
