<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Eye,
  Grid3X3,
  List,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { fetchSecurityReport } from '@/api/security'
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
import { Pagination } from '@/components/ui/pagination'
import { useToast } from '@/composables/useToast'
import { cn } from '@/lib/utils'
import type { SecurityIssue } from '@/types/security'

const queryClient = useQueryClient()
const toast = useToast()

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['security'],
  queryFn: fetchSecurityReport,
})

const search = ref('')
const selectedSeverity = ref<string>('all')
const selectedStatus = ref<string>('all')
const viewMode = ref<'table' | 'card'>('table')
const page = ref(1)
const pageSize = ref(10)

// Dialog states
const viewDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedIssue = ref<SecurityIssue | null>(null)
const isScanning = ref(false)

const issues = computed(() => data.value?.issues ?? [])

const filteredIssues = computed(() => {
  let result = issues.value

  // Filter by severity
  if (selectedSeverity.value !== 'all') {
    result = result.filter((i: SecurityIssue) => i.severity === selectedSeverity.value)
  }

  // Filter by status
  if (selectedStatus.value !== 'all') {
    result = result.filter((i: SecurityIssue) => i.status === selectedStatus.value)
  }

  // Filter by search
  if (search.value) {
    result = result.filter((i: SecurityIssue) =>
      i.title.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  return result
})

const paginatedIssues = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredIssues.value.slice(start, start + pageSize.value)
})

const stats = computed(() => ({
  total: issues.value.length,
  high: issues.value.filter((i: SecurityIssue) => i.severity === '高').length,
  medium: issues.value.filter((i: SecurityIssue) => i.severity === '中').length,
  low: issues.value.filter((i: SecurityIssue) => i.severity === '低').length,
  fixed: issues.value.filter((i: SecurityIssue) => i.status === '已修复').length,
  pending: issues.value.filter((i: SecurityIssue) => i.status === '待处理').length,
}))

const severityMap: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: typeof AlertCircle }
> = {
  高: { label: '高', variant: 'destructive', icon: AlertCircle },
  中: { label: '中', variant: 'default', icon: AlertTriangle },
  低: { label: '低', variant: 'secondary', icon: Shield },
}

const statusMap: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline'; icon: typeof CheckCircle2 }
> = {
  已修复: { label: '已修复', variant: 'outline', icon: CheckCircle2 },
  待处理: { label: '待处理', variant: 'default', icon: XCircle },
}

const severityColors: Record<string, string> = {
  高: 'bg-destructive/10 text-destructive border-destructive/20',
  中: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  低: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
}

const severityIconColors: Record<string, string> = {
  高: 'text-destructive',
  中: 'text-amber-600 dark:text-amber-400',
  低: 'text-emerald-600 dark:text-emerald-400',
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-destructive'
}

function openViewDialog(issue: SecurityIssue) {
  selectedIssue.value = issue
  viewDialogOpen.value = true
}

function openDeleteDialog(issue: SecurityIssue) {
  selectedIssue.value = issue
  deleteDialogOpen.value = true
}

function handleMarkFixed(issue: SecurityIssue) {
  queryClient.setQueryData(['security'], (old: { issues: SecurityIssue[]; lastScan: string; score: number } | undefined) => {
    if (!old) return old
    return {
      ...old,
      issues: old.issues.map((i) =>
        i.id === issue.id ? { ...i, status: '已修复' as const } : i
      ),
      score: Math.min(100, old.score + 2),
    }
  })
  toast.success(`"${issue.title}" 已标记为已修复`)
}

function handleIgnore() {
  if (!selectedIssue.value) return
  queryClient.setQueryData(['security'], (old: { issues: SecurityIssue[]; lastScan: string; score: number } | undefined) => {
    if (!old) return old
    return {
      ...old,
      issues: old.issues.filter((i) => i.id !== selectedIssue.value?.id),
    }
  })
  deleteDialogOpen.value = false
  toast.success(`已忽略问题 "${selectedIssue.value.title}"`)
  selectedIssue.value = null
}

