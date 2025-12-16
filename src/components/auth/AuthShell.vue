<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

import { cn } from '@/lib/utils'

interface Props {
  showLeft?: boolean
  leftGradientClass?: string
  rightPaddingClass?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  showLeft: true,
  leftGradientClass: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700',
  rightPaddingClass: 'px-3 sm:px-5 lg:px-10 py-2 sm:py-3 lg:py-6',
})

const features = [
  { icon: '🚀', text: '快速部署，即刻启动' },
  { icon: '📊', text: '实时数据分析与可视化' },
  { icon: '🔒', text: '企业级安全保障' },
  { icon: '⚡', text: '极致性能体验' },
]
</script>

<template>
  <div class="relative min-h-screen lg:h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- 网格背景 -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

    <!-- 背景光晕 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="halo halo-1 absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-blue-400/30 to-cyan-400/30" />
      <div class="halo halo-2 absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-indigo-400/30 to-purple-400/30" />
      <div class="halo halo-3 absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-violet-400/20 to-pink-400/20" />
    </div>

    <!-- 主内容区 -->
    <div :class="cn('relative flex min-h-screen lg:h-full flex-col lg:flex-row', props.class)">
      <!-- 左侧装饰区 (仅桌面端) -->
      <div
        v-if="showLeft"
        class="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slide-in-left"
      >
        <!-- 渐变背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
        <div :class="cn('absolute inset-0', leftGradientClass)" />

        <!-- 网格 -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />

        <!-- 左侧内容 -->
        <div class="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <slot name="left">
            <!-- 默认左侧内容 -->
            <div class="animate-fade-in-up">
              <!-- Logo -->
              <div class="flex items-center gap-3 mb-12 group">
                <div class="relative h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                  <Sparkles class="h-7 w-7" />
                  <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold tracking-tight">Admin Pro</h2>
                  <p class="text-xs text-white/60">企业级管理系统</p>
                </div>
              </div>

              <!-- 欢迎语 -->
              <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                欢迎回来
                <span class="inline-block ml-2 animate-wave">👋</span>
              </h1>
              <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
                登录您的账户，开始管理您的业务数据和团队协作，体验高效的工作流程。
              </p>

              <!-- 特性列表 -->
              <div class="space-y-4">
                <div
                  v-for="(item, index) in features"
                  :key="item.text"
                  class="flex items-center gap-3 group animate-fade-in-left"
                  :style="{ animationDelay: `${0.6 + index * 0.1}s` }"
                >
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {{ item.icon }}
                  </div>
                  <span class="text-white/90">{{ item.text }}</span>
                </div>
              </div>
            </div>
          </slot>
        </div>

        <!-- 浮动点 -->
        <div
          v-for="i in 6"
          :key="i"
          class="floating-dot absolute w-2 h-2 rounded-full bg-white/20"
          :style="{
            left: `${20 + (i - 1) * 15}%`,
            top: `${30 + ((i - 1) % 3) * 20}%`,
            animationDelay: `${(i - 1) * 0.5}s`,
          }"
        />
      </div>

      <!-- 右侧内容区 -->
      <div :class="cn('flex-1 flex items-center justify-center', rightPaddingClass)">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 光晕动画 */
.halo {
  animation: halo-pulse 8s ease-in-out infinite;
}

.halo-1 {
  animation-duration: 8s;
}

.halo-2 {
  animation-duration: 10s;
  animation-delay: 2s;
}

.halo-3 {
  animation-duration: 12s;
  animation-delay: 4s;
}

@keyframes halo-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

/* 浮动点动画 */
.floating-dot {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-20px);
    opacity: 0.5;
  }
}

/* 左侧滑入动画 */
.animate-slide-in-left {
  animation: slide-in-left 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 淡入上移动画 */
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

@keyframes fade-in-up {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 淡入左移动画 */
.animate-fade-in-left {
  animation: fade-in-left 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fade-in-left {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 挥手动画 */
.animate-wave {
  animation: wave 2s ease-in-out infinite;
  transform-origin: 70% 70%;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30% {
    transform: rotate(14deg);
  }
  20% {
    transform: rotate(-8deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50%, 100% {
    transform: rotate(0deg);
  }
}
</style>
