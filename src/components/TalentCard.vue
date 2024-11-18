<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

defineProps({
  cardTitle: String,
  cardRarity: {
    default: 'common'
  },
  mystic: {
    default: null,
    type: String
  }
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

const modal = ref(null);
const isMysticShowing = ref(false);

onClickOutside(modal, () => {
  isMysticShowing.value = false
});

const toggleModal = () => {
  isMysticShowing.value = !isMysticShowing.value;
}
</script>

<template>
  <li class="p-2 rounded bg-[#1c1c1c] my-3 grid grid-cols-7">
    <span :class="['col-span-4', rarityColor[cardRarity]]">{{ cardTitle }}</span>
    <span :class="['col-span-1', rarityColor[cardRarity]]">{{ cardRarity }}</span>
    <button @click="toggleModal" v-if="mystic"
      class="col-span-1 mx-auto px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">...</button>
    <span v-else class="col-span-1"></span>
    <slot class="col-span-1"></slot>
  </li>
  <Teleport to="#modal">
    <div v-if="mystic" tabindex="-1"
      :class="[isMysticShowing?'':'hidden', 'overflow-y-auto','overflow-x-hidden','fixed','top-0','right-0','left-0','z-50','justify-center','items-center','bg-[#00000085]','w-full','md:inset-0','h-full','max-h-full']">
      <div ref="modal" class="relative p-4 m-auto w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Mystic
                </h3>
                <button @click="toggleModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {{ mystic }}
                </p>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button @click="toggleModal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Close</button>
            </div>
        </div>
    </div>
    </div>

  </Teleport>
</template>