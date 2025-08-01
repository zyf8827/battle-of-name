import { Character, BattleState, StatusEffect } from './types';
import { createCharacter } from './characterGenerator';
import { events } from './definitions/events';
import seedrandom from 'seedrandom';

function logEvent(log: string[], message: string) {
    log.push(message);
    console.log(message);
}

function getModifiedStat(character: Character, stat: 'attack' | 'defense'): number {
    let baseValue = character.stats[stat];

    // Apply equipment stats
    for (const slot in character.equipment) {
        const equipment = character.equipment[slot as keyof typeof character.equipment];
        if (equipment && equipment.stats) {
            baseValue += equipment.stats[stat] || 0;
        }
    }

    // Apply status effect modifiers
    return character.statusEffects.reduce(
        (currentValue, effect) => currentValue * (effect.modifiers?.[stat === 'attack' ? 'atk' : 'def'] || 1),
        baseValue
    );
}

export function createBattleState(player1Name: string, player2Name: string): BattleState {
    const battleSeed = `${player1Name}-${player2Name}-${Date.now()}`;
    const rng = seedrandom(battleSeed);
    const player1 = createCharacter(player1Name);
    const player2 = createCharacter(player2Name);

    const initialState: Partial<BattleState> = {
        player1,
        player2,
        battleSeed,
        log: [],
        rng,
        stats: {
            [player1.name]: { totalDamageDealt: 0 },
            [player2.name]: { totalDamageDealt: 0 },
        },
    };

    const state = initialState as BattleState;

    state.addStatusEffect = (target, effect) => {
        logEvent(state.log, `${target.name} 获得了状态 “${effect.name}”！`);
        target.statusEffects.push(effect);
    };
    state.logEvent = (message) => logEvent(state.log, message);
    state.checkProbability = (key, probability) => {
        // Create a new RNG instance for each check to ensure independence
        const checkRng = seedrandom(`${state.battleSeed}-${state.rng()}-${key}`);
        return checkRng() < probability;
    };

    // Set initial active player
    if (player1.stats.speed > player2.stats.speed) {
        state.activePlayer = player1;
        state.opponent = player2;
    } else if (player2.stats.speed > player1.stats.speed) {
        state.activePlayer = player2;
        state.opponent = player1;
    } else if (rng() > 0.5) {
        state.activePlayer = player2;
        state.opponent = player1;
    } else {
        state.activePlayer = player1;
        state.opponent = player2;
    }

    return state;
}

export function startBattle(state: BattleState): { winner: Character; loser: Character } {
    state.logEvent(`战斗开始！${state.player1.name} vs ${state.player2.name}`);
    state.logEvent(`${state.activePlayer.name} 获得了先手！`);

    let turn = 1;
    while (state.player1.stats.hp > 0 && state.player2.stats.hp > 0) {
        // Re-seed the RNG for this turn to ensure turn-by-turn randomness
        state.rng = seedrandom(`${state.battleSeed}-${turn}`);

        state.logEvent(`
--- 回合 ${turn} ---
`);

        // 1. Event Phase
        events.forEach(event => event.hooks?.onTurnStart?.(state));

        state.logEvent(`${state.activePlayer.name} 的回合！`);

        // 2. Resolve Stun Status
        const isStunned = state.activePlayer.statusEffects.some(e => e.id === 'stunned');
        if (isStunned) {
            state.logEvent(`${state.activePlayer.name} 处于眩晕状态，无法行动！`);
        } else {
            // Turn Start Hooks (Career)
            state.activePlayer.career.hooks?.onTurnStart?.(state.activePlayer, state);

            let actionTaken = false;

            // 3. Action Phase (Use Item)
            if (state.activePlayer.items.length > 0 && state.checkProbability('useItem', 0.25)) {
                const itemToUse = state.activePlayer.items[0];
                state.logEvent(`${state.activePlayer.name} 决定使用道具 [${itemToUse.name}]！`);
                itemToUse.use(state.activePlayer, state);
                state.activePlayer.items.shift(); // Remove the used item
                actionTaken = true;
            }

            // 4. Action Phase (Attack)
            if (!actionTaken) {
                let attackCancelled = state.opponent.career.hooks?.onBeforeAttack?.(state.opponent, state.activePlayer, state);
                if (!attackCancelled) {
                    for (const effect of state.opponent.statusEffects) {
                        if (effect.hooks?.onBeforeAttack?.(state.opponent, state.activePlayer, state)) {
                            attackCancelled = true;
                            break;
                        }
                    }
                }

                if (!attackCancelled) {
                    const attackerAtk = getModifiedStat(state.activePlayer, 'attack');
                    const defenderDef = getModifiedStat(state.opponent, 'defense');

                    const isCritical = state.checkProbability('crit', state.activePlayer.stats.critRate);
                    const baseDamage = attackerAtk * (1 - defenderDef / (defenderDef + 100));
                    const damage = isCritical ? baseDamage * state.activePlayer.stats.critDamage : baseDamage;
                    const finalDamage = Math.floor(damage);

                    state.opponent.stats.hp -= finalDamage;
                    state.stats[state.activePlayer.name].totalDamageDealt += finalDamage;

                    let logMessage = `${state.activePlayer.name} 攻击了 ${state.opponent.name}，`;
                    logMessage += isCritical ? `打出了暴击！造成了 ${finalDamage} 点伤害！` : `造成了 ${finalDamage} 点伤害。`;
                    state.logEvent(logMessage);
                    state.logEvent(`${state.opponent.name} 剩余HP: ${Math.max(0, state.opponent.stats.hp)}`);

                    // After Attack Hook
                    state.activePlayer.career.hooks?.onAfterAttack?.(state.activePlayer, state.opponent, state);
                }
            }
        }

        // 5. Turn End Hooks & Status Effect Resolution
        state.activePlayer.career.hooks?.onTurnEnd?.(state.activePlayer, state);
        state.activePlayer.statusEffects = state.activePlayer.statusEffects.filter(effect => {
            effect.duration -= 1;
            if (effect.duration <= 0) {
                state.logEvent(`${state.activePlayer.name} 的 “${effect.name}” 效果消失了。`);
                return false;
            }
            return true;
        });

        if (state.opponent.stats.hp <= 0) {
            state.logEvent(`${state.opponent.name} 被击败了！`);
            break;
        }

        // 6. Switch Turns
        [state.activePlayer, state.opponent] = [state.opponent, state.activePlayer];
        turn++;

        if (turn > 100) {
            state.logEvent("战斗超过100回合，强制结束！");
            break;
        }
    }

    const winner = state.player1.stats.hp > 0 ? state.player1 : state.player2;
    const loser = winner === state.player1 ? state.player2 : state.player1;
    state.logEvent(`
--- 战斗结束 ---
`);
    state.logEvent(`胜利者是 ${winner.name}!`);

    return { winner, loser };
}