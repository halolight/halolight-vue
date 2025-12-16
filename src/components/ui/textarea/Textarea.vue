<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string | null>('modelValue', {
  default: null,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const textareaClasses = computed(() =>
  cn(
    'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    props.class
  )
)

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  modelValue.value = target.value
}
</script>

<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue ?? ''"
    :class="textareaClasses"
    @input="onInput"
  />
</template>
