import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'robots.txt'],
      manifest: false, // 使用 public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // 开发环境禁用 PWA
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // 构建优化
  build: {
    // 生产环境关闭 source map 减小体积
    sourcemap: false,

    // 压缩选项
    minify: 'esbuild',

    // 分块策略
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (['vue', 'vue-router', 'pinia'].some((pkg) => id.includes(pkg))) return 'vue-vendor'
            if (['reka-ui', 'radix-vue'].some((pkg) => id.includes(pkg))) return 'ui-vendor'
            if (
              ['@vueuse/core', '@vueuse/motion', 'clsx', 'tailwind-merge'].some((pkg) =>
                id.includes(pkg)
              )
            )
              return 'utils-vendor'
            if (['@tanstack/vue-query', 'axios'].some((pkg) => id.includes(pkg)))
              return 'query-vendor'
            if (id.includes('lucide-vue-next')) return 'icons-vendor'
          }
          return undefined
        },
        // 静态资源命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,

    // CSS 代码分割
    cssCodeSplit: true,

    // 目标浏览器
    target: 'es2020',
  },

  // 生产环境移除 console
  esbuild:
    mode === 'production'
      ? {
          drop: ['console', 'debugger'],
        }
      : undefined,

  // 开发服务器配置
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    // API 代理配置 - 解决跨域问题
    proxy: {
      '/api': {
        target: process.env.VITE_API_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  // 预览服务器配置
  preview: {
    port: 4173,
    strictPort: false,
  },

  // 依赖优化
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@tanstack/vue-query',
      'axios',
      'lucide-vue-next',
      '@vueuse/core',
      '@vueuse/motion',
      'reka-ui',
      'clsx',
      'tailwind-merge',
    ],
  },
}))
