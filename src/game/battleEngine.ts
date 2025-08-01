import { Character, BattleState, StatusEffect } from './types';
import { createCharacter } from './characterGenerator';
import { events } from './definitions/events/index';
import seedrandom from 'seedrandom';

function logEvent(log: string[], message: string) {
    log.push(message);
    console.log(message);
}

function getModifiedStat(character: Character, stat: 'attack' | 'defense' | 'speed' | 'critRate' | 'critDamage'): number {
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
        (currentValue, effect) => {
            switch (stat) {
                case 'attack': return currentValue * (effect.modifiers?.atk || 1);
                case 'defense': return currentValue * (effect.modifiers?.def || 1);
                case 'speed': return currentValue * (effect.modifiers?.speed || 1);
                case 'critRate': return currentValue + (effect.modifiers?.critRate || 0);
                case 'critDamage': return currentValue + (effect.modifiers?.critDmg || 0);
                default: return currentValue;
            }
        },
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
        const hasPeaceDoveEffect = state.activePlayer.statusEffects.some(e => e.id === 'peace_dove_effect');
        const isSilenced = state.activePlayer.statusEffects.some(e => e.id === 'silenced');

        if (isStunned) {
            // Check for Noise Cancelling Headphones immunity
            const hasNoiseCancellingHeadphones = state.activePlayer.equipment.armor?.id === 'noiseCancellingHeadphones';
            if (hasNoiseCancellingHeadphones && state.checkProbability('noiseCancellingHeadphones-stunImmunity', 0.5)) {
                state.logEvent(`${state.activePlayer.name} 的降噪耳机使其免疫了眩晕效果！`);
                state.activePlayer.statusEffects = state.activePlayer.statusEffects.filter(e => e.id !== 'stunned');
            } else {
                state.logEvent(`${state.activePlayer.name} 处于眩晕状态，无法行动！`);
            }
        } else if (hasPeaceDoveEffect) {
            state.logEvent(`${state.activePlayer.name} 处于和平鸽效果下，无法攻击！`);
        } else if (isSilenced) {
            state.logEvent(`${state.activePlayer.name} 处于沉默状态，无法使用技能和物品！`);
            // Prevent action by setting actionTaken to true
            actionTaken = true;
        } else if (state.activePlayer.statusEffects.some(e => e.id === 'lose_turn')) {
            state.logEvent(`${state.activePlayer.name} 失去了行动机会！`);
            state.activePlayer.statusEffects = state.activePlayer.statusEffects.filter(e => e.id !== 'lose_turn'); // Remove the effect after skipping turn
            actionTaken = true;
        } else {
            // Turn Start Hooks (Career)
            state.activePlayer.career.hooks?.onTurnStart?.(state.activePlayer, state);

            let actionTaken = false;
            const isItemDisabled = state.activePlayer.statusEffects.some(e => e.id === 'item_disabled');
            const isAttackDisabled = state.activePlayer.statusEffects.some(e => e.id === 'attack_disabled');
            const hasActionFailure = state.activePlayer.statusEffects.some(e => e.id === 'action_failure');

            if (hasActionFailure && state.checkProbability('action-failure', 0.2)) {
                state.logEvent(`${state.activePlayer.name} 的行动失败了！`);
                actionTaken = true;
            }

            // 3. Action Phase (Use Item)
            if (!actionTaken && state.activePlayer.items.length > 0 && !isItemDisabled) {
                const itemToUse = state.activePlayer.items[0];
                if (itemToUse.id === 'repeater') {
                    if (state.lastAction) {
                        state.logEvent(`${state.activePlayer.name} 决定使用道具 [${itemToUse.name}]，重复上一次行动！`);
                        if (state.lastAction.type === 'attack') {
                            // Re-perform attack
                            // This is a simplified re-attack, full re-execution would be complex
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
                        } else if (state.lastAction.type === 'useItem' && state.lastAction.item) {
                            state.logEvent(`${state.activePlayer.name} 重复使用道具 [${state.lastAction.item.name}]！`);
                            state.lastAction.item.use(state.activePlayer, state);
                        }
                        state.activePlayer.items.shift(); // Remove repeater
                        actionTaken = true;
                    } else {
                        state.logEvent(`${state.activePlayer.name} 尝试使用复读机，但没有上一次行动可以重复。`);
                    }
                } else if (state.checkProbability('useItem', 0.25)) {
                    const itemToUse = state.activePlayer.items[0];
                    state.logEvent(`${state.activePlayer.name} 决定使用道具 [${itemToUse.name}]！`);
                    itemToUse.use(state.activePlayer, state);
                    // Water Gun does not get removed immediately
                    if (itemToUse.id !== 'waterGun') {
                        state.activePlayer.items.shift(); // Remove the used item
                    }
                    actionTaken = true;
                    state.lastAction = { type: 'useItem', item: itemToUse };
                }
            } else if (!actionTaken && isItemDisabled) {
                state.logEvent(`${state.activePlayer.name} 无法使用物品！`);
            }

            // 4. Action Phase (Attack)
            if (!actionTaken && !isAttackDisabled) {
                let attackCancelled = false;

                // Voice Changer effect
                const hasVoiceChangerEffect = state.opponent.statusEffects.some(e => e.id === 'voice_changer_effect');
                if (hasVoiceChangerEffect && state.checkProbability('voiceChanger-miss', 0.5)) {
                    state.logEvent(`${state.opponent.name} 的变声器效果使其攻击失败了！`);
                    attackCancelled = true;
                }

                if (!attackCancelled) {
                    attackCancelled = state.opponent.career.hooks?.onBeforeAttack?.(state.opponent, state.activePlayer, state);
                    if (!attackCancelled) {
                        for (const effect of state.opponent.statusEffects) {
                            if (effect.hooks?.onBeforeAttack?.(state.opponent, state.activePlayer, state)) {
                                attackCancelled = true;
                                break;
                            }
                        }
                    }
                }

                if (!attackCancelled) {
                    const attackerAtk = getModifiedStat(state.activePlayer, 'attack');
                    const defenderDef = getModifiedStat(state.opponent, 'defense');

                    const isCritical = state.checkProbability('crit', state.activePlayer.stats.critRate);
                    const baseDamage = attackerAtk * (1 - defenderDef / (defenderDef + 100));
                    const damage = isCritical ? baseDamage * getModifiedStat(state.activePlayer, 'critDamage') : baseDamage;
                    const finalDamage = Math.floor(damage);

                    // Reflector effect
                    const hasReflector = state.opponent.equipment.accessory?.id === 'reflector';
                    if (hasReflector) {
                        const reflectedDamage = Math.floor(finalDamage * 0.5);
                        state.activePlayer.stats.hp -= reflectedDamage;
                        state.logEvent(`${state.opponent.name} 的反光镜反弹了 ${reflectedDamage} 点伤害给 ${state.activePlayer.name}！`);
                    }

                    state.opponent.stats.hp -= finalDamage;
                    state.stats[state.activePlayer.name].totalDamageDealt += finalDamage;

                    let logMessage = `${state.activePlayer.name} 攻击了 ${state.opponent.name}，`;
                    logMessage += isCritical ? `打出了暴击！造成了 ${finalDamage} 点伤害！` : `造成了 ${finalDamage} 点伤害。`;
                    state.logEvent(logMessage);
                    state.logEvent(`${state.opponent.name} 剩余HP: ${Math.max(0, state.opponent.stats.hp)}`);

                    // After Attack Hook (Career)
                    state.activePlayer.career.hooks?.onAfterAttack?.(state.activePlayer, state.opponent, state);
                    // After Attack Hook (Equipment)
                    for (const slot in state.activePlayer.equipment) {
                        const equipment = state.activePlayer.equipment[slot as keyof typeof state.activePlayer.equipment];
                        equipment?.hooks?.onAfterAttack?.(state.activePlayer, state.opponent, state);
                    }
                    state.lastAction = { type: 'attack' };
                }
            } else if (!actionTaken && isAttackDisabled) {
                state.logEvent(`${state.activePlayer.name} 无法进行攻击！`);
            }
        }

        // 5. Turn End Hooks & Status Effect Resolution
        state.activePlayer.career.hooks?.onTurnEnd?.(state.activePlayer, state);
        // Equipment onTurnEnd hooks
        for (const slot in state.activePlayer.equipment) {
            const equipment = state.activePlayer.equipment[slot as keyof typeof state.activePlayer.equipment];
            equipment?.hooks?.onTurnEnd?.(state.activePlayer, state);
        }

        state.activePlayer.statusEffects = state.activePlayer.statusEffects.filter(effect => {
            // Handle poisoned effect
            if (effect.id === 'poisoned') {
                const poisonDamage = 5; // Example poison damage
                state.activePlayer.stats.hp -= poisonDamage;
                state.logEvent(`${state.activePlayer.name} 受到中毒伤害 ${poisonDamage} 点！`);
            }
            // Handle mining virus effect
            if (effect.id === 'mining_virus') {
                const miningDamage = 3; // Example mining virus damage
                state.activePlayer.stats.hp -= miningDamage;
                state.logEvent(`${state.activePlayer.name} 受到挖矿病毒伤害 ${miningDamage} 点！`);
            }

            effect.duration -= 1;
            if (effect.duration <= 0) {
                state.logEvent(`${state.activePlayer.name} 的 “${effect.name}” 效果消失了。`);
                return false;
            }
            return true;
        });

        if (state.opponent.stats.hp <= 0) {
            // Cloud Backup effect
            const hasCloudBackup = state.opponent.items.some(item => item.id === 'cloudBackup');
            if (hasCloudBackup && state.checkProbability('cloudBackup-revive', 0.5)) {
                state.opponent.stats.hp = 1;
                state.logEvent(`${state.opponent.name} 的云盘备份生效了，以1点生命值复活！`);
                state.opponent.items = state.opponent.items.filter(item => item.id !== 'cloudBackup'); // Remove used item
            } else {
                state.logEvent(`${state.opponent.name} 被击败了！`);
                break;
            }
        }

        // 6. Switch Turns
        const hasExtraTurn = state.activePlayer.statusEffects.some(e => e.id === 'extra_turn');
        if (hasExtraTurn) {
            state.logEvent(`${state.activePlayer.name} 获得了额外行动机会！`);
            state.activePlayer.statusEffects = state.activePlayer.statusEffects.filter(e => e.id !== 'extra_turn'); // Remove the effect after using extra turn
        } else {
            [state.activePlayer, state.opponent] = [state.opponent, state.activePlayer];
            turn++;
        }

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