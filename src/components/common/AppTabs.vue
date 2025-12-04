<script setup lang="ts">
import {
  Bell,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  HelpCircle,
  Home,
  LayoutDashboard,
  LineChart,
  Lock,
  MessageSquare,
  RefreshCw,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useNavigationStore } from '@/stores/navigation'
import { type Tab,useTabsStore } from '@/stores/tabs'
import { useUiSettingsStore } from '@/stores/ui-settings'

// 路径到标题的映射（更具体的路径优先匹配）
const pathTitles: Record<string, string> = {
  '/': '首页',
  '/users/demo/profile': '资料页',
  '/users/demo/security': '安全页',
  '/users': '用户管理',
  '/accounts': '账号与权限',
  '/analytics': '数据分析',
  '/settings': '系统设置',
  '/documents': '文档管理',
  '/files': '文件管理',
  '/messages': '消息中心',
  '/calendar': '日程管理',
  '/notifications': '通知中心',
  '/profile': '个人资料',
  '/docs': '帮助文档',
  '/security': '安全审计',
}

// 路径到图标的映射（更具体的路径优先）
const pathIcons: Record<string, typeof Home> = {
  '/': LayoutDashboard,
  '/users/demo/profile': User,
  '/users/demo/security': Lock,
  '/users': Users,
  '/accounts': ShieldCheck,
  '/analytics': LineChart,
  '/settings': Settings,
  '/documents': FileText,
  '/files': FolderOpen,
  '/messages': MessageSquare,
  '/calendar': CalendarCheck,
  '/notifications': Bell,
  '/profile': User,
  '/docs': HelpCircle,
  '/security': ShieldCheck,
}

function resolveTitle(path: string): string {
  // 先精确匹配
  if (pathTitles[path]) {
    return pathTitles[path]
  }
  // 再尝试前缀匹配（从长到短）
  const sortedKeys = Object.keys(pathTitles).sort((a, b) => b.length - a.length)
  const match = sortedKeys.find((key) => path.startsWith(`${key}/`))
  return (match && pathTitles[match]) || path.split('/').pop() || '新页面'
}

function resolveIcon(path: string) {
  // 先精确匹配
  if (pathIcons[path]) {
    return pathIcons[path]
  }
  // 再尝试前缀匹配（从长到短）
  const sortedKeys = Object.keys(pathIcons).sort((a, b) => b.length - a.length)
  const match = sortedKeys.find((key) => path.startsWith(`${key}/`))
  return match ? pathIcons[match] : Home
}

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const navigation = useNavigationStore()
const uiSettings = useUiSettingsStore()

const tabsContainerRef = ref<HTMLDivElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const refreshingTabId = ref<string | null>(null)
const contextMenuTab = ref<Tab | null>(null)

const showTabBar = computed(() => uiSettings.showTabBar)
const mobileTabBarFixed = computed(() => uiSettings.mobileTabBarFixed)
const mobileHeaderFixed = computed(() => uiSettings.mobileHeaderFixed)
const pathname = computed(() => route.path)

// 检查滚动状态
function checkScroll() {
  const container = tabsContainerRef.value
  if (!container) return

  canScrollLeft.value = container.scrollLeft > 0
  canScrollRight.value =
    container.scrollLeft < container.scrollWidth - container.clientWidth
}

// 滚动到活动标签
function scrollToActiveTab() {
  const container = tabsContainerRef.value
  if (!container) return

  const activeTab = container.querySelector(
    `[data-tab-id="${tabsStore.activeTabId}"]`
  )
  if (activeTab) {
    activeTab.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }
}

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  (newPath) => {
    if (newPath) {
      const existingTab = tabsStore.getTabByPath(newPath)
      const title = resolveTitle(newPath)
      if (existingTab) {
        tabsStore.setActiveTab(existingTab.id)
        if (existingTab.title !== title) {
          tabsStore.updateTab(existingTab.id, { title })
        }
      } else {
        tabsStore.addTab({ title, path: newPath })
      }
    }
  },
  { immediate: true }
)

// 监听标签变化，检查滚动
watch(
  [() => tabsStore.tabs, () => tabsStore.activeTabId],
  () => {
    checkScroll()
    scrollToActiveTab()
  }
)

function scroll(direction: 'left' | 'right') {
  const container = tabsContainerRef.value
  if (!container) return

  const scrollAmount = 200
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  })
}

function handleTabClick(tab: Tab) {
  tabsStore.setActiveTab(tab.id)
  if (pathname.value !== tab.path) {
    navigation.startNavigation({
      path: tab.path,
      label: tab.title,
      source: 'tabbar',
    })
  }
  router.push(tab.path)
}

function handleCloseTab(e: Event, tab: Tab) {
  e.stopPropagation()
  if (tab.closable === false) return

  const currentIndex = tabsStore.tabs.findIndex((t) => t.id === tab.id)
  tabsStore.removeTab(tab.id)

  // 如果关闭的是当前标签，跳转到相邻标签
  if (tab.id === tabsStore.activeTabId) {
    const nextTab =
      tabsStore.tabs[currentIndex] || tabsStore.tabs[currentIndex - 1]
    if (nextTab) {
      router.push(nextTab.path)
    }
  }
}

