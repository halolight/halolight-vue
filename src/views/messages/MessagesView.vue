<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  Archive,
  File,
  Forward,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  Plus,
  Reply,
  Send,
  Star,
  Trash2,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { fetchMessages } from '@/api/messages'
import SearchInput from '@/components/common/SearchInput.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { MessageItem } from '@/types/messages'

const queryClient = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: ['messages'],
  queryFn: fetchMessages,
})

const folders = [
  { id: 'inbox', name: '收件箱', icon: Inbox },
  { id: 'sent', name: '已发送', icon: Send },
  { id: 'draft', name: '草稿箱', icon: File },
  { id: 'archive', name: '归档', icon: Archive },
  { id: 'trash', name: '回收站', icon: Trash2 },
]

const selectedFolder = ref('inbox')
const selectedMessage = ref<MessageItem | null>(null)
const searchQuery = ref('')
const starred = ref<Set<string>>(new Set())
const deleteDialogOpen = ref(false)
const messageToDelete = ref<MessageItem | null>(null)

const messages = computed(() => data.value?.list ?? [])

const filteredMessages = computed(() => {
  let result = messages.value

  // Filter by folder
  if (selectedFolder.value === 'starred') {
    result = result.filter((m) => starred.value.has(m.id))
  } else if (selectedFolder.value === 'trash') {
    result = []
  } else if (selectedFolder.value !== 'inbox') {
    result = selectedFolder.value === 'inbox' ? result : []
  }

  // Filter by search on sender or title (fallback content)
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(
      (m) =>
        m.sender.name.toLowerCase().includes(keyword) ||
        (m.content ?? '').toLowerCase().includes(keyword)
    )
  }

  return result
})

const unreadCount = computed(() =>
  messages.value.filter((m) => !m.read).length
)

const folderCounts = computed(() => ({
  inbox: messages.value.length,
  sent: 0,
  draft: 0,
  archive: 0,
  trash: 0,
}))

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

function handleSelectMessage(msg: MessageItem) {
  selectedMessage.value = msg
  // Mark as read
  if (!msg.read) {
    queryClient.setQueryData(['messages'], (old: { list: MessageItem[] } | undefined) => ({
      list: (old?.list ?? []).map((m) =>
        m.id === msg.id ? { ...m, read: true } : m
      ),
    }))
  }
}

function toggleStar(id: string) {
  if (starred.value.has(id)) {
    starred.value.delete(id)
  } else {
    starred.value.add(id)
  }
}

function openDeleteDialog(msg: MessageItem) {
  messageToDelete.value = msg
  deleteDialogOpen.value = true
}

function handleDeleteMessage() {
  if (!messageToDelete.value) return
  queryClient.setQueryData(['messages'], (old: { list: MessageItem[] } | undefined) => ({
    list: (old?.list ?? []).filter((m) => m.id !== messageToDelete.value?.id),
  }))
  if (selectedMessage.value?.id === messageToDelete.value.id) {
    selectedMessage.value = null
  }
  deleteDialogOpen.value = false
  messageToDelete.value = null
}

function handleArchiveMessage() {
  if (!selectedMessage.value) return
  // In real app, would move to archive
  queryClient.setQueryData(['messages'], (old: { list: MessageItem[] } | undefined) => ({
    list: (old?.list ?? []).filter((m) => m.id !== selectedMessage.value?.id),
  }))
  selectedMessage.value = null
}

