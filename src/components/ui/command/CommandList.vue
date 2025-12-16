<script setup lang="ts">
import type { ComboboxContentProps } from 'reka-ui'
import { ComboboxContent, ComboboxViewport, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ComboboxContent v-bind="forwarded">
    <ComboboxViewport
      :class="cn(
        'max-h-[300px] overflow-y-auto overflow-x-hidden p-1',
        props.class
      )"
    >
      <slot />
    </ComboboxViewport>
  </ComboboxContent>
</template>
