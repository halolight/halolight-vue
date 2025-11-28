<script setup lang="ts">
import { Check, Monitor, Moon, RotateCcw, Sun } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { type SkinPreset, useUiSettingsStore } from '@/stores/ui-settings'

const uiSettings = useUiSettingsStore()

const themeOptions = [
  { value: 'light' as const, label: '浅色', icon: Sun },
  { value: 'dark' as const, label: '深色', icon: Moon },
  { value: 'system' as const, label: '系统', icon: Monitor },
]

const skinPresets: Array<{ id: SkinPreset; name: string; colors: string[] }> = [
  { id: 'default', name: 'Neutral', colors: ['#0f172a', '#6366f1', '#14b8a6'] },
  { id: 'blue', name: 'Blue', colors: ['#1d4ed8', '#0ea5e9', '#a855f7'] },
  { id: 'emerald', name: 'Emerald', colors: ['#047857', '#10b981', '#22c55e'] },
  { id: 'amber', name: 'Amber', colors: ['#f59e0b', '#f97316', '#fb7185'] },
  { id: 'violet', name: 'Violet', colors: ['#7c3aed', '#8b5cf6', '#06b6d4'] },
  { id: 'rose', name: 'Rose', colors: ['#e11d48', '#f43f5e', '#fb923c'] },
]

function handleThemeChange(theme: 'light' | 'dark' | 'system', event?: MouseEvent) {
  uiSettings.setThemeWithTransition(theme, event)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">系统设置</h1>
        <p class="text-muted-foreground mt-1">管理应用外观和行为</p>
      </div>
      <Button variant="outline" size="sm" @click="uiSettings.resetSettings()">
        <RotateCcw class="h-4 w-4 mr-2" />
        重置
      </Button>
    </div>

    <!-- 主题 + 皮肤 -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- 主题 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">主题模式</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in themeOptions"
              :key="opt.value"
              :class="cn(
                'flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors hover:bg-muted/50',
                uiSettings.theme === opt.value ? 'border-primary bg-primary/5' : 'border-muted'
              )"
              @click="(e) => handleThemeChange(opt.value, e)"
            >
              <component :is="opt.icon" class="h-5 w-5" />
              <span class="text-xs">{{ opt.label }}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- 皮肤 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">配色皮肤</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="skin in skinPresets"
              :key="skin.id"
              :class="cn(
                'relative rounded-lg border-2 p-2 transition hover:bg-muted/50',
                uiSettings.skin === skin.id ? 'border-primary' : 'border-muted'
              )"
              @click="uiSettings.setSkin(skin.id)"
            >
              <div class="flex gap-1 mb-1.5">
                <span
                  v-for="c in skin.colors"
                  :key="c"
                  class="h-4 w-4 rounded-sm"
                  :style="{ backgroundColor: c }"
                />
              </div>
              <span class="text-xs">{{ skin.name }}</span>
              <Check v-if="uiSettings.skin === skin.id" class="absolute top-1 right-1 h-3 w-3 text-primary" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 界面选项 -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">界面选项</CardTitle>
        <CardDescription>切换立即生效</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm">显示页脚</span>
          <Switch :checked="uiSettings.showFooter" @update:checked="uiSettings.setShowFooter" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm">多标签导航</span>
          <Switch :checked="uiSettings.showTabBar" @update:checked="uiSettings.setShowTabBar" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">移动端固定头部</span>
          <Switch :checked="uiSettings.mobileHeaderFixed" @update:checked="uiSettings.setMobileHeaderFixed" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">移动端固定标签栏</span>
          <Switch :checked="uiSettings.mobileTabBarFixed" @update:checked="uiSettings.setMobileTabBarFixed" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
