<template>
    <PanoramaViewer :panorama="panoramaUrl" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PanoramaViewer from './components/PanoramaViewer.vue'

const panoramaUrl = ref<string | null>(null)
panoramaUrl.value = '/imgs/2025-03-10 10_11_32.jpeg'

</script>
