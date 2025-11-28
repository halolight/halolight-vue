<script setup lang="ts">
import { ArrowLeft, FileText, Sparkles } from 'lucide-vue-next'

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
    title: '1. 服务条款的接受',
    content: '通过访问或使用 Admin Pro 服务（以下简称"服务"），您确认您已阅读、理解并同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。',
  },
  {
    title: '2. 服务描述',
    content: 'Admin Pro 是一个企业级后台管理系统，提供用户管理、数据分析、内容管理等功能。我们保留随时修改、暂停或终止服务的权利，恕不另行通知。',
  },
  {
    title: '3. 用户账户',
    content: '您在创建账户时必须提供准确、完整的信息。您有责任维护您账户的安全性，并对使用您账户进行的所有活动负责。如果您发现任何未经授权使用您账户的情况，请立即通知我们。',
  },
  {
    title: '4. 用户行为准则',
    content: '使用我们的服务时，您同意不会：上传或传输任何非法、有害、威胁性、辱骂性、骚扰性、诽谤性、粗俗、淫秽或其他令人反感的内容；冒充任何个人或实体；干扰或破坏服务或连接到服务的服务器或网络。',
  },
  {
    title: '5. 知识产权',
    content: '服务及其原始内容、功能和设计均为 Admin Pro 及其许可方的专有财产，受版权、商标和其他知识产权法律的保护。未经我们事先书面同意，您不得复制、修改、分发或以其他方式使用我们的内容。',
  },
  {
    title: '6. 隐私保护',
    content: '我们重视您的隐私。有关我们如何收集、使用和保护您的个人信息的详细信息，请参阅我们的隐私政策。使用我们的服务即表示您同意我们按照隐私政策处理您的数据。',
  },
  {
    title: '7. 免责声明',
    content: '服务按"原样"和"可用"的基础提供，不提供任何明示或暗示的保证。我们不保证服务将不间断、及时、安全或无错误。您使用服务的风险由您自行承担。',
  },
  {
    title: '8. 责任限制',
    content: '在任何情况下，Admin Pro 及其董事、员工、合作伙伴、代理商、供应商或关联公司均不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据丢失、商誉损失或其他无形损失。',
  },
  {
    title: '9. 赔偿',
    content: '您同意赔偿并使 Admin Pro 及其关联公司、官员、代理商和员工免受因您使用服务或违反这些条款而引起的任何索赔、损害、义务、损失、责任、成本或债务。',
  },
  {
    title: '10. 条款修改',
    content: '我们保留随时修改这些条款的权利。修改后的条款将在本页面上发布，并注明修改日期。您在修改后继续使用服务即表示您接受修改后的条款。',
  },
  {
    title: '11. 终止',
    content: '我们可能会因任何原因（包括但不限于违反这些条款）立即终止或暂停您的账户和服务访问权限，恕不另行通知或承担责任。',
  },
  {
    title: '12. 适用法律',
    content: '这些条款受中华人民共和国法律管辖并依其解释。与这些条款相关的任何争议应提交至有管辖权的人民法院解决。',
  },
  {
    title: '13. 可分割性',
    content: '如果这些条款的任何规定被认定为不可执行或无效，该规定将被限制或删除到必要的最小程度，其余条款将继续完全有效。',
  },
  {
    title: '14. 联系我们',
    content: '如果您对这些服务条款有任何疑问，请通过 support@halolight.dev 联系我们。我们将尽快回复您的询问。',
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
                <FileText class="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle class="text-2xl sm:text-3xl font-bold">服务条款</CardTitle>
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
                欢迎使用 Admin Pro。请仔细阅读以下服务条款，这些条款管辖您对我们服务的使用。
                使用我们的服务即表示您同意这些条款。
              </p>
            </div>

            <!-- 条款内容 -->
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
                如果您不同意这些条款，请不要使用我们的服务。
              </p>
              <div class="flex gap-3">
                <RouterLink to="/privacy">
                  <Button variant="outline" size="sm" class="rounded-lg">
                    查看隐私政策
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
            <a href="mailto:support@halolight.dev" class="hover:text-foreground transition-colors">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
