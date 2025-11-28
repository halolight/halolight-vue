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
    :class="cn('flex flex-col space-y-2 text-center sm:text-left', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </div>
</template>
