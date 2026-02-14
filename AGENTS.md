# AGENTS.md

This file provides guidance to Coding Agents when working with code in this repository.

## Project Overview

**姓名大作战 (Name Battle)** - A deterministic turn-based auto-battler where player names generate unique character attributes via hash algorithm. Same name + same seed = identical battle outcome.

## Development Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Build for production (tsc -b && vite build)
npm run preview      # Preview production build

# Testing
npm run test         # Run all tests with vitest
npm run test:watch   # Run tests in watch mode

# Balance Simulation
npx tsx scripts/balance-sim.ts                      # Run batch simulation with default settings (5000 games)
npx tsx scripts/balance-sim.ts --total=1000          # Run with custom game count
npx tsx scripts/balance-sim.ts --seed=my-test-seed   # Run with specific seed
```

### Balance Testing & Tuning

The `scripts/balance-sim.ts` tool runs thousands of automated battles between randomly generated characters to collect statistical data.

**Tuning Workflow**:
1. Add/Modify content.
2. Run simulation: `npx tsx scripts/balance-sim.ts --total=2000 > sim_result.json`.
3. Check `recommendations` in the output JSON. It suggests weight multipliers for `weightProfile.ts` based on win rates and game length correlations.
4. Apply suggested multipliers to `src/content/balance/weightProfile.ts` to stabilize the meta.

## Architecture

### Core Design Philosophy

The project follows three core principles:
1. **Modifier-First**: Everything that changes stats or logic (equipment, buffs, environment) is a `Modifier`
2. **Event-Driven**: No direct state mutation. All actions broadcast events through a pipeline (Interception → Resolution → Reaction, DFS)
3. **Recursive Causality**: Events can trigger new events (e.g., thorns reflecting damage), processed depth-first

### Directory Structure

```
src/
├── engine/           # Core battle engine (deterministic, no content dependencies)
│   ├── engine.ts      # Main combat loop
│   ├── types.ts       # Core type definitions
│   ├── rng.ts         # Seeded RNG (seedrandom wrapper)
│   ├── scheduler.ts   # Turn order management
│   ├── runtimeServices.ts  # In-battle state modifiers API
│   └── contentAdapter.ts    # Interface for content layer dependency inversion
├── content/          # All game content (classes, equipment, events, modifiers)
│   ├── base/          # Shared type definitions
│   ├── classes/       # Character classes (brawler, sustainer, etc.)
│   ├── equipment/     # Weapons/armor (keyboard, thorns, etc.)
│   ├── consumables/   # Usable items
│   ├── modifiers/     # Reusable modifiers (buffs/debuffs)
│   ├── events/        # Random events and event pools
│   ├── effects/       # Built-in effect handlers for DSL
│   ├── narration.ts   # Battle text templates and rendering
│   └── battleContentAdapter.ts  # Default content adapter implementation
├── store/             # Zustand state management
└── ui/                # React components
```

### Engine-Content Separation

The engine depends **only** on `BattleContentAdapter` interface (defined in `src/engine/contentAdapter.ts`), not on concrete content. This allows:
- Swapping content packages without engine changes
- Testing with mock content
- Multiple content variants (MVP, seasonal, etc.)

The default implementation is `src/content/battleContentAdapter.ts`.

### The Event Pipeline

Every action goes through three phases:

1. **Interception** (Phase 1): Modifiers with `onOutgoing`/`onIncoming` hooks can modify the event before it resolves
2. **Resolution** (Phase 2): Final event is applied to game state (HP changes, buffs added, etc.)
3. **Reaction** (Phase 3): Modifiers with `onPostAction` hooks can generate new derived events (e.g., lifesteal, reflect)

Derived events immediately re-enter Phase 1 (DFS) until no new events are generated.

### Modifier System

All game entities implement the `Modifier` interface:
- **Sources**: `PASSIVE` | `EQUIP` | `BUFF` | `ENV` | `TALENT`
- **Stacking policies**: `STACK` | `REFRESH_DURATION` | `REPLACE` | `IGNORE`
- **Hooks**: `onRoundStart`, `onTurnStart`, `onTurnEnd`, `onOutgoing`, `onIncoming`, `onPostAction`

Most content uses **DSL (declarative effects)** instead of writing hooks. Built-in effect kinds include:
- `APPLY_MODIFIER` - Add a buff/debuff to target
- `LIFESTEAL` - Heal based on damage dealt
- `MITIGATE` - Reduce incoming damage
- `SHIELD` - Add shield points
- `DISPEL` - Remove buffs/debuffs
- `TRIGGER_EVENT_POOL` - Trigger random events
- `DIRECT_DAMAGE` / `DIRECT_HEAL` - Direct HP modification
- `GRANT/LOSE_RANDOM_CONSUMABLE` / `EQUIPMENT`

### Determinism & RNG

**Critical**: All randomness MUST use the seeded RNG from `engine/rng.ts`. Never use `Math.random()`.

- Same `name` → same base stats (via hash-based generation in content adapter)
- Same `name + seed` → same equipment/consumables
- Same `battle seed` → identical battle flow (same events, same crits, same triggers)

This enables battle replay and verification.

### Battle Loop Order (Fixed)

Per `GAME_ENGINE.md` Section 2.1, each round executes in this exact order:
1. RoundStart snapshot
2. onRoundStart hooks (global)
3. Environment event window: RoundStart
4. Cooldown tick (all `state.cd` decrement)
5. Generate turn queue (by AGI, stable sort)
6. Execute each unit's turn:
   - onTurnStart
   - Status settlement (DoT, shield decay, control check)
   - Action decision (if not controlled)
   - Execute action → Event pipeline
   - onTurnEnd
7. onRoundEnd hooks (global)
8. Duration tick & remove (all `duration > 0` modifiers)
9. Environment event window: RoundEnd

## Content Development

### Adding New Content

**Standard workflow**:
1. Create file in appropriate `src/content/` subdirectory
2. Follow naming convention: `class.xxx`, `equip.xxx`, `buff.xxx`, `talent.xxx`, `event.xxx`, `consumable.xxx`
3. Export the item from that directory's `index.ts`
4. Register in collection (`allClasses`, `allEquipment`, etc.)

### Modifier Validation

All modifiers must pass `validateModifierSpec()` from `src/content/base/modifier.ts`:
- Required fields: `id`, `source`, `name`
- `tags` must be from allowed `CombatTag` set
- `triggers` must have valid `TriggerSpec` + `EffectSpec[]`

### Text Templates

Battle logs use template variables like `{sourceName}`, `{targetName}`, `{damage}`, `{round}`, etc.

- **Narration** (`content/narration.ts`): Attack hit/crit/miss descriptions
- **System logs** (`logText` keys): Buff apply/remove, heal, death, etc.
- **Modifier texts**: Each modifier can define `texts.apply`, `texts.remove`, `texts.trigger`

Variables available depend on context (see `docs/CONTENT_SPEC.md` Section 4.4).

### Balance Guidelines

After adding content:
1. Run `npm run test`
2. Run `npx tsx scripts/balance-sim.ts`
3. Check metrics; adjust content values (not engine constants) if needed

## Debugging

### Battle Debug Logs

Enable engine-level debug output in browser console:

```javascript
window.__BATTLE_DEBUG__ = true   // Enable
window.__BATTLE_DEBUG__ = false  // Disable
```

When enabled, look for `[battle-debug]` prefixed logs showing:
- Event processing flow
- Trigger hits/misses with reasons
- Damage/heal calculations
- Deduplication and skips

### Test Structure

Tests are in `src/**/__tests__/*.test.ts` and run via vitest with Node environment.

## Key Implementation Files

- **`src/engine/engine.ts`** - Main GameEngine class with combat loop
- **`src/engine/types.ts`** - All core type definitions (Unit, Modifier, CombatEvent, etc.)
- **`src/content/battleContentAdapter.ts`** - Default bootstrap logic (name → stats/equipment)
- **`src/content/effects/standardEffectHandlers.ts`** - Built-in effect kind implementations
- **`src/content/effects/defaultControlResolver.ts`** - Control state handling (stun, skip, etc.)
- **`src/content/narration.ts`** - Battle text template system

## Important Constraints

1. **No direct engine modifications for content**: Use DSL effects or custom hooks before considering engine changes
2. **Immutable events in interceptors**: Must return new event object, not mutate input
3. **Deterministic ordering**: Hook execution order is fixed (priority → appliedOrder → id) for reproducibility
4. **Event budget enforcement**: Engine has limits to prevent infinite loops (max depth, max events per round, etc.)

## Documentation References

- `docs/GAME_ENGINE.md` - Complete engine architecture and technical specifications
- `docs/GAME_DESIGN.md` - Game design philosophy and mechanics
- `docs/CONTENT_SPEC.md` - Content layer implementation guide and balance rules