function handleCloseOthers(tab: Tab) {
  const otherTabs = tabsStore.tabs.filter(
    (t) => t.id !== tab.id && t.closable !== false
  )
  otherTabs.forEach((t) => tabsStore.removeTab(t.id))
  tabsStore.setActiveTab(tab.id)
  if (pathname.value !== tab.path) {
    navigation.startNavigation({
      path: tab.path,
      label: tab.title,
      source: 'tabbar',
    })
  }
  router.push(tab.path)
}

function handleCloseRight(tab: Tab) {
  const tabIndex = tabsStore.tabs.findIndex((t) => t.id === tab.id)
  const rightTabs = tabsStore.tabs
    .slice(tabIndex + 1)
    .filter((t) => t.closable !== false)
  rightTabs.forEach((t) => tabsStore.removeTab(t.id))
}

function handleCloseAll() {
  tabsStore.clearTabs()
  navigation.startNavigation({ path: '/', label: '首页', source: 'tabbar' })
  router.push('/')
}

function handleRefreshTab(tab: Tab) {
  navigation.startNavigation({
    path: tab.path,
    label: `正在刷新 ${tab.title}`,
    source: 'tabbar-refresh',
  })
  refreshingTabId.value = tab.id

  setTimeout(() => {
    refreshingTabId.value = null
    navigation.finishNavigation()
    // Force reload the current route
    if (pathname.value === tab.path) {
      router.go(0)
    } else {
      tabsStore.setActiveTab(tab.id)
      router.push(tab.path)
    }
  }, 500)
}

function openContextMenu(tab: Tab) {
  contextMenuTab.value = tab
}

// 监听容器大小变化
onMounted(() => {
  const container = tabsContainerRef.value
  if (!container) return

  const observer = new ResizeObserver(checkScroll)
  observer.observe(container)

  container.addEventListener('scroll', checkScroll)

  onUnmounted(() => {
    observer.disconnect()
    container.removeEventListener('scroll', checkScroll)
  })
})
</script>

<template>
  <div
    v-if="showTabBar && tabsStore.tabs.length > 1"
    :class="cn(
      'flex h-12 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      mobileTabBarFixed
        ? ['fixed', 'left-0', 'right-0', mobileHeaderFixed ? 'top-16' : 'top-0']
        : 'relative',
      'lg:static',
      'z-40'
    )"
  >
    <!-- 左滚动按钮 -->
    <Button
      v-if="canScrollLeft"
      variant="ghost"
      size="icon"
      class="h-8 w-8 shrink-0"
      @click="scroll('left')"
    >
      <ChevronLeft class="h-4 w-4" />
    </Button>

    <!-- 标签容器 -->
    <div
      ref="tabsContainerRef"
      class="flex-1 flex items-center overflow-x-auto scrollbar-hide"
    >
      <TransitionGroup name="tab" tag="div" class="flex">
        <div
          v-for="tab in tabsStore.tabs"
          :key="tab.id"
          :data-tab-id="tab.id"
          :class="cn(
            'group flex items-center gap-1 px-3 py-2 border-r border-border cursor-pointer transition-colors relative min-w-[100px] max-w-[200px]',
            tabsStore.activeTabId === tab.id
              ? 'bg-background text-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          )"
          @click="handleTabClick(tab)"
          @contextmenu.prevent="openContextMenu(tab)"
        >
          <!-- 活动指示器 -->
          <div
            v-if="tabsStore.activeTabId === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          />

          <!-- 图标 -->
          <component
            :is="resolveIcon(tab.path)"
            class="h-3.5 w-3.5 shrink-0"
          />

          <!-- 标题 -->
          <span class="truncate text-sm flex items-center gap-1">
            <span>{{ tab.title }}</span>
            <RefreshCw
              v-if="refreshingTabId === tab.id"
              class="h-3 w-3 animate-spin text-primary"
            />
          </span>

          <!-- 关闭按钮 -->
          <DropdownMenu v-if="tab.closable !== false">
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                :class="cn(
                  'h-4 w-4 p-0 transition-opacity ml-1 shrink-0 hover:bg-muted-foreground/20 rounded-sm',
                  tabsStore.activeTabId === tab.id
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                )"
                @click.stop
              >
                <X class="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem @click="handleCloseTab($event, tab)">
                关闭标签
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleRefreshTab(tab)">
                刷新页面
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleCloseOthers(tab)">
                关闭其他
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleCloseRight(tab)">
                关闭右侧
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleCloseAll">
                关闭所有
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TransitionGroup>
    </div>

    <!-- 右滚动按钮 -->
    <Button
      v-if="canScrollRight"
      variant="ghost"
      size="icon"
      class="h-8 w-8 shrink-0"
      @click="scroll('right')"
    >
      <ChevronRight class="h-4 w-4" />
    </Button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.tab-enter-active,
.tab-leave-active {
  transition: all 0.15s ease;
}

.tab-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.tab-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.tab-move {
  transition: transform 0.15s ease;
}
</style>
