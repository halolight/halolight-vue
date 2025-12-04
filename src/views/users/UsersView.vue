<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  Users,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { fetchUsers } from '@/api/users'
import SearchInput from '@/components/common/SearchInput.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import type { UserItem } from '@/types/users'

const queryClient = useQueryClient()
const toast = useToast()
const route = useRoute()
const router = useRouter()

// 检查是否有子路由匹配（路径是否比 /users 更深）
const hasChildRoute = computed(() => {
  const path = route.path
  // /users 显示列表，/users/xxx/xxx 显示子路由
  return path !== '/users' && path.startsWith('/users/')
})

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

const search = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive' | 'suspended'>('all')
const page = ref(1)
const pageSize = 8
const addDialogOpen = ref(false)
const editDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedUser = ref<UserItem | null>(null)

// Form state for adding/editing user
const formData = ref({
  name: '',
  email: '',
  role: '',
  status: 'active' as 'active' | 'inactive' | 'suspended',
})

const users = computed(() => data.value?.list ?? [])

const filteredUsers = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return users.value.filter((u: UserItem) => {
    const matchKeyword =
      !keyword ||
      u.name.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword)
    const matchStatus = statusFilter.value === 'all' || u.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter((u: UserItem) => u.status === 'active').length,
  inactive: users.value.filter((u: UserItem) => u.status === 'inactive').length,
  suspended: users.value.filter((u: UserItem) => u.status === 'suspended').length,
}))

