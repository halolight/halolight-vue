# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + Vite 的中文后台管理系统 (Admin Pro / Halolight)，使用 TypeScript、Tailwind CSS 4、shadcn-vue 和 @vueuse/motion 构建。

## 技术栈速览

  - **核心框架**: Vue 3 (Script Setup) + Vite + TypeScript
  - **路由**: Vue Router 4
  - **状态管理**: Pinia 2
  - **数据请求**: TanStack Query Vue (v5) + Axios
  - **样式**: Tailwind CSS 4、shadcn-vue (Radix Vue)、lucide-vue-next
  - **动画/交互**: @vueuse/motion (类似 framer-motion)、grid-layout-plus (可拖拽仪表盘)
  - **图表**: ECharts (配合 vue-echarts) 或 Visx
  - **Mock**: Mock.js / Vite Plugin Mock
  - **构建/规范**: pnpm 10、ESLint 9 (Prettier + TypeScript)
  - **测试**: Vitest + Vue Test Utils

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建产物
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm type-check   # TypeScript 类型检查 (vue-tsc)
pnpm test         # 运行单元测试
pnpm test:ui      # 运行测试并打开 UI 界面
pnpm test:coverage # 生成覆盖率报告
```

## 架构

### 应用入口与插件 (src/main.ts)

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
├── api/               # API 服务定义 (Axios 封装)
├── assets/            # 静态资源
├── components/
│   ├── ui/            # shadcn-vue 基础组件
│   ├── common/        # 通用业务组件 (Header, Sidebar等)
│   └── dashboard/     # 仪表盘专用组件 (Widgets, Charts)
├── composables/       # 组合式函数 (Hooks) - logic reuse
│   ├── useAuth.ts
│   └── useQuery.ts
├── config/            # 全局配置 (主题、常量)
├── layouts/           # 布局组件 (AdminLayout, AuthLayout)
├── mock/              # Mock 数据定义
├── plugins/           # 插件配置 (Chart, Motion等)
├── router/            # 路由配置 (routes, guard)
├── stores/            # Pinia Stores (auth, layout, tabs)
├── types/             # TS 类型定义
├── utils/             # 工具函数
├── views/             # 页面视图 (Pages)
│   ├── auth/          # 登录/注册页
│   └── dashboard/     # 业务页面
└── __tests__/         # 测试文件
```

### 数据流模式

1.  **API 请求**: `src/api/*.ts` 封装 Axios 请求 → `src/composables/` 使用 `useQuery`/`useMutation` 封装 → 组件 `<script setup>` 中调用。
2.  **状态管理**:
      * **全局状态** (用户信息、菜单折叠、主题色) 使用 **Pinia** (`src/stores/`).
      * **局部状态** 使用 `ref`/`reactive`。
3.  **Mock 数据**: 开发环境下通过 `vite-plugin-mock` 或拦截器拦截 Axios 请求返回数据。

### TanStack Query 策略 (Vue)

在 `src/plugins/query-client.ts` 中配置默认选项：

  - **staleTime**:
      - 静态资源: 30分钟
      - 列表数据: 5分钟
      - 实时性要求高的数据: 0 - 30秒
  - **refetchOnWindowFocus**: 生产环境建议关闭，特定页面开启。

### 代码规范

  - **组件风格**: 严格使用 Vue 3 `<script setup lang="ts">` 语法。
  - **导入排序**: 使用 ESLint 插件自动管理 import 顺序。
  - **路径别名**: 使用 `@/` 指向 `src/`。
  - **响应式**: 优先使用 `ref` 定义基本类型，`reactive` 定义复杂对象层级（视团队习惯而定，推荐统一用 `ref` 以保持心智模型一致）。
  - **样式**: 使用 Tailwind Utility Classes，复杂样式使用 `@apply` 或 `class-variance-authority (cva)`。
  - **类型安全**: 避免使用 `any`，为 Props 和 Emits 定义接口 (`defineProps<Props>()`).

### UI 组件

  - **shadcn-vue**: 基于 Radix Vue 的无头组件库，源码直接拷贝到项目。
  - **Icons**: 使用 `lucide-vue-next`。
  - **布局**: 使用 Flexbox 和 Grid 结合 Tailwind。
  - **动画**: `<Transition>` 组件配合 Tailwind 类名，或 `@vueuse/motion` 用于复杂序列动画。

## 环境变量

Vue (Vite) 使用 `VITE_` 前缀：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础 URL | `/api` |
| `VITE_USE_MOCK` | 启用 Mock 数据 | `false` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |
| `VITE_WS_URL` | WebSocket 地址 | - |
| `VITE_LEGACY` | 是否兼容旧浏览器 | `false` |

## 安全特性

  - **Token 存储**: 推荐使用 `HttpOnly Cookie` (由后端控制) 或 localStorage (配合 Pinia 持久化)。
  - **路由守卫**: 在 `src/router/guard.ts` 中拦截未授权访问 (`beforeEach`)。
  - **Axios 拦截器**: 统一处理 401/403 错误，自动登出或刷新 Token。

## CI/CD

工作流配置 (`.github/workflows/ci.yml`):

  - **lint**: `pnpm lint` + `vue-tsc --noEmit`
  - **test**: `vitest run`
  - **build**: `pnpm build` (Vite build)

## 新增功能开发指南

### 添加新页面

1.  在 `src/views/` 下创建页面组件 (e.g., `src/views/order/OrderList.vue`)。
2.  在 `src/router/routes.ts` 中注册路由记录。
3.  (可选) 在 `src/stores/permission.ts` 或 Mock 数据中配置菜单权限。

### 添加新的 API 服务

1.  在 `src/types/api/` 定义请求/响应接口。
2.  在 `src/api/modules/` 创建对应服务文件 (e.g., `user.ts`)。
3.  在 `src/composables/queries/` 封装 `useQuery` hook (可选，但推荐)。

### 添加 Pinia Store

1.  在 `src/stores/` 下创建文件 (e.g., `useCartStore.ts`)。
2.  使用 `defineStore` 定义状态和 Actions。
3.  在组件中 `const store = useCartStore()` 使用。

-----

### 下一步建议

**您是否需要我为您生成具体的 `package.json` 依赖列表，或者创建核心的 `vite.config.ts` 配置文件？**