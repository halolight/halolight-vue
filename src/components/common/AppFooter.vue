<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()
</script>

<template>
  <footer v-if="layout.showFooter !== false" class="app-footer">
    <span>Halolight Vue · Admin Pro</span>
    <span class="muted">体验版 · Mock 数据 · Vue 3 + Vite</span>
  </footer>
</template>
