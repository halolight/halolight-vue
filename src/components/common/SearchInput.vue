<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string>('modelValue', {
  default: '',
})

const props = defineProps<{
  class?: HTMLAttributes['class']
  placeholder?: string
  showIcon?: boolean
}>()

function clearSearch() {
  modelValue.value = ''
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  modelValue.value = target.value
}
</script>

<template>
  <div :class="cn('relative', props.class)">
    <Search
      v-if="props.showIcon !== false"
      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
    />
    <input
      v-bind="$attrs"
      :value="modelValue"
      :placeholder="placeholder"
      :class="cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        props.showIcon !== false ? 'pl-10' : 'pl-3',
        modelValue ? 'pr-9' : 'pr-3'
      )"
      @input="onInput"
    />
    <Button
      v-if="modelValue"
      variant="ghost"
      size="icon"
      class="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
      @click="clearSearch"
    >
      <X class="h-4 w-4" />
    </Button>
  </div>
</template>
