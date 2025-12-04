<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import TdkManager from '@/components/common/TdkManager.vue'
import { useLayoutStore } from '@/stores/layout'
import { useUiSettingsStore } from '@/stores/ui-settings'

const layout = useLayoutStore()
const uiSettings = useUiSettingsStore()

onMounted(() => {
  layout.initTheme()
  uiSettings.init()
})
</script>

<template>
  <!-- TDK 管理器 -->
  <TdkManager />

  <!-- 路由视图 with KeepAlive -->
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <KeepAlive :max="10">
        <component :is="Component" :key="route.path" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>
