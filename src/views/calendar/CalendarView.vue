<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  Eye,
  Grid3X3,
  List,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
  Video,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { fetchCalendarEvents } from '@/api/calendar'
import SearchInput from '@/components/common/SearchInput.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types/calendar'

const queryClient = useQueryClient()

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['calendar'],
  queryFn: fetchCalendarEvents,
})

const search = ref('')
const selectedType = ref<string>('all')
const viewMode = ref<'table' | 'card'>('table')
const page = ref(1)
const pageSize = ref(10)

// Dialog states
const viewDialogOpen = ref(false)
const rescheduleDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const addDialogOpen = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

// Reschedule form
const rescheduleForm = ref({
  date: '',
  time: '',
})

// Add event form
const addForm = ref({
  title: '',
  date: '',
  type: '' as CalendarEvent['type'] | '',
})

const events = computed(() => data.value?.list ?? [])

const filteredEvents = computed(() => {
  let result = events.value

  // Filter by type
  if (selectedType.value !== 'all') {
    result = result.filter((e: CalendarEvent) => e.type === selectedType.value)
  }

  // Filter by search
  if (search.value) {
    result = result.filter((e: CalendarEvent) =>
      e.title.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  return result
})

const paginatedEvents = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredEvents.value.slice(start, start + pageSize.value)
})

const stats = computed(() => ({
  total: events.value.length,
  meeting: events.value.filter((e: CalendarEvent) => e.type === '会议').length,
  release: events.value.filter((e: CalendarEvent) => e.type === '发布').length,
  reminder: events.value.filter((e: CalendarEvent) => e.type === '提醒').length,
}))

const eventTypeMap: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline'; icon: typeof Video }
> = {
  会议: { label: '会议', variant: 'default', icon: Video },
  发布: { label: '发布', variant: 'secondary', icon: CalendarDays },
  提醒: { label: '提醒', variant: 'outline', icon: Clock },
}

const eventTypeColors: Record<string, string> = {
  会议: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  发布: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  提醒: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
}

function openViewDialog(event: CalendarEvent) {
  selectedEvent.value = event
  viewDialogOpen.value = true
}

function openRescheduleDialog(event: CalendarEvent) {
  selectedEvent.value = event
  // Parse date for form
  const [datePart, timePart] = event.date.split(' ')
  rescheduleForm.value = {
    date: datePart || '',
    time: timePart || '',
  }
  rescheduleDialogOpen.value = true
}

function openDeleteDialog(event: CalendarEvent) {
  selectedEvent.value = event
  deleteDialogOpen.value = true
}

function handleReschedule() {
  if (!selectedEvent.value || !rescheduleForm.value.date) return
  const newDate = rescheduleForm.value.time
    ? `${rescheduleForm.value.date} ${rescheduleForm.value.time}`
    : rescheduleForm.value.date

  queryClient.setQueryData(['calendar'], (old: { list: CalendarEvent[] } | undefined) => ({
    list: (old?.list ?? []).map((e) =>
      e.id === selectedEvent.value?.id ? { ...e, date: newDate } : e
    ),
  }))
  rescheduleDialogOpen.value = false
  selectedEvent.value = null
}

function handleDelete() {
  if (!selectedEvent.value) return
  queryClient.setQueryData(['calendar'], (old: { list: CalendarEvent[] } | undefined) => ({
    list: (old?.list ?? []).filter((e) => e.id !== selectedEvent.value?.id),
  }))
  deleteDialogOpen.value = false
  selectedEvent.value = null
}

