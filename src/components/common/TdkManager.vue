<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useTdk } from '@/composables/useTdk'
import { getRouteTdk } from '@/config/tdk'

const route = useRoute()

// 根据当前路由获取 TDK
const tdkEntry = computed(() => getRouteTdk(route.path))

// 应用 TDK
useTdk(tdkEntry)
</script>

<template>
  <!-- TDK Manager 是一个无渲染组件，用于管理页面元数据 -->
  <slot />
</template>
