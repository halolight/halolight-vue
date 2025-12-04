# Halolight Vue | Admin Pro

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-vue/blob/main/LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5-%2342b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-%23646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2-%23ffd859.svg)](https://pinia.vuejs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-%23FF4154.svg)](https://tanstack.com/query)
[![pnpm](https://img.shields.io/badge/pnpm-10.23.0-ffa41c.svg)](https://pnpm.io)

基于 Vue 3 + Vite 的现代化中文后台管理系统，内置可拖拽仪表盘、权限与状态管理、主题换肤、PWA 能力与可选 Mock 数据，适合快速搭建中后台应用。

- 在线预览：<https://halolight-vue.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-vue>

## 功能亮点

- **Vue 3 Composition API + TypeScript**：全面使用 `<script setup lang="ts">` 语法，类型安全
- **Vite 7 (Rolldown)**：极速开发体验，支持 PWA、SEO 优化
- **Tailwind CSS 4 + shadcn-vue**：原子化样式、Radix Vue 原语、流畅主题切换（深色/浅色/系统）
- **多种主题皮肤**：支持 Default、Ocean、Forest、Sunset、Rose 等多种皮肤配色
- **可拖拽仪表盘**：grid-layout-plus 支持拖拽、添加/删除/重置、布局持久化到 localStorage
- **状态与数据流**：TanStack Vue Query 5 + Axios 请求层，Pinia 2 管理认证/仪表盘/导航/UI 设置等全局状态
- **增强交互体验**：@vueuse/motion 动画、TabBar 多页签、加载遮罩
- **ECharts 图表**：主题自适应配色，跟随皮肤变化
- **快捷设置面板**：快速切换主题、导航栏、TabBar、页脚等布局选项
- **Mock.js 集成**：环境变量一键启用，无后端快速演示开发
- **完整 CI/CD**：GitHub Actions 自动化测试、构建

## 目录结构

```
src/
├── api/                    # API 服务定义 (Axios 封装)
├── assets/                 # 静态资源
├── components/
│   ├── ui/                 # shadcn-vue 基础组件 (Button/Card/Dialog 等)
│   ├── common/             # 通用业务组件 (Header, Sidebar, Footer, Tabs)
│   ├── auth/               # 认证相关组件
│   ├── layout/             # 布局辅助组件
│   └── dashboard/widgets/  # 仪表盘部件 (Charts, Stats, Tasks 等)
├── composables/            # 组合式函数 (Hooks)
│   └── queries/            # TanStack Query 封装
├── config/                 # 全局配置 (菜单、环境变量)
├── layouts/                # 布局组件 (AdminLayout, AuthLayout)
├── lib/                    # 工具库 (utils)
├── mock/                   # Mock 数据定义
│   └── modules/            # 按模块拆分的 Mock 数据
├── plugins/                # 插件配置 (Query Client, Mock)
├── router/                 # 路由配置
├── stores/                 # Pinia Stores (auth, layout, tabs, ui-settings)
├── types/                  # TypeScript 类型定义
├── views/                  # 页面视图
│   ├── auth/               # 登录/注册/找回密码页
│   ├── dashboard/          # 仪表盘主页
│   ├── analytics/          # 数据分析页
│   ├── calendar/           # 日历页
│   ├── files/              # 文件管理页
│   ├── messages/           # 消息页
│   ├── security/           # 安全设置页
│   ├── settings/           # 系统设置页
│   ├── users/              # 用户管理页
│   └── legal/              # 法律条款页
└── __tests__/              # 测试文件
```

## 快速开始

环境要求：Node.js >= 18、pnpm >= 8（项目锁定 pnpm@10.23.0）。

```bash
pnpm install
pnpm dev         # 本地开发，默认 http://localhost:5173
```

可选：启用 Mock 数据（仅前端模拟）

```bash
# 修改 .env.development 中的 VITE_USE_MOCK=true
pnpm dev
```

生产构建与预览

```bash
pnpm build
pnpm preview     # 预览构建产物
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础地址 | `/api` |
| `VITE_USE_MOCK` | `true` 时启用 Mock.js 拦截 | `true` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |
| `VITE_BRAND_NAME` | 品牌名称 | `Halolight` |
| `VITE_DEMO_EMAIL` | 演示账号邮箱 | - |
| `VITE_DEMO_PASSWORD` | 演示账号密码 | - |
| `VITE_SHOW_DEMO_HINT` | 显示演示账号提示 | `true` |

在项目根目录创建 `.env.local` 文件来覆盖默认值。

## 常用脚本

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建产物
pnpm lint         # ESLint 检查代码规范
pnpm lint:fix     # 自动修复 ESLint 问题
pnpm type-check   # TypeScript 类型检查
pnpm test         # 运行测试（watch 模式）
pnpm test:run     # 运行测试（单次执行）
pnpm test:ui      # 运行测试并打开 UI 界面
pnpm test:coverage # 运行测试并生成覆盖率报告
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Vue 3.5 + Vite 7 (Rolldown) |
| 类型系统 | TypeScript 5.9 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia 2 + pinia-plugin-persistedstate |
| 数据请求 | TanStack Vue Query 5 + Axios |
| 样式 | Tailwind CSS 4 + tw-animate-css |
| UI 组件 | shadcn-vue (Radix Vue / Reka UI) |
| 图标 | lucide-vue-next |
| 图表 | ECharts 6 + vue-echarts |
| 动画 | @vueuse/motion |
| 拖拽布局 | grid-layout-plus |
| Mock | Mock.js |
| 测试 | Vitest + Vue Test Utils + Testing Library |

## 代码规范

- **组件风格**：严格使用 Vue 3 `<script setup lang="ts">` 语法
- **导入排序**：使用 ESLint 插件自动管理 import 顺序
- **路径别名**：使用 `@/` 指向 `src/`
- **样式**：使用 Tailwind Utility Classes，复杂样式使用 `class-variance-authority (cva)`
- **类型安全**：避免使用 `any`，为 Props 和 Emits 定义接口

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 相关链接

- [在线预览](https://halolight-vue.h7ml.cn)
- [GitHub 仓库](https://github.com/halolight/halolight-vue)
- [问题反馈](https://github.com/halolight/halolight-vue/issues)

## 许可证

[MIT](LICENSE)
