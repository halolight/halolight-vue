<script setup lang="ts">
import { CalendarClock, Mail, ShieldCheck, User } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const userId = computed(() => route.params.id as string)
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <User class="h-5 w-5 text-primary" />
          基础资料
        </CardTitle>
        <CardDescription>三级路由：/users/{{ userId }}/profile</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3 text-sm">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">用户名</span>
          <span class="font-medium">user_{{ userId }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Mail class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">邮箱</span>
          <span class="font-medium">user{{ userId }}@example.com</span>
        </div>
        <div class="flex items-center gap-2">
          <CalendarClock class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">加入时间</span>
          <span class="font-medium">2024-01-01</span>
        </div>
        <div class="flex items-center gap-2">
          <ShieldCheck class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">角色</span>
          <Badge variant="outline">管理员</Badge>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>标签</CardTitle>
        <CardDescription>可扩展为更多用户资料字段</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-2">
        <Badge variant="secondary">多级路由</Badge>
        <Badge variant="outline">演示数据</Badge>
        <Badge>可自由替换</Badge>
      </CardContent>
    </Card>
  </div>
  <Separator class="md:col-span-2" />
</template>