function messageTitle(msg: MessageItem): string {
  const text = msg.content || '（无标题）'
  return text.length > 30 ? text.slice(0, 30) + '...' : text
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">消息中心</h1>
        <p class="text-muted-foreground mt-1">
          查看和管理您的消息
          <Badge v-if="unreadCount > 0" variant="secondary" class="ml-2">
            {{ unreadCount }} 未读
          </Badge>
        </p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        写消息
      </Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <!-- 文件夹列表 -->
      <div class="lg:col-span-2">
        <Card>
          <CardContent class="p-2">
            <nav class="space-y-1">
              <button
                v-for="folder in folders"
                :key="folder.id"
                :class="cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                  selectedFolder === folder.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )"
                @click="selectedFolder = folder.id"
              >
                <div class="flex items-center gap-2">
                  <component :is="folder.icon" class="h-4 w-4" />
                  {{ folder.name }}
                </div>
                <Badge
                  v-if="folderCounts[folder.id as keyof typeof folderCounts] > 0"
                  :variant="selectedFolder === folder.id ? 'secondary' : 'default'"
                  class="h-5 min-w-5 px-1.5"
                >
                  {{ folderCounts[folder.id as keyof typeof folderCounts] }}
                </Badge>
              </button>
            </nav>
          </CardContent>
        </Card>
      </div>

      <!-- 消息列表 -->
      <div class="lg:col-span-4">
        <Card class="h-[calc(100vh-180px)]">
          <CardHeader class="pb-3">
            <SearchInput
              v-model="searchQuery"
              placeholder="搜索消息..."
            />
          </CardHeader>
          <CardContent class="p-0">
            <ScrollArea class="h-[calc(100vh-320px)]">
              <div v-if="isLoading" class="flex items-center justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
              <template v-else>
                <div
                  v-for="msg in filteredMessages"
                  :key="msg.id"
                  :class="cn(
                    'flex cursor-pointer gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50',
                    !msg.read && 'bg-muted/30',
                    selectedMessage?.id === msg.id && 'bg-muted'
                  )"
                  @click="handleSelectMessage(msg)"
                >
                  <div class="relative">
                    <Avatar class="h-10 w-10">
                      <AvatarImage v-if="msg.sender.avatar" :src="msg.sender.avatar" />
                      <AvatarFallback>{{ msg.sender.name?.[0] }}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <component :is="msg.read ? MailOpen : Mail" class="h-4 w-4 text-muted-foreground" />
                        <span :class="cn('font-medium', !msg.read && 'font-semibold')">
                          {{ msg.sender.name }}
                        </span>
                      </div>
                      <span class="text-xs text-muted-foreground">
                        {{ formatTime(msg.createdAt) }}
                      </span>
                    </div>
                    <p :class="cn('text-sm truncate', !msg.read && 'font-medium')">
                      {{ messageTitle(msg) }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <Star
                        v-if="starred.has(msg.id)"
                        class="h-3 w-3 fill-yellow-500 text-yellow-500"
                      />
                      <Badge v-if="!msg.read" variant="default" class="h-4 min-w-4 px-1 text-xs">
                        未读
                      </Badge>
                    </div>
                  </div>
                </div>
              </template>
              <div
                v-if="!isLoading && filteredMessages.length === 0"
                class="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <Mail class="h-12 w-12 mb-4" />
                <p>暂无消息</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <!-- 消息详情 -->
      <div class="lg:col-span-6">
        <Card class="h-[calc(100vh-180px)]">
          <template v-if="selectedMessage">
            <div class="flex flex-col h-full">
              <CardHeader class="pb-3 shrink-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Avatar class="h-10 w-10">
                      <AvatarImage v-if="selectedMessage.sender.avatar" :src="selectedMessage.sender.avatar" />
                      <AvatarFallback>{{ selectedMessage.sender.name?.[0] }}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle class="text-lg">{{ selectedMessage.sender.name }}</CardTitle>
                      <p class="text-xs text-muted-foreground">{{ formatTime(selectedMessage.createdAt) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <Button variant="ghost" size="icon" @click="toggleStar(selectedMessage.id)">
                      <Star
                        :class="cn(
                          'h-4 w-4',
                          starred.has(selectedMessage.id) && 'fill-yellow-500 text-yellow-500'
                        )"
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Reply class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Forward class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" @click="handleArchiveMessage">
                      <Archive class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" @click="openDeleteDialog(selectedMessage)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator class="shrink-0" />
              <div class="flex-1 min-h-0 overflow-hidden">
                <ScrollArea class="h-full">
                  <div class="p-4">
                    <p class="text-muted-foreground whitespace-pre-wrap">
                      {{ selectedMessage.content }}
                    </p>
                  </div>
                </ScrollArea>
              </div>
              <div class="shrink-0 p-4 pt-2 border-t">
                <div class="flex gap-2">
                  <Input placeholder="输入回复..." class="flex-1" />
                  <Button>
                    <Send class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MailOpen class="h-16 w-16 mb-4" />
              <p>选择一条消息查看详情</p>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这条消息吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="handleDeleteMessage">删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
