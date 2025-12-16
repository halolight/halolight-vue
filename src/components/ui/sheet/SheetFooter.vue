<script setup lang="ts">
import { computed,type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <div
    :class="cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </div>
</template>
