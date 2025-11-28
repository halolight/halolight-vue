<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string | number | null>('modelValue', {
  default: null,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  modelValue.value = target.value
}
</script>

<template>
  <input
    v-bind="$attrs"
    :value="modelValue ?? ''"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
    @input="onInput"
  />
</template>
