<script setup>
  defineProps({
    cardTitle: String,
    cardRarity: {
      default: 'common'
    },
  });
</script>

<template>
  <li class="p-2 rounded bg-[#1c1c1c] my-3 grid grid-cols-6">
    <span :class="['col-span-4', cardRarity === 'common'?'text-white':(cardRarity === 'rare'?'text-red-600':'text-teal-500')]">{{ cardTitle }}</span>
    <span :class="['col-span-1', cardRarity === 'common'?'text-white':(cardRarity === 'rare'?'text-red-600':'text-teal-500')]">{{ cardRarity }}</span>
    <slot class="col-span-1"></slot>
  </li>
</template>