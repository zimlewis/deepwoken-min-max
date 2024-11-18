<script setup>
  import { reactive, ref, watch, inject, onMounted } from 'vue';
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  import TalentCard from '../components/TalentCard.vue';

  const toast = useToast();

  const form = reactive({
    buildLink: '',
    buildDeepwoken: '',
  });

  const API = inject("api");

  const allTalentsFull = ref({});
  const allTalents = ref({});
  const allCategory = ref({});

  const success = ref({});

  onMounted(async () => {
    try {
      toast.info('loading fata');
      const result = await axios.get(`${API}/get?type=all`);
      const data = result.data;
      allTalentsFull.value = data['talents'];
      allTalents.value = Object.entries(allTalentsFull.value).reduce((acc, [key, value]) => {
        // Normalize the key name by removing the suffix
        const normalizedKey = key.split(" [")[0];

        // Add or merge the entry
        if (acc[normalizedKey]) {
          return acc;
        }
        acc[normalizedKey] = {
          rarity: value.rarity.toLowerCase(),
          category: value.category.toLowerCase()
        }; // Convert rarity to lowercase

        return acc;
      }, {});

      allCategory.value = data['mystics'];

      console.log(allTalents.value);

      

      toast.success('loaded data');

    }
    catch (err) {
      toast.info('failed to load data')
    }
  })


  const talents = reactive({
    build: [],
    deepwoken: [],
    toGet: [],
    toChange: []
  });

  const state = reactive({
    isLoading: false
  });

  const build = ref({});

  watch([talents.build, talents.deepwoken], () => {
    talents.toGet = talents.build.filter((x) => {
      // x => (!talents.deepwoken.includes(x) && ['common', 'rare', 'advanced'].includes(allTalents.value[x.toLowerCase()].rarity))
      let result = true;
      if (!allTalents.value[x.toLowerCase()]) {
        return false;
      }
      if (talents.deepwoken.includes(x)) {
        result = false;
      }
      if (!['common', 'rare', 'advanced'].includes(allTalents.value[x.toLowerCase()].rarity)) {
        result = false;
      }

      return result;
    });
    talents.toChange = talents.deepwoken.filter((x) => {
      let result = true;
      if (!allTalents.value[x.toLowerCase()]) {
        return false;
      }
      if (talents.build.includes(x)) {
        result = false;
      }
      if (!['common', 'rare', 'advanced'].includes(allTalents.value[x.toLowerCase()].rarity)) {
        result = false;
      }

      return result;
    });
  })

  const getBuild = async () => {
    const buildId = form.buildLink.substring(form.buildLink.length - 8, form.buildLink.length);
    const deewpokenBuildTalentString = form.buildDeepwoken.substring(form.buildDeepwoken.indexOf('== TALENTS ==') + '== TALENTS ==\n'.length, form.buildDeepwoken.length);
    talents.deepwoken = deewpokenBuildTalentString.split('\n')

    for(let [index, talent] of talents.deepwoken.entries()) {
      if (!allTalents.value[talent.toLowerCase()]) {
        removeTalent('deepwoken', index);
      }
    }
    try {
      state.isLoading = true;
      toast.info('Loading build...');
      const resp = await axios.get(`${API}/build?id=${buildId}`);
      build.value = resp.data;


      for(let talent of build.value.talents) {
        if (talent.indexOf('[') !== -1){
          talent = talent.substring(0, talent.indexOf('[')).trim();
        }

        if (!allTalents.value[talent.toLowerCase()]) {
          removeTalent('build', index);
        }

        talents.build.push(talent);
      }
      toast.success('Build loaded successfully');
    }
    catch (error) {
      toast.error('Error, build not found');
    }
    finally {
      state.isLoading = false
    }
  }

  const removeTalent = (from, index) => {
    talents[from].splice(index, 1)
  }
</script>

<template>
  <div class="h-screen">
    <div class="container m-auto mt-5 max-w-2xl">
      <div class="px-6 py-8 mb-4 rounded-md shadow-md bg-white m-auto md:m-0">
        <form @submit.prevent="getBuild" class="m-auto">
          <div class="mb-4">
            <label for="builderlink" class="block text-gray-700 font-bold mb-2">Builder link</label>
            <input v-model="form.buildLink" type="text" id="builderlink" name="builderlink" class="border rounded w-full py-2 px-3 mb-2" placeholder="" required />
          </div>
          <div class="mb-4">
            <label for="dwbuild" class="block text-gray-700 font-bold mb-2">Build from deepwoken</label>
            <textarea v-model="form.buildDeepwoken" id="dwbuild" name="dwbuild" class="border rounded w-full py-2 px-3" rows="10" placeholder="" required></textarea>
          </div>
          <button
            class="bg-[#04100d] hover:shadow-xl text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
            type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
    <div class="lg:px-40 md:px-0 sm:px-0 py-8 mb-4 rounded-md m-auto grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 auto-rows-[500px]">
        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>Talents from build</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="card in talents.build" :card-rarity="allTalents[card.toLowerCase()].rarity" :card-title="card" />
          </ul>
        </div>

        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>Talents from deepwoken</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="card in talents.deepwoken" :card-rarity="allTalents[card.toLowerCase()].rarity" :card-title="card" />
          </ul>
        </div>
        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>To change</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="(card, index) in talents.toChange" :card-rarity="allTalents[card.toLowerCase()].rarity" :card-title="card">
              <button  @click="removeTalent('toChange', index)" class="mx-auto px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">x</button>
            </TalentCard>
          </ul>
        </div>
        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>To get</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="(card, index) in talents.toGet" :card-rarity="allTalents[card.toLowerCase()].rarity" :mystic="allCategory[allTalents[card.toLowerCase()].category]" :card-title="card">
              <button @click="removeTalent('toGet', index)" class="mx-auto px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">x</button>
            </TalentCard>
          </ul>
        </div>
    </div>

  </div>
</template>