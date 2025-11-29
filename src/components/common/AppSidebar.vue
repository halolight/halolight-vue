<script setup lang="tsx">
import { ChevronDown, ChevronLeft } from 'lucide-vue-next'
import type { PropType } from 'vue'
import { computed, defineComponent, ref, Transition } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TooltipProvider } from '@/components/ui/tooltip'
import { primaryNav, secondaryNav } from '@/config/menu'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/stores/layout'
import { useNavigationStore } from '@/stores/navigation'

interface NavItem {
  title: string
  to?: string
  icon?: any
  badge?: string
  children?: NavItem[]
}

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
const openGroups = ref<Set<string>>(new Set())

// 如果 forceExpanded 为 true，始终显示展开状态
const collapsed = computed(() => props.forceExpanded ? false : layout.sidebarCollapsed)
const activePath = computed(() => route.path)

const sidebarWidth = computed(() =>
  props.forceExpanded ? `${props.expandedWidth}px` : collapsed.value ? `${props.collapsedWidth}px` : `${props.expandedWidth}px`
)

const allNavItems = computed(() => [...primaryNav, ...secondaryNav])

function isActive(item: NavItem, path: string): boolean {
  if (item.to) return path === item.to || path.startsWith(`${item.to}/`)
  return item.children?.some((child) => isActive(child, path)) ?? false
}

function toggleGroup(key: string, open?: boolean) {
  const next = new Set(openGroups.value)
  if (open === true) {
    next.add(key)
  } else if (open === false) {
    next.delete(key)
  } else if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  openGroups.value = next
}

function handleNavigate(href: string | undefined, label: string) {
  if (!href || activePath.value === href) return
  navigation.startNavigation({ path: href, label, source: 'sidebar' })
  router.push(href)
  layout.closeMobileSidebar()
}

function toggleSidebar() {
  layout.toggleSidebar()
}

const MenuItem = defineComponent({
  name: 'MenuItem',
  props: {
    item: { type: Object as PropType<NavItem>, required: true },
    level: { type: Number, default: 0 },
    collapsed: { type: Boolean, required: true },
    activePath: { type: String, required: true },
    openGroups: { type: Object as PropType<Set<string>>, required: true },
  },
  emits: ['navigate', 'toggle'],
  setup(props, { emit }) {
    const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0)
    const key = computed(() => props.item.to ?? props.item.title)
    const active = computed(() => isActive(props.item, props.activePath))
    const hasActiveChild = computed(
      () => props.item.children?.some((child) => isActive(child, props.activePath)) ?? false
    )
    const isOpen = computed(() => props.openGroups.has(key.value) || (!props.collapsed && hasActiveChild.value))

    const paddingStyle = computed(() => ({
      paddingLeft: `${12 + props.level * 12}px`,
    }))

    const childContainerClass = computed(() =>
      props.collapsed
        ? 'absolute left-full top-0 z-50 w-48 rounded-lg border border-border bg-sidebar p-2 shadow-lg space-y-1'
        : 'mt-1 space-y-1 border-l border-border/60 pl-2'
    )

    function onToggle() {
      emit('toggle', key.value)
    }

    function onNavigate() {
      emit('navigate', props.item.to, props.item.title)
    }

    function handleHover(open: boolean) {
      if (!props.collapsed || !hasChildren.value) return
      emit('toggle', key.value, open)
    }

    return () => (
      <div
        class="space-y-1 relative"
        onMouseenter={() => handleHover(true)}
        onMouseleave={() => handleHover(false)}
      >
        {hasChildren.value ? (
          <div class="flex flex-col">
            <button
              class={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                active.value
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70'
              )}
              style={paddingStyle.value}
              onClick={onToggle}
            >
              {props.item.icon && <props.item.icon class="h-5 w-5 shrink-0" />}
              {!props.collapsed && (
                <>
                  <span class="truncate">{props.item.title}</span>
                  {props.item.badge && (
                    <span class="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {props.item.badge}
                    </span>
                  )}
                  <ChevronDown
                    class={cn(
                      'ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                      isOpen.value && 'rotate-180'
                    )}
                  />
                </>
              )}
            </button>
            <Transition name="fade-width">
              <div
                v-show={isOpen.value}
                class={childContainerClass.value}
              >
                {props.item.children?.map((child) => (
                  <MenuItem
                    key={(child.to ?? child.title) as string}
                    item={child}
                    level={props.level + 1}
                    collapsed={props.collapsed}
                    activePath={props.activePath}
                    openGroups={props.openGroups}
                    onNavigate={(href: string, label: string) => emit('navigate', href, label)}
                    onToggle={(val: string) => emit('toggle', val)}
                  />
                ))}
              </div>
            </Transition>
          </div>
        ) : (
          <RouterLink
            to={props.item.to ?? '#'}
            class={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              active.value ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'
            )}
            style={paddingStyle.value}
            onClick={(e: Event) => {
              e.preventDefault()
              onNavigate()
            }}
          >
            {props.item.icon && <props.item.icon class="h-5 w-5 shrink-0" />}
            <Transition name="fade-width">
              {!props.collapsed && <span class="truncate">{props.item.title}</span>}
            </Transition>
            {props.item.badge && !props.collapsed && (
              <span class="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {props.item.badge}
              </span>
            )}
            {active.value && (
              <div class="absolute left-0 h-8 w-1 rounded-r-full bg-primary" />
            )}
          </RouterLink>
        )}
      </div>
    )
  },
})
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
          <MenuItem
            v-for="item in allNavItems"
            :key="item.to || item.title"
            :item="item"
            :collapsed="collapsed"
            :active-path="activePath"
            :open-groups="openGroups"
            @navigate="handleNavigate"
            @toggle="toggleGroup"
          />
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

.fade-width-enter-active,
.fade-width-leave-active {
  transform-origin: top;
}
</style>
