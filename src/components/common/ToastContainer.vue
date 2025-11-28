<script setup lang="ts">

import { useToast } from '@/composables/useToast'
import { cn } from '@/lib/utils'

const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-[1100] flex flex-col gap-2 w-80 max-w-[90vw]">
      <TransitionGroup name="toast-fade" tag="div" class="space-y-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="cn(
            'rounded-lg border bg-background shadow-lg p-3 text-sm',
            toast.variant === 'destructive' && 'border-destructive/60 bg-destructive/10 text-destructive'
          )"
          role="status"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="space-y-1">
              <p class="font-medium leading-tight" v-if="toast.title">{{ toast.title }}</p>
              <p class="text-muted-foreground leading-snug" v-if="toast.description">{{ toast.description }}</p>
            </div>
            <button
              class="text-muted-foreground hover:text-foreground text-xs"
              type="button"
              aria-label="关闭通知"
              @click="removeToast(toast.id)"
            >
              ✕
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
