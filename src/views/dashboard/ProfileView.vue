<script setup lang="ts">
import {
  Bell,
  Building,
  Camera,
  Key,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-vue-next'
import { reactive, ref } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const isLoading = ref(false)

const profileData = reactive({
  name: auth.user?.name || '管理员',
  email: auth.user?.email || 'admin@halolight.h7ml.cn',
  phone: '138-8888-8888',
  address: '北京市朝阳区',
  company: '科技有限公司',
  bio: '热爱技术，专注于后台管理系统开发',
})

const securitySettings = reactive({
  twoFactor: false,
  loginAlert: true,
  sessionTimeout: true,
})

const notificationSettings = reactive({
  email: true,
  push: true,
  sms: false,
  marketing: false,
})

const loginHistory = [
  { device: 'Chrome - macOS', location: '北京, 中国', time: '当前会话', current: true },
  { device: 'Safari - iOS', location: '北京, 中国', time: '2 小时前', current: false },
  { device: 'Firefox - Windows', location: '上海, 中国', time: '昨天', current: false },
]

async function handleProfileSubmit() {
  isLoading.value = true
  // 模拟保存
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isLoading.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">个人资料</h1>
    </div>

    <Tabs default-value="profile" class="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">
          <User class="mr-2 h-4 w-4" />
          基本信息
        </TabsTrigger>
        <TabsTrigger value="security">
          <Shield class="mr-2 h-4 w-4" />
          安全设置
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell class="mr-2 h-4 w-4" />
          通知偏好
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <div class="grid gap-6 md:grid-cols-3">
          <!-- 头像卡片 -->
          <Card>
            <CardHeader>
              <CardTitle>头像</CardTitle>
              <CardDescription>点击上传新头像</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col items-center gap-4">
              <div class="relative cursor-pointer group">
                <Avatar class="h-32 w-32">
                  <AvatarImage src="/avatar.png" alt="头像" />
                  <AvatarFallback class="text-3xl">
                    {{ profileData.name.charAt(0) }}
                  </AvatarFallback>
                </Avatar>
                <div class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera class="h-8 w-8 text-white" />
                </div>
              </div>
              <div class="text-center">
                <p class="font-medium">{{ profileData.name }}</p>
                <p class="text-sm text-muted-foreground">{{ profileData.email }}</p>
              </div>
              <Button variant="outline" size="sm">
                <Camera class="mr-2 h-4 w-4" />
                更换头像
              </Button>
            </CardContent>
          </Card>

          <!-- 基本信息表单 -->
          <Card class="md:col-span-2">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>更新您的个人信息</CardDescription>
            </CardHeader>
            <CardContent>
              <form class="space-y-4" @submit.prevent="handleProfileSubmit">
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="space-y-2">
                    <Label for="name">姓名</Label>
                    <div class="relative">
                      <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        v-model="profileData.name"
                        class="pl-10"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="email">邮箱</Label>
                    <div class="relative">
                      <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        v-model="profileData.email"
                        type="email"
                        class="pl-10"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="phone">电话</Label>
                    <div class="relative">
                      <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        v-model="profileData.phone"
                        class="pl-10"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="company">公司</Label>
                    <div class="relative">
                      <Building class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        v-model="profileData.company"
                        class="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="address">地址</Label>
                  <div class="relative">
                    <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      v-model="profileData.address"
                      class="pl-10"
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="bio">个人简介</Label>
                  <Textarea
                    id="bio"
                    v-model="profileData.bio"
                    :rows="3"
                  />
                </div>
                <div class="flex justify-end">
                  <Button type="submit" :disabled="isLoading">
                    <template v-if="isLoading">
                      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </template>
                    <template v-else>
                      保存更改
                    </template>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="security">
        <div class="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>密码</CardTitle>
              <CardDescription>更改您的账户密码</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid gap-4 md:grid-cols-3">
                <div class="space-y-2">
                  <Label for="current-password">当前密码</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div class="space-y-2">
                  <Label for="new-password">新密码</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div class="space-y-2">
                  <Label for="confirm-password">确认新密码</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <div class="flex justify-end">
                <Button>
                  <Key class="mr-2 h-4 w-4" />
                  更新密码
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>安全选项</CardTitle>
              <CardDescription>管理您的账户安全设置</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>双因素认证</Label>
                  <p class="text-sm text-muted-foreground">
                    启用后登录时需要额外验证
                  </p>
                </div>
                <Switch v-model:checked="securitySettings.twoFactor" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>登录提醒</Label>
                  <p class="text-sm text-muted-foreground">
                    新设备登录时发送邮件通知
                  </p>
                </div>
                <Switch v-model:checked="securitySettings.loginAlert" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>会话超时</Label>
                  <p class="text-sm text-muted-foreground">
                    30分钟无操作自动退出登录
                  </p>
                </div>
                <Switch v-model:checked="securitySettings.sessionTimeout" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>登录历史</CardTitle>
              <CardDescription>最近的登录活动</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="(session, index) in loginHistory"
                  :key="index"
                  class="flex items-center justify-between"
                >
                  <div class="space-y-1">
                    <p class="font-medium">{{ session.device }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ session.location }} · {{ session.time }}
                    </p>
                  </div>
                  <Badge v-if="session.current" variant="secondary">当前</Badge>
                  <Button v-else variant="ghost" size="sm">
                    撤销
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>通知偏好</CardTitle>
            <CardDescription>选择您希望接收通知的方式</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>邮件通知</Label>
                <p class="text-sm text-muted-foreground">
                  通过邮件接收重要通知
                </p>
              </div>
              <Switch v-model:checked="notificationSettings.email" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>推送通知</Label>
                <p class="text-sm text-muted-foreground">
                  在浏览器中接收推送通知
                </p>
              </div>
              <Switch v-model:checked="notificationSettings.push" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>短信通知</Label>
                <p class="text-sm text-muted-foreground">
                  通过短信接收紧急通知
                </p>
              </div>
              <Switch v-model:checked="notificationSettings.sms" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>营销邮件</Label>
                <p class="text-sm text-muted-foreground">
                  接收产品更新和促销信息
                </p>
              </div>
              <Switch v-model:checked="notificationSettings.marketing" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
