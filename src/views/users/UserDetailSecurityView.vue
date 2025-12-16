<script setup lang="ts">
import { KeyRound, Lock, MonitorSmartphone, Shield, ShieldAlert } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const route = useRoute()
const userId = computed(() => route.params.id as string)

const mfaEnabled = ref(true)
const deviceGuard = ref(false)
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <Card>
      <CardHeader class="space-y-2">
        <CardTitle class="flex items-center gap-2">
          <Shield class="h-5 w-5 text-primary" />
          安全状态
        </CardTitle>
        <CardDescription>三级路由：/users/{{ userId }}/security</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3 text-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-muted-foreground">
            <Lock class="h-4 w-4" />
            密码强度
          </div>
          <Badge variant="secondary">强</Badge>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-muted-foreground">
            <KeyRound class="h-4 w-4" />
            最近更新
          </div>
          <span class="font-medium">7 天前</span>
        </div>
      </CardContent>
      <CardFooter class="justify-end">
        <Button variant="outline" size="sm">重置密码</Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <ShieldAlert class="h-5 w-5 text-primary" />
          风险控制
        </CardTitle>
        <CardDescription>示例开关用于演示嵌套页面交互。</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <MonitorSmartphone class="h-4 w-4 text-muted-foreground" />
            <div>
              <p class="font-medium">设备守护</p>
              <p class="text-sm text-muted-foreground">限制高风险设备登录</p>
            </div>
          </div>
          <Switch v-model:checked="deviceGuard" />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Shield class="h-4 w-4 text-muted-foreground" />
            <div>
              <p class="font-medium">多因素验证</p>
              <p class="text-sm text-muted-foreground">登录时要求二次验证</p>
            </div>
          </div>
          <Switch v-model:checked="mfaEnabled" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
