<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  Download,
  File,
  FileText,
  Folder,
  FolderOpen,
  Grid3X3,
  List,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { fetchFiles } from '@/api/files'
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
import { useToast } from '@/composables/useToast'
import { cn } from '@/lib/utils'
import type { FileItem } from '@/types/files'

const queryClient = useQueryClient()

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['files'],
  queryFn: fetchFiles,
})

const search = ref('')
const viewMode = ref<'table' | 'card'>('table')
const page = ref(1)
const pageSize = ref(10)
const activeCardFilter = ref<'all' | 'doc' | 'media' | 'archive'>('all')

// Dialog states
const uploadDialogOpen = ref(false)
const moveDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedFile = ref<FileItem | null>(null)
const moveTarget = ref('')

// Upload form
const uploadForm = ref({
  name: '',
  file: null as File | null,
})

const folders = ['文档', '图片', '视频', '下载', '归档']

const files = computed(() => data.value?.list ?? [])
const toast = useToast()

const filteredFiles = computed(() => {
  const keyword = search.value.toLowerCase()
  return files.value.filter((f) => {
    const ext = f.name.split('.').pop()?.toLowerCase() || ''
    const matchKeyword =
      !keyword ||
      f.name.toLowerCase().includes(keyword) ||
      f.owner.toLowerCase().includes(keyword)

    const matchFilter =
      activeCardFilter.value === 'all' ||
      (activeCardFilter.value === 'doc' && ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(ext)) ||
      (activeCardFilter.value === 'media' && ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'].includes(ext)) ||
      (activeCardFilter.value === 'archive' && ['zip', 'rar', 'tar', 'gz', '7z'].includes(ext))

    return matchKeyword && matchFilter
  })
})

const paginatedFiles = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredFiles.value.slice(start, start + pageSize.value)
})

const stats = computed(() => ({
  total: files.value.length,
  totalSize: files.value.reduce((sum, f) => {
    const sizeNum = parseFloat(f.size)
    return sum + sizeNum
  }, 0).toFixed(2),
  doc: files.value.filter((f) => ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(f.name.split('.').pop()?.toLowerCase() || '')).length,
  media: files.value.filter((f) => ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'].includes(f.name.split('.').pop()?.toLowerCase() || '')).length,
  archive: files.value.filter((f) => ['zip', 'rar', 'tar', 'gz', '7z'].includes(f.name.split('.').pop()?.toLowerCase() || '')).length,
}))

function setCardFilter(type: 'all' | 'doc' | 'media' | 'archive') {
  activeCardFilter.value = type
  page.value = 1
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf' || ext === 'doc' || ext === 'docx' || ext === 'txt') {
    return FileText
  }
  if (ext === 'zip' || ext === 'rar' || ext === 'tar') {
    return Folder
  }
  return File
}

function getFileTypeColor(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  if (ext === 'doc' || ext === 'docx') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  if (ext === 'xls' || ext === 'xlsx') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  if (ext === 'zip' || ext === 'rar') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  return 'bg-muted text-muted-foreground border-border'
}

function handleDownload(file: FileItem) {
  // Simulate download - in real app, would trigger file download
  const link = document.createElement('a')
  link.href = '#'
  link.download = file.name
  // In real app: link.href = `/api/files/${file.id}/download`
  toast.success(`已开始下载 ${file.name}`)
}

function openMoveDialog(file: FileItem) {
  selectedFile.value = file
  moveTarget.value = ''
  moveDialogOpen.value = true
}

function handleMove() {
  if (!selectedFile.value || !moveTarget.value) return
  // Simulate move - in real app, would call API
  toast.success(`已将 "${selectedFile.value.name}" 移动到 "${moveTarget.value}"`)
  moveDialogOpen.value = false
  selectedFile.value = null
  moveTarget.value = ''
}

function openDeleteDialog(file: FileItem) {
  selectedFile.value = file
  deleteDialogOpen.value = true
}

function handleDelete() {
  if (!selectedFile.value) return
  queryClient.setQueryData(['files'], (old: { list: FileItem[] } | undefined) => ({
    list: (old?.list ?? []).filter((f) => f.id !== selectedFile.value?.id),
  }))
  deleteDialogOpen.value = false
  selectedFile.value = null
  toast.success('文件已删除')
}

