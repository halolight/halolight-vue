<script setup lang="ts">
import { PieChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'

import { useChartTheme } from '@/composables/useChartTheme'
import { useDashboardPie } from '@/composables/useDashboardData'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const { data, isLoading } = useDashboardPie()
const { chartColors, textColor, mutedColor, borderColor, updateKey } = useChartTheme()

const chartOption = computed(() => {
  void updateKey.value // Dependency for theme changes

  // Map data with colors
  const coloredData = data.value?.map((item, index) => ({
    ...item,
    itemStyle: { color: chartColors.value[index % chartColors.value.length] },
  })) ?? []

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: borderColor.value,
      textStyle: { color: textColor.value },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: mutedColor.value },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'var(--background)',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: textColor.value,
          },
        },
        data: coloredData,
      },
    ],
  }
})
</script>

<template>
  <div class="h-full w-full min-h-[200px]">
    <div v-if="isLoading" class="h-full flex items-center justify-center text-muted-foreground">
      加载中...
    </div>
    <VChart v-else :key="updateKey" :option="chartOption" autoresize class="h-full w-full" />
  </div>
</template>
