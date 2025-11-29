<script setup lang="ts">
import type { ComboboxSeparatorProps } from 'reka-ui'
import { ComboboxSeparator, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<ComboboxSeparatorProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ComboboxSeparator
    v-bind="forwarded"
    :class="cn('-mx-1 h-px bg-border', props.class)"
  />
</template>