function handleUpload() {
  if (!uploadForm.value.name) return
  const newFile: FileItem = {
    id: Date.now().toString(),
    name: uploadForm.value.name,
    size: '0.1 MB',
    owner: '当前用户',
    updatedAt: new Date().toLocaleDateString('zh-CN'),
  }
  queryClient.setQueryData(['files'], (old: { list: FileItem[] } | undefined) => ({
    list: [newFile, ...(old?.list ?? [])],
  }))
  uploadDialogOpen.value = false
  uploadForm.value = { name: '', file: null }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadForm.value.file = file
    if (!uploadForm.value.name) {
      uploadForm.value.name = file.name
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">文件空间</h1>
        <p class="text-muted-foreground mt-1">查看和管理您的文件</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="isRefetching" @click="() => refetch()">
          <RefreshCw :class="cn('h-4 w-4 mr-2', isRefetching && 'animate-spin')" />
          {{ isRefetching ? '刷新中' : '刷新' }}
        </Button>
        <Button @click="uploadDialogOpen = true">
          <Upload class="h-4 w-4 mr-2" />
          上传文件
        </Button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card
        v-for="stat in [
          { label: '全部文件', value: stats.total, color: 'text-primary', icon: File, key: 'all' },
          { label: '文档类', value: stats.doc, color: 'text-blue-600 dark:text-blue-400', icon: FileText, key: 'doc' },
          { label: '多媒体', value: stats.media, color: 'text-emerald-600 dark:text-emerald-400', icon: Grid3X3, key: 'media' },
          { label: '压缩包', value: stats.archive, color: 'text-amber-600 dark:text-amber-400', icon: FolderOpen, key: 'archive' },
        ]"
        :key="stat.label"
        class="cursor-pointer transition hover:-translate-y-0.5"
        :class="activeCardFilter === stat.key && 'ring-2 ring-primary/40'"
        @click="setCardFilter(stat.key as typeof activeCardFilter)"
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
            <SearchInput v-model="search" placeholder="搜索文件..." />
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

    <!-- 文件列表 - 表格模式 -->
    <Card v-if="viewMode === 'table'">
      <CardHeader>
        <CardTitle>最新文件</CardTitle>
        <CardDescription>查看和管理所有文件</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-3 font-medium text-muted-foreground">文件名</th>
                <th class="pb-3 font-medium text-muted-foreground">大小</th>
                <th class="pb-3 font-medium text-muted-foreground">所有者</th>
                <th class="pb-3 font-medium text-muted-foreground">更新时间</th>
                <th class="pb-3 font-medium text-muted-foreground w-[80px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="file in paginatedFiles"
                :key="file.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <component :is="getFileIcon(file.name)" class="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p class="font-medium">{{ file.name }}</p>
                      <p class="text-xs text-muted-foreground">
                        {{ file.name.split('.').pop()?.toUpperCase() }} 文件
                      </p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <Badge variant="outline" :class="getFileTypeColor(file.name)">
                    {{ file.size }}
                  </Badge>
                </td>
                <td class="py-4 text-sm text-muted-foreground">
                  {{ file.owner }}
                </td>
                <td class="py-4 text-sm text-muted-foreground">
                  {{ file.updatedAt }}
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
                      <DropdownMenuItem @click="handleDownload(file)">
                        <Download class="mr-2 h-4 w-4" />
                        下载
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="openMoveDialog(file)">
                        <FolderOpen class="mr-2 h-4 w-4" />
                        移动
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(file)">
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
            v-if="paginatedFiles.length === 0"
            class="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <File class="h-12 w-12 mb-4" />
            <p>暂无文件</p>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="filteredFiles.length > pageSize" class="mt-4 flex justify-center">
          <Pagination v-model:page="page" :page-size="pageSize" :total="filteredFiles.length" />
        </div>
      </CardContent>
    </Card>

    <!-- 文件列表 - 卡片模式 -->
    <template v-else>
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <div v-else-if="paginatedFiles.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <File class="h-12 w-12 mb-4" />
        <p>暂无文件</p>
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card
          v-for="file in paginatedFiles"
          :key="file.id"
          class="group hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div :class="cn('p-2 rounded-lg', getFileTypeColor(file.name))">
                  <component :is="getFileIcon(file.name)" class="h-6 w-6" />
                </div>
                <div class="min-w-0">
                  <p class="font-medium truncate" :title="file.name">{{ file.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ file.size }}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleDownload(file)">
                    <Download class="mr-2 h-4 w-4" />
                    下载
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="openMoveDialog(file)">
                    <FolderOpen class="mr-2 h-4 w-4" />
                    移动
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(file)">
                    <Trash2 class="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div class="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{{ file.owner }}</span>
              <span>{{ file.updatedAt }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- 分页 -->
      <div v-if="filteredFiles.length > pageSize" class="flex justify-center">
        <Pagination v-model:page="page" :page-size="pageSize" :total="filteredFiles.length" />
      </div>
    </template>

    <!-- 上传文件对话框 -->
    <Dialog v-model:open="uploadDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>上传文件</DialogTitle>
          <DialogDescription>选择要上传的文件</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="file">选择文件</Label>
            <Input id="file" type="file" @change="handleFileSelect" />
          </div>
          <div class="space-y-2">
            <Label for="filename">文件名</Label>
            <Input id="filename" v-model="uploadForm.name" placeholder="输入文件名" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="uploadDialogOpen = false">取消</Button>
          <Button @click="handleUpload" :disabled="!uploadForm.name">
            <Upload class="h-4 w-4 mr-2" />
            上传
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 移动文件对话框 -->
    <Dialog v-model:open="moveDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>移动文件</DialogTitle>
          <DialogDescription>
            将 "{{ selectedFile?.name }}" 移动到指定文件夹
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label>目标文件夹</Label>
            <Select v-model="moveTarget">
              <SelectTrigger>
                <SelectValue placeholder="选择目标文件夹" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="folder in folders" :key="folder" :value="folder">
                  {{ folder }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="moveDialogOpen = false">取消</Button>
          <Button @click="handleMove" :disabled="!moveTarget">
            <FolderOpen class="h-4 w-4 mr-2" />
            移动
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
            确定要删除文件 "{{ selectedFile?.name }}" 吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="handleDelete">删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
