<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="card" style="padding: 24px">
    <div class="page-eyebrow">In Progress</div>
    <h2 class="page-title" style="margin: 0 0 8px">{{ route.meta.label ?? '页面' }}</h2>
    <p class="muted">
      此页面在 Next.js 版本中已实现，Vue 迁移中。可在 `src/views` 下扩展并在 `src/router` 注册。
    </p>
  </section>
</template>
