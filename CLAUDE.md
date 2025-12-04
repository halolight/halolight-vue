# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Halolight Vue 是一个基于 Vue 3 + Vite 的现代化中文后台管理系统，使用 TypeScript、Tailwind CSS 4、shadcn-vue 和 @vueuse/motion 构建。

- **在线预览**: https://halolight-vue.h7ml.cn
- **GitHub**: https://github.com/halolight/halolight-vue

## 技术栈速览

- **核心框架**: Vue 3.5 (Script Setup) + Vite 7 (Rolldown) + TypeScript 5.9
- **路由**: Vue Router 4
- **状态管理**: Pinia 2 + pinia-plugin-persistedstate v4
- **数据请求**: TanStack Vue Query v5 + Axios
- **样式**: Tailwind CSS 4、shadcn-vue (Radix Vue / Reka UI)、lucide-vue-next
- **动画/交互**: @vueuse/motion、grid-layout-plus (可拖拽仪表盘)
- **图表**: ECharts 6 (配合 vue-echarts)
- **Mock**: Mock.js
- **构建/规范**: pnpm 10、ESLint 9 + TypeScript
- **测试**: Vitest + Vue Test Utils + Testing Library

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:5173)
pnpm build        # 生产构建
pnpm preview      # 预览构建产物
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm type-check   # TypeScript 类型检查 (vue-tsc)
pnpm test         # 运行单元测试 (watch 模式)
pnpm test:run     # 运行单元测试 (单次)
pnpm test:ui      # 运行测试并打开 UI 界面
pnpm test:coverage # 生成覆盖率报告
```

## 架构

### 应用入口 (src/main.ts)

Vue 应用通过插件链式调用初始化：

```ts
app.use(createPinia())
   .use(router)
   .use(VueQueryPlugin)
   .mount('#app')
```

### 核心目录结构

```
src/
├── api/                    # API 服务定义 (Axios 封装)
│   ├── types.ts            # API 类型定义
│   ├── mock-data.ts        # Mock 数据生成
│   ├── analytics.ts        # 分析 API
│   ├── calendar.ts         # 日历 API
│   ├── files.ts            # 文件 API
│   ├── messages.ts         # 消息 API
│   ├── security.ts         # 安全 API
│   ├── settings.ts         # 设置 API
│   └── users.ts            # 用户 API
├── assets/                 # 静态资源
├── components/
│   ├── ui/                 # shadcn-vue 基础组件
│   │   ├── avatar/
│   │   ├── badge/
│   │   ├── button/
│   │   ├── card/
│   │   ├── checkbox/
│   │   ├── dropdown-menu/
│   │   ├── input/
│   │   ├── label/
│   │   ├── scroll-area/
│   │   ├── separator/
│   │   ├── sheet/
│   │   ├── switch/
│   │   ├── tabs/
│   │   ├── textarea/
│   │   └── tooltip/
│   ├── common/             # 通用业务组件
│   │   ├── AppHeader.vue   # 顶部导航栏
│   │   ├── AppSidebar.vue  # 侧边栏
│   │   ├── AppFooter.vue   # 页脚
│   │   └── AppTabs.vue     # 多页签
│   ├── auth/               # 认证相关组件
│   │   └── AuthShell.vue   # 认证页面外壳
│   ├── layout/             # 布局辅助组件
│   └── dashboard/          # 仪表盘专用组件
│       └── widgets/        # 仪表盘部件
│           ├── StatsWidget.vue
│           ├── ChartLineWidget.vue
│           ├── ChartBarWidget.vue
│           ├── ChartPieWidget.vue
│           ├── TasksWidget.vue
│           ├── UsersWidget.vue
│           ├── NotificationsWidget.vue
│           ├── CalendarWidget.vue
│           └── WidgetCard.vue
├── composables/            # 组合式函数 (Hooks)
│   ├── useDashboardData.ts # 仪表盘数据查询
│   ├── useChartTheme.ts    # 图表主题自适应
│   └── queries/            # TanStack Query 封装
├── config/                 # 全局配置
│   ├── index.ts            # 配置导出
│   ├── env.ts              # 环境变量
│   └── menu.ts             # 菜单配置
├── layouts/                # 布局组件
│   ├── AdminLayout.vue     # 管理后台布局
│   └── AuthLayout.vue      # 认证页布局
├── lib/                    # 工具库
│   └── utils.ts            # 通用工具函数 (cn, etc.)
├── mock/                   # Mock 数据定义
│   ├── index.ts            # Mock 入口
│   └── modules/            # 按模块拆分
│       ├── analytics.ts
│       ├── calendar.ts
│       ├── dashboard.ts
│       ├── files.ts
│       ├── messages.ts
│       ├── notifications.ts
│       ├── security.ts
│       ├── settings.ts
│       └── users.ts
├── plugins/                # 插件配置
│   ├── query-client.ts     # TanStack Query 配置
│   └── mock.ts             # Mock 插件
├── router/                 # 路由配置
│   └── index.ts            # 路由定义
├── stores/                 # Pinia Stores
│   ├── auth.ts             # 认证状态
│   ├── layout.ts           # 布局状态
│   ├── navigation.ts       # 导航状态
│   ├── tabs.ts             # 多页签状态
│   └── ui-settings.ts      # UI 设置 (主题/皮肤)
├── types/                  # TypeScript 类型定义
│   ├── dashboard.ts
│   ├── analytics.ts
│   ├── calendar.ts
│   ├── files.ts
│   ├── security.ts
│   ├── settings.ts
│   └── mock.d.ts
├── views/                  # 页面视图
│   ├── auth/               # 登录/注册/找回密码
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── ForgotPasswordView.vue
│   │   └── ResetPasswordView.vue
│   ├── dashboard/          # 仪表盘
│   │   ├── DashboardView.vue
│   │   ├── ProfileView.vue
│   │   └── NotificationsView.vue
│   ├── analytics/          # 数据分析
│   ├── calendar/           # 日历
│   ├── files/              # 文件管理
│   ├── messages/           # 消息
│   ├── security/           # 安全设置
│   ├── settings/           # 系统设置
│   ├── users/              # 用户管理
│   └── legal/              # 法律条款
│       ├── PrivacyView.vue
│       └── TermsView.vue
└── __tests__/              # 测试文件
    └── setup.ts
