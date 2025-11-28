<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { primaryNav, secondaryNav } from '@/config/menu'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/stores/layout'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  expandedWidth?: number
  collapsedWidth?: number
  fixed?: boolean
  /** 强制展开模式（用于移动端 Sheet） */
  forceExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expandedWidth: 180,
  collapsedWidth: 64,
  fixed: true,
  forceExpanded: false,
})

const route = useRoute()
const router = useRouter()
const layout = useLayoutStore()
const navigation = useNavigationStore()

// 如果 forceExpanded 为 true，始终显示展开状态
const collapsed = computed(() => props.forceExpanded ? false : layout.sidebarCollapsed)
const activePath = computed(() => route.path)

const sidebarWidth = computed(() =>
  props.forceExpanded ? `${props.expandedWidth}px` : collapsed.value ? `${props.collapsedWidth}px` : `${props.expandedWidth}px`
)

const allNavItems = computed(() => [...primaryNav, ...secondaryNav])

function handleNavigate(href: string, label: string) {
  if (activePath.value === href) return
  navigation.startNavigation({ path: href, label, source: 'sidebar' })
  router.push(href)
  layout.closeMobileSidebar()
}

function toggleSidebar() {
  layout.toggleSidebar()
}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <aside
      :class="cn(
        fixed ? 'fixed left-0 top-0 h-screen max-lg:hidden' : 'relative h-full',
        'z-40 border-r border-border bg-sidebar',
        'flex flex-col transition-[width] duration-200 ease-in-out'
      )"
      :style="{ width: sidebarWidth }"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center justify-between border-b border-border px-4">
        <Transition name="fade" mode="out-in">
          <div v-if="!collapsed" class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span class="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <span class="font-semibold text-sidebar-foreground">Admin Pro</span>
          </div>
          <div v-else class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
            <span class="text-sm font-bold text-primary-foreground">A</span>
          </div>
        </Transition>
      </div>

      <!-- 导航菜单 -->
      <ScrollArea class="flex-1 py-4">
        <nav class="space-y-1 px-2">
          <template v-for="item in allNavItems" :key="item.to">
            <Tooltip v-if="collapsed">
              <TooltipTrigger as-child>
                <div class="relative">
                  <RouterLink
                    :to="item.to"
                    :class="cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      activePath === item.to
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70'
                    )"
                    @click.prevent="handleNavigate(item.to, item.title)"
                  >
                    <component :is="item.icon" class="h-5 w-5 shrink-0" />
                    <!-- Active indicator -->
                    <div
                      v-if="activePath === item.to"
                      class="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                    />
                  </RouterLink>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" :side-offset="10">
                {{ item.title }}
              </TooltipContent>
            </Tooltip>

            <div v-else class="relative">
              <RouterLink
                :to="item.to"
                :class="cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  activePath === item.to
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70'
                )"
                @click.prevent="handleNavigate(item.to, item.title)"
              >
                <component :is="item.icon" class="h-5 w-5 shrink-0" />
                <Transition name="fade-width">
                  <span v-show="!collapsed" class="truncate">{{ item.title }}</span>
                </Transition>
                <!-- Active indicator -->
                <div
                  v-if="activePath === item.to"
                  class="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                />
              </RouterLink>
            </div>
          </template>
        </nav>
      </ScrollArea>

      <!-- 折叠按钮 - 在移动端 Sheet 中隐藏 -->
      <div v-if="!props.forceExpanded" class="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          class="w-full justify-center"
          @click="toggleSidebar"
        >
          <ChevronLeft
            :class="cn(
              'h-4 w-4 transition-transform duration-200',
              collapsed && 'rotate-180'
            )"
          />
          <Transition name="fade-width">
            <span v-if="!collapsed" class="ml-2">收起菜单</span>
          </Transition>
        </Button>
      </div>
    </aside>
  </TooltipProvider>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-width-enter-active,
.fade-width-leave-active {
  transition: opacity 0.15s ease, width 0.15s ease;
  overflow: hidden;
}

.fade-width-enter-from,
.fade-width-leave-to {
  opacity: 0;
  width: 0;
}
</style>
