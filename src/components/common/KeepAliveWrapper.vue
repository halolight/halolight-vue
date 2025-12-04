<script setup lang="ts">
import { useScrollRestore } from '@/composables/useKeepAlive'

// 自动保存和恢复滚动位置
useScrollRestore()
</script>

<template>
  <slot />
</template>
