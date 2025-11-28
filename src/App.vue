<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()

onMounted(() => {
  layout.applyTheme()
})
</script>

<template>
  <RouterView />
</template>
