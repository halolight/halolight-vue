<script setup lang="ts">
import { ArrowLeft, Shield, Sparkles } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const lastUpdated = '2024年1月1日'

const sections = [
  {
    title: '1. 信息收集',
    content: '我们收集您在使用服务时主动提供的信息，包括：注册信息（如姓名、电子邮件地址）、个人资料信息、使用数据和日志信息。我们也可能通过 Cookie 和类似技术自动收集某些信息。',
  },
  {
    title: '2. 信息使用',
    content: '我们使用收集的信息来：提供、维护和改进我们的服务；处理交易和发送相关通知；向您发送技术通知、更新、安全警报和支持消息；响应您的评论、问题和请求；监控和分析使用趋势。',
  },
  {
    title: '3. 信息共享',
    content: '除以下情况外，我们不会与第三方共享您的个人信息：经您同意；为遵守法律义务；保护我们的权利和财产；与服务提供商合作（他们受保密义务约束）；在业务转让或合并的情况下。',
  },
  {
    title: '4. 数据安全',
    content: '我们采取合理的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。这包括使用加密、安全协议和访问控制。然而，没有任何传输或存储方法是完全安全的。',
  },
  {
    title: '5. Cookie 政策',
    content: '我们使用 Cookie 和类似技术来收集信息、记住您的偏好并改善您的体验。您可以通过浏览器设置控制 Cookie，但禁用 Cookie 可能会影响服务的某些功能。',
  },
  {
    title: '6. 您的权利',
    content: '根据适用法律，您可能有权：访问我们持有的关于您的个人信息；更正不准确的信息；删除您的个人信息；反对或限制某些处理活动；数据可携带性；撤回同意。',
  },
  {
    title: '7. 数据保留',
    content: '我们会在实现本政策所述目的所需的时间内保留您的个人信息，除非法律要求或允许更长的保留期限。当不再需要时，我们将安全地删除或匿名化您的信息。',
  },
  {
    title: '8. 儿童隐私',
    content: '我们的服务不面向 16 岁以下的儿童。我们不会故意收集 16 岁以下儿童的个人信息。如果我们发现已收集此类信息，我们将采取措施删除它。',
  },
  {
    title: '9. 国际数据传输',
    content: '您的信息可能会被传输到您所在国家/地区以外的国家/地区并在那里处理。这些国家/地区的数据保护法可能与您所在国家/地区的法律不同。',
  },
  {
    title: '10. 联系我们',
    content: '如果您对本隐私政策有任何疑问或关于您的个人信息的请求，请通过 privacy@halolight.dev 联系我们。我们将在合理时间内回复您的询问。',
  },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <RouterLink to="/" class="inline-flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Sparkles class="h-5 w-5 text-white" />
            </div>
            <span class="text-lg font-bold">Admin Pro</span>
          </RouterLink>
          <RouterLink to="/login">
            <Button variant="outline" size="sm" class="rounded-lg">
              <ArrowLeft class="mr-2 h-4 w-4" />
              返回登录
            </Button>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="max-w-4xl mx-auto">
        <Card class="border border-border/50 shadow-xl backdrop-blur-xl bg-card/80 overflow-hidden">
          <!-- 顶部渐变条 -->
          <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <CardHeader class="space-y-4 pb-6 pt-8 px-6 sm:px-8">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Shield class="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle class="text-2xl sm:text-3xl font-bold">隐私政策</CardTitle>
                <CardDescription class="text-sm mt-1">
                  最后更新：{{ lastUpdated }}
                </CardDescription>
              </div>
            </div>
            <Separator />
          </CardHeader>

          <CardContent class="px-6 sm:px-8 pb-8 space-y-8">
            <!-- 引言 -->
            <div class="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p class="text-sm text-muted-foreground leading-relaxed">
                Admin Pro（"我们"、"我们的"或"本公司"）致力于保护您的隐私。
                本隐私政策解释了我们如何收集、使用、披露和保护您的信息。
              </p>
            </div>

            <!-- 政策内容 -->
            <div class="space-y-6">
              <div
                v-for="section in sections"
                :key="section.title"
                class="space-y-2"
              >
                <h2 class="text-lg font-semibold text-foreground">
                  {{ section.title }}
                </h2>
                <p class="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/20">
                  {{ section.content }}
                </p>
              </div>
            </div>

            <!-- 底部说明 -->
            <Separator />
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-xs text-muted-foreground">
                使用我们的服务即表示您同意本隐私政策。
              </p>
              <div class="flex gap-3">
                <RouterLink to="/terms">
                  <Button variant="outline" size="sm" class="rounded-lg">
                    查看服务条款
                  </Button>
                </RouterLink>
                <RouterLink to="/login">
                  <Button size="sm" class="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                    我已阅读并同意
                  </Button>
                </RouterLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-border/50 bg-muted/30">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 Admin Pro. 保留所有权利。</p>
          <div class="flex gap-6">
            <RouterLink to="/terms" class="hover:text-foreground transition-colors">服务条款</RouterLink>
            <RouterLink to="/privacy" class="hover:text-foreground transition-colors">隐私政策</RouterLink>
            <a href="mailto:privacy@halolight.dev" class="hover:text-foreground transition-colors">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
