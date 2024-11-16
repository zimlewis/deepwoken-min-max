<script setup>
  import { reactive, ref } from 'vue';
  import { getBuild } from 'dwapi-wrapper';
  const form = reactive({
    buildLink: '',
    buildDeepwoken: '',
  });

  const getBuildDw = async () => {
    const buildId = form.buildLink.substring(form.buildLink.length - 8, form.buildLink.length);
    try {
      const build = await getBuild(buildId);
      console.log(build);
    }
    catch (error) {
      console.log(error)
    }
  }

</script>

<template>
  <form @submit.prevent="getBuildDw" class="m-auto bg-white p-10">
    <div class="mb-4">
      <label for="builderlink" class="block text-gray-700 font-bold mb-2">Job Listing Name</label>
      <input v-model="form.buildLink" type="text" id="builderlink" name="builderlink"
        class="border rounded w-full py-2 px-3 mb-2" placeholder="" required />
    </div>
    <button
      class="bg-[#04100d] hover:shadow-xl text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
      type="submit">
      Submit
    </button>
  </form>
</template>