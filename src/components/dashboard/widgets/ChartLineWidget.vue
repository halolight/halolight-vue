<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'

import { useChartTheme } from '@/composables/useChartTheme'
import { useDashboardVisits } from '@/composables/useDashboardData'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const { data, isLoading } = useDashboardVisits()
const { chartColors, textColor, mutedColor, borderColor, updateKey } = useChartTheme()

const chartOption = computed(() => {
  void updateKey.value // Dependency for theme changes
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: borderColor.value,
      textStyle: { color: textColor.value },
    },
    legend: {
      data: ['访问量', '页面浏览'],
      bottom: 0,
      textStyle: { color: mutedColor.value },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.value?.map((d) => d.date?.slice(5) ?? '') ?? [],
      axisLine: { lineStyle: { color: borderColor.value } },
      axisLabel: { color: mutedColor.value },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: borderColor.value } },
      axisLabel: { color: mutedColor.value },
      splitLine: { lineStyle: { color: borderColor.value, type: 'dashed' } },
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        color: chartColors.value[0],
        areaStyle: { opacity: 0.3, color: chartColors.value[0] },
        data: data.value?.map((d) => d.visits) ?? [],
      },
      {
        name: '页面浏览',
        type: 'line',
        smooth: true,
        color: chartColors.value[1],
        areaStyle: { opacity: 0.3, color: chartColors.value[1] },
        data: data.value?.map((d) => d.pageViews) ?? [],
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
