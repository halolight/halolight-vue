<script setup lang="ts">
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { computed, onMounted, reactive, ref } from 'vue'
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
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const router = useRouter()
const route = useRoute()

const formData = reactive({
  password: '',
  confirmPassword: '',
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const isSuccess = ref(false)
const isValidToken = ref(true)
const isCheckingToken = ref(true)

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
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword
  )
})

onMounted(async () => {
  // 验证 token
  const token = route.query.token as string
  if (!token) {
    isValidToken.value = false
    isCheckingToken.value = false
    return
  }

  // 模拟验证 token
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // 假设 token 有效
  isCheckingToken.value = false
})

async function handleSubmit() {
  error.value = ''

  if (formData.password.length < 8) {
    error.value = '密码至少需要 8 个字符'
    return
  }
  if (formData.password !== formData.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  try {
    // 模拟重置密码
    await new Promise((resolve) => setTimeout(resolve, 1500))
    isSuccess.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : '重置失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
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
      <p class="text-sm text-muted-foreground">设置新密码</p>
    </div>

    <Card class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
      <!-- 顶部渐变条 -->
      <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      <!-- 验证 Token 中 -->
      <template v-if="isCheckingToken">
        <CardHeader class="space-y-1 text-center py-12">
          <Loader2 class="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <CardTitle class="text-xl font-medium text-muted-foreground">
            验证链接中...
          </CardTitle>
        </CardHeader>
      </template>

      <!-- Token 无效 -->
      <template v-else-if="!isValidToken">
        <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-6 sm:pt-8">
          <div class="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 animate-bounce-in">
            <AlertCircle class="h-8 w-8 text-destructive" />
          </div>
          <CardTitle class="text-2xl sm:text-3xl font-bold text-destructive">
            链接无效
          </CardTitle>
          <CardDescription class="text-xs sm:text-sm mt-2">
            该重置链接已过期或无效
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4 px-4 sm:px-6">
          <div class="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p class="text-sm text-center text-muted-foreground">
              请重新申请密码重置链接
            </p>
          </div>

          <Button
            class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            @click="router.push('/forgot-password')"
          >
            重新申请重置链接
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

      <!-- 成功状态 -->
      <template v-else-if="isSuccess">
        <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-6 sm:pt-8">
          <div class="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 animate-bounce-in">
            <CheckCircle2 class="h-8 w-8 text-green-500" />
          </div>
          <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            密码已重置
          </CardTitle>
          <CardDescription class="text-xs sm:text-sm mt-2">
            您的密码已成功更新
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4 px-4 sm:px-6">
          <div class="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p class="text-sm text-center text-muted-foreground">
              现在您可以使用新密码登录账户
            </p>
          </div>

          <Button
            class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            @click="goToLogin"
          >
            立即登录
            <span class="ml-2 animate-arrow">→</span>
          </Button>
        </CardContent>

        <CardFooter class="px-4 sm:px-6 pb-5 sm:pb-8 pt-2" />
      </template>

      <!-- 表单状态 -->
      <template v-else>
        <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
          <CardTitle class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            设置新密码
          </CardTitle>
          <CardDescription class="text-xs sm:text-sm mt-2">
            请输入您的新密码
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

            <!-- 新密码 -->
            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground">新密码</label>
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
              <label class="text-xs font-medium text-muted-foreground">确认新密码</label>
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

            <!-- 提交按钮 -->
            <Button
              type="submit"
              class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              :disabled="loading || !isFormValid"
            >
              <template v-if="loading">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                重置中...
              </template>
              <template v-else>
                重置密码
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
