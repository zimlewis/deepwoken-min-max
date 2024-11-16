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

  const allTalents = ref({});
  const allTalentsRarity = ref({});

  const success = ref({});

  onMounted(async () => {
    try {
      toast.info('loading talents');
      const result = await axios.get('https://api.deepwoken.co/get?type=talent&name=all');
      allTalents.value = result.data;
      allTalentsRarity.value = Object.entries(allTalents.value).reduce((acc, [key, value]) => {
        // Normalize the key name by removing the suffix
        const normalizedKey = key.split(" [")[0];

        // Add or merge the entry
        if (!acc[normalizedKey]) {
          acc[normalizedKey] = value.rarity.toLowerCase(); // Convert rarity to lowercase
        }

        return acc;
      }, {});

      console.log(allTalentsRarity.value);
      success.value = true;
      toast.success('loaded talents');
    }
    catch (error) {
      success.value = false;
      console.log(error);
      toast.error('failed to load talents');
    }
    finally {

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
    talents.toGet = talents.build.filter(x => (!talents.deepwoken.includes(x) && ['common', 'rare', 'advanced'].includes(allTalentsRarity.value[x.toLowerCase()])));
    talents.toChange = talents.deepwoken.filter(x => (!talents.build.includes(x) && ['common', 'rare', 'advanced'].includes(allTalentsRarity.value[x.toLowerCase()])));
  })

  const getBuild = async () => {
    const buildId = form.buildLink.substring(form.buildLink.length - 8, form.buildLink.length);
    const deewpokenBuildTalentString = form.buildDeepwoken.substring(form.buildDeepwoken.indexOf('== TALENTS ==') + '== TALENTS ==\n'.length, form.buildDeepwoken.length);
    talents.deepwoken = deewpokenBuildTalentString.split('\n')
    try {
      state.isLoading = true;
      toast.info('Loading build...');
      const resp = await axios.get(`https://api.deepwoken.co/build?id=${buildId}`);
      build.value = resp.data;


      for(let talent of build.value.talents) {
        if (talent.indexOf('[') !== -1){
          talent = talent.substring(0, talent.indexOf('[')).trim();
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
            <label for="builderlink" class="block text-gray-700 font-bold mb-2">Job Listing Name</label>
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
    <div class="px-40 py-8 mb-4 rounded-md m-auto md:m-0 grid grid-cols-2 auto-rows-[500px]">
        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>Talents from build</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="card in talents.build" :card-rarity="allTalentsRarity[card.toLowerCase()]" :card-title="card" />
          </ul>
        </div>

        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>Talents from deepwoken</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="card in talents.deepwoken" :card-rarity="allTalentsRarity[card.toLowerCase()]" :card-title="card" />
          </ul>
        </div>
        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>To change</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="(card, index) in talents.toChange" :card-rarity="allTalentsRarity[card.toLowerCase()]" :card-title="card">
              <button  @click="removeTalent('toChange', index)">x</button>
            </TalentCard>
          </ul>
        </div>
        <div class="bg-neutral-100 border-2 rounded-xl p-2 m-2 flex flex-col">
          <h5>To get</h5>
          <ul class="h-100 overflow-y-auto">
            <TalentCard v-for="(card, index) in talents.toGet" :card-rarity="allTalentsRarity[card.toLowerCase()]" :card-title="card">
              <button @click="removeTalent('toGet', index)">x</button>
            </TalentCard>
          </ul>
        </div>
    </div>

  </div>
</template>