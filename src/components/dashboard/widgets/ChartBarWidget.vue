<script setup lang="ts">
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'

import { useChartTheme } from '@/composables/useChartTheme'
import { useDashboardSales } from '@/composables/useDashboardData'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const { data, isLoading } = useDashboardSales()
const { chartColors, textColor, mutedColor, borderColor, updateKey } = useChartTheme()

const chartOption = computed(() => {
  void updateKey.value // Dependency for theme changes
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: borderColor.value,
      textStyle: { color: textColor.value },
    },
    legend: {
      data: ['销售额', '订单数'],
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
      data: data.value?.map((d) => d.month) ?? [],
      axisLine: { lineStyle: { color: borderColor.value } },
      axisLabel: { color: mutedColor.value },
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        nameTextStyle: { color: mutedColor.value },
        axisLine: { lineStyle: { color: borderColor.value } },
        axisLabel: { color: mutedColor.value },
        splitLine: { lineStyle: { color: borderColor.value, type: 'dashed' } },
      },
      {
        type: 'value',
        name: '订单数',
        nameTextStyle: { color: mutedColor.value },
        axisLine: { lineStyle: { color: borderColor.value } },
        axisLabel: { color: mutedColor.value },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        color: chartColors.value[0],
        data: data.value?.map((d) => d.sales) ?? [],
      },
      {
        name: '订单数',
        type: 'bar',
        yAxisIndex: 1,
        color: chartColors.value[2],
        data: data.value?.map((d) => d.orders) ?? [],
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