const paginatedUsers = computed(() => {
  const totalPages = Math.max(1, Math.ceil(filteredUsers.value.length / pageSize))
  const currentPage = Math.min(page.value, totalPages)
  const start = (currentPage - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  active: { label: '活跃', variant: 'default' },
  inactive: { label: '禁用', variant: 'secondary' },
  suspended: { label: '暂停', variant: 'outline' },
}

const roleColors: Record<string, string> = {
  '超级管理员': 'bg-red-500/10 text-red-500 border-red-500/20',
  '管理员': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  '编辑': 'bg-green-500/10 text-green-500 border-green-500/20',
  '访客': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

const roleOptions = ['超级管理员', '管理员', '编辑', '访客']

function openAddDialog() {
  formData.value = { name: '', email: '', role: '', status: 'active' }
  addDialogOpen.value = true
}

function setStatusFilter(status: 'all' | 'active' | 'inactive' | 'suspended') {
  statusFilter.value = status
  page.value = 1
}

function openEditDialog(user: UserItem) {
  selectedUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    role: user.role?.label ?? '',
    status: user.status as 'active' | 'inactive' | 'suspended',
  }
  editDialogOpen.value = true
}

function openDeleteDialog(user: UserItem) {
  selectedUser.value = user
  deleteDialogOpen.value = true
}

function handleAddUser() {
  // Simulate adding user (in real app, would call API)
  const newUser: UserItem = {
    id: Date.now().toString(),
    name: formData.value.name,
    email: formData.value.email,
    avatar: '',
    role: {
      id: Date.now().toString(),
      name: formData.value.role.toLowerCase(),
      label: formData.value.role,
      permissions: [],
    },
    status: formData.value.status,
    createdAt: new Date().toISOString(),
  }
  queryClient.setQueryData(['users'], (old: { list: UserItem[] } | undefined) => ({
    list: [...(old?.list ?? []), newUser],
  }))
  addDialogOpen.value = false
}

function handleEditUser() {
  if (!selectedUser.value) return
  queryClient.setQueryData(['users'], (old: { list: UserItem[] } | undefined) => ({
    list: (old?.list ?? []).map((u) =>
      u.id === selectedUser.value?.id
        ? {
            ...u,
            name: formData.value.name,
            email: formData.value.email,
            role: {
              ...u.role,
              name: formData.value.role.toLowerCase(),
              label: formData.value.role,
            },
            status: formData.value.status,
          }
        : u
    ),
  }))
  editDialogOpen.value = false
  selectedUser.value = null
}

function handleDeleteUser() {
  if (!selectedUser.value) return
  queryClient.setQueryData(['users'], (old: { list: UserItem[] } | undefined) => ({
    list: (old?.list ?? []).filter((u) => u.id !== selectedUser.value?.id),
  }))
  deleteDialogOpen.value = false
  selectedUser.value = null
  toast.success('用户已删除')
}

function goToDetail(user: UserItem) {
  router.push({ name: 'user-profile', params: { id: user.id } })
}
</script>

<template>
  <!-- 有子路由时只渲染子路由内容 -->
  <RouterView v-if="hasChildRoute" />

  <!-- 没有子路由时显示用户列表 -->
  <div v-else class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">用户管理</h1>
        <p class="text-muted-foreground mt-1">查看和管理所有系统用户</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="isRefetching" @click="() => refetch()">
          <RefreshCw :class="cn('h-4 w-4 mr-2', isRefetching && 'animate-spin')" />
          {{ isRefetching ? '刷新中' : '刷新' }}
        </Button>
        <Button @click="openAddDialog">
          <Plus class="h-4 w-4 mr-2" />
          添加用户
        </Button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card v-for="stat in [
        { label: '总用户数', value: stats.total, color: 'text-primary', icon: Users },
        { label: '活跃用户', value: stats.active, color: 'text-emerald-600 dark:text-emerald-400', icon: Users },
        { label: '已禁用', value: stats.inactive, color: 'text-amber-600 dark:text-amber-400', icon: Users },
        { label: '暂停中', value: stats.suspended, color: 'text-destructive', icon: Users },
      ]" :key="stat.label" class="cursor-pointer transition hover:-translate-y-0.5"
        :class="cn(
          statusFilter === 'all' && stat.label === '总用户数' && 'ring-2 ring-primary/40',
          statusFilter === 'active' && stat.label === '活跃用户' && 'ring-2 ring-primary/40',
          statusFilter === 'inactive' && stat.label === '已禁用' && 'ring-2 ring-primary/40',
          statusFilter === 'suspended' && stat.label === '暂停中' && 'ring-2 ring-primary/40'
        )"
        @click="setStatusFilter(
          stat.label === '总用户数' ? 'all' :
          stat.label === '活跃用户' ? 'active' :
          stat.label === '已禁用' ? 'inactive' : 'suspended'
        )"
      >
        <CardHeader class="pb-2 flex flex-row items-center justify-between">
          <CardDescription class="flex items-center gap-2">
            <component :is="stat.icon" class="h-4 w-4" />
            {{ stat.label }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p :class="cn('text-2xl font-bold', stat.color)">{{ stat.value }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- 筛选区域 -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <SearchInput v-model="search" placeholder="搜索用户..." />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 用户表格 -->
    <Card>
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
        <CardDescription>查看和管理所有系统用户</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-3 font-medium text-muted-foreground">用户</th>
                <th class="pb-3 font-medium text-muted-foreground">角色</th>
                <th class="pb-3 font-medium text-muted-foreground">状态</th>
                <th class="pb-3 font-medium text-muted-foreground">注册时间</th>
                <th class="pb-3 font-medium text-muted-foreground w-[80px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <Avatar class="h-8 w-8">
                      <AvatarImage v-if="user.avatar" :src="user.avatar" />
                      <AvatarFallback>{{ user.name?.slice(0, 1) }}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="font-medium">{{ user.name }}</p>
                      <p class="text-xs text-muted-foreground">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <Badge variant="outline" :class="roleColors[user.role?.label] || ''">
                    <Shield class="mr-1 h-3 w-3" />
                    {{ user.role?.label || user.role?.name }}
                  </Badge>
                </td>
                <td class="py-4">
                  <Badge :variant="statusMap[user.status]?.variant ?? 'default'">
                    {{ statusMap[user.status]?.label ?? user.status }}
                  </Badge>
                </td>
                <td class="py-4 text-sm text-muted-foreground">
                  {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '-' }}
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
                      <DropdownMenuItem @click="goToDetail(user)">
                        <Eye class="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="openEditDialog(user)">
                        <Pencil class="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click="openDeleteDialog(user)">
                        <Trash2 class="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex flex-col gap-4 py-4">
            <div
              v-if="paginatedUsers.length === 0"
              class="flex flex-col items-center justify-center py-8 text-muted-foreground"
            >
              <Users class="h-12 w-12 mb-4" />
              <p>暂无用户数据</p>
            </div>
            <div v-else-if="filteredUsers.length > pageSize" class="flex justify-center">
              <Pagination v-model:page="page" :page-size="pageSize" :total="filteredUsers.length" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 添加用户对话框 -->
    <Dialog v-model:open="addDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加用户</DialogTitle>
          <DialogDescription>填写以下信息创建新用户</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="name">姓名</Label>
            <Input id="name" v-model="formData.name" placeholder="请输入姓名" />
          </div>
          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input id="email" v-model="formData.email" type="email" placeholder="请输入邮箱" />
          </div>
          <div class="space-y-2">
            <Label for="role">角色</Label>
            <Select v-model="formData.role">
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roleOptions" :key="role" :value="role">
                  {{ role }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="status">状态</Label>
            <Select v-model="formData.status">
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
                <SelectItem value="suspended">暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="addDialogOpen = false">取消</Button>
          <Button @click="handleAddUser" :disabled="!formData.name || !formData.email || !formData.role">
            添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 编辑用户对话框 -->
    <Dialog v-model:open="editDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>修改用户信息</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="edit-name">姓名</Label>
            <Input id="edit-name" v-model="formData.name" placeholder="请输入姓名" />
          </div>
          <div class="space-y-2">
            <Label for="edit-email">邮箱</Label>
            <Input id="edit-email" v-model="formData.email" type="email" placeholder="请输入邮箱" />
          </div>
          <div class="space-y-2">
            <Label for="edit-role">角色</Label>
            <Select v-model="formData.role">
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roleOptions" :key="role" :value="role">
                  {{ role }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="edit-status">状态</Label>
            <Select v-model="formData.status">
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
                <SelectItem value="suspended">暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editDialogOpen = false">取消</Button>
          <Button @click="handleEditUser">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 删除确认对话框 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除用户 "{{ selectedUser?.name }}" 吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="handleDeleteUser">删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
