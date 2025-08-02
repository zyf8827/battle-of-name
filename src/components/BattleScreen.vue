
<template>
  <div class="w-full h-full flex flex-col bg-gray-900 text-white p-8">
    <div class="flex justify-between text-2xl font-bold">
      <div>{{ player1.name }}</div>
      <div>{{ player2.name }}</div>
    </div>
    <div class="flex justify-between">
      <div>HP: {{ player1.stats.hp }} / {{ player1.stats.maxHp }}</div>
      <div>
        <p>武器: {{ player1.equipment.weapon?.name || '无' }}</p>
        <p>防具: {{ player1.equipment.armor?.name || '无' }}</p>
        <p>饰品: {{ player1.equipment.accessory?.name || '无' }}</p>
      </div>
      <div>HP: {{ player2.stats.hp }} / {{ player2.stats.maxHp }}</div>
      <div>
        <p>武器: {{ player2.equipment.weapon?.name || '无' }}</p>
        <p>防具: {{ player2.equipment.armor?.name || '无' }}</p>
        <p>饰品: {{ player2.equipment.accessory?.name || '无' }}</p>
      </div>
    </div>
    <div class="flex-grow bg-gray-800 my-4 p-4 rounded overflow-y-auto">
      <div v-for="(entry, index) in log" :key="index">{{ entry }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '../game/types';

defineProps<{ 
  player1: Character, 
  player2: Character, 
  log: string[] 
}>();
</script>
