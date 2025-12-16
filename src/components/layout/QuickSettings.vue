<script setup lang="ts">
import {
  Brush,
  Check,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  Settings2,
  Smartphone,
  Sun,
  X,
} from 'lucide-vue-next'
import { computed, onMounted,ref } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { type SkinPreset,useUiSettingsStore } from '@/stores/ui-settings'

const uiSettings = useUiSettingsStore()

const open = ref(false)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const themeOptions = [
  { id: 'light' as const, label: '浅色', icon: Sun },
  { id: 'dark' as const, label: '深色', icon: Moon },
  { id: 'system' as const, label: '系统', icon: Monitor },
]

const skinPresets: Array<{
  id: SkinPreset
  name: string
  description: string
  colors: string[]
}> = [
  {
    id: 'default',
    name: 'Shadcn · Neutral',
    description: '官方默认中性色，强调对比与易读性',
    colors: ['#0f172a', '#6366f1', '#14b8a6'],
  },
  {
    id: 'blue',
    name: 'Shadcn · Blue',
    description: '蓝色主色 + Charts 默认冷色调',
    colors: ['#1d4ed8', '#0ea5e9', '#a855f7'],
  },
  {
    id: 'emerald',
    name: 'Shadcn · Emerald',
    description: '清新绿色，适合数据和成功态',
    colors: ['#047857', '#10b981', '#22c55e'],
  },
  {
    id: 'amber',
    name: 'Shadcn · Amber',
    description: '琥珀 / 橙色主色，温暖明快',
    colors: ['#f59e0b', '#f97316', '#fb7185'],
  },
  {
    id: 'violet',
    name: 'Shadcn · Violet',
    description: '紫色高饱和，科技/创意场景',
    colors: ['#7c3aed', '#8b5cf6', '#06b6d4'],
  },
  {
    id: 'rose',
    name: 'Shadcn · Rose',
    description: '玫红主色，图表撞色更活泼',
    colors: ['#e11d48', '#f43f5e', '#fb923c'],
  },
  {
    id: 'teal',
    name: 'Shadcn · Teal',
    description: '青色主色，冷静又具现代感',
    colors: ['#0d9488', '#06b6d4', '#a855f7'],
  },
  {
    id: 'slate',
    name: 'Shadcn · Slate',
    description: '低饱和灰蓝，后台/工具感',
    colors: ['#0f172a', '#475569', '#0ea5e9'],
  },
]

const currentTheme = computed(() => uiSettings.theme)

function handleThemeChange(newTheme: 'light' | 'dark' | 'system', event?: MouseEvent) {
  uiSettings.setThemeWithTransition(newTheme, event)
}

function handleSkinChange(nextSkin: SkinPreset) {
  if (uiSettings.skin === nextSkin) return
  uiSettings.setSkin(nextSkin)
}

function handleResetSettings() {
  uiSettings.resetSettings()
}

// Computed properties for Switch v-model bindings
const showFooterModel = computed({
  get: () => uiSettings.showFooter,
  set: (v: boolean) => uiSettings.setShowFooter(v),
})

const showTabBarModel = computed({
  get: () => uiSettings.showTabBar,
  set: (v: boolean) => uiSettings.setShowTabBar(v),
})

const mobileHeaderFixedModel = computed({
  get: () => uiSettings.mobileHeaderFixed,
  set: (v: boolean) => uiSettings.setMobileHeaderFixed(v),
})

const mobileTabBarFixedModel = computed({
  get: () => uiSettings.mobileTabBarFixed,
  set: (v: boolean) => uiSettings.setMobileTabBarFixed(v),
})

