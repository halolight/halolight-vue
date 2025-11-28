<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { ArrowUpRight, BarChart3, Flame, MonitorSmartphone, ShieldCheck, Users, Zap } from 'lucide-vue-next'

import { fetchDashboardSummary } from '@/api/dashboard'

const { data, isLoading } = useQuery({
  queryKey: ['dashboard-summary'],
  queryFn: fetchDashboardSummary,
})

const statCards = [
  {
    title: 'MRR (本月)',
    value: '¥186k',
    change: '+18.6%',
    icon: BarChart3,
    highlight: '较上月提升',
  },
  {
    title: '活跃用户',
    value: '12,840',
    change: '+4.2%',
    icon: Users,
    highlight: '新增 512 人',
  },
  {
    title: '系统可用性',
    value: '99.97%',
    change: '+0.02%',
    icon: ShieldCheck,
    highlight: 'SLA 保障',
  },
  {
    title: '响应时间',
    value: '182ms',
    change: '-6.1%',
    icon: Zap,
    highlight: '延迟持续下降',
  },
]

const projects = [
  { name: '可拖拽仪表盘', owner: '陈晓', progress: '82%', status: '进行中' },
  { name: '权限策略中心', owner: '李雷', progress: '64%', status: '设计中' },
  { name: 'WebSocket 推送', owner: '王宇', progress: '100%', status: '已上线' },
]

const nextActions = [
  { title: '启用 Mock 数据', hint: '在 .env 设置 VITE_USE_MOCK=true', tone: 'ghost' },
  { title: '接入真实 API', hint: '更新 src/api/client.ts baseURL', tone: 'ghost' },
  { title: '扩展业务页面', hint: '在 src/router 中添加 routes', tone: 'primary' },
]
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Analytics</div>
      <h1 class="page-title">运营总览 · Vue 版</h1>
      <p class="muted">
        来自 Next.js Halolight 的布局与数据流已迁移至 Vue：Pinia 状态、Vue Query、路由守卫与主题切换开箱即用。
      </p>
    </div>
    <div class="page-actions">
      <button class="btn">
        <ArrowUpRight :size="16" /> 预览线上版
      </button>
      <button class="btn primary">
        <Flame :size="16" /> 新建仪表盘
      </button>
    </div>
  </div>

  <section class="grid stats-grid">
    <article v-for="card in statCards" :key="card.title" class="card stat-card">
      <div class="stat-top">
        <div class="pill" style="display: inline-flex; align-items: center; gap: 6px">
          <component :is="card.icon" :size="16" />
          {{ card.title }}
        </div>
        <span class="stat-change">{{ card.change }}</span>
      </div>
      <div class="stat-value">{{ card.value }}</div>
      <div class="muted">{{ card.highlight }}</div>
    </article>
  </section>

  <section class="grid two-col" style="margin-top: 14px">
    <article class="card">
      <header class="stat-top" style="margin-bottom: 8px">
        <div class="pill" style="gap: 6px; display: inline-flex; align-items: center">
          <MonitorSmartphone :size="16" /> 实时概览
        </div>
        <span class="muted">{{ isLoading ? '同步数据...' : '最新数据' }}</span>
      </header>

      <div class="grid" style="gap: 10px; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))">
        <div class="card" style="background: var(--panel); box-shadow: none">
          <div class="muted">MRR</div>
          <div class="stat-value">¥{{ data?.revenue?.toLocaleString() ?? '—' }}</div>
          <div class="muted">含所有渠道</div>
        </div>
        <div class="card" style="background: var(--panel); box-shadow: none">
          <div class="muted">活跃用户</div>
          <div class="stat-value">{{ data?.activeUsers?.toLocaleString() ?? '—' }}</div>
          <div class="muted">近 30 天</div>
        </div>
        <div class="card" style="background: var(--panel); box-shadow: none">
          <div class="muted">可用性</div>
          <div class="stat-value">{{ data?.uptime ?? '—' }}%</div>
          <div class="muted">SLA 保障</div>
        </div>
        <div class="card" style="background: var(--panel); box-shadow: none">
          <div class="muted">工单</div>
          <div class="stat-value">{{ data?.tickets ?? '—' }}</div>
          <div class="muted">处理中</div>
        </div>
      </div>
    </article>

    <article class="card">
      <header class="stat-top" style="margin-bottom: 6px">
        <div class="pill" style="gap: 6px; display: inline-flex; align-items: center">
          <Flame :size="16" /> 最新动态
        </div>
        <span class="muted">自动同步自 Vue Query</span>
      </header>

      <div class="list">
        <div v-for="item in data?.activity" :key="item.id" class="list-item">
          <div>
            <div style="font-weight: 700">{{ item.title }}</div>
            <div class="muted">{{ item.user }} · {{ item.time }}</div>
          </div>
          <span class="pill">{{ item.status }}</span>
        </div>
      </div>
    </article>
  </section>

  <section class="grid two-col" style="margin-top: 14px">
    <article class="card">
      <header class="stat-top" style="margin-bottom: 6px">
        <div class="pill" style="gap: 6px; display: inline-flex; align-items: center">
          <ShieldCheck :size="16" /> 当前项目
        </div>
        <span class="muted">与 Next.js 版进度保持一致</span>
      </header>
      <div class="list">
        <div v-for="project in projects" :key="project.name" class="list-item">
          <div>
            <div style="font-weight: 700">{{ project.name }}</div>
            <div class="muted">负责人：{{ project.owner }}</div>
          </div>
          <div style="text-align: right">
            <div class="pill">{{ project.status }}</div>
            <div class="muted">进度：{{ project.progress }}</div>
          </div>
        </div>
      </div>
    </article>

    <article class="card quick-actions">
      <header class="stat-top" style="margin-bottom: 8px">
        <div class="pill" style="gap: 6px; display: inline-flex; align-items: center">
          <Zap :size="16" /> 下一步
        </div>
        <span class="muted">迁移路线图</span>
      </header>
      <div class="list">
        <div v-for="action in nextActions" :key="action.title" class="list-item">
          <div>
            <div style="font-weight: 700">{{ action.title }}</div>
            <div class="muted">{{ action.hint }}</div>
          </div>
          <button class="btn" :class="action.tone">执行</button>
        </div>
      </div>
    </article>
  </section>
</template>
