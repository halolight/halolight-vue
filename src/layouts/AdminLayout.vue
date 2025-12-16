<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppTabs from '@/components/common/AppTabs.vue'
import CommandMenu from '@/components/common/CommandMenu.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useProvideCommandMenu } from '@/composables/useCommandMenu'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/stores/layout'
import { useTabsStore } from '@/stores/tabs'
import { useUiSettingsStore } from '@/stores/ui-settings'

// 提供命令面板上下文给子组件
useProvideCommandMenu()

const layout = useLayoutStore()
const uiSettings = useUiSettingsStore()
const tabsStore = useTabsStore()

// 响应式侧边栏宽度：移动端为 0，桌面端根据折叠状态
const sidebarWidth = computed(() => (layout.sidebarCollapsed ? 64 : 180))

// 移动端是否显示标签栏
const showMobileTabBar = computed(() => uiSettings.showTabBar && tabsStore.tabs.length > 1)

// 移动端内容区域顶部偏移量（根据固定元素累加）
const mobileContentPadding = computed(() => {
  let padding = ''

  // 固定头部时需要 pt-16 (64px)
  if (uiSettings.mobileHeaderFixed) {
    // 同时有固定标签栏
    if (showMobileTabBar.value && uiSettings.mobileTabBarFixed) {
      padding = 'pt-28' // 64px + 48px = 112px = pt-28
    } else {
      padding = 'pt-16' // 64px
    }
  } else if (showMobileTabBar.value && uiSettings.mobileTabBarFixed) {
    // 只有标签栏固定
    padding = 'pt-12' // 48px
  }

  return padding ? `${padding} lg:pt-0` : ''
})

onMounted(() => {
  uiSettings.init()
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar - hidden on mobile, visible on desktop -->
    <AppSidebar class="hidden lg:flex shrink-0" />

    <!-- Main content area -->
    <div
      :class="cn(
        'flex-1 flex flex-col h-screen overflow-hidden transition-[margin-left] duration-200 ease-in-out',
        'lg:ml-[var(--sidebar-width)]'
      )"
      :style="{ '--sidebar-width': `${sidebarWidth}px` } as Record<string, string>"
    >
      <!-- Header -->
      <AppHeader />

      <!-- TabBar with transition -->
      <Transition name="expand">
        <AppTabs v-if="uiSettings.showTabBar" />
      </Transition>

      <!-- Page content with transition -->
      <main
        :class="cn(
          'flex-1 min-h-0 overflow-auto px-4 py-5 lg:px-6 lg:py-6 mt-6',
          mobileContentPadding
        )"
      >
        <RouterView v-slot="{ Component, route: currentRoute }">
          <Transition name="page" mode="out-in" appear>
            <div :key="currentRoute.path">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </main>

      <!-- Footer with transition -->
      <Transition name="expand">
        <AppFooter v-if="uiSettings.showFooter" />
      </Transition>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <Sheet :open="layout.mobileSidebarOpen" @update:open="layout.setMobileSidebarOpen">
      <SheetContent side="left" class="p-0 w-[180px] max-w-[180px] bg-sidebar border-r border-border">
        <AppSidebar :fixed="false" :force-expanded="true" :expanded-width="180" />
      </SheetContent>
    </Sheet>
  </div>
  <ToastContainer />
  <!-- 全局命令面板 -->
  <CommandMenu />
</template>

<style scoped>
/* 移动端隐藏侧边栏 margin */
@media (max-width: 1023px) {
  div[style*="--sidebar-width"] {
    margin-left: 0 !important;
  }
}

/* 页面切换过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 展开/收起过渡 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
