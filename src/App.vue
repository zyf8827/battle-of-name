<template>
  <div id="app" class="w-full h-full">
    <StartScreen v-if="gameState === 'start'" @start-battle="startBattle" />
    <BattleScreen v-else-if="gameState === 'battle'" :player1="player1!" :player2="player2!" :log="log" />
    <SettlementScreen v-else-if="gameState === 'settlement'" :winner="winner!" @play-again="playAgain" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import StartScreen from './components/StartScreen.vue';
import BattleScreen from './components/BattleScreen.vue';
import SettlementScreen from './components/SettlementScreen.vue';
import type { Character } from './game/types';
import { createBattleState, startBattle as runBattle } from './game/battleEngine';

type GameState = 'start' | 'battle' | 'settlement';

const gameState = ref<GameState>('start');
const player1 = ref<Character | null>(null);
const player2 = ref<Character | null>(null);
const winner = ref<Character | null>(null);
const log = ref<string[]>([]);

const startBattle = (names: { player1: string; player2: string }) => {
  const state = createBattleState(names.player1, names.player2);
  player1.value = state.player1;
  player2.value = state.player2;
  log.value = state.log;
  gameState.value = 'battle';

  nextTick(() => {
    setTimeout(() => {
      const result = runBattle(state);
      winner.value = result.winner;
      gameState.value = 'settlement';
    }, 100);
  });
};

const playAgain = () => {
  gameState.value = 'start';
  player1.value = null;
  player2.value = null;
  winner.value = null;
  log.value = [];
};

</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>