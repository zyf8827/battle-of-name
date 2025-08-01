<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
    <h1 class="text-6xl font-bold mb-4">WINNER</h1>
    <h2 class="text-4xl text-yellow-400 mb-8">{{ winner.name }}</h2>
    <p class="text-2xl mb-2">称号：<span class="font-bold text-orange-500">{{ title }}</span></p>
    <div class="mt-4 text-xl">
      <p>武器: {{ winner.equipment.weapon?.name || '无' }}</p>
      <p>防具: {{ winner.equipment.armor?.name || '无' }}</p>
      <p>饰品: {{ winner.equipment.accessory?.name || '无' }}</p>
    </div>
    <button @click="playAgain" class="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg">
      再来一局
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Character } from '../game/types';

const props = defineProps<{ 
  winner: Character 
}>();

const emit = defineEmits(['play-again']);

const title = computed(() => {
  // Simple title generation based on career
  switch (props.winner.career.id) {
    case 'programmer':
      return '宇宙最强码农';
    case 'master_of_loafing':
      return '摸鱼之王';
    case 'keyboard_warrior':
      return '键仙';
    default:
      return '天选之人';
  }
});

const playAgain = () => {
  emit('play-again');
};
</script>