</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" class="relative shrink-0" aria-label="界面设置">
        <Settings2 class="h-5 w-5" />
        <Badge variant="secondary" class="pointer-events-none absolute right-1 top-1 h-4 px-1 text-[10px]">
          UI
        </Badge>
      </Button>
    </SheetTrigger>
    <SheetContent side="right" class="w-[360px] sm:max-w-[420px] p-0 [&_[data-slot=sheet-close]]:hidden">
      <SheetHeader class="sr-only">
        <SheetTitle>界面设置</SheetTitle>
        <SheetDescription>控制主题、皮肤和界面布局</SheetDescription>
      </SheetHeader>
      <div class="flex h-full min-h-0 flex-col">
        <div class="flex items-center justify-between gap-2 border-b px-4 py-3">
          <div class="flex items-center gap-2">
            <SheetClose as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <X class="h-4 w-4" />
                <span class="sr-only">关闭</span>
              </Button>
            </SheetClose>
            <div>
              <p class="text-sm font-semibold">界面设置</p>
              <p class="text-xs text-muted-foreground">主题 · 皮肤 · 布局</p>
            </div>
          </div>
        </div>
        <ScrollArea class="flex-1 min-h-0 pr-1">
          <div class="space-y-4 p-4 pb-6">
            <!-- 主题模式 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm font-medium">
                <Palette class="h-4 w-4" />
                <span>主题模式</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="option in themeOptions"
                  :key="option.id"
                  type="button"
                  :class="cn(
                    'relative flex flex-col items-start justify-center gap-1 rounded-lg border border-border/70 py-2 px-2 text-left transition hover:border-primary/60 hover:bg-primary/5',
                    mounted && currentTheme === option.id && 'border-primary/40 bg-primary/10 text-primary'
                  )"
                  @click="handleThemeChange(option.id, $event)"
                >
                  <component :is="option.icon" class="h-4 w-4" />
                  <span class="text-xs">{{ option.label }}</span>
                </button>
              </div>
            </div>

            <Separator />

            <!-- 配色皮肤 -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm font-medium">
                <Brush class="h-4 w-4" />
                <span>配色皮肤</span>
                <Badge variant="outline" class="h-5 px-1.5 text-[11px]">
                  实时预览
                </Badge>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="preset in skinPresets"
                  :key="preset.id"
                  type="button"
                  :class="cn(
                    'group relative overflow-hidden rounded-lg border p-3 text-left transition hover:border-primary/60 hover:bg-primary/5',
                    uiSettings.skin === preset.id && 'border-primary ring-1 ring-primary/50 bg-primary/5'
                  )"
                  @click="handleSkinChange(preset.id)"
                >
                  <div class="relative flex items-center justify-between text-sm font-semibold">
                    <span>{{ preset.name }}</span>
                    <Check v-if="uiSettings.skin === preset.id" class="h-4 w-4 text-primary" />
                  </div>
                  <p class="relative mt-1 text-xs text-muted-foreground line-clamp-2">
                    {{ preset.description }}
                  </p>
                  <div class="relative mt-2 flex gap-1">
                    <span
                      v-for="color in preset.colors"
                      :key="color"
                      class="h-6 w-6 rounded-md border border-border/70"
                      :style="{ backgroundColor: color }"
                    />
                  </div>
                </button>
              </div>
            </div>

            <Separator />

            <!-- 布局元素 -->
            <div class="space-y-3 pb-8">
              <div class="flex items-center gap-2 text-sm font-medium">
                <PanelsTopLeft class="h-4 w-4" />
                <span>布局元素</span>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                  <div>
                    <p class="text-sm font-medium">显示底部</p>
                    <p class="text-xs text-muted-foreground">控制页脚和快捷入口展示</p>
                  </div>
                  <Switch v-model="showFooterModel" />
                </div>
                <div class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                  <div>
                    <p class="text-sm font-medium">显示多标签</p>
                    <p class="text-xs text-muted-foreground">隐藏后不再展示顶部标签栏</p>
                  </div>
                  <Switch v-model="showTabBarModel" />
                </div>
              </div>
            </div>

            <Separator />

            <!-- 移动端行为 -->
            <div class="space-y-3 pb-8">
              <div class="flex items-center gap-2 text-sm font-medium">
                <Smartphone class="h-4 w-4" />
                <span>移动端行为</span>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                  <div>
                    <p class="text-sm font-medium">固定头部</p>
                    <p class="text-xs text-muted-foreground">滚动时保持顶部栏浮动</p>
                  </div>
                  <Switch v-model="mobileHeaderFixedModel" />
                </div>
                <div class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                  <div>
                    <p class="text-sm font-medium">固定标签栏</p>
                    <p class="text-xs text-muted-foreground">页面滚动时保持多标签栏可见</p>
                  </div>
                  <Switch v-model="mobileTabBarFixedModel" />
                </div>
              </div>
            </div>

            <Separator />

            <!-- 重置按钮 -->
            <div class="space-y-2 border-t pt-4">
              <Button variant="outline" size="sm" class="w-full" @click="handleResetSettings">
                恢复默认配置
              </Button>
              <p class="text-center text-xs text-muted-foreground">
                重置皮肤、布局与移动端行为为初始配置
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </SheetContent>
  </Sheet>
</template>
