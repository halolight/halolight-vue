<script setup lang="ts">
import type { ComboboxEmptyProps } from 'reka-ui'
import { ComboboxEmpty } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ComboboxEmpty :class="cn('py-6 text-center text-sm text-muted-foreground', props.class)">
    <slot>
      暂无结果
    </slot>
  </ComboboxEmpty>
</template>
