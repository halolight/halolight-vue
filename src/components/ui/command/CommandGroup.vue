<script setup lang="ts">
import type { ComboboxGroupProps, ComboboxLabelProps } from 'reka-ui'
import { ComboboxGroup, ComboboxLabel, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

interface Props extends ComboboxGroupProps {
  class?: HTMLAttributes['class']
  heading?: string
  labelClass?: HTMLAttributes['class']
  labelProps?: ComboboxLabelProps
}

const props = withDefaults(defineProps<Props>(), {
  heading: undefined,
  labelProps: undefined,
})

const forwarded = useForwardProps(props)
</script>

<template>
  <ComboboxGroup
    v-bind="forwarded"
    :class="cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      props.class
    )"
  >
    <ComboboxLabel
      v-if="heading"
      v-bind="props.labelProps"
      :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.labelClass)"
    >
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>