async function handleStartScan() {
  isScanning.value = true
  // Simulate scan delay
  await new Promise((resolve) => setTimeout(resolve, 2000))
  await refetch()
  isScanning.value = false
  toast.success('安全扫描已完成')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">安全审计</h1>
        <p class="text-muted-foreground mt-1">查看系统安全状态和漏洞报告</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="isRefetching" @click="() => refetch()">
          <RefreshCw :class="cn('h-4 w-4 mr-2', isRefetching && 'animate-spin')" />
          {{ isRefetching ? '刷新中' : '刷新' }}
        </Button>
        <Button :disabled="isScanning" @click="handleStartScan">
          <ShieldCheck :class="cn('h-4 w-4 mr-2', isScanning && 'animate-pulse')" />
          {{ isScanning ? '扫描中...' : '开始扫描' }}
        </Button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 md:grid-cols-5">
      <Card class="md:col-span-1">
        <CardHeader class="pb-2">
          <CardDescription class="flex items-center gap-2">
            <ShieldCheck class="h-4 w-4" />
            安全评分
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p :class="cn('text-3xl font-bold', getScoreColor(data?.score ?? 0))">
            {{ data?.score ?? '—' }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            上次扫描: {{ data?.lastScan ?? '—' }}
          </p>
        </CardContent>
      </Card>

      <Card
        v-for="stat in [
          { label: '高危问题', value: stats.high, color: 'text-destructive', icon: AlertCircle, key: '高', type: 'severity' },
          { label: '中危问题', value: stats.medium, color: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle, key: '中', type: 'severity' },
          { label: '低危问题', value: stats.low, color: 'text-emerald-600 dark:text-emerald-400', icon: Shield, key: '低', type: 'severity' },
          { label: '已修复', value: stats.fixed, color: 'text-primary', icon: CheckCircle2, key: '已修复', type: 'status' },
        ]"
        :key="stat.label"
        class="cursor-pointer transition hover:-translate-y-0.5"
        :class="(
          (stat.type === 'severity' && selectedSeverity === stat.key) ||
          (stat.type === 'status' && selectedStatus === stat.key)
        ) && 'ring-2 ring-primary/40'"
        @click="() => {
          if (stat.type === 'severity') selectedSeverity = stat.key as typeof selectedSeverity
          if (stat.type === 'status') selectedStatus = stat.key as typeof selectedStatus
          page = 1
        }"
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
            <SearchInput v-model="search" placeholder="搜索安全问题..." />
          </div>
          <div class="flex gap-2">
            <Button
              :variant="selectedSeverity === 'all' ? 'default' : 'outline'"
              size="sm"
              @click="selectedSeverity = 'all'"
            >
              全部严重度
            </Button>
            <Button
              :variant="selectedSeverity === '高' ? 'default' : 'outline'"
              size="sm"
              @click="selectedSeverity = '高'"
            >
              高危
            </Button>
            <Button
              :variant="selectedSeverity === '中' ? 'default' : 'outline'"
              size="sm"
              @click="selectedSeverity = '中'"
            >
              中危
            </Button>
            <Button
              :variant="selectedSeverity === '低' ? 'default' : 'outline'"
              size="sm"
              @click="selectedSeverity = '低'"
            >
              低危
            </Button>
          </div>
          <div class="flex gap-2">
            <Button
              :variant="selectedStatus === 'all' ? 'default' : 'outline'"
              size="sm"
              @click="selectedStatus = 'all'"
            >
              全部状态
            </Button>
            <Button
              :variant="selectedStatus === '已修复' ? 'default' : 'outline'"
              size="sm"
              @click="selectedStatus = '已修复'"
            >
              已修复
            </Button>
            <Button
              :variant="selectedStatus === '待处理' ? 'default' : 'outline'"
              size="sm"
              @click="selectedStatus = '待处理'"
            >
              待处理
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

    <!-- 安全问题列表 - 表格模式 -->
    <Card v-if="viewMode === 'table'">
      <CardHeader>
        <CardTitle>安全问题列表</CardTitle>
        <CardDescription>查看和处理所有安全问题</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-3 font-medium text-muted-foreground">问题</th>
                <th class="pb-3 font-medium text-muted-foreground">严重度</th>
                <th class="pb-3 font-medium text-muted-foreground">状态</th>
                <th class="pb-3 font-medium text-muted-foreground w-[80px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="issue in paginatedIssues"
                :key="issue.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <component
                      :is="severityMap[issue.severity]?.icon ?? ShieldAlert"
                      :class="cn('h-5 w-5', severityIconColors[issue.severity])"
                    />
                    <div>
                      <p class="font-medium">{{ issue.title }}</p>
                      <p class="text-xs text-muted-foreground">
                        安全漏洞 - {{ issue.severity }}危
                      </p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <Badge variant="outline" :class="severityColors[issue.severity] || ''">
                    {{ issue.severity }}危
                  </Badge>
                </td>
                <td class="py-4">
                  <Badge :variant="statusMap[issue.status]?.variant ?? 'default'">
                    <component
                      :is="statusMap[issue.status]?.icon ?? Shield"
                      class="mr-1 h-3 w-3"
                    />
                    {{ statusMap[issue.status]?.label ?? issue.status }}
                  </Badge>
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
                      <DropdownMenuItem @click="openViewDialog(issue)">
                        <Eye class="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        v-if="issue.status === '待处理'"
                        @click="handleMarkFixed(issue)"
                      >
                        <CheckCircle2 class="mr-2 h-4 w-4" />
                        标记已修复
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(issue)">
                        <Ban class="mr-2 h-4 w-4" />
                        忽略
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="paginatedIssues.length === 0"
            class="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <ShieldCheck class="h-12 w-12 mb-4" />
            <p>暂无安全问题</p>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="filteredIssues.length > pageSize" class="mt-4 flex justify-center">
          <Pagination v-model:page="page" :page-size="pageSize" :total="filteredIssues.length" />
        </div>
      </CardContent>
    </Card>

    <!-- 安全问题列表 - 卡片模式 -->
    <template v-else>
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <div v-else-if="paginatedIssues.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShieldCheck class="h-12 w-12 mb-4" />
        <p>暂无安全问题</p>
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="issue in paginatedIssues"
          :key="issue.id"
          class="group hover:shadow-md transition-shadow"
        >
          <CardContent class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div :class="cn('p-2 rounded-lg', severityColors[issue.severity])">
                  <component :is="severityMap[issue.severity]?.icon ?? ShieldAlert" class="h-5 w-5" />
                </div>
                <div>
                  <p class="font-medium">{{ issue.title }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <Badge variant="outline" :class="severityColors[issue.severity]">
                      {{ issue.severity }}危
                    </Badge>
                    <Badge :variant="statusMap[issue.status]?.variant ?? 'default'">
                      {{ issue.status }}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="openViewDialog(issue)">
                    <Eye class="mr-2 h-4 w-4" />
                    查看详情
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="issue.status === '待处理'"
                    @click="handleMarkFixed(issue)"
                  >
                    <CheckCircle2 class="mr-2 h-4 w-4" />
                    标记已修复
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(issue)">
                    <Ban class="mr-2 h-4 w-4" />
                    忽略
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div class="mt-4 text-xs text-muted-foreground">
              ID: {{ issue.id }}
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- 分页 -->
      <div v-if="filteredIssues.length > pageSize" class="flex justify-center">
        <Pagination v-model:page="page" :page-size="pageSize" :total="filteredIssues.length" />
      </div>
    </template>

    <!-- 查看详情对话框 -->
    <Dialog v-model:open="viewDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>安全问题详情</DialogTitle>
          <DialogDescription>查看安全问题的详细信息</DialogDescription>
        </DialogHeader>
        <div v-if="selectedIssue" class="space-y-4 py-4">
          <div class="flex items-center gap-3">
            <div :class="cn('p-3 rounded-lg', severityColors[selectedIssue.severity])">
              <component :is="severityMap[selectedIssue.severity]?.icon ?? ShieldAlert" class="h-6 w-6" />
            </div>
            <div>
              <p class="text-lg font-semibold">{{ selectedIssue.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <Badge variant="outline" :class="severityColors[selectedIssue.severity]">
                  {{ selectedIssue.severity }}危
                </Badge>
                <Badge :variant="statusMap[selectedIssue.status]?.variant ?? 'default'">
                  <component :is="statusMap[selectedIssue.status]?.icon ?? Shield" class="mr-1 h-3 w-3" />
                  {{ selectedIssue.status }}
                </Badge>
              </div>
            </div>
          </div>
          <div class="rounded-lg border p-4 space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">问题 ID:</span>
              <span>{{ selectedIssue.id }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <AlertCircle class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">严重程度:</span>
              <span>{{ selectedIssue.severity }}危</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <CheckCircle2 class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">当前状态:</span>
              <span>{{ selectedIssue.status }}</span>
            </div>
          </div>
          <div class="rounded-lg bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">
              建议措施：请检查相关配置并及时修复此安全问题，以确保系统安全。
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="viewDialogOpen = false">关闭</Button>
          <Button
            v-if="selectedIssue?.status === '待处理'"
            @click="viewDialogOpen = false; handleMarkFixed(selectedIssue!)"
          >
            <CheckCircle2 class="h-4 w-4 mr-2" />
            标记已修复
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 忽略确认对话框 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认忽略</DialogTitle>
          <DialogDescription>
            确定要忽略安全问题 "{{ selectedIssue?.title }}" 吗？忽略后该问题将不再显示。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="handleIgnore">
            <Ban class="h-4 w-4 mr-2" />
            忽略
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
