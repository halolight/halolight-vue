<script setup lang="ts">
import {
  Check,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-vue-next'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

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

const router = useRouter()

// 读取注册开关环境变量，默认关闭
const registrationEnabled = import.meta.env.VITE_ENABLE_REGISTRATION === 'true'

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

// 密码强度规则
const passwordRules = computed(() => [
  { label: '至少 8 个字符', valid: formData.password.length >= 8 },
  { label: '包含大写字母', valid: /[A-Z]/.test(formData.password) },
  { label: '包含小写字母', valid: /[a-z]/.test(formData.password) },
  { label: '包含数字', valid: /\d/.test(formData.password) },
  { label: '包含特殊字符', valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
])

const passwordStrength = computed(() => {
  const validCount = passwordRules.value.filter((r) => r.valid).length
  if (validCount <= 1) return { level: 0, label: '弱', color: 'bg-destructive' }
  if (validCount <= 2) return { level: 1, label: '弱', color: 'bg-destructive' }
  if (validCount <= 3) return { level: 2, label: '中等', color: 'bg-yellow-500' }
  if (validCount <= 4) return { level: 3, label: '强', color: 'bg-green-500' }
  return { level: 4, label: '非常强', color: 'bg-green-600' }
})

const isFormValid = computed(() => {
  return (
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    formData.agreeTerms
  )
})

async function handleSubmit() {
  error.value = ''

  if (!formData.name.trim()) {
    error.value = '请输入您的姓名'
    return
  }
  if (!formData.email.trim()) {
    error.value = '请输入邮箱地址'
    return
  }
  if (formData.password.length < 8) {
    error.value = '密码至少需要 8 个字符'
    return
  }
  if (formData.password !== formData.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  if (!formData.agreeTerms) {
    error.value = '请阅读并同意服务条款和隐私政策'
    return
  }

  loading.value = true
  try {
    // 模拟注册请求
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // 注册成功后跳转登录页
    router.push('/login?registered=1')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function handleSocialLogin(provider: string) {
  console.log(`使用 ${provider} 注册`)
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
      <p class="text-sm text-muted-foreground">创建您的账户，开始使用</p>
    </div>

    <Card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
      <!-- 顶部渐变条 -->
      <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
        <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          创建账户
        </CardTitle>
        <CardDescription class="text-xs sm:text-sm mt-2">
          填写以下信息注册新账户
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-3 sm:space-y-4 px-4 sm:px-6">
        <!-- 注册已关闭状态 -->
        <div v-if="!registrationEnabled" class="space-y-6 py-6 animate-fade-in">
          <!-- 主要图标和标题 -->
          <div class="flex flex-col items-center justify-center space-y-4">
            <div class="relative">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                <Lock class="h-10 w-10 text-amber-600 dark:text-amber-500" />
              </div>
              <div class="absolute -inset-2 rounded-full border-2 border-dashed border-amber-300/50 dark:border-amber-700/50 animate-spin-slow" />
            </div>

            <div class="space-y-2 text-center">
              <h3 class="text-xl font-semibold text-foreground sm:text-2xl">
                注册已关闭
              </h3>
              <p class="max-w-sm text-sm text-muted-foreground">
                系统管理员已暂时关闭新用户注册功能
              </p>
            </div>
          </div>

          <!-- 信息卡片 -->
          <div class="space-y-3">
            <div class="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-muted/80">
              <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium text-foreground">联系管理员</p>
                <p class="text-xs text-muted-foreground">
                  如需创建账号，请通过邮件联系系统管理员
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-muted/80">
              <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Phone class="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium text-foreground">已有账号？</p>
                <p class="text-xs text-muted-foreground">
                  如果您已有账号，请直接登录使用系统功能
                </p>
              </div>
            </div>
          </div>

          <!-- 装饰性分隔线 -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border/50" />
            </div>
            <div class="relative flex justify-center">
              <span class="bg-card px-4 text-xs text-muted-foreground">
                感谢您的理解
              </span>
            </div>
          </div>
        </div>

        <!-- 社交登录按钮（开启状态） -->
        <div v-if="registrationEnabled" class="grid grid-cols-3 gap-2 sm:gap-3">
          <Button
            v-for="provider in socialProviders"
            :key="provider.name"
            variant="outline"
            class="h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
            @click="handleSocialLogin(provider.name)"
          >
            <component :is="provider.icon" class="h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <!-- 分隔线 -->
        <div v-if="registrationEnabled" class="relative py-3">
          <div class="absolute inset-0 flex items-center">
            <Separator class="w-full" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-3 text-muted-foreground font-medium">
              或使用邮箱注册
            </span>
          </div>
        </div>

        <!-- 注册表单 -->
        <form v-if="registrationEnabled" class="space-y-3 sm:space-y-4" @submit.prevent="handleSubmit">
          <!-- 错误提示 -->
          <div
            v-if="error"
            class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake"
          >
            {{ error }}
          </div>

          <!-- 姓名 -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground">姓名</label>
            <div class="relative group">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                v-model="formData.name"
                type="text"
                placeholder="您的姓名"
                class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
              />
            </div>
          </div>

          <!-- 邮箱 -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground">邮箱地址</label>
            <div class="relative group">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                v-model="formData.email"
                type="email"
                placeholder="your@email.com"
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

            <!-- 密码强度指示器 -->
            <div v-if="formData.password" class="space-y-2 animate-fade-in">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1.5 flex-1 rounded-full transition-colors duration-300"
                  :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-muted'"
                />
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-muted-foreground">密码强度</span>
                <span
                  class="text-xs font-medium"
                  :class="{
                    'text-destructive': passwordStrength.level <= 1,
                    'text-yellow-500': passwordStrength.level === 2,
                    'text-green-500': passwordStrength.level >= 3,
                  }"
                >
                  {{ passwordStrength.label }}
                </span>
              </div>
              <!-- 密码规则列表 -->
              <div class="grid grid-cols-2 gap-1 text-xs">
                <div
                  v-for="rule in passwordRules"
                  :key="rule.label"
                  class="flex items-center gap-1.5 transition-colors"
                  :class="rule.valid ? 'text-green-500' : 'text-muted-foreground'"
                >
                  <Check v-if="rule.valid" class="h-3 w-3" />
                  <X v-else class="h-3 w-3" />
                  <span>{{ rule.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 确认密码 -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground">确认密码</label>
            <div class="relative group">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <EyeOff v-if="showConfirmPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
            <!-- 密码匹配提示 -->
            <p
              v-if="formData.confirmPassword && formData.password !== formData.confirmPassword"
              class="text-xs text-destructive"
            >
              两次输入的密码不一致
            </p>
          </div>

          <!-- 同意条款 -->
          <div class="flex items-start gap-3 py-2">
            <Checkbox
              v-model:checked="formData.agreeTerms"
              class="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label class="text-xs sm:text-sm text-muted-foreground leading-relaxed cursor-pointer">
              我已阅读并同意
              <RouterLink to="/terms" class="text-primary hover:text-primary/80 font-medium">服务条款</RouterLink>
              和
              <RouterLink to="/privacy" class="text-primary hover:text-primary/80 font-medium">隐私政策</RouterLink>
            </label>
          </div>

          <!-- 注册按钮 -->
          <Button
            type="submit"
            class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            :disabled="loading || !isFormValid"
          >
            <template v-if="loading">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              注册中...
            </template>
            <template v-else>
              创建账户
              <span class="ml-2 animate-arrow">→</span>
            </template>
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
        <div v-if="registrationEnabled" class="relative w-full">
          <div class="absolute inset-0 flex items-center">
            <Separator class="w-full" />
          </div>
        </div>
        <p v-if="registrationEnabled" class="text-xs sm:text-sm text-muted-foreground text-center">
          已有账户？
          <RouterLink to="/login" class="text-primary hover:text-primary/80 font-semibold transition-colors">
            立即登录
          </RouterLink>
        </p>

        <!-- 返回登录按钮（关闭状态） -->
        <div v-if="!registrationEnabled" class="w-full space-y-3">
          <RouterLink to="/login" class="block w-full">
            <Button
              variant="default"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              <span class="hover:-translate-x-1 transition-transform">← 返回登录</span>
            </Button>
          </RouterLink>
          <p class="text-center text-xs text-muted-foreground">使用现有账号登录系统</p>
        </div>
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

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
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

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
