<script setup lang="ts">
import {
  Chrome,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { config } from '@/config'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// 从环境变量读取演示账号
const demoEmail = config.demoEmail
const demoPassword = config.demoPassword
const showDemoHint = config.showDemoHint

const formData = reactive({
  email: '',
  password: '',
  remember: false,
})
const showPassword = ref(false)
const localError = ref('')

function fillDemoCredentials() {
  formData.email = demoEmail
  formData.password = demoPassword
  console.log('使用演示账号登录')
}

async function handleSubmit() {
  localError.value = ''

  if (!formData.email || !formData.password) {
    localError.value = '请填写邮箱和密码'
    return
  }

  try {
    await auth.login({ email: formData.email, password: formData.password })
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch {
    // 错误已在 store 中处理
  }
}

const SOCIAL_LINKS = {
  github: 'https://github.com/halolight/halolight-vue',
  google: 'https://halolight-docs.h7ml.cn',
  wechat: 'https://github.com/halolight',
}

const socialProviders = [
  { icon: Github, name: 'github', label: 'GitHub' },
  { icon: Chrome, name: 'google', label: 'Google' },
  { icon: MessageCircle, name: 'wechat', label: '微信' },
]
</script>

<template>
  <div class="w-full max-w-md animate-fade-in-up">
    <!-- 移动端 Logo -->
    <div class="mb-5 lg:hidden text-center animate-fade-in-down">
      <div class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
        <Sparkles class="h-6 w-6 text-white" />
        <span class="text-xl font-bold text-white">Admin Pro</span>
      </div>
      <p class="text-sm text-muted-foreground">欢迎回来，请登录您的账户</p>
    </div>

    <Card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
      <!-- 顶部渐变条 -->
      <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
        <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          登录账户
        </CardTitle>
        <CardDescription class="text-xs sm:text-sm mt-2">
          输入您的邮箱和密码登录
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-3 sm:space-y-4 px-4 sm:px-6">
        <!-- 社交登录按钮 -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <a
            v-for="provider in socialProviders"
            :key="provider.name"
            :href="SOCIAL_LINKS[provider.name as keyof typeof SOCIAL_LINKS]"
            target="_blank"
            rel="noopener noreferrer"
            class="h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group inline-flex items-center justify-center border rounded-lg"
          >
            <component :is="provider.icon" class="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        <!-- 分隔线 -->
        <div class="relative py-3">
          <div class="absolute inset-0 flex items-center">
            <Separator class="w-full" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-3 text-muted-foreground font-medium">
              或使用邮箱登录
            </span>
          </div>
        </div>

        <!-- 登录表单 -->
        <form class="space-y-3 sm:space-y-4" @submit.prevent="handleSubmit">
          <!-- 错误提示 -->
          <div
            v-if="auth.error || localError"
            class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake"
          >
            {{ auth.error || localError }}
          </div>

          <!-- 邮箱 -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground">邮箱地址</label>
            <div class="relative group">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                v-model="formData.email"
                type="email"
                placeholder="your@email.h7ml.cn"
                class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
              />
            </div>
          </div>

          <!-- 密码 -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground">密码</label>
            <div class="relative group">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- 记住我 & 忘记密码 -->
          <div class="flex items-center justify-between text-xs sm:text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                v-model:checked="formData.remember"
                class="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span class="text-muted-foreground group-hover:text-foreground transition-colors">记住我</span>
            </label>
            <RouterLink
              to="/forgot-password"
              class="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              忘记密码？
            </RouterLink>
          </div>

          <!-- 测试账号按钮 -->
          <div v-if="showDemoHint" class="flex items-center gap-2 py-2">
            <div class="flex-1 h-px bg-border/50" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              class="h-7 px-3 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
              @click="fillDemoCredentials"
            >
              <User class="h-3 w-3 mr-1.5" />
              测试账号
            </Button>
            <div class="flex-1 h-px bg-border/50" />
          </div>

          <!-- 登录按钮 -->
          <Button
            type="submit"
            class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            :disabled="auth.loading"
          >
            <template v-if="auth.loading">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              登录中...
            </template>
            <template v-else>
              登录
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
        <p class="text-xs sm:text-sm text-muted-foreground text-center">
          还没有账户？
          <RouterLink to="/register" class="text-primary hover:text-primary/80 font-semibold transition-colors">
            立即注册
          </RouterLink>
        </p>
        <p class="text-xs sm:text-sm text-muted-foreground/70 text-center leading-relaxed">
          阅读我们的
          <RouterLink to="/terms" class="text-primary hover:text-primary/80 font-semibold transition-colors">
            服务条款
          </RouterLink>
          和
          <RouterLink to="/privacy" class="text-primary hover:text-primary/80 font-semibold transition-colors">
            隐私政策
          </RouterLink>
          了解更多信息。
        </p>
      </CardFooter>
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
