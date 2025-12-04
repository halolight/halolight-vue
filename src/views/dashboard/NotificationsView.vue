<script setup lang="ts">
import {
  AlertCircle,
  Bell,
  Check,
  ClipboardList,
  Info,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Trash2,
  User,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Notification {
  id: string
  title: string
  content: string
  type: 'system' | 'message' | 'task' | 'alert'
  read: boolean
  createdAt: string
}

const typeIcons = {
  system: Info,
  message: MessageSquare,
  task: ClipboardList,
  alert: AlertCircle,
}

const typeColors: Record<string, string> = {
  system: 'text-blue-500 bg-blue-500/10',
  message: 'text-purple-500 bg-purple-500/10',
  task: 'text-green-500 bg-green-500/10',
  alert: 'text-orange-500 bg-orange-500/10',
}

// 模拟通知数据
const notifications = ref<Notification[]>([
  {
    id: '1',
    title: '系统更新',
    content: '系统将于今晚 22:00 进行维护更新，预计持续 2 小时。',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '2',
    title: '新消息',
    content: '张三向您发送了一条消息。',
    type: 'message',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '3',
    title: '任务提醒',
    content: '您有一个任务即将到期，请及时处理。',
    type: 'task',
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '4',
    title: '安全警告',
    content: '检测到您的账户在新设备上登录。',
    type: 'alert',
    read: false,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '5',
    title: '周报提醒',
    content: '请在本周五前提交您的工作周报。',
    type: 'task',
    read: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
])

const isLoading = ref(false)
const filter = ref<'all' | 'unread'>('all')

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const filteredNotifications = computed(() => {
  return filter.value === 'all'
    ? notifications.value
    : notifications.value.filter((n) => !n.read)
})

const systemCount = computed(() =>
  notifications.value.filter((n) => n.type === 'system' || n.type === 'alert').length
)

const messageCount = computed(() =>
  notifications.value.filter((n) => n.type === 'message').length
)

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return date.toLocaleDateString('zh-CN')
}

function handleMarkAsRead(id: string) {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.read = true
  }
}

function handleMarkAllAsRead() {
  notifications.value.forEach((n) => {
    n.read = true
  })
}

function handleDelete(id: string) {
  notifications.value = notifications.value.filter((n) => n.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">通知中心</h1>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          :disabled="unreadCount === 0"
          @click="handleMarkAllAsRead"
        >
          <Check class="mr-2 h-4 w-4" />
          全部已读
        </Button>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">全部通知</CardTitle>
          <Bell class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ notifications.length }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">未读通知</CardTitle>
          <Badge variant="destructive">{{ unreadCount }}</Badge>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ unreadCount }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">系统通知</CardTitle>
          <Settings class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ systemCount }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">消息通知</CardTitle>
          <User class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ messageCount }}</div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>通知列表</CardTitle>
            <CardDescription>所有系统和用户通知</CardDescription>
          </div>
          <Tabs v-model="filter">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="unread">
                未读
                <Badge v-if="unreadCount > 0" variant="secondary" class="ml-2">
                  {{ unreadCount }}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <Bell class="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p class="text-muted-foreground">暂无通知</p>
        </div>
        <ScrollArea v-else class="h-[60vh] pr-4">
          <div class="space-y-2">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              class="flex items-start gap-4 rounded-lg border p-4 transition-colors"
              :class="{ 'bg-muted/50': !notification.read }"
            >
              <div
                class="rounded-full p-2"
                :class="typeColors[notification.type] || typeColors.system"
              >
                <component
                  :is="typeIcons[notification.type] || Info"
                  class="h-4 w-4"
                />
              </div>
              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <p class="font-medium">{{ notification.title }}</p>
                  <Badge v-if="!notification.read" variant="default" class="h-5">
                    新
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground">
                  {{ notification.content }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ formatTime(notification.createdAt) }}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    v-if="!notification.read"
                    @click="handleMarkAsRead(notification.id)"
                  >
                    <Check class="mr-2 h-4 w-4" />
                    标记已读
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="text-destructive"
                    @click="handleDelete(notification.id)"
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
</template>
