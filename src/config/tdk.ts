/**
 * TDK (Title, Description, Keywords) 配置
 * 用于管理每个页面的 SEO 元数据
 */

export interface TdkEntry {
  title: string
  description: string
  keywords: string
}

/** 默认 TDK */
export const DEFAULT_TDK: TdkEntry = {
  title: 'Admin Pro',
  description: 'Admin Pro 企业级后台管理系统，为团队提供统一的数据、权限与运营控制中心。',
  keywords: 'Admin Pro, 后台管理, 仪表盘, 运营, Vue3, TypeScript',
}

/** 路由 TDK 配置 */
export const ROUTE_TDK: Record<string, TdkEntry> = {
  '/': {
    title: '仪表盘',
    description: '可拖拽、可配置的仪表盘，支持添加/删除/重置部件，配置持久化本地存储。',
    keywords: '仪表盘, dashboard, 报表, Admin Pro',
  },
  '/users': {
    title: '用户管理',
    description: '管理系统用户，包括用户列表、角色分配、权限控制等功能。',
    keywords: '用户管理, 用户列表, 角色权限, Admin Pro',
  },
  '/messages': {
    title: '消息中心',
    description: '查看和管理系统消息，支持消息分类、已读未读标记、消息搜索等功能。',
    keywords: '消息中心, 站内信, 通知, Admin Pro',
  },
  '/files': {
    title: '文件管理',
    description: '文件上传、下载、管理功能，支持多种文件格式和文件夹组织。',
    keywords: '文件管理, 文件上传, 云存储, Admin Pro',
  },
  '/calendar': {
    title: '日程管理',
    description: '日历视图的日程管理，支持事件创建、提醒设置、日程共享等功能。',
    keywords: '日程管理, 日历, 事件提醒, Admin Pro',
  },
  '/security': {
    title: '安全审计',
    description: '系统安全审计日志，记录用户操作、登录日志、安全事件等。',
    keywords: '安全审计, 操作日志, 登录日志, Admin Pro',
  },
  '/settings': {
    title: '系统设置',
    description: '系统配置管理，包括基本设置、通知设置、安全设置等。',
    keywords: '系统设置, 配置管理, 参数设置, Admin Pro',
  },
  '/analytics': {
    title: '数据分析',
    description: '数据可视化分析，支持多维度数据报表和图表展示。',
    keywords: '数据分析, 数据报表, 可视化, Admin Pro',
  },
  '/profile': {
    title: '个人中心',
    description: '查看和编辑个人信息、修改密码、设置偏好等。',
    keywords: '个人中心, 个人信息, 账户设置, Admin Pro',
  },
  '/notifications': {
    title: '通知中心',
    description: '查看系统通知、消息提醒和公告信息。',
    keywords: '通知中心, 系统通知, 消息提醒, Admin Pro',
  },
  '/login': {
    title: '登录',
    description: '登录 Admin Pro 后台管理系统，安全便捷的身份认证。',
    keywords: '登录, 身份认证, Admin Pro',
  },
  '/register': {
    title: '注册',
    description: '注册 Admin Pro 账号，开始使用企业级后台管理系统。',
    keywords: '注册, 创建账号, Admin Pro',
  },
  '/forgot-password': {
    title: '忘记密码',
    description: '重置密码，通过邮箱验证找回账号访问权限。',
    keywords: '忘记密码, 密码重置, Admin Pro',
  },
}

/**
 * 根据路由路径获取 TDK
 * @param pathname 路由路径
 * @returns TDK 配置
 */
export function getRouteTdk(pathname: string): TdkEntry {
  // 精确匹配
  const exactMatch = ROUTE_TDK[pathname]
  if (exactMatch) {
    return exactMatch
  }

  // 前缀匹配（用于动态路由）
  const matchedKey = Object.keys(ROUTE_TDK).find((key) => pathname.startsWith(key + '/'))
  if (matchedKey) {
    const prefixMatch = ROUTE_TDK[matchedKey]
    return prefixMatch ?? DEFAULT_TDK
  }

  return DEFAULT_TDK
}
