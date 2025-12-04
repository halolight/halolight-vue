<script setup lang="ts">
import AuthShell from '@/components/auth/AuthShell.vue'
</script>

<template>
  <AuthShell right-padding-class="p-3 sm:p-4 lg:px-10 lg:py-6">
    <RouterView />
  </AuthShell>
</template>
