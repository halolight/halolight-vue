<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<AvatarImageProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarImage :class="cn('aspect-square h-full w-full', props.class)" v-bind="props" />
</template>
