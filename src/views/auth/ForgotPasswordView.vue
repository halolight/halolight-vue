<script setup lang="ts">
import { ArrowLeft, CheckCircle2, Loader2, Mail, Sparkles } from 'lucide-vue-next'
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const email = ref('')
const loading = ref(false)
const error = ref('')
const isSubmitted = ref(false)

async function handleSubmit() {
  error.value = ''

  if (!email.value.trim()) {
    error.value = '请输入您的邮箱地址'
    return
  }

  // 简单邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = '请输入有效的邮箱地址'
    return
  }

  loading.value = true
  try {
    // 模拟发送重置邮件
    await new Promise((resolve) => setTimeout(resolve, 1500))
    isSubmitted.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : '发送失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function handleResend() {
  isSubmitted.value = false
  handleSubmit()
}
</script>

<template>
  <div class="w-full max-w-md animate-fade-in-up">
    <!-- 移动端 Logo -->
    <div class="mb-5 lg:hidden text-center animate-fade-in-down">
      <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
        <Sparkles class="h-6 w-6 text-white" />
        <span class="text-xl font-bold text-white">Admin Pro</span>
      </div>
      <p class="text-sm text-muted-foreground">重置您的密码</p>
    </div>

    <Card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
      <!-- 顶部渐变条 -->
      <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      <!-- 成功状态 -->
      <template v-if="isSubmitted">
        <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-6 sm:pt-8">
          <div class="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 animate-bounce-in">
            <CheckCircle2 class="h-8 w-8 text-green-500" />
          </div>
          <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            邮件已发送
          </CardTitle>
          <CardDescription class="text-xs sm:text-sm mt-2">
            我们已向您的邮箱发送了密码重置链接
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4 px-4 sm:px-6">
          <div class="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p class="text-sm text-center text-muted-foreground">
              请检查您的邮箱 <span class="font-medium text-foreground">{{ email }}</span>
            </p>
            <p class="text-xs text-center text-muted-foreground mt-2">
              如果几分钟内未收到邮件，请检查垃圾邮件文件夹
            </p>
          </div>

          <Button
            variant="outline"
            class="w-full h-12 rounded-xl border-border/50"
            @click="handleResend"
          >
            重新发送邮件
          </Button>
        </CardContent>

        <CardFooter class="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
          <div class="relative w-full">
            <div class="absolute inset-0 flex items-center">
              <Separator class="w-full" />
            </div>
          </div>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            返回登录
          </RouterLink>
        </CardFooter>
      </template>

      <!-- 表单状态 -->
      <template v-else>
        <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
          <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            忘记密码
          </CardTitle>
          <CardDescription class="text-xs sm:text-sm mt-2">
            输入您的邮箱，我们将发送重置链接
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- 错误提示 -->
            <div
              v-if="error"
              class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake"
            >
              {{ error }}
            </div>

            <!-- 邮箱 -->
            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground">邮箱地址</label>
              <div class="relative group">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input
                  v-model="email"
                  type="email"
                  placeholder="your@email.com"
                  class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                />
              </div>
            </div>

            <!-- 提交按钮 -->
            <Button
              type="submit"
              class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              :disabled="loading"
            >
              <template v-if="loading">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                发送中...
              </template>
              <template v-else>
                发送重置链接
                <span class="ml-2 animate-arrow">→</span>
              </template>
            </Button>
          </form>
        </CardContent>

        <CardFooter class="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
          <div class="relative w-full">
            <div class="absolute inset-0 flex items-center">
              <Separator class="w-full" />
            </div>
          </div>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            返回登录
          </RouterLink>
        </CardFooter>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

@keyframes fade-in-up {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.5s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes fade-in-down {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-arrow {
  display: inline-block;
  animation: arrow-move 1.5s ease-in-out infinite;
}

@keyframes arrow-move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}
</style>
