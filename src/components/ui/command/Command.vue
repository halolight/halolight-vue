<script setup lang="ts">
import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { ComboboxRoot, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

interface Props extends ComboboxRootProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  open: true,                    // 默认展开列表
  modelValue: '',                // 默认空值
  filterFunction: () => true,    // 禁用内置过滤，使用自定义过滤
})

const emits = defineEmits<ComboboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    :class="cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      props.class
    )"
  >
    <slot />
  </ComboboxRoot>
</template>
