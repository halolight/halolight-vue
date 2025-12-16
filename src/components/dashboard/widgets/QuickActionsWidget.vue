<script setup lang="ts">
import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  FolderOpen,
  Github,
  ListTodo,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  Users,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'

const router = useRouter()

const actions = [
  { icon: Users, label: '用户管理', path: '/users' },
  { icon: MessageSquare, label: '消息中心', path: '/messages' },
  { icon: FolderOpen, label: '文件管理', path: '/files' },
  { icon: BarChart3, label: '数据分析', path: '/analytics' },
  { icon: FileText, label: '文档中心', path: '/documents' },
  { icon: Settings, label: '系统设置', path: '/settings' },
  { icon: ShieldCheck, label: '安全审计', path: '/security' },
  { icon: Bell, label: '通知中心', path: '/notifications' },
  { icon: User, label: '个人中心', path: '/profile' },
  { icon: Calendar, label: '日程管理', path: '/calendar' },
  { icon: ListTodo, label: '任务管理', path: '/tasks' },
  { icon: Github, label: '项目 GitHub', path: 'https://github.com/halolight/halolight-vue' },
]

function handleAction(path: string) {
  if (path.startsWith('http')) {
    window.open(path, '_blank', 'noopener')
    return
  }
  router.push(path)
}
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <Button
      v-for="action in actions"
      :key="action.path"
      variant="outline"
      class="h-auto flex-col gap-1 py-3"
      @click="handleAction(action.path)"
    >
      <component :is="action.icon" class="h-5 w-5" />
      <span class="text-xs">{{ action.label }}</span>
    </Button>
  </div>
</template>