function handleAddEvent() {
  if (!addForm.value.title || !addForm.value.date || !addForm.value.type) return
  const newEvent: CalendarEvent = {
    id: Date.now(),
    title: addForm.value.title,
    date: addForm.value.date,
    type: addForm.value.type as CalendarEvent['type'],
  }
  queryClient.setQueryData(['calendar'], (old: { list: CalendarEvent[] } | undefined) => ({
    list: [newEvent, ...(old?.list ?? [])],
  }))
  addDialogOpen.value = false
  addForm.value = { title: '', date: '', type: '' }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">活动日历</h1>
        <p class="text-muted-foreground mt-1">查看和管理您的日程安排</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="isRefetching" @click="() => refetch()">
          <RefreshCw :class="cn('h-4 w-4 mr-2', isRefetching && 'animate-spin')" />
          {{ isRefetching ? '同步中' : '刷新' }}
        </Button>
        <Button @click="addDialogOpen = true">
          <Plus class="h-4 w-4 mr-2" />
          新建日程
        </Button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card
        v-for="stat in [
          { label: '总日程', value: stats.total, color: 'text-primary', icon: CalendarIcon, key: 'all' },
          { label: '会议', value: stats.meeting, color: 'text-blue-600 dark:text-blue-400', icon: Video, key: '会议' },
          { label: '发布', value: stats.release, color: 'text-emerald-600 dark:text-emerald-400', icon: CalendarDays, key: '发布' },
          { label: '提醒', value: stats.reminder, color: 'text-amber-600 dark:text-amber-400', icon: Clock, key: '提醒' },
        ]"
        :key="stat.label"
        class="cursor-pointer transition hover:-translate-y-0.5"
        :class="selectedType === stat.key && 'ring-2 ring-primary/40'"
        @click="() => { selectedType = stat.key as typeof selectedType; page = 1 }"
      >
        <CardHeader class="pb-2 flex flex-row items-center justify-between">
          <CardDescription class="flex items-center gap-2">
            <component :is="stat.icon" class="h-4 w-4" />
            {{ stat.label }}
          </CardDescription>
          <Badge variant="outline" size="sm" class="rounded-full">点击过滤</Badge>
        </CardHeader>
        <CardContent>
          <p :class="cn('text-2xl font-bold', stat.color)">{{ stat.value }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- 筛选区域 -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <SearchInput v-model="search" placeholder="搜索日程..." />
          </div>
          <div class="flex gap-2">
            <Button
              :variant="selectedType === 'all' ? 'default' : 'outline'"
              size="sm"
              @click="selectedType = 'all'"
            >
              全部
            </Button>
            <Button
              :variant="selectedType === '会议' ? 'default' : 'outline'"
              size="sm"
              @click="selectedType = '会议'"
            >
              会议
            </Button>
            <Button
              :variant="selectedType === '发布' ? 'default' : 'outline'"
              size="sm"
              @click="selectedType = '发布'"
            >
              发布
            </Button>
            <Button
              :variant="selectedType === '提醒' ? 'default' : 'outline'"
              size="sm"
              @click="selectedType = '提醒'"
            >
              提醒
            </Button>
          </div>
          <div class="flex items-center gap-2">
            <Button
              :variant="viewMode === 'table' ? 'default' : 'outline'"
              size="icon"
              @click="viewMode = 'table'"
            >
              <List class="h-4 w-4" />
            </Button>
            <Button
              :variant="viewMode === 'card' ? 'default' : 'outline'"
              size="icon"
              @click="viewMode = 'card'"
            >
              <Grid3X3 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 日程列表 - 表格模式 -->
    <Card v-if="viewMode === 'table'">
      <CardHeader>
        <CardTitle>日程列表</CardTitle>
        <CardDescription>查看和管理所有日程安排</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-3 font-medium text-muted-foreground">日程</th>
                <th class="pb-3 font-medium text-muted-foreground">类型</th>
                <th class="pb-3 font-medium text-muted-foreground">日期时间</th>
                <th class="pb-3 font-medium text-muted-foreground w-[80px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in paginatedEvents"
                :key="event.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <component
                      :is="eventTypeMap[event.type]?.icon ?? CalendarIcon"
                      class="h-5 w-5 text-muted-foreground"
                    />
                    <div>
                      <p class="font-medium">{{ event.title }}</p>
                      <p class="text-xs text-muted-foreground">
                        {{ event.type }} 日程
                      </p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <Badge variant="outline" :class="eventTypeColors[event.type] || ''">
                    {{ event.type }}
                  </Badge>
                </td>
                <td class="py-4 text-sm text-muted-foreground">
                  {{ event.date }}
                </td>
                <td class="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="openViewDialog(event)">
                        <Eye class="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="openRescheduleDialog(event)">
                        <Clock class="mr-2 h-4 w-4" />
                        重新安排
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(event)">
                        <Trash2 class="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="paginatedEvents.length === 0"
            class="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <CalendarIcon class="h-12 w-12 mb-4" />
            <p>暂无日程</p>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="filteredEvents.length > pageSize" class="mt-4 flex justify-center">
          <Pagination v-model:page="page" :page-size="pageSize" :total="filteredEvents.length" />
        </div>
      </CardContent>
    </Card>

    <!-- 日程列表 - 卡片模式 -->
    <template v-else>
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <div v-else-if="paginatedEvents.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <CalendarIcon class="h-12 w-12 mb-4" />
        <p>暂无日程</p>
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="event in paginatedEvents"
          :key="event.id"
          class="group hover:shadow-md transition-shadow"
        >
          <CardContent class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div :class="cn('p-2 rounded-lg', eventTypeColors[event.type])">
                  <component :is="eventTypeMap[event.type]?.icon ?? CalendarIcon" class="h-5 w-5" />
                </div>
                <div>
                  <p class="font-medium">{{ event.title }}</p>
                  <Badge variant="outline" :class="cn('mt-1', eventTypeColors[event.type])">
                    {{ event.type }}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="openViewDialog(event)">
                    <Eye class="mr-2 h-4 w-4" />
                    查看详情
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="openRescheduleDialog(event)">
                    <Clock class="mr-2 h-4 w-4" />
                    重新安排
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(event)">
                    <Trash2 class="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock class="h-4 w-4" />
              <span>{{ event.date }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- 分页 -->
      <div v-if="filteredEvents.length > pageSize" class="flex justify-center">
        <Pagination v-model:page="page" :page-size="pageSize" :total="filteredEvents.length" />
      </div>
    </template>

    <!-- 查看详情对话框 -->
    <Dialog v-model:open="viewDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>日程详情</DialogTitle>
          <DialogDescription>查看日程的详细信息</DialogDescription>
        </DialogHeader>
        <div v-if="selectedEvent" class="space-y-4 py-4">
          <div class="flex items-center gap-3">
            <div :class="cn('p-3 rounded-lg', eventTypeColors[selectedEvent.type])">
              <component :is="eventTypeMap[selectedEvent.type]?.icon ?? CalendarIcon" class="h-6 w-6" />
            </div>
            <div>
              <p class="text-lg font-semibold">{{ selectedEvent.title }}</p>
              <Badge variant="outline" :class="eventTypeColors[selectedEvent.type]">
                {{ selectedEvent.type }}
              </Badge>
            </div>
          </div>
          <div class="rounded-lg border p-4 space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <Clock class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">时间:</span>
              <span>{{ selectedEvent.date }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <CalendarIcon class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">ID:</span>
              <span>{{ selectedEvent.id }}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="viewDialogOpen = false">关闭</Button>
          <Button @click="viewDialogOpen = false; openRescheduleDialog(selectedEvent!)">
            <Clock class="h-4 w-4 mr-2" />
            重新安排
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 重新安排对话框 -->
    <Dialog v-model:open="rescheduleDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重新安排日程</DialogTitle>
          <DialogDescription>
            为 "{{ selectedEvent?.title }}" 选择新的日期时间
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="date">日期</Label>
            <Input id="date" v-model="rescheduleForm.date" type="date" />
          </div>
          <div class="space-y-2">
            <Label for="time">时间</Label>
            <Input id="time" v-model="rescheduleForm.time" type="time" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="rescheduleDialogOpen = false">取消</Button>
          <Button @click="handleReschedule" :disabled="!rescheduleForm.date">
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 删除确认对话框 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除日程 "{{ selectedEvent?.title }}" 吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="handleDelete">删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 新建日程对话框 -->
    <Dialog v-model:open="addDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建日程</DialogTitle>
          <DialogDescription>填写以下信息创建新日程</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="title">标题</Label>
            <Input id="title" v-model="addForm.title" placeholder="请输入日程标题" />
          </div>
          <div class="space-y-2">
            <Label for="event-date">日期时间</Label>
            <Input id="event-date" v-model="addForm.date" type="datetime-local" />
          </div>
          <div class="space-y-2">
            <Label>类型</Label>
            <Select v-model="addForm.type">
              <SelectTrigger>
                <SelectValue placeholder="选择日程类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="会议">会议</SelectItem>
                <SelectItem value="发布">发布</SelectItem>
                <SelectItem value="提醒">提醒</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="addDialogOpen = false">取消</Button>
          <Button @click="handleAddEvent" :disabled="!addForm.title || !addForm.date || !addForm.type">
            <Plus class="h-4 w-4 mr-2" />
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
