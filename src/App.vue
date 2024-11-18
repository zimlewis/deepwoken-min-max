<script setup>
import { RouterView } from 'vue-router';
import { provide } from 'vue';


provide("api", "https://api.deepwoken.co");

</script>

<template>
  <header>
  </header>

  <RouterView/>
</template>
