<script setup lang="ts">
import { ArrowLeft, Shield, UserCog } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const route = useRoute()
const router = useRouter()

const userId = computed(() => route.params.id as string)

const tabs = computed(() => [
  {
    label: '资料',
    to: { name: 'user-profile', params: { id: userId.value } },
  },
  {
    label: '安全',
    to: { name: 'user-security', params: { id: userId.value } },
  },
])

function goBack() {
  router.push({ name: 'users' })
}
</script>

<template>
  <Card class="border-dashed">
    <CardHeader class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <UserCog class="h-4 w-4" />
          用户详情
        </div>
        <div class="flex items-center gap-3">
          <CardTitle class="text-2xl font-semibold">ID: {{ userId }}</CardTitle>
          <Badge variant="secondary" class="gap-1">
            <Shield class="h-3 w-3" />
            多级路由示例
          </Badge>
        </div>
        <CardDescription>这是二级（/users/:id）承载组件，下面的标签页是三级路由。</CardDescription>
      </div>
      <Button variant="outline" size="sm" class="shrink-0" @click="goBack">
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回列表
      </Button>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.label"
          :to="tab.to"
          class="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition"
          :class="cn(
            route.name === (tab.to as any).name
              ? 'border-primary/50 bg-primary/5 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
          )"
        >
          {{ tab.label }}
        </RouterLink>
      </div>

      <Separator />

      <RouterView />
    </CardContent>
  </Card>
</template>
