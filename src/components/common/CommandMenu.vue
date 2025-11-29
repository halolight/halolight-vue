<script setup lang="ts">
import { ChevronRight, Laptop2, LogOut, Moon, Sun } from 'lucide-vue-next'
import type { Component } from 'vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useCommandMenu } from '@/composables/useCommandMenu'
import { type NavItem, primaryNav, secondaryNav } from '@/config/menu'
import { useAuthStore } from '@/stores/auth'
import { useUiSettingsStore } from '@/stores/ui-settings'

/** 命令条目类型定义 */
interface CommandEntry {
  id: string
  title: string
  section: string
  icon?: Component
  keywords?: string[]
  onSelect: () => void | Promise<void>
}

const router = useRouter()
const authStore = useAuthStore()
const uiSettings = useUiSettingsStore()
const { open } = useCommandMenu()

const searchTerm = ref('')
const inputRef = ref<{ $el?: HTMLInputElement } | null>(null)

/**
 * 递归扁平化导航菜单
 */
function flattenNavItems(items: NavItem[], section: string): CommandEntry[] {
  const result: CommandEntry[] = []

  for (const item of items) {
    if (item.to) {
      const to = item.to
      result.push({
        id: `nav-${to}`,
        title: item.title,
        section,
        icon: item.icon,
        keywords: [item.title, to],
        onSelect: async () => {
          try {
            await router.push(to)
          } catch (error) {
            console.error('Navigation failed:', error)
          }
        },
      })
    }

    if (item.children?.length) {
      result.push(...flattenNavItems(item.children, section))
    }
  }

  return result
}

/**
 * 所有命令列表
 */
const allCommands = computed<CommandEntry[]>(() => {
  // 导航命令
  const navCommands = [
    ...flattenNavItems(primaryNav, '导航'),
    ...flattenNavItems(secondaryNav, '导航'),
  ]

  // 主题命令
  const themeCommands: CommandEntry[] = [
    {
      id: 'theme-light',
      title: '切换到浅色模式',
      section: '主题',
      icon: Sun,
      keywords: ['浅色', '亮色', 'light', 'theme'],
      onSelect: () => uiSettings.setTheme('light'),
    },
    {
      id: 'theme-dark',
      title: '切换到深色模式',
      section: '主题',
      icon: Moon,
      keywords: ['深色', '暗色', 'dark', 'theme'],
      onSelect: () => uiSettings.setTheme('dark'),
    },
    {
      id: 'theme-system',
      title: '跟随系统主题',
      section: '主题',
      icon: Laptop2,
      keywords: ['系统', 'system', 'auto', 'theme'],
      onSelect: () => uiSettings.setTheme('system'),
    },
  ]

  // 账号命令
  const accountCommands: CommandEntry[] = [
    {
      id: 'logout',
      title: '退出登录',
      section: '账号',
      icon: LogOut,
      keywords: ['退出', '登出', 'logout', 'signout'],
      onSelect: async () => {
        try {
          authStore.logout()
          await router.push('/login')
        } catch (error) {
          console.error('Logout failed:', error)
        }
      },
    },
  ]

  return [...navCommands, ...themeCommands, ...accountCommands]
})

/**
 * 根据搜索词过滤命令
 */
const filteredCommands = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return allCommands.value

  return allCommands.value.filter((cmd) => {
    const titleMatch = cmd.title.toLowerCase().includes(term)
    const keywordMatch = cmd.keywords?.some((kw) => kw.toLowerCase().includes(term))
    return titleMatch || keywordMatch
  })
})

/**
 * 按分组组织命令
 */
const groupedCommands = computed(() => {
  const groups: Record<string, CommandEntry[]> = {}

  for (const cmd of filteredCommands.value) {
    const section = cmd.section
    if (!groups[section]) {
      groups[section] = []
    }
    groups[section]!.push(cmd)
  }

  return groups
})

/**
 * 处理命令选择
 */
async function handleSelect(cmd: CommandEntry) {
  try {
    await cmd.onSelect()
  } catch (error) {
    console.error('Command execution failed:', error)
  } finally {
    open.value = false
  }
}

/**
 * 全局快捷键监听
 */
function handleKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = !open.value
  }
}

/**
 * 打开面板时重置搜索词并聚焦输入框
 */
watch(open, async (isOpen) => {
  if (isOpen) {
    searchTerm.value = ''
    await nextTick()
    // 聚焦输入框
    const inputElement = inputRef.value?.$el?.querySelector?.('input') || inputRef.value?.$el
    if (inputElement instanceof HTMLInputElement) {
      inputElement.focus()
    }
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput
      ref="inputRef"
      v-model="searchTerm"
      placeholder="搜索命令或导航..."
    />
    <CommandList>
      <CommandEmpty>没有找到匹配的命令</CommandEmpty>

      <template v-for="(commands, section, index) in groupedCommands" :key="section">
        <CommandSeparator v-if="index > 0" />
        <CommandGroup :heading="section">
          <CommandItem
            v-for="cmd in commands"
            :key="cmd.id"
            :value="cmd.id"
            @select="handleSelect(cmd)"
          >
            <component
              :is="cmd.icon || ChevronRight"
              class="h-4 w-4 text-muted-foreground"
            />
            <span>{{ cmd.title }}</span>
            <CommandShortcut v-if="cmd.section === '导航'">↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </CommandDialog>
</template>
