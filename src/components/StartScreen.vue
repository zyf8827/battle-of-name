
<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
    <h1 class="text-5xl font-bold mb-8">姓名大作战</h1>
    <div class="flex gap-4">
      <input v-model="player1Name" placeholder="输入姓名1" class="bg-gray-800 border border-gray-700 rounded px-4 py-2" />
      <input v-model="player2Name" placeholder="输入姓名2" class="bg-gray-800 border border-gray-700 rounded px-4 py-2" />
    </div>
    <button @click="startBattle" class="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      开始对战
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const player1Name = ref('');
const player2Name = ref('');

const emit = defineEmits(['start-battle']);

const startBattle = () => {
  if (player1Name.value && player2Name.value) {
    emit('start-battle', { player1: player1Name.value, player2: player2Name.value });
  }
};
</script>
