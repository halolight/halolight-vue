<script setup lang="ts">
import {
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import QuickSettings from '@/components/layout/QuickSettings.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCommandMenuOptional } from '@/composables/useCommandMenu'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { useNavigationStore } from '@/stores/navigation'
import { useUiSettingsStore } from '@/stores/ui-settings'

interface Props {
  onMenuClick?: () => void
  onSearchClick?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  menuClick: []
  searchClick: []
}>()

const router = useRouter()
const auth = useAuthStore()
const layout = useLayoutStore()
const navigation = useNavigationStore()
const uiSettings = useUiSettingsStore()
const commandMenu = useCommandMenuOptional()

const mobileHeaderFixed = computed(() => uiSettings.mobileHeaderFixed)

function handleMenuClick() {
  if (props.onMenuClick) {
    props.onMenuClick()
  } else {
    emit('menuClick')
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
    if (isMobile) {
      layout.openMobileSidebar()
    } else {
      layout.toggleSidebar()
    }
  }
}

function handleSearchClick() {
  if (props.onSearchClick) {
    props.onSearchClick()
  } else if (commandMenu) {
    // 打开命令面板
    commandMenu.openMenu()
  } else {
    emit('searchClick')
  }
}

function handleNavigate(href: string, label: string) {
  navigation.startNavigation({ path: href, label, source: 'header' })
  router.push(href)
}

async function handleLogout() {
  auth.logout()
  router.push('/login')
}

async function handleSwitchAccount(accountId: string) {
  try {
    await auth.switchAccount(accountId)
    // 刷新当前页面或跳转到首页
    router.push('/')
  } catch (error) {
    console.error('切换账号失败:', error)
  }
}

// 获取可切换的账号列表（排除当前账号）
const accountList = computed(() => {
  return auth.accounts.filter((acc) => acc.id !== auth.activeAccountId)
})
</script>

<template>
  <header
    :class="cn(
      'z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      'lg:sticky lg:top-0',
      mobileHeaderFixed ? 'fixed inset-x-0 top-0' : 'relative'
    )"
  >
    <div class="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        class="lg:hidden"
        @click="handleMenuClick"
      >
        <Menu class="h-5 w-5" />
      </Button>

      <!-- 搜索栏 -->
      <Button
        variant="outline"
        class="hidden w-64 justify-start text-muted-foreground sm:flex"
        @click="handleSearchClick"
      >
        <Search class="mr-2 h-4 w-4" />
        <span>搜索...</span>
        <kbd class="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span class="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>

    <div class="flex items-center gap-2">
      <!-- 搜索按钮（移动端） -->
      <Button
        variant="ghost"
        size="icon"
        class="sm:hidden"
        @click="handleSearchClick"
      >
        <Search class="h-5 w-5" />
      </Button>

      <!-- 通知 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="relative">
            <Bell class="h-5 w-5" />
            <Badge class="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-80">
          <DropdownMenuLabel class="flex items-center justify-between">
            <span>通知</span>
            <RouterLink
              to="/notifications"
              class="text-xs font-normal text-primary hover:underline"
              @click.prevent="handleNavigate('/notifications', '通知中心')"
            >
              查看全部
            </RouterLink>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="flex flex-col items-start gap-1 cursor-pointer"
            @click="handleNavigate('/notifications', '通知中心')"
          >
            <p class="font-medium">新用户注册</p>
            <p class="text-xs text-muted-foreground">
              用户 张三 刚刚完成注册
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="flex flex-col items-start gap-1 cursor-pointer"
            @click="handleNavigate('/notifications', '通知中心')"
          >
            <p class="font-medium">系统更新</p>
            <p class="text-xs text-muted-foreground">
              系统将于今晚 23:00 进行维护
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="flex flex-col items-start gap-1 cursor-pointer"
            @click="handleNavigate('/notifications', '通知中心')"
          >
            <p class="font-medium">任务完成</p>
            <p class="text-xs text-muted-foreground">
              数据备份任务已完成
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="w-full text-center text-sm text-muted-foreground hover:text-foreground cursor-pointer justify-center"
            @click="handleNavigate('/notifications', '通知中心')"
          >
            查看所有通知
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- 界面设置 -->
      <QuickSettings />

      <!-- 用户菜单 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-9 w-9 rounded-full">
            <Avatar class="h-9 w-9">
              <AvatarImage src="/avatar.png" alt="用户头像" />
              <AvatarFallback>
                {{ auth.initials || 'AD' }}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium">{{ auth.user?.name || '管理员' }}</p>
              <p class="text-xs text-muted-foreground">
                {{ auth.user?.email || 'admin@halolight.h7ml.cn' }}
              </p>
            </div>
          </DropdownMenuLabel>

          <!-- 账号切换 -->
          <template v-if="accountList.length > 0">
            <DropdownMenuSeparator />
            <DropdownMenuLabel class="text-xs text-muted-foreground">
              快速切换账号
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="account in accountList"
                :key="account.id"
                class="cursor-pointer gap-2"
                @click="handleSwitchAccount(account.id)"
              >
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="account.avatar || ''" :alt="account.name" />
                  <AvatarFallback>
                    {{ account.name?.charAt(0) || 'A' }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col">
                  <span class="text-sm font-medium leading-tight">
                    {{ account.name }}
                  </span>
                  <span class="text-[11px] text-muted-foreground leading-tight">
                    {{ account.role }} · {{ account.email }}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </template>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleNavigate('/profile', '个人资料')"
            >
              <User class="mr-2 h-4 w-4" />
              个人资料
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleNavigate('/settings', '账户设置')"
            >
              <Settings class="mr-2 h-4 w-4" />
              账户设置
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleNavigate('/docs', '帮助文档')"
            >
              <HelpCircle class="mr-2 h-4 w-4" />
              帮助文档
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="text-destructive cursor-pointer"
            @click="handleLogout"
          >
            <LogOut class="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
