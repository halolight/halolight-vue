<script setup lang="ts">
import { Github, Globe, Heart, Mail } from 'lucide-vue-next'

const projectInfo = {
  name: 'Halolight Vue',
  author: 'h7ml',
  repo: 'https://github.com/halolight/halolight-vue',
  homepage: 'https://halolight-vue.h7ml.cn',
  email: 'h7ml@qq.com',
}

const currentYear = new Date().getFullYear()

const socialLinks = [
  { href: 'https://halolight.docs.h7ml.cn', icon: Globe, label: '在线文档' },
  { href: projectInfo.repo, icon: Github, label: 'GitHub' },
  { href: `mailto:${projectInfo.email}`, icon: Mail, label: '邮箱' },
]
</script>

<template>
  <footer class="border-t border-border/50 bg-background/80 backdrop-blur-sm">
    <div class="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6 sm:py-4">
      <!-- 移动端：紧凑两行布局 -->
      <div class="flex flex-col gap-2 text-xs text-muted-foreground sm:hidden">
        <div class="flex items-center justify-between">
          <span>© {{ currentYear }} {{ projectInfo.name }}</span>
          <div class="flex items-center gap-1.5">
            <a
              v-for="link in socialLinks"
              :key="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-primary"
              :title="link.label"
            >
              <component :is="link.icon" class="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Made with</span>
            <Heart class="h-3 w-3 text-red-500 fill-red-500" />
            <span>by</span>
            <a
              :href="`https://github.com/${projectInfo.author}`"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-primary"
            >
              {{ projectInfo.author }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <RouterLink to="/privacy" class="hover:text-primary transition-colors">
              隐私
            </RouterLink>
            <RouterLink to="/terms" class="hover:text-primary transition-colors">
              条款
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- 桌面端：一行布局 -->
      <div class="hidden sm:flex flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <!-- Copyright -->
        <span>© {{ currentYear }} {{ projectInfo.name }}</span>

        <!-- Social Links -->
        <div class="flex items-center gap-2">
          <a
            v-for="link in socialLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary hover:bg-primary/5"
            :title="link.label"
          >
            <component :is="link.icon" class="h-4 w-4" />
          </a>
        </div>

        <!-- Author -->
        <div class="flex items-center gap-1">
          <span>Made with</span>
          <Heart class="h-3.5 w-3.5 text-red-500 fill-red-500" />
          <span>by</span>
          <a
            :href="`https://github.com/${projectInfo.author}`"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-primary hover:underline"
          >
            {{ projectInfo.author }}
          </a>
        </div>

        <!-- Legal Links -->
        <div class="flex items-center gap-3 text-xs">
          <RouterLink to="/privacy" class="hover:text-primary transition-colors">
            隐私政策
          </RouterLink>
          <RouterLink to="/terms" class="hover:text-primary transition-colors">
            服务条款
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
