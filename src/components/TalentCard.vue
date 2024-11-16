<script setup>
  defineProps({
    cardTitle: String,
    cardRarity: {
      default: 'common'
    },
  });
  const rarityColor = {
    'common': 'text-white',
    'rare': 'text-red-600',
    'advanced': 'text-teal-500',
    'quest': 'text-yellow-400',
    'oath': 'text-blue-600',
    'outfit': 'text-purple-700',
    'origin': 'text-green-500'
  };
</script>

<template>
  <li class="p-2 rounded bg-[#1c1c1c] my-3 grid grid-cols-6">
    <span :class="['col-span-4', rarityColor[cardRarity]]">{{ cardTitle }}</span>
    <span :class="['col-span-1', rarityColor[cardRarity]]">{{ cardRarity }}</span>
    <slot class="col-span-1"></slot>
  </li>
</template>