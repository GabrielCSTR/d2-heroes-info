<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    isLoading: Boolean,
});
</script>
<template>
  <div v-if="isLoading" class="absolute top-0 left-0 right-0 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div class="w-16 h-16 mt-96 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
</template>
