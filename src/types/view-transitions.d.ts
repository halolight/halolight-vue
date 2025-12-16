/**
 * View Transitions API 类型声明
 * 用于支持主题切换的圆形扩散动画
 */

interface ViewTransition {
  /** 过渡完成后解析的 Promise */
  finished: Promise<void>
  /** 过渡准备就绪后解析的 Promise（可以开始动画） */
  ready: Promise<void>
  /** DOM 更新回调完成后解析的 Promise */
  updateCallbackDone: Promise<void>
  /** 跳过过渡动画 */
  skipTransition(): void
}

declare global {
  interface Document {
    /** 开始视图过渡 */
    startViewTransition(callback: () => void | Promise<void>): ViewTransition
  }

  interface CSSStyleDeclaration {
    viewTransitionName: string
  }
}

export {}
