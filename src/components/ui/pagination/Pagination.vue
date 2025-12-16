<script setup lang="ts">
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import { computed } from 'vue'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  page: number
  pageSize: number
  total: number
  siblingsCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  siblingsCount: 1,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const pages = computed(() => {
  const { page, siblingsCount } = props
  const total = totalPages.value
  const items: (number | 'ellipsis')[] = []

  // Always show first page
  items.push(1)

  // Calculate range around current page
  const leftSibling = Math.max(page - siblingsCount, 2)
  const rightSibling = Math.min(page + siblingsCount, total - 1)

  // Add ellipsis after first page if needed
  if (leftSibling > 2) {
    items.push('ellipsis')
  }

  // Add pages around current
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== total) {
      items.push(i)
    }
  }

  // Add ellipsis before last page if needed
  if (rightSibling < total - 1) {
    items.push('ellipsis')
  }

  // Always show last page if more than 1 page
  if (total > 1) {
    items.push(total)
  }

  return items
})

const canPrev = computed(() => props.page > 1)
const canNext = computed(() => props.page < totalPages.value)

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.page) {
    emit('update:page', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <p class="text-sm text-muted-foreground">
      共 {{ total }} 条，第 {{ page }}/{{ totalPages }} 页
    </p>
    <nav v-if="totalPages > 1" class="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="!canPrev"
        @click="goToPage(page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <template v-for="(item, index) in pages" :key="index">
        <Button
          v-if="item === 'ellipsis'"
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          disabled
        >
          <MoreHorizontal class="h-4 w-4" />
        </Button>
        <Button
          v-else
          :variant="item === page ? 'default' : 'outline'"
          size="icon"
          :class="cn('h-8 w-8', item === page && 'pointer-events-none')"
          @click="goToPage(item)"
        >
          {{ item }}
        </Button>
      </template>

      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="!canNext"
        @click="goToPage(page + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </nav>
  </div>
</template>