```

### 数据流模式

1. **API 请求**: `src/api/*.ts` 封装 Axios 请求 → `src/composables/` 使用 `useQuery`/`useMutation` 封装 → 组件 `<script setup>` 中调用
2. **状态管理**:
   - **全局状态** (用户信息、菜单折叠、主题色) 使用 **Pinia** (`src/stores/`)
   - **局部状态** 使用 `ref`/`reactive`
3. **Mock 数据**: 开发环境下通过 Mock.js 拦截 Axios 请求返回数据

### TanStack Query 策略

在 `src/plugins/query-client.ts` 中配置默认选项：

- **staleTime**:
  - 静态资源: 30分钟
  - 列表数据: 5分钟
  - 仪表盘数据: 0 (每次刷新获取新数据)
- **refetchOnWindowFocus**: 生产环境建议关闭

### 主题与皮肤系统

UI 设置存储在 `src/stores/ui-settings.ts`:

- **theme**: `light` | `dark` | `system`
- **skin**: `default` | `ocean` | `forest` | `sunset` | `rose`
- 皮肤通过 CSS 变量 (`--chart-1` 到 `--chart-5`) 影响图表颜色
- `useChartTheme` composable 自动将 CSS 变量转换为 ECharts 可用的十六进制颜色

### 代码规范

- **组件风格**: 严格使用 Vue 3 `<script setup lang="ts">` 语法
- **导入排序**: 使用 ESLint 插件自动管理 import 顺序
- **路径别名**: 使用 `@/` 指向 `src/`
- **响应式**: 优先使用 `ref` 定义基本类型
- **样式**: 使用 Tailwind Utility Classes，复杂样式使用 `class-variance-authority (cva)`
- **类型安全**: 避免使用 `any`，为 Props 和 Emits 定义接口 (`defineProps<Props>()`)

### UI 组件

- **shadcn-vue**: 基于 Radix Vue / Reka UI 的无头组件库，源码直接拷贝到项目
- **Icons**: 使用 `lucide-vue-next`
- **布局**: 使用 Flexbox 和 Grid 结合 Tailwind
- **动画**: `<Transition>` 组件配合 Tailwind 类名，或 `@vueuse/motion` 用于复杂序列动画

## 环境变量

Vue (Vite) 使用 `VITE_` 前缀：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础 URL | `/api` |
| `VITE_USE_MOCK` | 启用 Mock 数据 | `true` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |
| `VITE_BRAND_NAME` | 品牌名称 | `Halolight` |
| `VITE_DEMO_EMAIL` | 演示账号邮箱 | - |
| `VITE_DEMO_PASSWORD` | 演示账号密码 | - |
| `VITE_SHOW_DEMO_HINT` | 显示演示账号提示 | `true` |

## 安全特性

- **Token 存储**: 使用 localStorage (配合 Pinia 持久化，`pinia-plugin-persistedstate` v4 使用 `pick` 而非 `paths`)
- **路由守卫**: 在 `src/router/index.ts` 中 `beforeEach` 拦截未授权访问
- **Axios 拦截器**: 统一处理 401/403 错误

## 新增功能开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件 (e.g., `src/views/order/OrderList.vue`)
2. 在 `src/router/index.ts` 中注册路由记录
3. (可选) 在 `src/config/menu.ts` 中配置菜单项

### 添加新的 API 服务

1. 在 `src/types/` 定义请求/响应接口
2. 在 `src/api/` 创建对应服务文件 (e.g., `order.ts`)
3. 在 `src/composables/queries/` 封装 `useQuery` hook (可选，但推荐)
4. 如需 Mock，在 `src/mock/modules/` 添加对应模块

### 添加 Pinia Store

1. 在 `src/stores/` 下创建文件 (e.g., `cart.ts`)
2. 使用 `defineStore` 定义状态和 Actions
3. 如需持久化，配置 `persist: { key: 'xxx', pick: ['field1', 'field2'] }`
4. 在组件中 `const store = useCartStore()` 使用

### 添加仪表盘部件

1. 在 `src/components/dashboard/widgets/` 创建部件组件
2. 使用 `useChartTheme()` 获取主题自适应颜色
3. 在 `DashboardView.vue` 中注册部件

## 注意事项

- **pinia-plugin-persistedstate v4**: 使用 `pick` 选项而非 `paths`
- **ECharts 主题**: 使用 `useChartTheme` composable 自动适配皮肤颜色
- **Switch 组件**: 使用 computed get/set 模式绑定 v-model
